import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
      outDir: 'dist',
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VersaChatUI',
      formats: ['es', 'umd'],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'antd-mobile', '@versa-chat/utils', '@versa-chat/hooks'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'antd-mobile': 'antdMobile',
          '@versa-chat/utils': 'VersaUtils',
          '@versa-chat/hooks': 'VersaChatHooks',
        },
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
});
