import styled, { keyframes, css } from 'styled-components';
import { darken } from 'polished';

const bubbleSize = keyframes`
  0%, 75% {
    width: var(--bubble-size, 4rem);
    height: var(--bubble-size, 4rem);
  }

  100% {
    width: 0;
    height: 0;
  }
`;

const bubbleMove = keyframes`
  0% {
    bottom: -4rem;
  }
  100% {
    bottom: var(--bubble-distance, 10rem)
  }
`;

interface IFooterContentProps {
  isMobile?: boolean;
}

interface IInfoBoxProps {
  align?: string;
}

export const FooterBox = styled.div`
  overflow: hidden;
  min-height: 350px;
`;

export const FooterWrapper = styled.div`
  z-index: 1;
  background: var(--cbn-new-red-2);
  display: grid;
  position: relative;
  grid-area: footer;
  min-height: 12rem;
  margin-top: 12rem;
`;

export const Bubbles = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1rem;
  background: var(--cbn-new-red-2);
  filter: url('#blob');
`;

export const Bubble = styled.div`
  position: absolute;
  left: var(--bubble-position, 50%);
  background: var(--cbn-new-red-2);
  border-radius: 100%;
  animation: ${bubbleSize} var(--bubble-time, 4s) ease-in infinite
      var(--bubble-delay, 0s),
    ${bubbleMove} var(--bubble-time, 4s) ease-in infinite
      var(--bubble-delay, 0s);
  transform: translate(-50%, 100%);
`;

export const FooterContent = styled.div<IFooterContentProps>`
  z-index: 2;
  padding: 2rem;
  background: var(--cbn-new-red-2);

  display: grid;

  ${props =>
    props.isMobile
      ? css`
          grid-template-rows: 1fr 1fr 1fr;
        `
      : css`
          grid-template-columns: 1fr 1fr 1fr;
        `}
`;

export const InfoBox = styled.div<IInfoBoxProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;

  ${props =>
    props.align === 'left' &&
    css`
      margin: auto auto auto 0;
    `}

  ${props =>
    props.align === 'right' &&
    css`
      margin: auto 0 auto auto;
    `}

    ${props =>
    props.align !== 'left' &&
    props.align !== 'right' &&
    css`
      margin: auto;
      align-items: center;
    `}

  font-size: 14px;
  color: var(--cbn-new-neutral-1);

  a {
    text-decoration: none;
    font-size: 14px;
    color: var(--cbn-new-neutral-1);
    margin-top: 8px;

    &:hover {
      color: ${darken(0.3, '#eee')};
    }

    strong {
      font-weight: 500;
    }
  }

  > strong {
    font-size: 16px;
    font-weight: 500;
  }

  span {
    font-weight: 400;
  }
`;

export const CbNPages = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: auto;

  a {
    display: flex;
    flex-direction: column;
    text-decoration: none;
    margin: 0 16px;
  }

  svg {
    width: 30px;
    height: 30px;
    color: var(--cbn-new-neutral-1);
    transition: color 0.3;

    &:hover {
      color: ${darken(0.3, '#eee')};
    }
  }
`;
