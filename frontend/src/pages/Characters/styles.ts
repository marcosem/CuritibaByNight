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
  margin: 18px auto;

  ${props =>
    props.isMobile &&
    css`
      max-width: 340px;
    `}
`;

export const TitleBox = styled.div`
  display: flex;
  flex-direction: space-between;
  padding: 20px;
  margin: 10px auto 0 auto;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.2);
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);

  > strong {
    color: #eee;
    text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
  }
`;

export const Select = styled.select`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: none;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

  width: 190px;
  margin-left: auto;

  background: #111;
  border-radius: 4px;
  border: 0;
  padding: 4px 8px;
  font-size: 14px;
  font-weight: 500px;
  color: #888;
`;
