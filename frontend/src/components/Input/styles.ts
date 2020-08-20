import styled, { css } from 'styled-components';
import ToolTip from '../ToolTip';

interface ContainerProps {
  isErrored: boolean;
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

  border: 2px solid #201919;
  color: #756b6b;

  & + div {
    margin-top: 8px;
  }

  ${props =>
    props.isErrored &&
    css`
      border-color: #860209;
    `}

  ${props =>
    props.isFocused &&
    css`
      color: #fff;
      border-color: #fff;
    `}

  ${props =>
    props.isFilled &&
    css`
      color: #fff;
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
`;

export const Error = styled(ToolTip)`
  height: 20px;
  margin-left: 16px;

  svg {
    margin: 0;
  }

  span {
    background: #860209;
    color: #d5d5d5;

    &::before {
      border-color: #860209 transparent;
    }
  }
`;
