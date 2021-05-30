import React, { useState } from 'react';

import LGPDWarning from './warnings/LGPDWarning';

import { Overlay, Container } from './styles';

// import Button from '../Button';

import { useMobile } from '../../hooks/mobile';

interface IModalWarning {
  warningText: string;
}

const ModalWarning: React.FC<IModalWarning> = ({
  warningText,
}: IModalWarning) => {
  const { isMobileVersion } = useMobile();
  const [openDlg, setOpenDlg] = useState<boolean>(true);
  // const { closeImageCrop } = useImageCrop();

  return (
    <Overlay>
      <Container openClose={openDlg} isMobile={isMobileVersion}>
        {warningText === 'LGPD' && <LGPDWarning setOpenDlg={setOpenDlg} />}
      </Container>
    </Overlay>
  );
};

export default ModalWarning;
