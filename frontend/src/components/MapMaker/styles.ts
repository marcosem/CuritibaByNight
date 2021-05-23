import styled, { css, keyframes } from 'styled-components';

interface IMapMakerProps {
  ownership?: string;
}

const pulsate = keyframes`
  from {
    transform: scale(0.1, 0.1);
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  to {
    transform: scale(1.2, 1.2);
    opacity: 0;
  }
`;

export const Container = styled.div`
  width: 42px;
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const MapPin = styled.div<IMapMakerProps>`
  width: 30px;
  height: 30px;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);

  ${props =>
    props.ownership === 'owner' &&
    css`
      background: #029609;
    `};

  ${props =>
    props.ownership === 'clan' &&
    css`
      background: #0296e6;
    `};

  ${props =>
    props.ownership === '' &&
    css`
      background: #c60209;
    `};
`;

export const ImgContainer = styled.div`
  width: 24px;
  height: 24px;
  margin: 3px 0 0 2px;
  background: #fff;
  position: absolute;
  border-radius: 50%;
  left: 0;
  right: 0;

  display: flex;
  justify-content: center;
  align-items: center;
  transform: rotate(45deg);

  svg {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    color: #000;
  }
`;

export const PinShadow = styled.div`
  background: #222;
  opacity: 0.5;
  border-radius: 50%;
  height: 14px;
  width: 14px;
  position: absolute;
  left: 26px;
  top: 24px;
  margin: 12px 0px 0px -12px;
  transform: rotateX(55deg);
  z-index: -2 !important;
`;

export const Pulsate = styled.div<IMapMakerProps>`
  border-radius: 50%;
  height: 40px;
  width: 40px;
  left: 0px;
  top: 0px;
  position: absolute;
  margin: -13px 0 0 -13px;
  opacity: 0;

  ${props =>
    props.ownership === 'owner' &&
    css`
      box-shadow: 0 0 1px 2px #02c609;
    `};

  ${props =>
    props.ownership === 'clan' &&
    css`
      box-shadow: 0 0 1px 2px #00ffff;
    `};

  ${props =>
    props.ownership === '' &&
    css`
      box-shadow: 0 0 1px 2px #f60209;
    `};

  animation: ${pulsate} 1s ease-out infinite;
  animation-delay: 1.1s;
  z-index: -2 !important;
`;
