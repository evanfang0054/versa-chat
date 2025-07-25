import type { Session } from '@/types/chat';

export interface SessionManagerProps {
  visible: boolean;
  onClose: () => void;
  sessions: Session[];
  activeSessionId: string | null;
  onAddSession?: () => void;
  onRemoveSession: (sessionId: string) => void;
  onSelectSession: (sessionId: string) => void;
  onRenameSession: (sessionId: string, newTitle: string) => void;
  footer?: React.ReactNode;
}
