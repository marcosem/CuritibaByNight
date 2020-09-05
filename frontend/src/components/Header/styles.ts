import styled, { css } from 'styled-components';
import { lighten, shade } from 'polished';

interface ProfileProps {
  isST: boolean;
}

export const Container = styled.header`
  padding: 10px 0;
  background: #989797;
`;

export const HeaderContent = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  align-items: center;

  > img {
    height: 80px;
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

  strong {
    color: #860209;
  }
`;
