import { useNavigate } from 'react-router-dom';
import { List, Badge, Button, NavBar } from 'antd-mobile';
import { useTranslation } from 'react-i18next';
import { usePaymentStore } from '@/stores/paymentStore';
import { useEffect } from 'react';

const PaymentList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { payments, fetchPayments, loading } = usePaymentStore();

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      <NavBar
        onBack={() => navigate('/')}
        className="border-b border-gray-100 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
      >
        {t('payment.title')}
      </NavBar>

      <div className="flex-1 overflow-auto">
        <List header={null} mode="card">
          {payments.map((payment) => (
            <List.Item
              key={payment.id}
              onClick={() => navigate(`/payments/${payment.id}`)}
              prefix={
                <Badge
                  content={t(`payment.status.${payment.status}`)}
                  color={
                    payment.status === 'success'
                      ? 'success'
                      : payment.status === 'pending'
                        ? 'warning'
                        : 'danger'
                  }
                />
              }
              description={`${t('payment.createdAt')}: ${payment.createdAt}`}
            >
              <div className="font-medium dark:text-white">
                {payment.description || t('payment.defaultDescription')}
              </div>
              <div className="text-lg text-primary dark:text-blue-400">
                ¥{payment.amount.toFixed(2)}
              </div>
            </List.Item>
          ))}
        </List>
      </div>
    </div>
  );
};

export default PaymentList;
