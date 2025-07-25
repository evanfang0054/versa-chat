export interface HeaderBarProps {
  /**
   * 标题
   */
  title: string;
  /**
   * 打开会话管理器的回调
   */
  onOpenSessionManager: () => void;
  /**
   * 添加新会话的回调
   */
  onAddSession: (title: string) => void;
  /**
   * 导航到支付页面的回调
   */
  onNavigateToPayments?: () => void;
  /**
   * 待处理支付数量
   */
  pendingPaymentsCount?: number;
  /**
   * 自定义类名
   */
  className?: string;
}
