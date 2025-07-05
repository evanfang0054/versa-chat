export { pubsub } from '@versa-chat/utils';

export { BaseMessage } from './components/chat/plugins/BaseMessage';
export { type BaseMessageProps } from './components/chat/plugins/BaseMessage';

export { Chat, MessageSender } from './components/chat';
export {
  type ChatMessage,
  type ChatProps,
  type MessagePlugin,
  type TextMessage,
  type PluginMessage,
} from './components/chat/interface';

export { default as ErrorBoundary } from './components/ErrorBoundary';
export {
  type ErrorBoundaryProps,
  type ErrorBoundaryState,
} from './components/ErrorBoundary/interface';

export { default as RichText } from './components/RichText/RichText';
export { type RichTextProps } from './components/RichText/interface';

export { InputArea } from './components/InputArea';
export { type InputAreaProps } from './components/InputArea';

export { RichInputArea } from './components/RichInputArea';
export { type RichInputAreaProps } from './components/RichInputArea/interface';

// 导出进度指示器组件
export { ProgressIndicator } from './components/ProgressIndicator';
export {
  type ProgressIndicatorProps,
  type ProgressShape,
  type GradientConfig,
} from './components/ProgressIndicator/interface';
