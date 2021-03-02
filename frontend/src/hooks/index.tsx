import React from 'react';
import { AuthProvider } from './auth';
import { ToastProvider } from './toast';
import { MobileProvider } from './mobile';
import { SelectionProvider } from './selection';
import { ModalBoxProvider } from './modalBox';

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <MobileProvider>
      <SelectionProvider>
        <ModalBoxProvider>
          <ToastProvider>{children}</ToastProvider>
        </ModalBoxProvider>
      </SelectionProvider>
    </MobileProvider>
  </AuthProvider>
);

export default AppProvider;
