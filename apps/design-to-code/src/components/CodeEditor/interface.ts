import { editor } from 'monaco-editor';

export interface CodeEditorProps {
  /** 代码内容 */
  value: string;
  /** 代码变更回调 */
  onChange?: (value: string) => void;
  /** 只读模式 */
  readOnly?: boolean;
  /** 语言 */
  language?: string;
  /** 编辑器高度 */
  height?: string | number;
  /** 编辑器宽度 */
  width?: string | number;
  /** 行号可见性 */
  showLineNumbers?: boolean;
  /** 编辑器主题 */
  theme?: 'vs-dark' | 'vs-light' | 'dark' | 'light';
  /** 字体大小 */
  fontSize?: number;
  /** 组件样式类名 */
  className?: string;
  /** 高亮行号列表 */
  highlightedLines?: number[];
  /** 自定义编辑器选项 */
  editorOptions?: editor.IStandaloneEditorConstructionOptions;
  /** 禁用自动完成 */
  disableAutocompletion?: boolean;
  /** 是否显示缩略图 */
  minimap?: boolean;
}
