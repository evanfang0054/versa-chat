const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');
const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,less}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,less}',
  ],
  mode: 'jit',
  darkMode: ['selector', '[data-theme="dark"]'],

  // 设计系统配置
  theme: {
    extend: {
      // 颜色系统 (Ant Design Mobile + 企业扩展)
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        'page-bg': 'var(--bg-page)',
        'text-base': 'var(--text-base)',
      },

      // 字体系统
      fontFamily: {
        sans: ['PingFang SC', 'Microsoft YaHei', ...defaultTheme.fontFamily.sans],
        mono: ['Menlo', 'Monaco', 'Courier New', 'monospace'],
      },

      // 字号系统 (rem基准为16px)
      fontSize: {
        '4xs': ['0.4rem', { lineHeight: '1rem' }],
        '3xs': ['0.5rem', { lineHeight: '1rem' }],
        '2xs': ['0.6875rem', { lineHeight: '1rem' }], // 11px
        xs: ['0.75rem', { lineHeight: '1rem' }], // 12px
        sm: ['0.875rem', { lineHeight: '1.25rem' }], // 14px
        base: ['1rem', { lineHeight: '1.5rem' }], // 16px
        lg: ['1.125rem', { lineHeight: '1.75rem' }], // 18px
        xl: ['1.25rem', { lineHeight: '1.75rem' }], // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }], // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
      },

      // 间距系统 (基于4px基准)
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
        4.5: '1.125rem', // 18px
        5.5: '1.375rem', // 22px
        6.5: '1.625rem', // 26px
        7.5: '1.875rem', // 30px
        15: '3.75rem', // 60px
        18: '4.5rem', // 72px
      },

      // 圆角系统
      borderRadius: {
        none: '0',
        xs: '0.125rem', // 2px
        sm: '0.25rem', // 4px
        md: '0.375rem', // 6px
        lg: '0.5rem', // 8px
        xl: '0.75rem', // 12px
        '2xl': '1rem', // 16px
        '3xl': '1.5rem', // 24px
        full: '9999px',
      },

      // 阴影系统
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        none: 'none',
      },

      // 动画系统
      animation: {
        none: 'none',
        spin: 'spin 1s linear infinite',
        ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        bounce: 'bounce 1s infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-out': 'fadeOut 0.3s ease-out',
      },

      // 断点系统 (移动优先)
      screens: {
        xs: '375Px',
        sm: '640Px',
        md: '768Px',
        lg: '1024Px',
        xl: '1280Px',
        '2xl': '1536Px',
      },

      // z-index 系统
      zIndex: {
        auto: 'auto',
        0: '0',
        10: '10',
        20: '20',
        30: '30',
        40: '40',
        50: '50',
        dropdown: '1000',
        sticky: '1020',
        fixed: '1030',
        'modal-backdrop': '1040',
        modal: '1050',
        popover: '1060',
        tooltip: '1070',
        toast: '1080',
      },
    },
  },

  // 变体配置
  variants: {
    extend: {
      backgroundColor: ['active', 'disabled', 'group-hover'],
      textColor: ['active', 'disabled', 'group-hover'],
      borderColor: ['active', 'disabled', 'group-hover'],
      opacity: ['active', 'disabled'],
      scale: ['group-hover'],
    },
  },

  // 插件配置
  plugins: [
    // 启用表单重置（自定义配置避免与antd冲突）
    require('@tailwindcss/forms')({
      strategy: 'class', // 仅通过类名应用样式
      input: {
        '&:focus': {
          outline: 'none',
          ringWidth: '2px',
          ringColor: 'rgba(22, 119, 255, 0.1)',
        },
      },
    }),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),

    // 添加Less变量支持
    plugin(function ({ addBase, theme }) {
      addBase({
        ':root': {
          '--primary-color': theme('colors.primary.500'),
          '--success-color': theme('colors.success.500'),
          '--warning-color': theme('colors.warning.500'),
          '--error-color': theme('colors.error.500'),
          '--font-size-base': theme('fontSize.base[0]'),
          '--border-radius-base': theme('borderRadius.md'),
        },
        // 基础重置（保留部分关键样式）
        html: {
          '-webkit-touch-callout': 'none',
          'user-select': 'none',
          'scroll-behavior': 'smooth',
          '-webkit-font-smoothing': 'antialiased',
          '-moz-osx-font-smoothing': 'grayscale',
          'text-size-adjust': 'none',
        },
        body: {
          margin: '0',
          padding: '0',
          'line-height': '1.5',
          'font-family': theme('fontFamily.sans'),
          'background-color': '#f5f5f5',
          color: theme('colors.gray.800'),
        },
      });
    }),

    // 添加移动端交互重置
    plugin(function ({ addUtilities }) {
      addUtilities({
        // 禁用移动端点击高亮
        '.tap-highlight-none': {
          '-webkit-tap-highlight-color': 'transparent',
        },
        // 按钮激活效果
        '.active-scale': {
          '&:active': {
            transform: 'scale(0.98)',
            opacity: '0.8',
          },
        },
        // 禁用文本选中
        '.select-none': {
          'user-select': 'none',
          '-webkit-user-select': 'none',
        },
        // 滚动条样式
        '.scrollbar-thin': {
          '&::-webkit-scrollbar': {
            width: '4px',
            height: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            'background-color': 'rgba(0, 0, 0, 0.2)',
            'border-radius': '2px',
          },
          '&::-webkit-scrollbar-track': {
            'background-color': 'transparent',
          },
        },
        // 安全区域适配
        '.safe-area': {
          padding:
            'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
        },
      });
    }),
  ],

  // 核心插件配置
  corePlugins: {
    preflight: false, // 禁用预检样式
    container: false, // 使用自定义容器
  },
};
