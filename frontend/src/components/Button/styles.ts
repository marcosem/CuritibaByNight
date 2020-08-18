import styled from 'styled-components';
import { shade } from 'polished';

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

  &:hover {
    background: ${shade(0.2, '#860209')};
  }
`;
