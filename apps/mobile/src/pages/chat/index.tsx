import { useState, useCallback, useEffect } from 'react';
import { useChatStore, initialMessages } from '@/stores/chatStore';
import {
  Chat,
  BaseMessage,
  RichText,
  InputArea,
  MessageSender,
  pubsub,
  // RichInputArea,
  type MessagePlugin,
  type ChatMessage,
  type TextMessage,
  type PluginMessage,
} from '@versa-chat/ui';
import { TRAVEL_ASSISTANT_PROMPT } from '@/constants/prompts';
import { Button, Space, Image, ImageViewer, Badge } from 'antd-mobile';
import { RedoOutline, PayCircleOutline } from 'antd-mobile-icons';
import { SessionManager } from '@/components/SessionManager';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { HeaderBar } from '@/components/HeaderBar';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { cardPlugin } from '@/components/Plugin/CardPlugin';
import { useTranslation } from 'react-i18next';
import { createEventStream, cancelRequest } from '@efdev/event-stream';
import { useThemeStore } from '@/stores/themeStore';
import { useNavigate } from 'react-router-dom';
import { usePaymentStore } from '@/stores/paymentStore';

const ChatPage = () => {
  const [inputValue, setInputValue] = useState('');
  const { t } = useTranslation();
  const [sessionManagerVisible, setSessionManagerVisible] = useState(false);
  const { isDark } = useThemeStore();
  const navigate = useNavigate();
  const { payments, fetchPayments } = usePaymentStore();
  const {
    sessions,
    activeSessionId,
    updateSession,
    // setMessages,
    addMessage,
    updateMessage,
    // removeMessage,
    loading,
    setLoading,
    addSession,
    removeSession,
    setActiveSession,
  } = useChatStore();

  const [images, setImages] = useState<string[]>([]);

  const activeSession = sessions.find((s: any) => s.id === activeSessionId);
  const messages = activeSession?.messages || [];
  const currentLoading = activeSessionId ? loading[activeSessionId] : false;

  // 获取待处理支付的数量
  const pendingPaymentsCount = payments.filter((payment) => payment.status === 'pending').length;

  // 组件加载时获取支付数据
  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // 自定义富文本消息插件
  const richTextPlugin: MessagePlugin = {
    type: 'richText',
    render: (message, globalData, context) => {
      const content = message.content?.content || '';

      return (
        <BaseMessage message={message}>
          <RichText content={content} className="dark:prose-invert" />
        </BaseMessage>
      );
    },
  };

  // 自定义图片消息插件
  const imagePlugin: MessagePlugin = {
    type: 'image',
    render: (message, globalData, context) => {
      const content = message.content?.url || '';

      return (
        <BaseMessage message={message}>
          <Image lazy src={content} onClick={() => setImages([content])} />
        </BaseMessage>
      );
    },
  };

  const roles = {
    [MessageSender.Assistant]: {
      loading: (message: ChatMessage) => !!message.loading,
      renderFooter: (
        message: ChatMessage,
        globalData: Record<string, any>,
        context: Record<string, any>
      ) => {
        return (
          <Space>
            <Button
              size="small"
              fill="none"
              onClick={() => {
                console.log('message context', message, context);
              }}
            >
              <RedoOutline fontSize={'0.4rem'} />
            </Button>
          </Space>
        );
      },
    },
    [MessageSender.User]: {
      renderFooter: (message: ChatMessage, globalData: Record<string, any>) => {
        return <div className="text-right dark:text-gray-300">¥¥</div>;
      },
    },
  };

  const sendChatRequest = useCallback(
    (content: string) => {
      const requestSessionId = activeSessionId; // 记录请求时的会话ID，已确保非空
      const id = (Date.now() + 1).toString();
      let values: any = '';
      setLoading(true, requestSessionId);

      const assistantMessage: PluginMessage = {
        id,
        type: 'richText',
        sender: MessageSender.Assistant,
        loading: true,
        content: {
          content: values,
        },
        timestamp: new Date(),
      };
      addMessage(assistantMessage, requestSessionId); // 使用请求时的会话ID

      createEventStream('/api/v1/chat/completions', {
        debug: true,
        requestId: requestSessionId,
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
        },
        data: {
          messages: [
            {
              content: TRAVEL_ASSISTANT_PROMPT,
              role: MessageSender.System,
            },
            ...messages.map((item: ChatMessage) => ({
              content:
                item.type === 'text'
                  ? (item as TextMessage).content || ''
                  : (item as PluginMessage).content.content || '',
              role: item.sender,
            })),
            {
              content,
              role: 'user',
            },
          ],
          model: import.meta.env.VITE_MODEL,
          frequency_penalty: 0,
          max_tokens: 2048,
          presence_penalty: 0,
          response_format: {
            type: 'text',
          },
          stop: null,
          stream: true,
        },
        onOpen: async () => {},
        onMessage: async (message: any) => {
          values += message?.data.choices[0].delta?.content;
          const assistantMessage: PluginMessage = {
            id,
            type: 'richText',
            sender: MessageSender.Assistant,
            loading: false,
            content: {
              content: values,
            },
            timestamp: new Date(),
          };
          updateMessage(id, assistantMessage);
        },
        onClose: () => {
          console.log('onClose 3');
        },
        onComplete() {
          setLoading(false, requestSessionId);
        },
        onError(error) {
          const assistantMessage: PluginMessage = {
            id,
            type: 'richText',
            sender: MessageSender.Assistant,
            loading: false,
            content: {
              content: '请求失败，请重试',
            },
            timestamp: new Date(),
          };
          updateMessage(id, assistantMessage);
          setLoading(false, requestSessionId);
        },
      });
    },
    [activeSessionId, messages, addMessage, updateMessage, setLoading]
  );

  const handleSend = useCallback(
    (content: string) => {
      if (!activeSessionId) {
        // 如果没有活动会话，创建一个新会话
        const newSession = {
          title: t('session.new'),
          messages: [],
        };
        addSession(newSession);
        return;
      }

      const userMessage: PluginMessage = {
        id: Date.now().toString(),
        type: content.includes('blob:') ? 'image' : 'richText',
        sender: MessageSender.User,
        content: {
          url: content,
          content,
        },
        timestamp: new Date(),
      };

      // 将用户消息添加到当前会话
      addMessage(userMessage);

      // 发送消息请求
      sendChatRequest(content);

      setInputValue('');
    },
    [activeSessionId, addSession, addMessage, sendChatRequest, t]
  );

  const handleAddSession = useCallback(
    (title: string) => {
      addSession({
        title: `${title} ${sessions.length + 1}`,
        messages: initialMessages,
      });
    },
    [addSession, sessions.length]
  );

  const renameSession = useCallback(
    (sessionId: string, title: string) => {
      updateSession(sessionId, { title });
    },
    [updateSession]
  );

  useEffect(() => {
    pubsub.subscribe('showCard', (data: any) => {
      console.log('showCard subscribe', data);
    });
  }, []);

  return (
    <div
      className="h-screen flex flex-col"
      style={{
        '--adm-color-border': 'transparent',
        '--adm-color-background': isDark ? 'var(--color-bg-primary)' : '#f5f5f5',
      }}
    >
      <HeaderBar
        title={activeSession?.title || ''}
        onOpenSessionManager={() => setSessionManagerVisible(true)}
        onAddSession={handleAddSession}
        onNavigateToPayments={() => navigate('/payments')}
        pendingPaymentsCount={pendingPaymentsCount}
      />

      <div className="flex flex-col flex-1 sm:w-[640Px] mx-auto">
        <div className="flex-1 overflow-auto">
          <Chat
            globalData={{ user: { name: 'John' } }}
            messages={messages}
            plugins={[cardPlugin, richTextPlugin, imagePlugin]}
            roles={roles}
            className="dark:bg-gray-900"
          />
        </div>

        <InputArea
          value={inputValue}
          placeholder={t('chat.placeholder')}
          cancelButtonText={t('chat.cancel')}
          sendButtonText={t('chat.send')}
          onChange={setInputValue}
          onSend={handleSend}
          onCancel={() => {
            cancelRequest(activeSessionId!);
            setLoading(false, activeSessionId);
          }}
          loading={currentLoading}
          showSendButton={!currentLoading}
          showCancelButton={currentLoading}
          inputDisabled={currentLoading}
          className="dark:bg-gray-800 dark:text-white"
        />
      </div>
      <SessionManager
        visible={sessionManagerVisible}
        onClose={() => setSessionManagerVisible(false)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onRemoveSession={removeSession}
        onSelectSession={setActiveSession}
        onRenameSession={renameSession}
        footer={
          <Space align="center" block className="gap-1">
            <ThemeToggle />
            <ThemeSwitcher />
            <LanguageSwitcher />
            <Badge content={pendingPaymentsCount || ''}>
              <Button
                size="small"
                onClick={() => {
                  setSessionManagerVisible(false);
                  navigate('/payments');
                }}
              >
                <PayCircleOutline fontSize={'0.5rem'} />
              </Button>
            </Badge>
          </Space>
        }
      />
      <ImageViewer.Multi
        images={images}
        onClose={() => setImages([])}
        visible={images.length > 0}
      />
    </div>
  );
};

export default ChatPage;
