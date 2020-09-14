import styled, { keyframes, css } from 'styled-components';
import { lighten } from 'polished';
import getCardImg from './getCardImg';

interface ICharacterProps {
  isMobile: boolean;
}

interface IImageProps {
  locked: boolean;
}

interface ICardProps {
  clan: string;
}

const appearFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
    z-index: 10; transform: rotateZ(-10deg);
  }
  to {
    opacity: 1;
    transform: translateX(1);
    transform: rotateZ(0deg);
  }
`;

// transform: rotateZ(0deg);
// z-index: 10; transform: rotateZ(-2deg);

export const Container = styled.div<ICharacterProps>`
  width: 248px;
  height: 350px;
  display: flex;
  background: #000;
  background: transparent;

  & + div {
    ${props =>
      props.isMobile
        ? css`
            margin-top: 20px;
          `
        : css`
            margin-left: 20px;
          `}
  }

  animation: ${appearFromLeft} 0.6s;
`;

export const CardSquare = styled.div<ICardProps>`
  position: relative;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;
  border-radius: 10px;

  ${props => css`
    background: url(${getCardImg(props.clan)});
  `}

  background-repeat: no-repeat;
  background-size: cover;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.8);

  > span {
    cursor: default;
    font-style: normal;
    font-weight: 400;
    font-size: 10px;
    color: #eee;

    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);

    position: absolute;
    top: 273px;
    left: 44px;
  }
`;

export const ProfileImage = styled.div<IImageProps>`
  position: absolute;
  top: 29px;
  left: 46px;

  width: 192px;
  height: 252px;
  border-radius: 50%;

  background: transparent;

  input {
    display: none;
  }

  img {
    width: 192px;
    height: 252px;
    border-radius: 50%;

    transition: opacity 0.2s;

    ${props =>
      !props.locked &&
      css`
        &:hover {
          cursor: pointer;
          opacity: 0.5;
        }
      `}
  }
`;

export const CharInfo = styled.div`
  position: absolute;
  top: 288px;
  left: 49px;

  width: 188px;
  height: 49px;

  background: transparent;

  line-height: 90%;

  display: flex;
  align-items: center;
  justify-content: center;

  > a {
    cursor: pointer;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    text-decoration: none;
    transition: color 0.2s;

    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;

    color: #000;

    &:hover {
      color: #860209;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }
  }
`;

export const CharXPTitle = styled.div`
  position: absolute;
  top: 319px;
  left: 201px;

  width: 20px;
  height: 18px;

  background: transparent;

  > span {
    cursor: default;
    margin-left: auto;
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    color: #860209;
  }
`;

export const CharXP = styled.div`
  position: absolute;
  top: 321px;
  left: 220px;

  width: 25px;
  height: 25px;
  border-radius: 50%;

  background: transparent;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #eee;

  > span {
    cursor: default;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 12px;

    transition: color 0.2s;
  }

  transition: background-color 0.2s;

  &:hover {
    font-weight: 500;
    color: ${lighten(0.5, '#eee')};
    background: ${lighten(0.2, '#860209')};
  }
`;
