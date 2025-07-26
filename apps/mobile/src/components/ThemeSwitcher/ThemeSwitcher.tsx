import React from 'react';
import { Picker, Button } from 'antd-mobile';
import { useThemeStore, ThemePackName } from '@/stores/themeStore';
import type { ThemeItem } from './interface';
const THEME_ITEMS: ThemeItem[] = [
  {
    label: 'Default',
    value: 'default',
  },
  {
    label: 'AI',
    value: 'ai',
  },
  {
    label: 'Animal',
    value: 'animal',
  },
];

const ThemeSwitcher: React.FC = () => {
  const { pack, setPack } = useThemeStore();

  const columns = [
    THEME_ITEMS.map((item) => ({
      label: item.label,
      value: item.value,
    })),
  ];

  return (
    <Picker
      columns={columns}
      value={[pack]}
      onConfirm={(values) => {
        setPack(values[0] as ThemePackName);
      }}
    >
      {(items, { open }) => (
        <Button onClick={open} fill="outline" shape="rounded">
          {THEME_ITEMS.find((item) => item.value === pack)?.label || 'Default'}
        </Button>
      )}
    </Picker>
  );
};

export default ThemeSwitcher;
