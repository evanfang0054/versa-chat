import { lazy } from 'react';
import { RouteObject, createBrowserRouter } from 'react-router-dom';

const BasicLayout = lazy(() => import('@/layouts/BasicLayout'));
const ChatPage = lazy(() => import('@/pages/chat'));
const DemoPage = lazy(() => import('@/pages/demo'));
const PaymentList = lazy(() => import('@/pages/payment/PaymentList'));
const PaymentDetail = lazy(() => import('@/pages/payment/PaymentDetail'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <BasicLayout />,
    children: [
      {
        index: true,
        element: <ChatPage />,
      },
      {
        path: 'demo',
        element: <DemoPage />,
      },
      {
        path: 'payments',
        children: [
          {
            index: true,
            element: <PaymentList />,
          },
          {
            path: ':id',
            element: <PaymentDetail />,
          },
        ],
      },
    ],
  },
];
