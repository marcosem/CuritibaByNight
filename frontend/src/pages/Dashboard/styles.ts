import styled, { keyframes } from 'styled-components';
import { lighten } from 'polished';

interface ProfileProps {
  isST: boolean;
}

const appearFromTop = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(1);
  }
`;

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

export const Container = styled.div`
  height: 100vh;
`;

export const Content = styled.main`
  max-width: 1120px;
  margin: 18px auto;

  > div {
    margin: 0 0 10px 20px;
    > strong {
      color: #000;
    }
  }
`;

export const Character = styled.div`
  background-color: #ccc;
  border-radius: 10px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
  animation: ${appearFromLeft} 1s;

  &:hover {
    background: ${lighten(0.2, '#ccc')};
  }
`;

export const CharTitle = styled.div`
  cursor: pointer;
  max-width: 1120px;
  display: flex;
  justify-content: space-between;
  padding: 10px 45px;

  strong {
    color: #860209;
  }

  span {
    padding-right: 10px;
    margin-left: 12px;
    color: #000;
  }

  svg {
    color: #000;
    width: 16px;
    height: 16px;
  }
`;

export const CharSheet = styled.div`
  iframe {
    animation: ${appearFromTop} 1s;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
  }
`;
