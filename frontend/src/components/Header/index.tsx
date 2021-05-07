import React from 'react';

import { useMobile } from '../../hooks/mobile';
import HeaderWeb from './HeaderWeb';
import HeaderMobile from './HeaderMobile';

interface IHeaderProps {
  page?: string;
}

const Header: React.FC<IHeaderProps> = ({ page }) => {
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
