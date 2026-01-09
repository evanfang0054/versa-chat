import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './utils/i18n'; // 导入i18n配置
import 'amfe-flexible'; // 用于移动端适配
import 'antd-mobile/es/global';
import './styles/index.less';
import './styles/antd-mobile.less';

// 启动应用
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
