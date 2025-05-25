export interface RichInputAreaProps {
  /**
   * 输入框的值
   */
  value: string;
  /**
   * 输入框的占位符
   */
  placeholder?: string;
  /**
   * 输入框的值发生变化时的回调
   */
  onChange: (value: string) => void;
  /**
   * 发送消息时的回调
   */
  onSend: (value: string) => void;
  /**
   * 取消消息时的回调
   */
  onCancel?: () => void;
  /**
   * 是否显示加载状态
   */
  loading?: boolean;
  /**
   * 是否禁用输入框
   */
  inputDisabled?: boolean;
  /**
   * 是否显示取消按钮
   */
  showCancelButton?: boolean;
  /**
   * 是否显示发送按钮
   */
  showSendButton?: boolean;
  /**
   * 输入框的类名
   */
  className?: string;
  /**
   * 取消按钮的文本
   */
  cancelButtonText?: string;
  /**
   * 发送按钮的文本
   */
  sendButtonText?: string;
}
