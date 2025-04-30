import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import legacy from '@vitejs/plugin-legacy';
import viteCompression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';
import { createHtmlPlugin } from 'vite-plugin-html';
import postcssImport from 'postcss-import';
import postcssPresetEnv from 'postcss-preset-env';
import postcssPxToRem from 'postcss-pxtorem';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig((config) => {
  const env = loadEnv(config.mode, process.cwd(), '');
  const port = Number(env.VITE_APP_PORT) || 3000;

  return {
    plugins: [
      react(),
      // 兼容旧版浏览器
      legacy({
        targets: ['defaults', 'not IE 11'],
      }),
      // Gzip 压缩
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz',
      }),
      // 构建分析
      visualizer({
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),
      // HTML 优化
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            title: env.VITE_APP_NAME,
          },
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
      postcss: {
        plugins: [
          tailwindcss(),
          autoprefixer(),
          postcssImport(),
          postcssPresetEnv(),
          postcssPxToRem({
            rootValue: 37.5,
            propList: ['*'],
            unitPrecision: 5,
            selectorBlackList: ['.ignore', '.hairlines', '.dp-'],
            replace: true,
            mediaQuery: true,
            minPixelValue: 1,
          }),
        ],
      },
      // CSS 代码分割
      modules: {
        generateScopedName: '[name]__[local]___[hash:base64:5]',
      },
      // 开启 CSS 源码映射
      devSourcemap: true,
    },
    server: {
      port,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
      // 启用 HMR
      hmr: {
        overlay: true,
      },
      // 开发服务器配置
      watch: {
        // 使用轮询来监视文件变化
        usePolling: true,
      },
    },
    build: {
      outDir: 'dist',
      // 生产环境移除 console
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      // 启用源码映射
      sourcemap: true,
      // 构建优化
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'antd-mobile': ['antd-mobile'],
            lodash: ['lodash-es'],
          },
          // 自定义 chunk 文件名
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
      // 设置较大的警告阈值
      chunkSizeWarningLimit: 2000,
      // CSS 代码分割
      cssCodeSplit: true,
      // 预加载分析
      reportCompressedSize: false,
    },
    // 优化依赖预构建
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'antd-mobile', 'lodash-es'],
      exclude: [],
    },
    // 预加载配置
    preview: {
      port: 8080,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
      strictPort: true,
    },
  };
});
