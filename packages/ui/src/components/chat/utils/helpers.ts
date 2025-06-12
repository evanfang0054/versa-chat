import { ChatMessage, MessagePlugin, PluginMessage } from '../interface';

export function getMessagePlugin(
  message: ChatMessage,
  plugins: MessagePlugin[]
): MessagePlugin | undefined {
  return plugins.find(
    (p) => p.type === message.type && (p.match ? p.match(message as PluginMessage) : true)
  );
}
