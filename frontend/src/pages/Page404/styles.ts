import styled, { keyframes, css } from 'styled-components';

const vampBump = keyframes`
  from {
    transform: translateY(10px);
  }

  to {
    transform: translateY(30px);
  }
`;

const bloodDrop = keyframes`
  from {
    opacity: 1;
  }

  to {
    background: red;
    opacity: 0;
    top: 50%;
  }
`;

interface IContentProps {
  isMobile: boolean;
}

interface IEyeProps {
  eyePos: 'left' | 'right';
}

interface IBloodProps {
  drop?: boolean;
}

export const Container = styled.main`
  background: #1b0034;
  background-image: linear-gradient(135deg, #1b0034 10%, #33265c 100%);
  background-attachment: fixed;
  background-size: cover;
  width: 100vw;
  height: 100vh;
`;

export const Content = styled.div<IContentProps>`
  height: auto;
  margin: auto;
  text-align: center;
  margin-bottom: 0;

  ${props =>
    props.isMobile &&
    css`
      > div {
        width: 100%;
      }

      white-space: nowrap;
      transform: scale(0.4);
    `}

  p {
    height: 100%;
    color: #c0d7dd;
    font-size: 280px;
    margin: 100px 50px;
    display: inline-block;
    font-family: 'Anton', sans-serif;
    font-family: 'Combo', cursive;
  }
`;

export const Vampire = styled.span`
  width: 230px;
  height: 300px;
  display: inline-block;
  margin: auto;
  // overflow-x: hidden;
`;

export const VampFace = styled.div`
  width: 500px;
  height: 500px;
  position: relative;
  margin: 9% auto 0;
  animation: ${vampBump} 0.7s ease-in-out infinite alternate;

  div {
    position: absolute;
    left: 0;
  }
`;

export const VampHair = styled.div`
  top: -20px;
  width: 210px;
  height: 200px;
  background: #c0d7dd;
  border-radius: 0 50% 0 50%;
  transform: rotate(45deg);
  background: #33265c;
`;

export const VampHairR = styled.div`
  top: 0;
  left: 20px !important;
  width: 210px;
  height: 200px;
  background: #c0d7dd;
  border-radius: 0 50% 0 50%;
  transform: rotate(45deg);
  background: #33265c;
`;

export const VampHead = styled.div`
  top: 0;
  width: 200px;
  height: 200px;
  background: #c0d7dd;
  border-radius: 0 50% 0 50%;
  transform: rotate(45deg);
`;

export const VampEye = styled.div<IEyeProps>`
  top: 15%;

  ${props =>
    props.eyePos === 'left'
      ? css`
          left: 11.5% !important;
        `
      : css`
          left: 24% !important;
        `}

  width: 20px;
  height: 20px;
  background: #111113;
  border-radius: 50%;
  transition: 0.3s linear;
`;

export const VampMonth = styled.div`
  top: 20%;
  left: 14% !important;

  width: 60px;
  height: 20px;
  background: #840021;
  border-radius: 50% / 0 0 100% 100%;

  &:after {
    content: '';
    position: absolute;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 13px solid #ffffff;
    left: 10px;
  }

  &:before {
    content: '';
    position: absolute;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 13px solid #ffffff;
    left: 40px;
  }
`;

export const VampBlood = styled.div<IBloodProps>`
  background: #840021;

  &:after {
    content: '';
    position: absolute;
    top: 20%;
    left: 10%;

    width: 2px;
    height: 10px;
    background: #fff;
    border-radius: 20px;
  }

  ${props =>
    props.drop
      ? css`
          top: 23%;
          left: 20% !important;
          width: 13px;
          height: 13px;
          border-radius: 50% 50% 50% 0;

          transform: rotate(130deg);
          animation: ${bloodDrop} 2s linear infinite;
          opacity: 0;
        `
      : css`
          top: 23%;
          left: 17% !important;
          width: 8px;
          height: 20px;
          border-radius: 20px;
        `}
`;

export const TextContainer = styled.div`
  display: block;
  p {
    text-align: center;
    color: #c0d7dd;
    font-size: 30px;
    font-family: 'Combo', cursive;
    margin: auto auto 40px auto !important;
  }
`;

export const ButtonBox = styled.div<IContentProps>`
  max-width: 340px;

  ${props =>
    props.isMobile
      ? css`
          margin: 60px auto 16px auto;
          transform: scale(2.5);
        `
      : css`
          margin: 20px auto 16px auto;
        `}
`;
