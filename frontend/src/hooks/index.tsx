import React from 'react';
import { AuthProvider } from './auth';
import { ToastProvider } from './toast';
import { MobileProvider } from './mobile';
import { SelectionProvider } from './selection';
import { ModalBoxProvider } from './modalBox';
import { SocketProvider } from './socket';
import { HeaderProvider } from './header';
import { ImageCropProvider } from './imageCrop';
import { UserNotificationProvider } from './userNotification';

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <MobileProvider>
      <SelectionProvider>
        <ModalBoxProvider>
          <ToastProvider>
            <UserNotificationProvider>
              <SocketProvider>
                <ImageCropProvider>
                  <HeaderProvider>{children}</HeaderProvider>
                </ImageCropProvider>
              </SocketProvider>
            </UserNotificationProvider>
          </ToastProvider>
        </ModalBoxProvider>
      </SelectionProvider>
    </MobileProvider>
  </AuthProvider>
);

export default AppProvider;
