import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

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
  }
`;
