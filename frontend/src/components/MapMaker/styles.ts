import styled, { css, keyframes } from 'styled-components';
// import { shade } from 'polished';

/*
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;
*/

interface IMapMakerProps {
  isOwner?: boolean;
}

const pulsate = keyframes`
  from {
    transform: scale(0.1, 0.1)
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
  // top: 50%;
  // left: 50%;
  // border: 1px solid #fff;
`;

export const MapPin = styled.div<IMapMakerProps>`
  width: 30px;
  height: 30px;
  border-radius: 50% 50% 50% 0;
  // position: absolute;
  transform: rotate(-45deg);
  // left: 50%;
  // top: 50%;
  // margin: -15px 0 0 -15px;

  ${props =>
    props.isOwner
      ? css`
          background: #029609;
        `
      : css`
          background: #c60209;
        `}
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

  img {
    width: 22px;
    height: 22px;
    border-radius: 50%;
  }

  // z-index: 5;
`;

export const PinShadow = styled.div`
  background: #222;
  opacity: 0.5;
  border-radius: 50%;
  height: 14px;
  width: 14px;
  position: absolute;
  left: 25px;
  top: 22px;
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
    props.isOwner
      ? css`
          box-shadow: 0 0 1px 2px #02c609;
        `
      : css`
          box-shadow: 0 0 1px 2px #f60209;
        `}

  animation: ${pulsate} 1s ease-out;
  animation-iteration-count: infinite;
  animation-delay: 1.1s;
  z-index: -2 !important;
`;

/*
export const Container = styled.button`
  background: #860209;
  color: #d5d5d5;
  font-weight: 500;
  height: 56px;
  border-radius: 10px;
  border: 0;
  padding: 0 16px;
  width: 100%;
  transition: background-color 0.2s;

  -webkit-user-select: none; // Safari
  -moz-user-select: none; // Firefox
  -ms-user-select: none; // IE10+/Edge
  user-select: none; // Standard

  display: flex;
  flex-direction: space-between;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${shade(0.2, '#860209')};
  }

  > svg {
    width: 20px;
    height: 20px;
    color: #fff;
    margin-right: auto;
    animation: ${rotate} 2s linear infinite;
  }

  span {
    margin-right: auto;
    font-size: 16px !important;
    color: #d5d5d5 !important;
    font-weight: 500 !important;
  }
`;
*/
