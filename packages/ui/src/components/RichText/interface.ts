import { HTMLAttributes } from 'react';

interface RichTextProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * markdown 文本内容
   */
  content: string;
  /**
   * 是否显示加载状态
   */
  loading?: boolean;
  /**
   * 加载状态时的占位内容
   */
  loadingPlaceholder?: React.ReactNode;
  /**
   * 自定义 markdown-it 配置
   */
  markdownOptions?: Record<string, any>;
}

export type { RichTextProps };
