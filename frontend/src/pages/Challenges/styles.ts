import styled, { css, keyframes } from 'styled-components';
import { lighten } from 'polished';
import bgImg from '../../assets/yellow-old-paper.jpg';

interface ICardContainerProps {
  animationMode?: string;
  position?: string;
}

interface IButtonProps {
  readyToPlay?: boolean;
  victory?: number;
  isMobile?: boolean;
}

interface IContentsProps {
  isMobile: boolean;
}

interface IConnectionButtonProps {
  connected: boolean;
}

interface IIconProps {
  animateMe?: boolean;
  vertical?: boolean;
}

const bounceButton = keyframes`
  from {
    transform: scale(1) translateY(0);
  }

  50% {
    transform: scale(1.2) translateY(-40px);
  }

  to {
    transform: scale(1) translateY(0);
  }
`;

const XOpacity = keyframes`
  from {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const characterIn = keyframes`
  from {
    transform: translateY(+200px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const characterOut = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }

  to {
    transform: translateY(+200px);
    opacity: 0;
  }
`;

export const Container = styled.div`
  height: 100vh;
`;

export const TitleBox = styled.div`
  min-width: 340px;
  max-width: 1012px;
  height: 38px;
  position: relative;

  display: flex;
  flex-direction: space-between;
  padding: 10px;

  margin: 5px auto 10px auto;

  border-radius: 10px;
  background: rgba(0, 0, 0, 0.2);
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);

  > strong {
    color: #eee;
    text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
    font-size: 14px;
    font-weight: 500;
    margin: auto;
  }
`;

export const Content = styled.main<IContentsProps>`
  margin: 0 auto;
  background: url(${bgImg}) repeat;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  min-height: 382px;
  max-height: 75vh;
  max-width: 1012px;

  ${props =>
    props.isMobile
      ? css`
          max-width: 340px;
        `
      : css`
          min-width: 340px;
          max-width: 1012px;
        `}

  scrollbar-width: thin;
  scrollbar-color: #555;
  scrollbar-track-color: #f5f5f5;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 8px;
    background-color: #f5f5f5;
  }

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    background-color: #f5f5f5;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #555;
  }

  border-radius: 4px;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
`;

export const CardsContent = styled.div`
  display: flex;
  flex-direction: row;
`;

export const CharCardContainer = styled.div<ICardContainerProps>`
  padding: 16px;
  margin: auto;

  ${props =>
    props.animationMode === 'in' &&
    css`
      animation: ${characterIn} 0.7s ease-in-out 1;
    `}

  ${props =>
    props.animationMode === 'out' &&
    css`
      animation: ${characterOut} 0.7s ease-in-out 1;
    `}
`;

export const ChallangeArena = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 16px 0;

  div {
    display: flex;
    flex-direction: row;
    width: 100%;
    margin-bottom: 5px;

    h1 {
      font-size: 24px;
      font-weight: 500;
      margin: 0 auto;
      color: #333;
    }
  }
`;

export const ArenaContainer = styled.div`
  width: 100%;
  //background: #444;
  height: 286px;
`;

export const JanKenPoContainer = styled.div<IIconProps>`
  display: flex;
  flex-direction: column !important;
  width: 64px !important;
  height: 100%;

  &:first-child {
    margin-right: auto;
    button {
      margin-left: 5px;
    }
  }

  &:last-child {
    margin-left: auto;
  }

  > svg {
    margin: auto;
    color: #860209;
    width: 32px;
    height: 32px;

    ${props =>
      props.animateMe &&
      css`
        animation: ${XOpacity} 0.7s ease-in-out 3;
      `}
  }
`;

export const JanKenPoButton = styled.button<IButtonProps>`
  border: 0;
  margin: auto;
  background: #333;

  display: flex;
  justify-content: center;
  align-items: center;

  transition: background-color 0.2s;
  transition: transform 0.2s;

  svg {
    color: #ccc;
    transition: color 0.2s;
    transition: transform 0.2s;
  }

  ${props =>
    props.isMobile
      ? css`
          width: 42px;
          height: 42px;
          border-radius: 15px;

          svg {
            width: 24px;
            height: 24px;
          }
        `
      : css`
          width: 64px;
          height: 64px;
          border-radius: 20px;

          svg {
            width: 32px;
            height: 32px;
          }
        `}

  &:hover {
    :not(:disabled) {
      transform: scale(1.2);
      background: ${lighten(0.2, '#333')};
      svg {
        color: ${lighten(0.2, '#ccc')};
      }
    }
  }

  :disabled {
    cursor: not-allowed;
  }

  ${props =>
    props.victory === 0 &&
    css`
      background: #022603;
    `}

  ${props =>
    props.readyToPlay &&
    props.victory === 0 &&
    css`
      background: #022603;
      animation: ${bounceButton} 0.7s ease-in-out 3;
    `}

  ${props =>
    props.victory === 1 &&
    css`
      background: #028603;
    `}

  ${props =>
    props.victory === -1 &&
    css`
      background: #860209;
    `}
`;

export const SelectCharacter = styled.select`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: none;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

  width: 250px;

  &:first-child {
    margin-right: auto;
  }

  &:last-child {
    margin-left: auto;
  }

  background: #111;
  border-radius: 4px;
  border: 0;
  padding: 0 8px;
  font-size: 14px;
  font-weight: 500;
  color: #888;
`;

export const ButtonBox = styled.div<IContentsProps>`
  margin: auto;
  padding: 16px 0;
  display: flex;
  flex-direction: row;

  button {
    &:last-child {
      margin-left: 10px;
    }
  }

  ${props =>
    props.isMobile
      ? css`
          width: 320px;
        `
      : css`
          width: 340px;
        `}
`;

export const ConnectionStatus = styled.div<IConnectionButtonProps>`
  width: 32px;
  height: 32px;
  border: 0;
  margin: 10px auto !important;
  border-radius: 50%;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s;

  svg {
    width: 16px;
    height: 16px;
    color: #ccc;
  }

  ${props =>
    props.connected
      ? css`
          background: #025609;
        `
      : css`
          background: #860209;
        `}
`;

export const ConnectionButton = styled.button<IConnectionButtonProps>`
  position: fixed;
  bottom: 40px;
  right: 40px;

  width: 64px;
  height: 64px;
  border: 0;

  border-radius: 20px;

  display: flex;
  justify-content: center;
  align-items: center;

  transition: background-color 0.2s;

  :disabled {
    cursor: not-allowed;
  }

  svg {
    width: 32px;
    height: 32px;
    color: #ccc;
    transition: color 0.2s;
  }

  ${props =>
    props.connected
      ? css`
          background: #025609;

          &:hover {
            background: ${lighten(0.2, '#025609')};
          }
        `
      : css`
          background: #860209;

          &:hover {
            background: ${lighten(0.2, '#860209')};
          }
        `}

  &:hover {
    svg {
      color: ${lighten(0.2, '#ccc')};
    }
  }
`;

export const SelectorContainerMobile = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 33px;
`;

export const CardContainerMobile = styled.div`
  display: flex;
  flex-direction: row;
  padding: 8px;
  width: 100%;
  height: 317px;
`;

export const CharCardContainerMobile = styled.div<ICardContainerProps>`
  width: 264px;
  height: 430px;
  margin: 0;
  transform: scale(0.7);

  ${props =>
    props.position === 'left' &&
    css`
      transform-origin: top left;
    `}

  ${props =>
    props.position === 'right' &&
    css`
      transform-origin: top right;
    `}

  ${props =>
    props.animationMode === 'in' &&
    css`
      animation: ${characterIn} 0.7s ease-in-out 1;
    `}

  ${props =>
    props.animationMode === 'out' &&
    css`
      animation: ${characterOut} 0.7s ease-in-out 1;
    `}
`;

export const TitleContainerMobile = styled.div`
  display: flex;
  flex-direction: row;
  margin: 5px 0;
  width: 100%;

  h1 {
    font-size: 16px;
    font-weight: 500;
    margin: 0 auto;
    color: #333;
  }
`;

export const ChallangeArenaMobile = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 8px 0;
`;

export const JanKenPoContainerMobile = styled.div<IIconProps>`
  display: flex;
  flex-direction: column !important;
  width: 42px !important;
  min-height: 42px;
  height: 100%;
  max-height: 183px;
  margin: auto;

  ${props =>
    props.vertical &&
    css`
      margin: 32px 64px 32px 0;
    `}

  &:first-child {
    margin-right: 0;
    button {
      margin-right: 0;
    }
  }

  &:last-child {
    margin-left: 0;
    button {
      margin-left: 0;
    }
  }

  > svg {
    margin: auto;
    color: #860209;
    width: 32px;
    height: 32px;

    ${props =>
      props.animateMe &&
      css`
        animation: ${XOpacity} 0.7s ease-in-out 3;
      `}
  }
`;
