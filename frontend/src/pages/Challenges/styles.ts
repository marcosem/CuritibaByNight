import styled, { css, keyframes } from 'styled-components';
import { lighten } from 'polished';
import bgImg from '../../assets/yellow-old-paper.jpg';

interface IDashboardProps {
  isMobile: boolean;
}

interface IButtonProps {
  readyToPlay?: boolean;
  victory?: number;
}

const bounceButton = keyframes`
  from {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-40px);
  }

  to {
    transform: translateY(0);
  }
`;

export const Container = styled.div`
  height: 100vh;
`;

export const TitleBox = styled.div`
  min-width: 340px;
  max-width: 1012px;
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
          flex-direction: column;
        `
      : css`
          min-width: 340px;
          max-width: 1012px;

          flex-direction: row;
        `}

  border-radius: 4px;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
`;

export const CharCardContainer = styled.div<IDashboardProps>`
  padding: 16px;

  ${props =>
    props.isMobile &&
    css`
      padding-bottom: 5px;

      div {
        margin: auto;
      }
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

export const JanKenPoContainer = styled.div`
  display: flex;
  flex-direction: column !important;
  //background: #111;
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
