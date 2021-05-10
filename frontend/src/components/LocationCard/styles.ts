import styled, { keyframes, css } from 'styled-components';
import CardToolTip from '../CardToolTip';

interface ILocationProps {
  isMobile: boolean;
  locked: boolean;
}

interface IImageProps {
  locked: boolean;
}

interface ICardProps {
  cardImg: string;
}

interface ICardTitle {
  textLength: number;
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

const appear = keyframes`
  from {
    filter: blur(10px);
    opacity: 0;
  }

  to {
    filter: blur(0);
    opacity: 1;
  }
`;

export const Container = styled.div<ILocationProps>`
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

  ${props =>
    !props.locked &&
    css`
      animation: ${appearFromLeft} 0.6s;
    `}
`;

export const CardSquare = styled.div<ICardProps>`
  position: relative;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;
  border-radius: 10px;

  ${props => css`
    background: url(${props.cardImg});
  `}

  background-repeat: no-repeat;
  background-size: cover;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.8);
`;

export const CardTitle = styled.div<ICardTitle>`
  position: absolute;
  top: 4px;
  left: 10px;
  width: 200px;
  height: 23px;
  display: flex;

  background: transparent;

  span {
    ${props =>
      props.textLength > 22
        ? css`
            font-size: 12px;
          `
        : css`
            font-size: 16px;
          `}

    font-style: normal;
    font-weight: 550;
    text-decoration: none;
    max-width: 200px;

    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;

    color: #fff;
  }
`;

export const LocationImage = styled.div<IImageProps>`
  position: absolute;
  top: 30px;
  left: 44px;
  width: 198px;
  height: 172px;
  background: #888;

  input {
    display: none;
  }

  img {
    object-fit: cover;
    object-position: 0 50%;

    width: 198px;
    height: 172px;

    animation: ${appear} 0.2s ease-in-out;
    transition: opacity 0.2s;
  }

  svg {
    position: absolute;
    top: 57px;
    left: 73px;

    width: 46px;
    height: 46px;

    color: #fff;

    opacity: 0.5;
    visibility: hidden;

    transition: visibility 0.2s;
  }

  span {
    position: absolute;
    opacity: 0.5;
    font-size: 16px;
    font-weight: 550;
    top: 105px;
    left: 45px;

    visibility: hidden;

    transition: visibility 0.2s;
  }

  ${props =>
    !props.locked &&
    css`
      &:hover {
        cursor: pointer;

        svg {
          visibility: visible;
        }

        span {
          visibility: visible;
        }

        img {
          opacity: 0.5;
        }
      }
    `}
`;

export const LocationInfo = styled.div`
  position: absolute;
  top: 223px;
  left: 47px;

  width: 193px;
  height: 117px;

  background: transparent;

  line-height: 90%;

  display: flex;
  flex-direction: column;
  line-height: normal;

  strong {
    font-size: 13px;
    font-weight: 550;
    text-decoration: none;
    padding: 5px 5px 10px 5px;
    margin: 0 auto;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre-wrap;

    color: #000;
  }

  span {
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    padding: 0 5px 0 5px;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre-wrap;

    color: #000;
  }

  small {
    font-size: 11px;
    font-style: normal;
    font-weight: 500;
    text-decoration: none;
    padding: 0 5px 0 5px;
    margin: auto auto 0 auto;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre-wrap;

    color: #000;
  }
`;

export const LocationType = styled(CardToolTip)`
  position: absolute;
  top: 70px;
  left: 9px;

  width: 20px;
  height: 20px;

  background: transparent;

  > svg {
    width: 20px;
    height: 20px;
    color: #eee;
  }
`;

export const LocationElysium = styled(CardToolTip)`
  position: absolute;
  top: 180px;
  left: 9px;

  width: 20px;
  height: 20px;

  background: transparent;

  > svg {
    width: 20px;
    height: 20px;
    color: #eee;
  }
`;

export const LocationLevel = styled.div`
  position: absolute;
  top: 311px;
  left: 5px;

  width: 25px;
  height: 25px;
  border-radius: 50%;

  background: #860209;

  display: flex;
  align-items: center;
  justify-content: center;
  color: #ddd;

  > span {
    font-weight: 520;
    font-size: 14px;
  }
`;
