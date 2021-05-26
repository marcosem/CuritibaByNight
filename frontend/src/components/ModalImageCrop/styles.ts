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

const previewVisibility = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

interface IContainerProps {
  openClose: boolean;
  isMobile: boolean;
}

interface ICropContainerProps {
  visible: boolean;
  isMobile?: boolean;
  myWidth?: number;
  myHeight?: number;
}

interface IButtonProps {
  isMobile: boolean;
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
  height: 100%;
  min-height: 382px;
  max-height: 430px;

  ${props =>
    props.isMobile
      ? css`
          min-width: 320px;
          max-width: 320px;
        `
      : css`
          min-width: 340px;
          max-width: 478px;
        `}

  border-radius: 5px;
  position: relative;

  // background: #fff;
  background: #eee;
  box-shadow: 4px 4px 64px rgba(0, 0, 0, 0.5);

  ${props =>
    props.openClose
      ? css`
          animation: ${openDialog} 0.2s ease-in-out 1;
        `
      : css`
          animation: ${closeDialog} 0.2s ease-in-out 1;
        `}
`;

export const ReactCropContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: 254px;
`;

export const CropContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  width: 254px;
  height: 254px;
  background: #666;
  border: solid #000 1px;
  border-radius: 4px;

  margin-right: 5px;
`;

export const CanvasContainer = styled.div<ICropContainerProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 4px;

  ${props =>
    props.isMobile
      ? css`
          width: 0;
          height: 0;
        `
      : css`
          width: calc(2px + ${props.myWidth}px);
          height: calc(2px + ${props.myHeight}px); // 254px;
          background: #666;
          border: solid #000 1px;
          margin-left: 5px;
        `}

  ${props =>
    props.visible
      ? css`
          visibility: visible;
          animation: ${previewVisibility} 0.2s ease-in-out 1;
        `
      : css`
          visibility: hidden;
        `}
`;

export const CanvasMask = styled.div<ICropContainerProps>`
  position: absolute;
  top: 0px;
  left: 0px;

  ${props => css`
    width: ${props.myWidth}px;
    height: ${props.myHeight}px; // 254px;
  `}

  // width: 192px;
  // height: 252px;

  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  // background: rgba(0, 0, 0, 0.5);

  ${props =>
    props.visible
      ? css`
          visibility: visible;
          animation: ${previewVisibility} 0.2s ease-in-out 1;
        `
      : css`
          visibility: hidden;
        `};
`;

export const CanvasMaskWindow = styled.div<ICropContainerProps>`
  // width: 192px;
  // height: 252px;

  ${props => css`
    width: ${props.myWidth}px;
    height: ${props.myHeight}px; // 254px;
  `}

  border-radius: 50%;
  border: solid #ccc 1px;
  // background: rgba(255, 255, 255, 0);
  box-shadow: 0 0 0 100px rgba(0, 0, 0, 0.5);
`;

export const LabelBox = styled.div<IButtonProps>`
  width: 100%;
  background: #860209;
  color: #d5d5d5;
  font-weight: 500;
  height: 56px;
  border-radius: 10px;
  border: 0;
  transition: background-color 0.2s;

  ${props =>
    props.isMobile
      ? css`
          margin: 24px auto 10px auto;
          max-width: 252px;
        `
      : css`
          margin: 16px auto;
          max-width: 340px;
        `}

  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */

  display: flex;
  flex-direction: space-between;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${shade(0.2, '#860209')};
  }

  label {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    span {
      margin: auto;
      font-size: 16px !important;
      color: #d5d5d5 !important;
      font-weight: 500 !important;
    }
  }

  input {
    display: none;
  }
`;

export const ButtonBox = styled.div<IButtonProps>`
  margin: auto;
  padding: 10px 0;
  width: 100%;

  ${props =>
    props.isMobile
      ? css`
          max-width: 252px;
        `
      : css`
          max-width: 340px;
        `}
`;
