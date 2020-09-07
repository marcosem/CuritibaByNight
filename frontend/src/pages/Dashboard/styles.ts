import styled, { css } from 'styled-components';

interface ICharacterProps {
  isMobile: boolean;
}

export const Container = styled.div`
  height: 100vh;
`;

export const Content = styled.main<ICharacterProps>`
  max-width: 1120px;
  margin: 18px auto;

  > div {
    margin: 0 0 10px 20px;
    > strong {
      color: #eee;
    }
  }

  ${props =>
    props.isMobile &&
    css`
      max-width: 340px;
    `}
`;

export const Character = styled.div<ICharacterProps>`
  max-width: 1120px;
  background: transparent;
  display: flex;
  flex-direction: row;

  ${props =>
    props.isMobile &&
    css`
      max-width: 340px;
      flex-direction: column;
      align-items: center;
    `}
`;
