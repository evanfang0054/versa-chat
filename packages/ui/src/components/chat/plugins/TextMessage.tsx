import { FC } from 'react';
import { BaseMessage } from './BaseMessage';
import { TextMessage as TextMessageType } from '../interface';

export const TextMessage: FC<{ message: TextMessageType }> = ({ message }) => {
  return <BaseMessage message={message}>{message.content}</BaseMessage>;
};
