import styled from 'styled-components';

export const Container = styled.div`
  background: #100909;
  border-radius: 10px;
  border: 2px solid #100909;
  padding: 16px;
  width: 100%;
  color: #756b6b;
  display: flex;
  align-items: center;

  & + div {
    margin-top: 8px;
  }

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
