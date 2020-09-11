import styled, { css } from 'styled-components';
import { lighten, shade } from 'polished';

interface ProfileProps {
  isST: boolean;
}

export const Container = styled.header`
  padding: 10px 0;
  background: #989797;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

export const HeaderContent = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  align-items: center;

  > a {
    img {
      height: 80px;
    }
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

export const ButtonMenu = styled.div`
  overflow: hidden;
  display: block;
  border-radius: 10px;
  width: 35px;
  height: 35px;
  margin-right: auto;

  background-color: #860209;
  opacity: 0.8;
  transition: width 0.3s 0.5s ease, border-radius 1.1s ease;

  > svg {
    padding-top: 2px;
    padding-left: 3px;
    color: #ddd;
    width: 32px;
    height: 32px;
  }
`;

export const Profile = styled.div<ProfileProps>`
  display: flex;
  align-items: center;
  margin-left: 80px;

  img {
    width: 56px;
    height: 56px;
    border-radius: 50%;

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
    flex-direction: column;
    margin-left: 16px;
    line-height: 24px;
  }

  span {
    color: #000;
  }

  a {
    text-decoration: none;
    color: #860209;

    transition: color 0.3s;

    &:hover {
      color: ${lighten(0.14, '#860209')};
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
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
