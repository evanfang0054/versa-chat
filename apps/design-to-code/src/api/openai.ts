import { http } from '@/utils/request';
// 导入markdown-it库
import MarkdownIt from 'markdown-it';

interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * 向OpenAI发送请求生成代码
 * @param prompt 提示词
 * @param model 模型名称
 * @param apiKey OpenAI API密钥
 */
export const generateCodeWithOpenAI = async (
  prompt: string,
  model: string = import.meta.env.VITE_MODEL,
  apiKey?: string
): Promise<string> => {
  const openAIKey = apiKey || import.meta.env.VITE_API_KEY;

  if (!openAIKey) {
    throw new Error('OpenAI API密钥未提供，请在环境变量中设置VITE_API_KEY或手动传入');
  }

  try {
    const response = await http.post<OpenAIResponse>(
      `${import.meta.env.VITE_API_URL}v1/chat/completions`,
      {
        model,
        messages: [
          {
            role: 'system',
            content:
              '你是一位专业的React前端开发专家，精通组件设计和代码生成。请根据用户提供的Figma设计数据，生成符合企业规范的React组件代码。',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        frequency_penalty: 0,
        max_tokens: 2048,
        presence_penalty: 0,
        response_format: {
          type: 'text',
        },
        stop: null,
        stream: false,
        temperature: 0,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAIKey}`,
        },
        errorHandling: {
          showErrorMessage: true,
          ignoreBusinessError: true,
        },
        timeout: 600000, // 增加超时时间到60秒，AI生成可能需要较长时间
      }
    );

    if (response.choices && response.choices.length > 0) {
      return response.choices[0].message.content;
    }

    throw new Error('OpenAI未返回有效响应');
  } catch (error) {
    console.error('OpenAI API调用失败:', error);

    const err = error as Error;

    // 针对常见错误类型提供友好提示
    if (err.message?.includes('401')) {
      throw new Error('OpenAI API认证失败，请检查API密钥是否有效');
    } else if (err.message?.includes('429')) {
      throw new Error('OpenAI API请求过于频繁，请稍后再试');
    } else if (err.message?.includes('timeout')) {
      throw new Error('OpenAI API请求超时，请稍后重试或减少生成内容');
    }

    throw new Error(`生成代码失败: ${err.message}`);
  }
};

/**
 * 文件类型特征定义
 */
interface FileTypeFeatures {
  name: string; // 文件名模式
  isMatch: (code: string, componentName: string) => boolean; // 匹配规则
  getDefaultContent: (componentName: string) => string; // 默认内容生成
}

/**
 * 核心文件类型的特征定义
 */
const FILE_TYPES: FileTypeFeatures[] = [
  // interface.ts 特征
  {
    name: 'interface.ts',
    isMatch: (code) => {
      return (
        (code.includes('interface') || code.includes('type ')) &&
        (code.includes('Props') || code.includes('export type')) &&
        !code.includes('React.FC') &&
        !code.includes('<div') &&
        !code.includes('return (') &&
        !code.includes('return <')
      );
    },
    getDefaultContent: (componentName) =>
      `interface ${componentName}Props {\n  // 在此处定义组件Props\n}\n\nexport type { ${componentName}Props };`,
  },
  // [组件名].tsx 特征
  {
    name: '{componentName}.tsx',
    isMatch: (code) => {
      return (
        (code.includes('React') || code.includes('react')) &&
        (code.includes('React.FC') ||
          (code.includes('const') && code.includes('=>')) ||
          (code.includes('function') && code.includes('return'))) &&
        (code.includes('return (') || code.includes('return <')) &&
        (code.includes('<div') ||
          (code.includes('<') && code.includes('/>')) ||
          code.includes('</'))
      );
    },
    getDefaultContent: (componentName) =>
      `import React from 'react';\nimport { ${componentName}Props } from './interface';\n\nconst ${componentName}: React.FC<${componentName}Props> = (props) => {\n  return (\n    <div>\n      ${componentName} Component\n    </div>\n  );\n};\n\nexport default ${componentName};`,
  },
  // helpers.ts 特征
  {
    name: 'helpers.ts',
    isMatch: (code) => {
      return (
        (code.includes('function') ||
          (code.includes('const') && code.includes('=>')) ||
          code.includes('export const')) &&
        !code.includes('React.FC') &&
        !code.includes('<div') &&
        !code.includes('return (') &&
        !code.includes('return <') &&
        !code.includes('interface') &&
        !code.includes('export type')
      );
    },
    getDefaultContent: (componentName) =>
      `// 此文件包含${componentName}组件的辅助函数\n\n// 示例辅助函数\nexport const formatData = (data: any) => {\n  return data;\n};`,
  },
  // index.ts 特征
  {
    name: 'index.ts',
    isMatch: (code) => {
      return (
        code.includes('export') &&
        (code.includes('default') || code.includes('from')) &&
        code.length < 500 &&
        !code.includes('React.FC') &&
        !code.includes('<div') &&
        !code.includes('function')
      );
    },
    getDefaultContent: (componentName) =>
      `export { default as ${componentName} } from './${componentName}';\nexport type { ${componentName}Props } from './interface';`,
  },
  // styles.css 特征
  {
    name: 'styles.css',
    isMatch: (code) => {
      return (
        code.includes('{') &&
        code.includes('}') &&
        (code.includes('.') || code.includes('#')) &&
        (code.includes('color') ||
          code.includes('margin') ||
          code.includes('padding') ||
          code.includes('background'))
      );
    },
    getDefaultContent: (componentName) =>
      `.${componentName.toLowerCase()} {\n  /* 基本样式 */\n  display: block;\n  margin: 0;\n  padding: 0;\n}`,
  },
];

/**
 * 从AI响应中解析代码块，提取核心文件
 * @param response OpenAI响应文本
 */
export const parseCodeBlocks = (response: string): Record<string, string> => {
  const result: Record<string, string> = {};

  // 1. 提取组件名
  const componentNameMatch =
    response.match(/组件名\s*[:：]\s*(\w+)/i) ||
    response.match(/component\s*name\s*[:：]\s*(\w+)/i);
  const componentName = componentNameMatch ? componentNameMatch[1] : 'Component';

  // 2. 提取所有代码块
  const codeBlocks = extractAllCodeBlocks(response);

  // 3. 根据注释中的文件名识别文件
  const fileNamePatterns = [
    /^\/\/\s*([a-zA-Z0-9_\-.]+\.(?:ts|tsx|js|jsx|css))/i, // 匹配 // filename.ext
    /^\/\*\s*([a-zA-Z0-9_\-.]+\.(?:ts|tsx|js|jsx|css))\s*\*\//i, // 匹配 /* filename.ext */
    /^#{1,6}\s*([a-zA-Z0-9_\-.]+\.(?:ts|tsx|js|jsx|css))/i, // 匹配 # filename.ext
  ];

  for (const { code } of codeBlocks) {
    // 提取代码块的第一行
    const firstLine = code.split('\n')[0].trim();

    // 尝试从第一行中提取文件名
    let filename = null;
    for (const pattern of fileNamePatterns) {
      const match = firstLine.match(pattern);
      if (match && match[1]) {
        filename = match[1].trim();
        break;
      }
    }

    if (filename) {
      // 移除文件名注释行
      const cleanedCode = code.split('\n').slice(1).join('\n').trim();
      result[filename] = cleanedCode;
      continue;
    }

    // 如果没有找到文件名，使用文件特征识别
    for (const fileType of FILE_TYPES) {
      if (fileType.isMatch(code, componentName)) {
        const typedFilename = fileType.name.replace('{componentName}', componentName);
        if (!result[typedFilename]) {
          result[typedFilename] = code;
        }
        break;
      }
    }
  }

  // 4. 确保所有必要的文件都存在
  FILE_TYPES.forEach((fileType) => {
    const filename = fileType.name.replace('{componentName}', componentName);
    if (!result[filename]) {
      result[filename] = fileType.getDefaultContent(componentName);
    }
  });

  return result;
};

/**
 * 提取所有代码块
 * @param response Markdown文本或JSON数组字符串
 */
function extractAllCodeBlocks(response: string): Array<{ language: string; code: string }> {
  // 尝试解析为JSON数组
  try {
    const jsonData = JSON.parse(response);
    if (
      Array.isArray(jsonData) &&
      jsonData.length > 0 &&
      'language' in jsonData[0] &&
      'code' in jsonData[0]
    ) {
      return jsonData.map((item) => ({
        language: item.language || 'text',
        code: item.code.trim(),
      }));
    }
  } catch (e) {
    // 如果不是有效的JSON，继续使用markdown解析
  }

  // 使用markdown-it解析
  const md = new MarkdownIt();
  const tokens = md.parse(response, {});
  const codeBlocks: Array<{ language: string; code: string }> = [];

  // 提取代码块（类型为'fence'）
  const mdCodeBlocks = tokens
    .filter((token) => token.type === 'fence')
    .map((block) => ({
      language: block.info || 'text',
      code: block.content.trim(),
    }));

  if (mdCodeBlocks.length > 0) {
    return mdCodeBlocks;
  }

  // 回退到使用正则表达式解析
  const codeBlockRegex = /```(?:(\w+)\n)?([\s\S]+?)```/g;
  let match;

  while ((match = codeBlockRegex.exec(response)) !== null) {
    const language = match[1] || 'text';
    const code = match[2].trim();
    codeBlocks.push({ language, code });
  }

  return codeBlocks;
}
