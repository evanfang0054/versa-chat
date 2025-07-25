import { useThemeStore } from '@/stores/themeStore';
import { BaseMessage } from '@versa-chat/ui';
import { Card, Button } from 'antd-mobile';
import type { MessagePlugin } from '@versa-chat/ui';
// 自定义卡片消息插件
export const cardPlugin: MessagePlugin = {
  type: 'card',
  render: (message, globalData, context, pubsub) => {
    const { isDark } = useThemeStore.getState();

    return (
      <BaseMessage message={message}>
        <Card
          style={{
            '--adm-color-background': isDark ? '#2c2c2c' : '#ebe9e9',
            '--adm-color-border': isDark ? '#3a3a3a' : '#c0c0c0',
          }}
          title={message.content.title}
          headerStyle={{ backgroundColor: isDark ? '#2c2c2c' : '#ebe9e9' }}
          className={isDark ? 'text-gray-200' : 'text-black'}
        >
          {message.content.content}
          <div className="flex justify-end">
            <Button
              size="small"
              color="primary"
              onClick={() => {
                pubsub.publish('showCard', message.content.data);
              }}
            >
              查看更多
            </Button>
          </div>
        </Card>
      </BaseMessage>
    );
  },
};
