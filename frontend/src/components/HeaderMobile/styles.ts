import styled, { css } from 'styled-components';
import { lighten, shade } from 'polished';

interface IProfileProps {
  isST: boolean;
}

export const Container = styled.header`
  padding: 5px 0;
  background: #989797;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
`;

export const HeaderContent = styled.div`
  max-width: 340px;
  margin: 0 auto;
  display: flex;
  align-items: center;

  > img {
    height: 64px;
  }

  button {
    margin-left: auto;
    background: transparent;
    border: 0;

    svg {
      color: #860209;
      width: 32px;
      height: 32px;

      transition: color 0.3s;

      &:hover {
        color: ${lighten(0.14, '#860209')};
      }
    }
  }
`;

export const Profile = styled.div<IProfileProps>`
  max-width: 340px;
  margin: 0 auto;
  display: flex;
  align-items: center;

  img {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    margin-left: auto;

    transition: border-color 0.3s;

    border: 3px solid #860209;

    &:hover {
      border-color: ${lighten(0.14, '#860209')};
    }

    ${props =>
      props.isST &&
      css`
        border: 3px solid #ffd700;

        &:hover {
          border-color: ${shade(0.2, '#ffd700')};
        }
      `}
  }

  div {
    display: flex;
    flex-direction: row;
    padding: auto;
    margin-right: auto;

    span {
      color: #000;
      margin: 0 10px;
    }

    a {
      text-decoration: none;
      color: #860209;

      transition: color 0.3s;

      &:hover {
        color: ${shade(0.2, '#860209')};
      }
    }
  }
`;

export const MyPages = styled.div`
  margin-left: auto;
  background: transparent;
  border: 0;
  display: flex;
  flex-direction: row;

  svg {
    width: 32px;
    height: 32px;
    margin: 0 16px;
    color: #2c2f33;

    &:hover {
      color: ${lighten(0.1, '#2c2c2c')};
    }
  }
`;
