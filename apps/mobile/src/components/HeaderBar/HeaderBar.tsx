import React from 'react';
import { Space, Button, Ellipsis, Badge } from 'antd-mobile';
import { UnorderedListOutline, ChatAddOutline, PayCircleOutline } from 'antd-mobile-icons';
import { useTranslation } from 'react-i18next';
import type { HeaderBarProps } from './interface';

export const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  onOpenSessionManager,
  onAddSession,
  onNavigateToPayments,
  pendingPaymentsCount = 0,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <div className={`dark:bg-gray-800 ${className}`}>
      <Space justify="between" align="center" block className="p-1">
        <Button fill="none" size="small" onClick={onOpenSessionManager}>
          <UnorderedListOutline fontSize={'0.5rem'} />
        </Button>

        <Ellipsis className="text-4xs dark:text-gray-300" direction="end" content={title || ''} />

        <Space align="center" block className="gap-2">
          {onNavigateToPayments && (
            <Badge content={pendingPaymentsCount || ''}>
              <Button fill="none" size="small" onClick={onNavigateToPayments}>
                <PayCircleOutline fontSize={'0.5rem'} />
              </Button>
            </Badge>
          )}
          <Button fill="none" size="small" onClick={() => onAddSession(t('session.new'))}>
            <ChatAddOutline fontSize={'0.5rem'} />
          </Button>
        </Space>
      </Space>
    </div>
  );
};

export default HeaderBar;
