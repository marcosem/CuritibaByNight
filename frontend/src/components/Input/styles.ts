import styled, { css } from 'styled-components';

interface ContainerProps {
  isFilled: boolean;
  isFocused: boolean;
}

export const Container = styled.div<ContainerProps>`
  background: #100909;
  border-radius: 10px;
  padding: 16px;
  width: 100%;
  display: flex;
  align-items: center;

  border: 2px solid #100909;
  color: #756b6b;

  & + div {
    margin-top: 8px;
  }

  ${props =>
    props.isFocused &&
    css`
      color: #860209;
      border-color: #860209;
    `}

  ${props =>
    props.isFilled &&
    css`
      color: #860209;
    `}

  input {
    background: transparent;
    flex: 1;
    border: 0;
    color: #d5d5d5;

    &::placeholder {
      color: #958b8b;
    }

    & input {
      margin-bottom: 8px;
    }
  }

  svg {
    margin-right: 16px;
  }

  span {
    font-size: 14px;
  }
`;
