import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Badge, List, NavBar, Toast } from 'antd-mobile';
import { useTranslation } from 'react-i18next';
import { usePaymentStore } from '@/stores/paymentStore';
import { launchFirework } from '@/utils/confetti';

const PaymentDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { payments } = usePaymentStore();

  const payment = payments.find((p) => p.id === id);

  const handleRetryPayment = async () => {
    try {
      // 模拟支付处理
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 支付成功，触发庆祝效果
      await launchFirework(0.5, 0.5, ['#FFD700', '#FFA500', '#FF6347', '#FF4500']);

      Toast.show({
        content: '支付成功！',
        icon: 'success',
      });
    } catch (error) {
      Toast.show({
        content: '支付失败，请重试',
        icon: 'fail',
      });
    }
  };

  if (!payment) {
    return (
      <div className="p-4 text-center">
        <p>{t('payment.notFound')}</p>
        <Button color="primary" onClick={() => navigate('/payments')}>
          {t('payment.backToList')}
        </Button>
      </div>
    );
  }

  console.log('payment', payment);

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      <NavBar
        onBack={() => navigate('/payments')}
        className="border-b border-gray-100 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
      >
        {t('payment.detailTitle')}
      </NavBar>

      <div className="p-4 flex-1 overflow-auto">
        <Card
          title={null}
          extra={
            <>
              <Badge
                content={t(`payment.status.${payment.status}`)}
                color={
                  payment.status === 'success'
                    ? 'green'
                    : payment.status === 'pending'
                      ? 'orange'
                      : 'red'
                }
              />
            </>
          }
          className="dark:bg-gray-800"
        >
          <List className="dark:bg-gray-800">
            <List.Item extra={`¥${payment.amount.toFixed(2)}`} className="dark:text-white">
              {t('payment.amount')}
            </List.Item>
            <List.Item extra={payment.createdAt} className="dark:text-white">
              {t('payment.createdAt')}
            </List.Item>
            <List.Item
              extra={payment.description || t('payment.defaultDescription')}
              className="dark:text-white"
            >
              {t('payment.description')}
            </List.Item>
            <List.Item extra={payment.id} className="dark:text-white">
              {t('payment.id')}
            </List.Item>
          </List>

          <div className="mt-4 flex gap-2">
            <Button block color="primary" onClick={() => navigate('/payments')}>
              {t('payment.backToList')}
            </Button>
            {payment.status === 'pending' && (
              <Button block color="success" onClick={handleRetryPayment}>
                {t('payment.retryPayment')}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PaymentDetail;
