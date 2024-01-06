import React from 'react';

import { useMobile } from '../../hooks/mobile';
import HeaderWeb from './HeaderWeb';
import HeaderMobile from './HeaderMobile';

const Header: React.FC = () => {
  const { isMobileVersion } = useMobile();

  return <>{isMobileVersion ? <HeaderMobile /> : <HeaderWeb />}</>;
};

export default Header;
