import { memo, useMemo } from 'react';
import { DotLoading } from 'antd-mobile';
import { pubsub } from '@versa-chat/utils';
import { BaseMessage } from '../../plugins/BaseMessage';
import { getMessageContext } from '../../utils/context';
import { getMessagePlugin } from '../../utils/helpers';
import type { MessageItemProps } from './interface';

export const MessageItem = memo(function MessageItem({
  message,
  index,
  messages,
  globalData,
  roles,
  plugins,
}: MessageItemProps) {
  const context = useMemo(() => getMessageContext(messages, index), [messages, index]);
  const role = roles?.[message.sender];

  const isLoading = useMemo(
    () => role?.loading?.(message, globalData, context, pubsub) || false,
    [role, message, globalData, context]
  );

  const renderContent = useMemo(() => {
    if (isLoading) {
      return (
        role?.renderLoading?.(message, globalData, context, pubsub) || (
          <BaseMessage message={message}>
            <DotLoading color="white" />
          </BaseMessage>
        )
      );
    }

    const plugin = getMessagePlugin(message, plugins) || {
      render: (message) => {
        return <BaseMessage message={message}>--查无此插件 {message.type} --</BaseMessage>;
      },
    };

    return (
      <>
        {role?.renderHeader?.(message, globalData, context, pubsub)}
        {plugin?.render(message as any, globalData, context, pubsub)}
        {role?.renderFooter?.(message, globalData, context, pubsub)}
      </>
    );
  }, [isLoading, message, globalData, context, role, plugins]);

  return (
    <div className="pt-2 pb-2 px-2 text-3xs relative cursor-pointer transition-all duration-300 hover:bg-black/[0.02] active:bg-black/[0.05] active:scale-[0.98] before:content-[''] before:absolute before:inset-0 before:bg-current before:opacity-0 before:transition-opacity hover:before:opacity-[0.02] active:before:opacity-[0.05]">
      {renderContent}
    </div>
  );
});
