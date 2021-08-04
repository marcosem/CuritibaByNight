import styled, { css, keyframes } from 'styled-components';
import { darken, lighten } from 'polished';

interface IContainerProps {
  isMobile: boolean;
}

interface INavigateButtonProps {
  position: string;
}

const bumpToRight = keyframes`
  from {
    transform: translateX(0);
  }
  50% {
    transform: translateX(12px);
  }
  to {
    transform: translateX(0);
  }
`;

const bumpToLeft = keyframes`
  from {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-12px);
  }
  to {
    transform: translateX(0);
  }
`;

export const Container = styled.div<IContainerProps>`
  ${props =>
    props.isMobile
      ? css`
          height: calc(100vh - 110px);
        `
      : css`
          height: calc(100vh - 140px);
        `}
`;

export const NavigateButton = styled.button<INavigateButtonProps>`
  position: fixed;
  bottom: calc(50% - 24px);
  display: flex;
  justify-content: center;
  align-items: center;

  ${props =>
    props.position === 'left'
      ? css`
          left: 24px;
        `
      : css`
          right: 24px;
        `}

  width: 48px;
  height: 48px;
  border: 0;

  border-radius: 50%;
  cursor: pointer;
  opacity: 0.5;

  transition: background-color 0.2s;

  svg {
    width: 24px;
    height: 24px;
    color: #222;

    transition: color 0.2s;
  }

  &:hover {
    background-color: ${lighten(0.5, '#e4e6eb')};
    opacity: 0.8;

    ${props =>
      props.position === 'left'
        ? css`
            animation: ${bumpToLeft} 1s ease-in-out infinite;
          `
        : css`
            animation: ${bumpToRight} 1s ease-in-out infinite;
          `}

    svg {
      color: ${darken(0.5, '#222')};
    }
  }
`;

/*
--secondary-button-background: #E4E6EB;
--secondary-button-background-floating: #ffffff;
--secondary-button-background-on-dark: rgba(0, 0, 0, 0.4);
--secondary-button-pressed: rgba(0, 0, 0, 0.05);
--secondary-button-stroke: transparent;
*/
