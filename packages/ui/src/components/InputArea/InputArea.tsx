import React from 'react';
import { Input, Button } from 'antd-mobile';
import type { InputAreaProps } from './interface';

function InputArea({
  value,
  onChange,
  onSend,
  onCancel,
  loading = false,
  inputDisabled = false,
  showCancelButton = false,
  showSendButton = true,
  className = '',
  cancelButtonText = '取消',
  sendButtonText = '发送',
  placeholder = '输入消息...',
}: InputAreaProps) {
  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value);
  };

  return (
    <div className={`p-1 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] ${className}`}>
      <div className="flex gap-3">
        <Input
          className="flex-1 rounded-full px-2 shadow-sm transition-all focus:shadow-md focus:ring-2 focus:ring-blue-500"
          value={value}
          onChange={onChange}
          disabled={inputDisabled}
          onEnterPress={handleSend}
          placeholder={placeholder}
        />
        {showCancelButton && (
          <Button
            color="warning"
            onClick={onCancel}
            className="rounded-full px-2 transition-all hover:shadow-md active:scale-95"
          >
            {cancelButtonText}
          </Button>
        )}
        {showSendButton && (
          <Button
            color="primary"
            onClick={handleSend}
            disabled={inputDisabled || !value.trim()}
            loading={loading}
            className="rounded-full px-2 transition-all hover:shadow-md active:scale-95"
          >
            {sendButtonText}
          </Button>
        )}
      </div>
    </div>
  );
}

export default InputArea;
