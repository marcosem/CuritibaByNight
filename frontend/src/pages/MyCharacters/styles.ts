import styled, { css } from 'styled-components';

interface IContainerProps {
  isMobile: boolean;
}

export const Container = styled.div<IContainerProps>`
  ${props =>
    props.isMobile
      ? css`
          height: calc(100vh - 110px);
        `
      : css`
          height: calc(100vh - 140px);
        `}
`;

export const Content = styled.main<IContainerProps>`
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
  height: 38px;
  position: relative;

  display: flex;
  flex-direction: space-between;
  padding: 10px;

  margin: 5px auto 5px auto;

  border-radius: 10px;
  background: rgba(0, 0, 0, 0.2);
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);

  > strong {
    color: #eee;
    text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
    font-size: 14px;
    font-weight: 500;
    margin: auto 0;
  }
`;

export const SelectionContainer = styled.div`
  display: flex;
  flex-direction: space-between;
  margin-left: auto;

  align-items: center;
  justify-content: center;

  span {
    color: #eee !important;
    text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5) !important;
    font-size: 14px !important;
    font-weight: 500px !important;
  }
`;

export const Select = styled.select`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: none;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

  width: 250px;
  margin-left: auto;

  background: #111;
  border-radius: 4px;
  border: 0;
  padding: 0 8px;
  font-size: 14px;
  font-weight: 500px;
  color: #888;

  text-align: left;
  text-align-last: center;
  -moz-text-align-last: center;
`;
