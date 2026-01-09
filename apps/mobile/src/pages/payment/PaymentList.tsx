import { useNavigate } from 'react-router-dom';
import { List, Badge, Button, NavBar, Toast } from 'antd-mobile';
import { useTranslation } from 'react-i18next';
import { usePaymentStore } from '@/stores/paymentStore';
import { useEffect } from 'react';
import { launchFirework, launchRainbow, launchHeart } from '@/utils/confetti';

const PaymentList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { payments, fetchPayments, loading } = usePaymentStore();

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleAddPayment = async () => {
    try {
      // 模拟添加支付记录
      await new Promise((resolve) => setTimeout(resolve, 800));

      // 使用工具API调用方式触发庆祝效果
      await launchFirework(0.5, 0.3, ['#FFD700', '#FFA500', '#FF6347']);

      Toast.show({
        content: '支付记录添加成功！',
        icon: 'success',
      });

      // 刷新列表
      fetchPayments();
    } catch (error) {
      Toast.show({
        content: '添加失败，请重试',
        icon: 'fail',
      });
    }
  };

  const handleShowRainbowEffect = async () => {
    await launchRainbow({ particleCount: 200, spread: 100 });
  };

  const handleShowHeartEffect = async () => {
    await launchHeart(0.5, 0.4);
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      <NavBar
        onBack={() => navigate('/')}
        className="border-b border-gray-100 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
      >
        {t('payment.title')}
      </NavBar>

      <div className="flex-1 overflow-auto">
        {/* 工具API调用方式控制区域 */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800">
          <div className="flex gap-2 mb-4">
            <Button size="small" color="primary" onClick={handleAddPayment}>
              💰 添加支付
            </Button>
            <Button size="small" color="success" onClick={handleShowRainbowEffect}>
              🌈 彩虹效果
            </Button>
            <Button size="small" color="warning" onClick={handleShowHeartEffect}>
              💖 心形效果
            </Button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            * 使用工具API调用方式触发纸屑效果
          </p>
        </div>

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
