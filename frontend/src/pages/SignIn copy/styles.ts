import styled from 'styled-components';
import { shade } from 'polished';
import signInBackgrundImg from '../../assets/sign-in-background.png';

export const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: stretch;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  justify-content: center;
  align-items: center;

  width: 100%;
  max-width: 700px;

  form {
    margin: 80px 0;
    width: 340px;
    text-align: center;

    h1 {
      margin-bottom: 24px;
    }

    a {
      color: #fff;
      display: block;
      margin-top: 16px;
      text-decoration: none;
      transition: color 0.2s;

      &:hover {
        color: ${shade(0.2, '#fff')};
      }
    }
  }

  button {
    margin-top: 24px;
  }

  > a {
    color: #860209;
    font-weight: 500;
    display: block;
    margin-top: 16px;
    text-decoration: none;
    display: flex;
    align-items: center;

    transition: color 0.2s;

    &:hover {
      color: ${shade(0.2, '#860209')};
    }

    svg {
      margin-right: 16px;
    }
  }
`;
// place-content: center;

export const Background = styled.div`
  flex: 1;
  background: url(${signInBackgrundImg}) no-repeat center;
  background-size: cover;
`;

/**
 *
    button {
      background: #860209;
      color: #d5d5d5;
      font-weight: 500;
      height: 56px;
      border-radius: 10px;
      border: 0;
      padding: 0 16px;
      width: 100%;
      margin-top: 16px;
      transition: background-color 0.2s;

      &:hover {
        background: ${shade(0.2, '#860209')};
      }
    }
 */
