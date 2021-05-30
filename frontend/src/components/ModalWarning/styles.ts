import styled, { keyframes, css } from 'styled-components';
// import { shade } from 'polished';

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

export const Container = styled.div<IContainerProps>`
  width: 100%;
  height: 100%;
  max-height: 80vh;
  max-width: 90vw;

  border-radius: 5px;
  border: solid #000 1px;
  position: relative;
  opacity: 0.98;

  background: #fff;
  box-shadow: 4px 4px 64px rgba(0, 0, 0, 0.5);

  ${props =>
    props.openClose
      ? css`
          animation: ${openDialog} 0.2s ease-in-out 1;
        `
      : css`
          animation: ${closeDialog} 0.2s ease-in-out 1;
        `}

  padding: 16px;
  color: #000;

  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #555;
  scrollbar-track-color: #333333; // #f5f5f5;
  scroll-behavior: smooth;

  h1 {
    font-size: 25px;
    font-weight: 550;

    &:not(:first-child) {
      margin-top: 30px;
    }
  }

  p {
    font-size: 14px;
    font-weight: 400;
    margin: 10px 0 0 0;

    strong {
      font-weight: 550;
    }
  }

  h2 {
    font-size: 20px;
    font-weight: 550;
    margin: 30px 0 10px 0;
  }

  h3 {
    font-size: 18px;
    font-weight: 550;
    margin: 10px 0;
  }
`;
