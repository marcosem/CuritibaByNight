import styled, { keyframes, css } from 'styled-components';
import { lighten } from 'polished';
import cardBackground from '../../assets/char_profile.png';

interface ICharacterProps {
  isMobile: boolean;
}

const appearFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(1);
  }
`;

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

  animation: ${appearFromLeft} 1s;
`;

export const CardSquare = styled.div`
  position: relative;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;
  border-radius: 10px;

  background: url(${cardBackground});
  background-repeat: no-repeat;
  background-size: cover;

  > span {
    font-style: normal;
    font-weight: 400;
    font-size: 10px;
    color: #eee;

    position: absolute;
    top: 270px;
    left: 44px;
  }
`;

export const ProfileImage = styled.div`
  position: absolute;
  top: 25px;
  left: 46px;

  width: 192px;
  height: 252px;
  border-radius: 50%;

  background: transparent;

  img {
    cursor: pointer;
    width: 192px;
    height: 252px;
    border-radius: 50%;

    transition: opacity 0.2s;

    &:hover {
      opacity: 0.5;
    }
  }
`;

export const CharInfo = styled.div`
  position: absolute;
  top: 285px;
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
    font-weight: normal;
    text-decoration: none;
    transition: color 0.2s;

    color: #000;

    &:hover {
      color: #860209;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }
  }
`;

export const CharXPTitle = styled.div`
  position: absolute;
  top: 315px;
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
  top: 319px;
  left: 221px;

  width: 24px;
  height: 24px;
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
