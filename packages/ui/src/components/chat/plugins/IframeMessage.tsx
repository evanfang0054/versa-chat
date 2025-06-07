import React from 'react';
import { Card } from 'antd-mobile';
import { BaseMessage } from './BaseMessage';
import type { PluginMessage } from '../interface';

export interface IframeMessageProps {
  message: PluginMessage & {
    content?: {
      url?: string;
      height?: string;
      width?: string;
    };
  };
  className?: string;
}

export const IframeMessage: React.FC<IframeMessageProps> = ({ message, className = '' }) => {
  const { content = {} } = message;
  const { url, height = '300px', width = '100%' } = content;

  if (!url) {
    return (
      <BaseMessage message={message}>
        <Card className={`text-red-500 ${className}`}>无效的iframe链接</Card>
      </BaseMessage>
    );
  }

  return (
    <BaseMessage message={message}>
      <iframe
        src={url}
        height={height}
        width={width}
        className="border-0 w-full"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        allowFullScreen
        loading="lazy"
      />
    </BaseMessage>
  );
};
