import styled, { css, keyframes } from 'styled-components';
import { lighten } from 'polished';
import bgImg from '../../assets/yellow-old-paper.jpg';

interface IDashboardProps {
  isMobile: boolean;
}

interface ICardContainerProps {
  isMobile: boolean;
  animationMode?: string;
}

interface IButtonProps {
  readyToPlay?: boolean;
  victory?: number;
}

interface IConnectionButtonProps {
  connected: boolean;
}

interface IIconProps {
  animateMe?: boolean;
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

export const Content = styled.main<IDashboardProps>`
  margin: 0 auto;
  background: url(${bgImg}) repeat;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  min-height: 382px;
  max-height: 75vh;

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

  ${props =>
    props.isMobile
      ? css`
          max-width: 340px;
        `
      : css`
          min-width: 340px;
          max-width: 1012px;
        `}

  border-radius: 4px;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
`;

export const CardsContent = styled.div<IDashboardProps>`
  display: flex;

  ${props =>
    props.isMobile
      ? css`
          flex-direction: column;
        `
      : css`
          flex-direction: row;
        `}
`;

export const CharCardContainer = styled.div<ICardContainerProps>`
  padding: 16px;

  ${props =>
    props.isMobile &&
    css`
      padding-bottom: 5px;

      div {
        margin: auto;
      }
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

export const ChallangeArena = styled.div<IDashboardProps>`
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
  }

  &:last-child {
    margin-left: auto;
  }

  > svg {
    margin: auto;
    color: #860209;
    width: 32px;
    height: 32px;

    // transition: opacity 0.2s;

    ${props =>
      props.animateMe &&
      css`
        animation: ${XOpacity} 0.7s ease-in-out 3;
      `}
  }
`;

export const JanKenPoButton = styled.button<IButtonProps>`
  width: 64px;
  height: 64px;
  border: 0;
  margin: auto;

  background: #333;
  border-radius: 20px;

  display: flex;
  justify-content: center;
  align-items: center;

  transition: background-color 0.2s;
  transition: scale 0.2s;

  svg {
    width: 32px;
    height: 32px;
    color: #ccc;
    transition: color 0.2s;
    transition: scale 0.2s;
  }

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

export const ButtonBox = styled.div<IDashboardProps>`
  margin: auto;
  padding: 16px 0;

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
