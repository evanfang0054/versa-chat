import { type ChatMessage } from '../interface';

export function getMessageContext(messages: ChatMessage[], index: number) {
  return {
    prevMessages: messages.slice(0, index),
    nextMessages: messages.slice(index + 1),
  };
}
