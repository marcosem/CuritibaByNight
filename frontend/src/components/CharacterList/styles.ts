import styled, { css } from 'styled-components';
import PerfectScrollBar from 'react-perfect-scrollbar';

interface ICharacterProps {
  isMobile: boolean;
}

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
  max-height: 74vh;
  padding: 0 20px;
  margin-top: 5px;
`;
