import React from 'react';
import type { MessagePlugin } from '../interface';
import { IframeMessage } from './IframeMessage';
import { TextMessage } from './TextMessage';
import type { PluginMessage, TextMessage as TextMessageType } from '../interface';

const textPlugin: MessagePlugin = {
  type: 'text',
  render: (message) => {
    const textMessage = message as unknown as TextMessageType;
    return <TextMessage message={textMessage} />;
  },
};

const iframePlugin: MessagePlugin = {
  type: 'iframe',
  render: (message) => {
    const pluginMessage = message as PluginMessage;
    return <IframeMessage message={pluginMessage} />;
  },
};

const builtInPlugins: MessagePlugin[] = [textPlugin, iframePlugin];

export function registerPlugins(customPlugins: MessagePlugin[] = []) {
  return [...builtInPlugins, ...customPlugins];
}
