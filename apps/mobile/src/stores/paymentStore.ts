import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface Payment {
  id: string;
  amount: number;
  status: 'pending' | 'success' | 'failed';
  createdAt: string;
  description?: string;
}

interface PaymentState {
  payments: Payment[];
  loading: boolean;
  fetchPayments: () => Promise<void>;
}

const mockPayments: Payment[] = [
  {
    id: '1',
    amount: 99.99,
    status: 'success',
    createdAt: '2025-06-01',
    description: 'VIP会员订阅',
  },
  {
    id: '2',
    amount: 199.99,
    status: 'pending',
    createdAt: '2025-06-02',
    description: '项目咨询费',
  },
  { id: '3', amount: 299.99, status: 'failed', createdAt: '2025-06-03', description: '技术服务费' },
  { id: '4', amount: 299.99, status: 'failed', createdAt: '2025-06-03', description: '技术服务费' },
  { id: '5', amount: 299.99, status: 'failed', createdAt: '2025-06-03', description: '技术服务费' },
  { id: '6', amount: 299.99, status: 'failed', createdAt: '2025-06-03', description: '技术服务费' },
  { id: '7', amount: 299.99, status: 'failed', createdAt: '2025-06-03', description: '技术服务费' },
  { id: '8', amount: 299.99, status: 'failed', createdAt: '2025-06-03', description: '技术服务费' },
];

export const usePaymentStore = create<PaymentState>()(
  persist(
    immer((set) => ({
      payments: [],
      loading: false,
      fetchPayments: async () => {
        set({ loading: true });
        // 模拟API请求
        await new Promise((resolve) => setTimeout(resolve, 500));
        set({ payments: mockPayments, loading: false });
      },
    })),
    {
      name: 'payment-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
