import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';
import { ChatState, Session } from '../types/chat';
import { type ChatMessage, MessageSender } from '@versa-chat/ui';
import { t } from 'i18next';

export const initialMessages: ChatMessage[] = [
  {
    id: uuidv4(),
    type: 'text',
    sender: MessageSender.Assistant,
    loading: false,
    content: `${t('session.welcome')}`,
    timestamp: new Date(),
  },
  {
    id: uuidv4() + 1,
    type: 'iframe',
    sender: MessageSender.Assistant,
    loading: false,
    timestamp: new Date(),
    content: {
      url: 'https://tech.meituan.com/',
    },
  },
  {
    id: uuidv4() + 2,
    type: 'image',
    sender: MessageSender.Assistant,
    loading: false,
    timestamp: new Date(),
    content: {
      url: 'https://camo.githubusercontent.com/d0d155f2a3c4d8b9825cfe3ec5feee6b5309f26e239668a9a33bb82b2d612b26/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6576616e66616e67303035342f626c6f67496d616765406d61737465722f696d672f46434231383232374335334331464538394241374433354545333846463644342e706e67',
    },
  },
  {
    id: uuidv4() + 3,
    type: 'card',
    sender: MessageSender.Assistant,
    loading: false,
    timestamp: new Date(),
    content: {
      title: '示例',
      content: '可承载文字、列表、图片、段落等，便于用户浏览内容。',
      data: {
        name: '张三',
        age: 18,
        gender: '男',
      },
    },
  },
];

const initialSession: Session = {
  id: uuidv4(),
  title: `${t('session.new')} 1`,
  messages: initialMessages,
  createdAt: new Date(),
};

export const useChatStore = create<ChatState>()(
  persist(
    immer((set) => ({
      sessions: [initialSession],
      activeSessionId: initialSession.id,
      loading: {},
      setSessions: (sessions) => set({ sessions }),
      addSession: (session) =>
        set((state) => {
          const newSession = {
            ...session,
            id: uuidv4(),
            createdAt: new Date(),
          };
          return {
            sessions: [...state.sessions, newSession],
            activeSessionId: newSession.id,
            loading: { ...state.loading, [newSession.id]: false }, // 初始化新会话loading状态
          };
        }),
      updateSession: (sessionId: string, session: Partial<Session>) =>
        set((state) => {
          const newSessions = state.sessions.map((s: Session) =>
            s.id === sessionId ? { ...s, ...session } : s
          );
          return { sessions: newSessions };
        }),
      removeSession: (sessionId: string) =>
        set((state) => {
          const newSessions = state.sessions.filter((s: Session) => s.id !== sessionId);
          const { [sessionId]: _, ...remainingLoading } = state.loading; // 移除对应会话的loading状态
          return {
            sessions: newSessions,
            activeSessionId: newSessions.length > 0 ? newSessions[0].id : undefined,
            loading: remainingLoading,
          };
        }),
      setActiveSession: (sessionId) => set({ activeSessionId: sessionId }),
      setMessages: (messages: ChatMessage[]) =>
        set((state) => ({
          sessions: state.sessions.map((session: Session) =>
            session.id === state.activeSessionId ? { ...session, messages } : session
          ),
        })),
      addMessage: (message: ChatMessage, targetSessionId?: string) =>
        set((state) => ({
          sessions: state.sessions.map((session: Session) =>
            session.id === (targetSessionId || state.activeSessionId)
              ? { ...session, messages: [...session.messages, message] }
              : session
          ),
        })),
      setLoading: (loading: boolean, sessionId?: string) =>
        set((state) => ({
          loading: {
            ...state.loading,
            [sessionId ?? state.activeSessionId ?? '']: loading,
          },
        })),
      updateMessage: (messageId: string, partialMessage: Partial<ChatMessage>) =>
        set((state) => {
          const session = state.sessions.find((s: Session) => s.id === state.activeSessionId);
          if (!session) return;

          const message = session.messages.find((m: ChatMessage) => m.id === messageId);
          if (message) {
            Object.assign(message, partialMessage);
          }
        }),
      removeMessage: (messageId: string) =>
        set((state) => {
          const session = state.sessions.find((s: Session) => s.id === state.activeSessionId);
          if (!session) return;
          session.messages = session.messages.filter((m: ChatMessage) => m.id !== messageId);
        }),
    })),
    {
      name: 'chat-storage', // localStorage 键名
      storage: createJSONStorage(() => localStorage), // 使用 localStorage
      partialize: (state) => ({
        sessions: state.sessions,
        activeSessionId: state.activeSessionId,
      }), // 只持久化 sessions 和 activeSessionId
    }
  )
);
