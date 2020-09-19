import React from 'react';
import { AuthProvider } from './auth';
import { ToastProvider } from './toast';
import { MobileProvider } from './mobile';

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <MobileProvider>
      <ToastProvider>{children}</ToastProvider>
    </MobileProvider>
  </AuthProvider>
);

export default AppProvider;
