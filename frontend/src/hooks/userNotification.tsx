import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from 'react';
import ModalWarning from '../components/ModalWarning';

import { useAuth } from './auth';

interface IUserNotificationContextData {
  resetNotifications(): void;
  closeWarning(): void;
}

const UserNotificationContext = createContext<IUserNotificationContextData>(
  {} as IUserNotificationContextData,
);

const UserNotificationProvider: React.FC = ({ children }) => {
  const [warningUser, setWarningUser] = useState<boolean>(true);
  const { user } = useAuth();

  const closeWarning = useCallback(() => {
    if (!warningUser) {
      return;
    }
    setWarningUser(false);
  }, [warningUser]);

  const resetNotifications = useCallback(() => {
    setWarningUser(true);
  }, []);

  useEffect(() => {
    if (user === undefined) {
      resetNotifications();
    }
  }, [resetNotifications, user]);

  return (
    <UserNotificationContext.Provider
      value={{
        closeWarning,
        resetNotifications,
      }}
    >
      {children}
      {warningUser &&
        user !== undefined &&
        (user.lgpd_acceptance_date === undefined ||
          user.lgpd_acceptance_date === null) && (
          <ModalWarning warningText="LGPD" />
        )}
    </UserNotificationContext.Provider>
  );
};

function useUserNotification(): IUserNotificationContextData {
  const context = useContext(UserNotificationContext);

  if (!context) {
    throw new Error(
      'useUserNotification must be used within an UserNotificationProvider',
    );
  }

  return context;
}

export { UserNotificationProvider, useUserNotification };
