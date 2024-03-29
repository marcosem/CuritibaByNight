import styled from 'styled-components';
import { shade } from 'polished';

interface IButtonProps {
  readonly type: 'button' | 'submit' | 'reset' | undefined;
}

export const Container = styled.div`
  height: 100vh;
  align-items: stretch;
  flex-direction: column;

  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */

  > header {
    height: 144px;
    background: #989797;

    display: flex;
    align-items: center;

    div {
      width: 100%;
      max-width: 1120px;
      margin: 0 auto;

      display: flex;
      flex-direction: row;
      align-items: center;
    }

    button {
      border: none;
      background: transparent;
    }

    svg {
      color: #860209;
      width: 24px;
      height: 24px;

      &:hover {
        color: ${shade(0.2, '#860209')};
      }
    }

    h1 {
      font-size: 30px;
      padding-left: 20px;
      color: #860209;
      margin: auto 0 auto auto;
    }
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: -125px auto 0;

  width: 100%;

  form {
    margin: 30px 0;
    width: 340px;
    text-align: center;
    display: flex;
    flex-direction: column;

    h1 {
      margin-bottom: 24px;
      font-size: 20px;
      text-align: left;
    }

    div {
      display: flex;
      flex-direction: row;

      label {
        padding: 10px 0;

        span {
          color: #eee;
          font-size: 14px;
          font-weight: 500;
          margin: auto 0;
        }
      }
    }
  }

  button {
    margin-top: 24px;
  }

  > a {
    color: #d5d5d5;
    font-weight: 500;
    display: block;
    margin-top: 16px;
    text-decoration: none;
    display: flex;
    align-items: center;

    transition: color 0.2s;

    &:hover {
      color: ${shade(0.2, '#d5d5d5')};
    }

    svg {
      margin-right: 16px;
    }
  }
`;

export const Avatar = styled.div`
  position: relative;
  align-self: center;
  margin-bottom: 32px;

  > img {
    width: 186px;
    height: 186px;
    border-radius: 50%;
    border: 3px solid #860209;
    background: #888;
  }

  label {
    cursor: pointer;
    position: absolute;
    width: 48px;
    height: 48px;
    background: #860209;
    border-radius: 50%;
    right: 0;
    bottom: 0;
    border: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    transition: background-color 0.2s;

    input {
      display: none;
    }

    svg {
      width: 20px;
      height: 20px;
      color: #ccc;
    }

    &:hover {
      background: ${shade(0.2, '#860209')};
    }
  }
`;

export const RemoveButton = styled.button.attrs<IButtonProps>(() => ({
  type: 'button',
}))`
  position: fixed;
  bottom: 40px;
  right: 40px;

  width: 64px;
  height: 64px;
  border: 0;

  background: #860209;
  border-radius: 20px;

  display: flex;
  justify-content: center;
  align-items: center;

  transition: background-color 0.2s;

  &:hover {
    background: ${shade(0.2, '#860209')};
  }

  svg {
    width: 32px;
    height: 32px;
    color: #ccc;
  }
`;
