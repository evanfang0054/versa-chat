import { useCallback, useRef, ChangeEvent, KeyboardEvent, ClipboardEvent, useState } from 'react';
import { Button } from 'antd-mobile';
import TextareaAutosize from 'react-textarea-autosize';
import { type RichInputAreaProps } from './interface';

function RichInputArea({
  value,
  onChange,
  onSend,
  onCancel,
  loading = false,
  inputDisabled = false,
  showCancelButton = false,
  showSendButton = true,
  className = '',
  placeholder = '输入消息...',
  cancelButtonText = '取消',
  sendButtonText = '发送',
}: RichInputAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend(value);
      }
    },
    [value]
  );

  const handleSend = (content: string) => {
    if (!content?.trim()) return;
    onSend(content);
  };

  const handlePaste = (e: ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    let pastedFile: File | null = null;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const file = item.getAsFile();
      if (file) {
        pastedFile = file;
        break;
      }
    }

    if (pastedFile) {
      handleSend(URL.createObjectURL(pastedFile));
    }
  };

  return (
    <div className={`p-1 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] ${className}`}>
      <div className="flex gap-3">
        <TextareaAutosize
          onPaste={handlePaste}
          ref={textareaRef}
          className="flex-1 rounded-lg bg-white p-2 shadow-sm transition-all focus:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={value}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
          disabled={inputDisabled}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          minRows={1}
          maxRows={5}
        />
        {showCancelButton && (
          <Button
            color="warning"
            onClick={onCancel}
            className="self-end rounded-full px-4 py-2 transition-all hover:shadow-md active:scale-95"
          >
            {cancelButtonText}
          </Button>
        )}
        {showSendButton && (
          <Button
            color="primary"
            onClick={() => handleSend(value)}
            disabled={inputDisabled || !value.trim()}
            loading={loading}
            className="self-end rounded-full px-4 py-2 transition-all hover:shadow-md active:scale-95"
          >
            {sendButtonText}
          </Button>
        )}
      </div>
    </div>
  );
}

export default RichInputArea;
