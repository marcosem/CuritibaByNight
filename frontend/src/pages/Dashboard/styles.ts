import styled, { css } from 'styled-components';
import PerfectScrollBar from 'react-perfect-scrollbar';

interface ICharacterProps {
  isMobile: boolean;
}

export const Container = styled.div`
  height: 100vh;
`;

export const Content = styled.main<ICharacterProps>`
  max-width: 1120px;
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

export const Character = styled.ul<ICharacterProps>`
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

export const Scroll = styled(PerfectScrollBar)`
  max-height: 600px;
  padding: 5px 20px;
  margin-top: 5px;
`;
