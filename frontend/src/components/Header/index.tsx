import React from 'react';

import { useMobile } from '../../hooks/mobile';
import HeaderWeb from '../HeaderWeb';
import HeaderMobile from '../HeaderMobile';

interface HeaderProps {
  page?: string;
}

const Header: React.FC<HeaderProps> = ({ page }) => {
  const { isMobileVersion } = useMobile();

  return (
    <>
      {isMobileVersion ? (
        <HeaderMobile page={page} />
      ) : (
        <HeaderWeb page={page} />
      )}
    </>
  );
};

export default Header;
