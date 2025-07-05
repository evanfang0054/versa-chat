import type { ChatMessage } from '@versa-chat/ui';

export interface Session {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
}

export interface ChatState {
  sessions: Session[];
  activeSessionId: string;
  loading: Record<string, boolean>;
  setSessions: (sessions: Session[]) => void;
  addSession: (session: Omit<Session, 'id' | 'createdAt'>) => void;
  updateSession: (sessionId: string, session: Partial<Session>) => void;
  removeSession: (sessionId: string) => void;
  setActiveSession: (sessionId: string) => void;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage, targetSessionId?: string) => void;
  setLoading: (loading: boolean, sessionId?: string) => void;
  updateMessage: (messageId: string, partialMessage: Partial<ChatMessage>) => void;
  removeMessage: (messageId: string) => void;
}
