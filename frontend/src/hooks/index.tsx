import React from 'react';
import { AuthProvider } from './auth';
import { ToastProvider } from './toast';
import { MobileProvider } from './mobile';
import { SelectionProvider } from './selection';

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <MobileProvider>
      <SelectionProvider>
        <ToastProvider>{children}</ToastProvider>
      </SelectionProvider>
    </MobileProvider>
  </AuthProvider>
);

export default AppProvider;
