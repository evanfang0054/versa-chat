import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
      outDir: 'dist/es',
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
      generateScopedName: '[name]__[local]__[hash:base64:5]',
    },
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
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => `${format}/index.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'antd-mobile', '@versa-chat/utils', '@versa-chat/hooks'],
      output: [
        {
          format: 'es',
          preserveModules: true,
          preserveModulesRoot: 'src',
          dir: 'dist/es',
          entryFileNames: '[name].js',
        },
        {
          format: 'umd',
          dir: 'dist',
          name: 'VersaChatUI',
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'antd-mobile': 'antdMobile',
            '@versa-chat/utils': 'VersaUtils',
            '@versa-chat/hooks': 'VersaChatHooks',
          },
        },
      ],
    },
  },
});
