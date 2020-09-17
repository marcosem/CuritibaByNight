import styled, { css } from 'styled-components';
import PerfectScrollBar from 'react-perfect-scrollbar';

interface ICharacterProps {
  isMobile: boolean;
}

export const Container = styled.div`
  height: 100vh;
`;

export const Content = styled.main<ICharacterProps>`
  min-width: 340px;
  max-width: 1012px;
  margin: 18px auto;

  ${props =>
    props.isMobile &&
    css`
      max-width: 340px;
    `}
`;

export const TitleBox = styled.div`
  padding: 20px;
  margin: 10px auto;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.2);
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);

  > strong {
    color: #eee;
    text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
  }
`;

export const Character = styled.div<ICharacterProps>`
  min-width: 340px;
  max-width: 1012px;
  background: transparent;
  display: flex;
  flex-direction: row;

  ${props =>
    props.isMobile &&
    css`
      max-width: 340px;
      align-items: center;
    `}

  table {
    width: 100%;
    min-width: 340px;
    max-width: 1012px;
    white-space: nowrap;
    border-collapse: separate;
    border-spacing: 32px;
  }
`;

export const Scroll = styled(PerfectScrollBar)`
  max-height: 600px;
  padding: 5px 20px;
  margin-top: 5px;
`;
