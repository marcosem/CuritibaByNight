import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from 'react';
import ModalWarning from '../components/ModalWarning';

import { useAuth } from './auth';
import api from '../services/api';

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
  const [lgpdDate, setLGPDDate] = useState<Date | null>(
    // eslint-disable-next-line camelcase
    user?.lgpd_acceptance_date === undefined ? null : user.lgpd_acceptance_date,
  );

  const loadUserLGPD = useCallback(async () => {
    if (user === undefined || lgpdDate !== null) {
      return;
    }

    try {
      await api.post('/profile', { profile_id: user.id }).then(response => {
        const res = response.data;

        setLGPDDate(res.lgpd_acceptance_date);
      });
    } catch (error) {
      setLGPDDate(null);
    }
  }, [lgpdDate, user]);

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
      setLGPDDate(null);
    }

    loadUserLGPD();
  }, [loadUserLGPD, resetNotifications, user]);

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
        (lgpdDate === undefined || lgpdDate === null) && (
          <ModalWarning warningText="LGPD" />
        )}
      {/* For new notification add the logical here */}
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
