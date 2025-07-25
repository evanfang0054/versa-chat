import React, { useState, useRef } from 'react';
import { Popup, List, Button, Toast, Popover, Input, Dialog } from 'antd-mobile';
import { DeleteOutline, MoreOutline, EditSOutline } from 'antd-mobile-icons';
import { SessionManagerProps } from './interface';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '@/stores/themeStore';

export const SessionManager: React.FC<SessionManagerProps> = ({
  visible,
  onClose,
  sessions,
  activeSessionId,
  onRemoveSession,
  onSelectSession,
  onRenameSession,
  footer,
}) => {
  const { t } = useTranslation();
  const { isDark } = useThemeStore();
  const [activePopoverId, setActivePopoverId] = useState<string | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');
  const inputRef = useRef<any>(null);

  const handleRemoveSession = (sessionId: string) => {
    if (sessions.length <= 1) {
      Toast.show({
        content: t('session.cannotRemoveLast'),
        position: 'top',
        maskStyle: { zIndex: 1000 },
      });
      return;
    }

    Dialog.confirm({
      title: t('session.permanentlyDelete'),
      content: t('session.deleteConfirmation'),
      cancelText: t('common.cancel'),
      confirmText: t('common.delete'),
      onConfirm: () => {
        onRemoveSession(sessionId);
        Toast.show({ content: t('session.removed'), position: 'top' });
        setActivePopoverId(null);
      },
    });
  };

  const handleStartRenaming = (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return;

    setEditingSessionId(sessionId);
    setEditingTitle(session.title);
    setActivePopoverId(null);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSaveRename = () => {
    if (!editingSessionId) return;

    if (editingTitle.trim()) {
      onRenameSession(editingSessionId, editingTitle.trim());
      setEditingSessionId(null);
    } else {
      setEditingSessionId(null);
      Toast.show({ content: t('session.nameCannotBeEmpty'), position: 'top' });
    }
  };

  const actions = [
    {
      text: t('session.rename'),
      key: 'rename',
      icon: <EditSOutline fontSize={'0.5rem'} />,
    },
    {
      text: t('session.delete'),
      key: 'delete',
      icon: <DeleteOutline fontSize={'0.5rem'} />,
    },
  ];

  const handlePopoverVisibleChange = (visible: boolean, sessionId: string) => {
    setActivePopoverId(
      visible ? sessionId : activePopoverId === sessionId ? null : activePopoverId
    );
  };

  const onMaskClick = () => {
    setActivePopoverId(null);
    editingSessionId && handleSaveRename();
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.key === 'Enter' && handleSaveRename();
  };

  return (
    <Popup
      visible={visible}
      onMaskClick={onMaskClick}
      position="left"
      bodyStyle={{
        width: '80vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <div style={{ '--adm-color-border': 'transparent' }} className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <List>
            {sessions.map((session) => (
              <List.Item
                key={session.id}
                arrow={false}
                onClick={() => {
                  if (editingSessionId === session.id) return;
                  onSelectSession(session.id);
                }}
                extra={
                  <Popover.Menu
                    style={{ '--arrow-size': '0', '--border-color': 'transparent' }}
                    actions={actions}
                    mode={isDark ? 'dark' : 'light'}
                    placement="bottom"
                    onAction={(node) => {
                      if (node.key === 'delete') {
                        handleRemoveSession(session.id);
                      } else if (node.key === 'rename') {
                        handleStartRenaming(session.id);
                      }
                    }}
                    trigger="click"
                    visible={activePopoverId === session.id}
                    onVisibleChange={(visible) => handlePopoverVisibleChange(visible, session.id)}
                  >
                    <Button
                      size="small"
                      fill="none"
                      color="default"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreOutline fontSize={'0.5rem'} />
                    </Button>
                  </Popover.Menu>
                }
              >
                {editingSessionId === session.id ? (
                  <Input
                    ref={inputRef}
                    value={editingTitle}
                    onChange={setEditingTitle}
                    onBlur={handleSaveRename}
                    onKeyDown={handleKeyDown}
                    className="w-full"
                  />
                ) : (
                  <div className={session.id === activeSessionId ? 'font-bold' : 'text-gray-600'}>
                    {session.title}
                  </div>
                )}
              </List.Item>
            ))}
          </List>
        </div>
        {footer && <div className="p-2">{footer}</div>}
      </div>
    </Popup>
  );
};
