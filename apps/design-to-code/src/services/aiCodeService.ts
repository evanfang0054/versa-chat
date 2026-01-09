import { ProcessedNode } from './figmaProcessor';
import { generateCodeWithOpenAI, parseCodeBlocks } from '../api/openai';
import { GeneratedComponent, CodeGenerationOptions } from './codeGenerator';

// AI代码生成请求参数
export interface AICodeGenerationRequest {
  nodes: ProcessedNode[];
  options: CodeGenerationOptions;
  yamlData?: string; // 添加YAML格式数据选项
  prompt?: string;
}

interface AICodeInput {
  nodes: ProcessedNode[];
  options: CodeGenerationOptions;
  yamlData?: string; // 添加YAML格式数据
}

/**
 * 生成组件代码的提示词模板
 */
const generatePromptTemplate = (input: AICodeInput): string => {
  const { nodes, options, yamlData } = input;
  const { componentName, useAntd, isResponsive, useI18n, isTs, styleFramework } = options;

  // 基础提示词
  const basePrompt = `请生成一个名为 ${componentName} 的React组件。
需要满足以下要求：
- 使用${isTs ? 'TypeScript' : 'JavaScript'}
- 样式使用${styleFramework === 'tailwind' ? 'Tailwind CSS' : styleFramework}
- ${useAntd ? '使用Ant Design Mobile组件库' : '不使用任何组件库'}
- ${isResponsive ? '支持响应式布局' : '固定布局'}
- ${useI18n ? '支持国际化(i18next)' : '不需要国际化'}

需要生成以下文件：
1. index.ts - 导出组件和类型定义
2. interface.ts - 包含组件的Props类型定义
3. ${componentName}.tsx - 主组件文件
4. helpers.ts - 辅助函数(如果需要)`;

  // 基于数据类型选择不同的数据输入格式
  let dataPrompt = '';
  if (yamlData) {
    dataPrompt = `\n\n以下是从Figma导出的YAML格式设计数据：
\`\`\`yaml
${yamlData}
\`\`\``;
  } else {
    dataPrompt = `\n\n以下是从Figma导出的设计数据结构：
\`\`\`json
${JSON.stringify(nodes, null, 2)}
\`\`\``;
  }

  // 完整提示词
  const finalPrompt = `${basePrompt}${dataPrompt}

请根据以上设计数据和需求，生成符合企业规范的组件代码。
代码应该具有良好的可维护性、可扩展性，并且遵循React最佳实践。
请为每个文件添加详细的注释，以便其他开发人员能够理解代码的作用和实现方式。

对于组件Props，请包含以下内容：
- 所有必要的样式自定义Props
- 数据输入Props
- 事件回调Props
- 国际化相关Props（如果开启了国际化）

请确保代码可以直接运行，不要有任何语法错误或未实现的功能。

非常重要：你必须严格按照以下JSON格式返回所有代码：
[
  {
    "language": "typescript", // 或其他适当的语言标识
    "code": "这里是文件的完整代码",
    "fileName": "文件名，例如index.ts"
  }
]

返回的数据必须是一个数组，每个文件对应一个对象，包含language、code和fileName三个字段。
不要包含任何其他格式的内容，不要添加额外的解释或注释，仅返回上述JSON格式的数据。`;

  return finalPrompt;
};

/**
 * 使用AI生成组件代码
 * @param input 生成代码所需的输入数据
 */
export const generateAICode = async (input: AICodeInput): Promise<GeneratedComponent> => {
  try {
    // 生成提示词
    const prompt = generatePromptTemplate(input);

    // 调用OpenAI API生成代码
    const response = await generateCodeWithOpenAI(prompt);

    // 解析返回的JSON数据
    let codeFiles: { language: string; code: string; fileName: string }[] = [];
    try {
      // 预处理响应，处理可能的Markdown代码块格式
      let jsonContent = response.trim();

      // 检查响应是否为Markdown代码块格式
      // 匹配任何语言类型的代码块，包括json、typescript等
      const codeBlockRegex = /```(?:json|typescript|js|javascript)?\s*([\s\S]*?)\s*```/;
      const match = jsonContent.match(codeBlockRegex);
      if (match && match[1]) {
        jsonContent = match[1].trim();
      } else if (jsonContent.startsWith('[') && jsonContent.endsWith(']')) {
        // 如果内容已经是JSON数组格式，保持不变（无需处理）
      } else {
        // 尝试在内容中寻找JSON数组
        const arrayMatch = jsonContent.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (arrayMatch) {
          jsonContent = arrayMatch[0];
        }
      }

      // 解析JSON内容
      try {
        codeFiles = JSON.parse(jsonContent);
      } catch (jsonError) {
        // JSON解析失败，尝试修复常见问题

        // 1. 尝试移除注释（// 开头的内容）
        const contentWithoutComments = jsonContent.replace(/\/\/.*$/gm, '');
        try {
          codeFiles = JSON.parse(contentWithoutComments);
        } catch {
          // 2. 尝试其他修复方法
          throw jsonError; // 如果还是失败，抛出原始错误
        }
      }

      // 验证数据格式
      if (!Array.isArray(codeFiles)) {
        throw new Error('返回的数据格式不正确，不是数组');
      }

      // 验证数组项结构
      for (const file of codeFiles) {
        if (!file.fileName || typeof file.code !== 'string') {
          console.warn('数组项缺少必要字段:', file);
        }
      }
    } catch (parseError) {
      console.error('解析AI返回的JSON数据失败:', parseError);
      // 如果解析失败，尝试使用原有的解析方法
      const codeBlocks = parseCodeBlocks(response);
      return createComponentFromCodeBlocks(codeBlocks, input.options.componentName, response);
    }

    // 从返回的JSON数据构建组件对象
    const componentName = input.options.componentName;
    const generatedComponent: GeneratedComponent = {
      componentName,
      componentFile: '',
      interfaceFile: '',
      indexFile: '',
      helpersFile: '',
      rawResponse: response,
    };

    // 填充组件对象
    for (const file of codeFiles) {
      if (file.fileName === `${componentName}.tsx` || file.fileName === 'component.tsx') {
        generatedComponent.componentFile = file.code;
      } else if (file.fileName === 'interface.ts') {
        generatedComponent.interfaceFile = file.code;
      } else if (file.fileName === 'index.ts') {
        generatedComponent.indexFile = file.code;
      } else if (file.fileName === 'helpers.ts') {
        generatedComponent.helpersFile = file.code;
      }
    }

    // 如果缺少某些文件，生成默认内容
    if (!generatedComponent.indexFile) {
      generatedComponent.indexFile = `export { default as ${componentName} } from './${componentName}';\nexport type { ${componentName}Props } from './interface';`;
    }
    if (!generatedComponent.helpersFile) {
      generatedComponent.helpersFile = '// 本组件不需要辅助函数';
    }

    return generatedComponent;
  } catch (error) {
    console.error('AI代码生成失败:', error);
    throw new Error(`AI代码生成失败: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// 辅助函数：从代码块创建组件对象
const createComponentFromCodeBlocks = (
  codeBlocks: Record<string, string>,
  componentName: string,
  rawResponse: string
): GeneratedComponent => {
  return {
    componentName,
    componentFile: codeBlocks[`${componentName}.tsx`] || codeBlocks['component.tsx'] || '',
    interfaceFile: codeBlocks['interface.ts'] || '',
    indexFile:
      codeBlocks['index.ts'] ||
      `export { default as ${componentName} } from './${componentName}';\nexport type { ${componentName}Props } from './interface';`,
    helpersFile: codeBlocks['helpers.ts'] || '// 本组件不需要辅助函数',
    rawResponse: rawResponse,
  };
};
