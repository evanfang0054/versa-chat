import { FC } from 'react';
import { MessageBase } from '../interface';

export interface BaseMessageProps {
  message: MessageBase;
  children: React.ReactNode;
}

export const BaseMessage: FC<BaseMessageProps> = ({ message, children }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`relative max-w-[80%] rounded-lg px-3 py-2 
        ${isUser ? 'bg-blue-100 text-blue-900' : 'bg-blue-500 text-white'}`}
      >
        {children}
      </div>
    </div>
  );
};
