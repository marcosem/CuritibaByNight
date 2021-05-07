import React from 'react';
import { AuthProvider } from './auth';
import { ToastProvider } from './toast';
import { MobileProvider } from './mobile';
import { SelectionProvider } from './selection';
import { ModalBoxProvider } from './modalBox';
import { SocketProvider } from './socket';
import { HeaderProvider } from './header';

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <MobileProvider>
      <SelectionProvider>
        <ModalBoxProvider>
          <ToastProvider>
            <SocketProvider>
              <HeaderProvider>{children}</HeaderProvider>
            </SocketProvider>
          </ToastProvider>
        </ModalBoxProvider>
      </SelectionProvider>
    </MobileProvider>
  </AuthProvider>
);

export default AppProvider;
