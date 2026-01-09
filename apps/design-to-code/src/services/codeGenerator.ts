// 代码生成选项
export interface CodeGenerationOptions {
  componentName: string;
  useAntd: boolean;
  isResponsive: boolean;
  useI18n: boolean;
  isTs: boolean;
  styleFramework: 'tailwind' | 'css' | 'scss' | 'less';
}

// 组件代码生成结果
export interface GeneratedComponent {
  componentName: string;
  componentFile: string;
  interfaceFile: string;
  indexFile: string;
  helpersFile: string;
  // 原始响应
  rawResponse?: string;
}
