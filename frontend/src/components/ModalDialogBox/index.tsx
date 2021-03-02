import React, { useState, useCallback, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import {
  FaInfoCircle,
  FaExclamationTriangle,
  FaMinusCircle,
} from 'react-icons/fa';
import { IconType } from 'react-icons/lib';
import { useModalBox } from '../../hooks/modalBox';
import {
  Container,
  Overlay,
  BodyContainer,
  TextContainer,
  CloseModalButton,
  ButtonsContainer,
  FunctionButton,
  IconContainer,
} from './styles';

interface IModalBoxData {
  type?: 'warning' | 'error' | 'info';
  title: string;
  description?: string;
  btn1Title?: string;
  btn1Function?: () => void;
  btn2Title?: string;
  btn2Function?: () => void;
  btn3Title?: string;
  btn3Function?: () => void;
}

interface IModalDialogBoxProps {
  modalData: IModalBoxData;
}

const ModalDialogBox: React.FC<IModalDialogBoxProps> = ({
  modalData,
}: IModalDialogBoxProps) => {
  const [openDlg, setOpenDlg] = useState<boolean>(true);
  const [dlgIcon, setDlgIcon] = useState<IconType | null>(null);
  const { closeModal } = useModalBox();

  const {
    type,
    title,
    description,
    btn1Title,
    btn1Function,
    btn2Title,
    btn2Function,
    btn3Title,
    btn3Function,
  } = modalData;

  const closeDialog = useCallback(() => {
    setOpenDlg(false);
    setTimeout(() => {
      closeModal();
    }, 200);
  }, [closeModal]);

  const handleButtonOne = useCallback(
    event => {
      event.stopPropagation();

      if (btn1Function) {
        btn1Function();
        closeDialog();
      }
    },
    [btn1Function, closeDialog],
  );

  const handleButtonTwo = useCallback(
    event => {
      event.stopPropagation();

      if (btn2Function) {
        btn2Function();
        closeDialog();
      }
    },
    [btn2Function, closeDialog],
  );

  const handleButtonThree = useCallback(
    event => {
      event.stopPropagation();

      if (btn3Function) {
        btn3Function();
        closeDialog();
      }
    },
    [btn3Function, closeDialog],
  );

  const handleDoNothing = useCallback(event => {
    event.stopPropagation();
  }, []);

  useEffect(() => {
    switch (type) {
      case 'warning':
        setDlgIcon(FaExclamationTriangle);
        break;
      case 'error':
        setDlgIcon(FaMinusCircle);
        break;
      case 'info':
        setDlgIcon(FaInfoCircle);
        break;
      default:
    }
  }, [type]);

  useEffect(() => {
    if (
      btn1Function === undefined &&
      btn2Function === undefined &&
      btn3Function === undefined &&
      openDlg
    ) {
      setTimeout(() => {
        closeDialog();
      }, 3000);
    }
  }, [btn1Function, btn2Function, btn3Function, closeDialog, openDlg]);

  useEffect(() => {
    if (type === undefined && openDlg) {
      closeDialog();
    }
  }, [type, closeDialog, openDlg]);

  return (
    <Overlay onClick={closeDialog}>
      <Container
        openClose={openDlg}
        type={type as 'warning' | 'error' | 'info'}
        onClick={handleDoNothing}
      >
        <BodyContainer>
          {dlgIcon !== null && (
            <IconContainer iconColor={type as 'warning' | 'error' | 'info'}>
              {dlgIcon}
            </IconContainer>
          )}
          <TextContainer>
            <strong>{title}</strong>
            {description && <p>{description}</p>}
          </TextContainer>
        </BodyContainer>

        <ButtonsContainer>
          {btn1Title && btn1Function && (
            <FunctionButton
              type="button"
              onClick={handleButtonOne}
              text={btn1Title}
            >
              <span>{btn1Title}</span>
            </FunctionButton>
          )}
          {btn2Title && btn2Function && (
            <FunctionButton
              type="button"
              onClick={handleButtonTwo}
              text={btn2Title}
            >
              <span>{btn2Title}</span>
            </FunctionButton>
          )}
          {btn3Title && btn3Function && (
            <FunctionButton
              type="button"
              onClick={handleButtonThree}
              text={btn3Title}
            >
              <span>{btn3Title}</span>
            </FunctionButton>
          )}
        </ButtonsContainer>
        <CloseModalButton onClick={closeDialog}>
          <FiX />
        </CloseModalButton>
      </Container>
    </Overlay>
  );
};

export default ModalDialogBox;
