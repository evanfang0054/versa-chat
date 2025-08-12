import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ThemePack = 'default' | 'ai' | 'animal';

export const ThemePackList = ['default', 'ai', 'animal'] as const;
export type ThemePackName = (typeof ThemePackList)[number];

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
  pack: ThemePack;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  setPack: (pack: ThemePack) => void;
  togglePack: () => void;
}

// 检测系统主题偏好
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'system',
      isDark: getSystemTheme() === 'dark',
      pack: 'default',
      setMode: (mode: ThemeMode) =>
        set({
          mode,
          isDark: mode === 'system' ? getSystemTheme() === 'dark' : mode === 'dark',
        }),
      toggleMode: () => {
        const { mode } = get();
        if (mode === 'light') {
          set({ mode: 'dark', isDark: true });
        } else if (mode === 'dark') {
          set({ mode: 'system', isDark: getSystemTheme() === 'dark' });
        } else {
          set({ mode: 'light', isDark: false });
        }
      },
      setPack: (pack: ThemePack) => {
        if (typeof window !== 'undefined') {
          document.documentElement.setAttribute('data-theme-pack', pack);
        }
        set({ pack });
      },
      togglePack: () => {
        const packs: ThemePack[] = ['default', 'ai', 'animal'];
        const { pack } = get();
        const idx = packs.indexOf(pack);
        const next = packs[(idx + 1) % packs.length];
        if (typeof window !== 'undefined') {
          document.documentElement.setAttribute('data-theme-pack', next);
        }
        set({ pack: next });
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// 监听系统主题变化
if (typeof window !== 'undefined') {
  const updateTheme = () => {
    const { mode, setMode } = useThemeStore.getState();
    if (mode === 'system') {
      setMode('system');
    }
  };

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme);
}
