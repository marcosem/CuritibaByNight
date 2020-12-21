import styled, { css } from 'styled-components';

interface ICharacterProps {
  isMobile: boolean;
}

export const Container = styled.div`
  height: 100vh;
`;

export const Content = styled.main<ICharacterProps>`
  min-width: 340px;
  max-width: 1012px;
  margin: 0 auto;

  ${props =>
    props.isMobile &&
    css`
      max-width: 340px;
    `}
`;

export const TitleBox = styled.div`
  min-width: 340px;
  max-width: 1012px;
  position: relative;

  padding: 10px;
  margin: 5px auto 10px auto;

  border-radius: 10px;
  background: rgba(0, 0, 0, 0.2);
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);

  > strong {
    font-size: 14px;
    font-weight: 500px;
    margin: auto 0;

    color: #eee;
    text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
  }
`;
