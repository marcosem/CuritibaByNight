import styled, { keyframes, css } from 'styled-components';
import { shade } from 'polished';

const openDialog = keyframes`
  from {
    transform: scale(0.2);
    opacity: 0.2;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const closeDialog = keyframes`
  from {
    transform: scale(1);
    opacity: 1;
  }

  to {
    transform: scale(0.2);
    opacity: 0.2;
  }
`;

interface IContainerProps {
  openClose: boolean;
  type: 'warning' | 'error' | 'info';
}

interface IIconContainerProps {
  iconColor: 'warning' | 'error' | 'info';
}

interface IButtonText {
  text?: string;
}

export const Overlay = styled.div`
  background: transparent;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5000;
`;

export const CloseModalButton = styled.button`
  position: absolute;
  background: transparent;
  right: 0.3rem;
  top: 0.3rem;
  width: 1.6rem;
  height: 1.6rem;
  border: 0;
  font-size: 0px;
  cursor: pointer;
  padding: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 4px;
  transition: background-color 0.2s;

  svg {
    color: #000;
    width: 1rem;
    height: 1rem;
  }
`;

export const Container = styled.div<IContainerProps>`
  width: 100%;
  max-width: 500px;
  padding: 1.3rem 1.6rem 1.3rem 1rem;
  border-radius: 5px;
  box-shadow: 4px 4px 64px rgba(0, 0, 0, 0.5);
  position: relative;

  background: white;
  ${props =>
    props.type === 'warning' &&
    css`
      background: #ffffe0;
    `}

  ${props =>
    props.type === 'error' &&
    css`
      background: #fddede;
    `}

  ${props =>
    props.type === 'info' &&
    css`
      background: #ebf8ff;
    `}


  ${props =>
    props.openClose
      ? css`
          animation: ${openDialog} 0.2s ease-in-out 1;
        `
      : css`
          animation: ${closeDialog} 0.2s ease-in-out 1;
        `}

  ${CloseModalButton} {
    ${props =>
      props.type === 'warning' &&
      css`
        &:hover {
          background: ${shade(0.1, '#ffffe0')};
        }
      `}

    ${props =>
      props.type === 'error' &&
      css`
        &:hover {
          background: ${shade(0.1, '#fddede')};
        }
      `}

    ${props =>
      props.type === 'info' &&
      css`
        &:hover {
          background: ${shade(0.1, '#ebf8ff')};
        }
      `}
  }
`;

export const BodyContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export const IconContainer = styled.div<IIconContainerProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-right: 1rem;

  > svg {
    display: flex;

    width: 3rem;
    height: 3rem;

    transition: transform 0.2s;

    ${props =>
      props.iconColor === 'warning' &&
      css`
        color: #ffc107;
      `}

    ${props =>
      props.iconColor === 'error' &&
      css`
        color: #f44336;
      `}

    ${props =>
      props.iconColor === 'info' &&
      css`
        color: #2196f3;
      `}

      &:hover {
      transform: scale(1.3);
    }
  }
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;

  strong {
    width: 100%;
    font-size: 1.4rem;
    color: #333;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  p {
    font-size: 0.9rem;
    font-weight: 500;
    width: 100%;
    color: #333;
    margin-top: 0.8rem;

    overflow-wrap: break-word;
    word-wrap: break-word;
  }
`;

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding-top: 1rem;
`;

export const FunctionButton = styled.button<IButtonText>`
  display: flex;
  flex-direction: space-between;
  justify-content: center;
  align-items: center;
  width: 6rem;
  height: 1.8rem;
  border-radius: 6px;
  border: 0;
  margin: 0 0.6rem;
  cursor: pointer;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

  background: #5f9cec;
  transition: background-color 0.2s;

  &:hover {
    background: ${shade(0.2, '#5f9cec')};
  }
  ${props =>
    (props.text?.toLowerCase() === 'yes' ||
      props.text?.toLowerCase() === 'sim') &&
    css`
      background: #4acfae;
      &:hover {
        background: ${shade(0.2, '#4acfae')};
      }
    `}

  ${props =>
    (props.text?.toLowerCase() === 'no' ||
      props.text?.toLowerCase() === 'cancel' ||
      props.text?.toLowerCase() === 'não' ||
      props.text?.toLowerCase() === 'cancelar') &&
    css`
      background: #ed5464;
      &:hover {
        background: ${shade(0.2, '#ed5464')};
      }
    `}

  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  > span {
    font-size: 0.8rem;
    color: #fff;
    font-weight: 550;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
