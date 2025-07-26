import React from 'react';
import { Button } from 'antd-mobile';
import { useThemeStore } from '@/stores/themeStore';
import type { ThemeToggleProps } from './interface';

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { mode, toggleMode } = useThemeStore();

  return (
    <Button
      fill="outline"
      className={`theme-toggle ${className}`}
      onClick={toggleMode}
      shape="rounded"
      size="small"
    >
      {mode === 'light' && (
        <span role="img" aria-label="light mode" className="text-yellow-500">
          🌞
        </span>
      )}
      {mode === 'dark' && (
        <span role="img" aria-label="dark mode" className="text-blue-300">
          🌙
        </span>
      )}
      {mode === 'system' && (
        <span role="img" aria-label="system mode" className="text-gray-500">
          💻
        </span>
      )}
    </Button>
  );
};

export default ThemeToggle;
