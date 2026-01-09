import { ReactNode } from 'react';

export interface KeepAliveProviderProps {
  children: ReactNode;
}

export interface KeepAliveWrapperProps {
  children: ReactNode;
  id: string;
  saveScrollPosition?: boolean;
  when?: boolean;
}
