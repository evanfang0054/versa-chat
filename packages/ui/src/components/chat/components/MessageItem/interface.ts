import { type ChatMessage, type MessageRole } from '../../interface';

export interface MessageItemProps {
  message: ChatMessage;
  index: number;
  messages: ChatMessage[];
  globalData: Record<string, any>;
  roles?: Partial<Record<string, MessageRole>>;
  plugins: any[];
}
