import React, { createContext, useContext, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';

interface IMobileContextData {
  isMobileVersion: boolean;
}

const MobileContext = createContext<IMobileContextData>(
  {} as IMobileContextData,
);

const MobileProvider: React.FC = ({ children }) => {
  const [mobileVer, setMobileVer] = useState<boolean>(false);

  useEffect(() => {
    setMobileVer(isMobile);
    // setMobileVer(true);
  }, []);

  return (
    <MobileContext.Provider value={{ isMobileVersion: mobileVer }}>
      {children}
    </MobileContext.Provider>
  );
};

function useMobile(): IMobileContextData {
  const context = useContext(MobileContext);

  if (!context) {
    throw new Error('useToast must be used within a MobileProvider');
  }

  return context;
}

export { MobileProvider, useMobile };
