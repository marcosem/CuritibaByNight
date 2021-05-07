import styled, { css } from 'styled-components';
import bgImg from '../../assets/yellow-old-paper.jpg';

interface ContainerProps {
  isMobile: boolean;
}

export const Container = styled.div<ContainerProps>`
  ${props =>
    props.isMobile
      ? css`
          height: calc(100vh - 110px);
        `
      : css`
          height: calc(100vh - 140px);
        `}
`;

export const Content = styled.main`
  min-width: 340px;
  max-width: 1012px;
  margin: 0 auto;
  background: url(${bgImg}) repeat;
  display: flex;
  flex-direction: row;
  border-radius: 4px;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
`;

export const TitleBox = styled.div`
  min-width: 340px;
  max-width: 1012px;
  height: 38px;
  position: relative;

  display: flex;
  flex-direction: space-between;
  padding: 10px;

  margin: 5px auto 10px auto;

  border-radius: 10px;
  background: rgba(0, 0, 0, 0.2);
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);

  > strong {
    color: #eee;
    text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
    font-size: 14px;
    font-weight: 500;
    margin: auto;
  }
`;

export const LocationCardContainer = styled.div`
  padding: 16px;
`;

export const LocationFormContainer = styled.div`
  width: 100%;
  margin: 20px;

  display: flex;
  flex-direction: column;

  div {
    display: flex;
    width: 100%;
    margin-bottom: 5px;

    h1 {
      font-size: 24px;
      font-weight: 500;
      color: #333;
      margin-bottom: 16px;

      &:not(:first-child) {
        margin-left: auto;
      }
    }
  }

  form {
    margin-top: 10px;
    border-top: 2px solid #333;
    padding-top: 10px;
  }
`;

export const InputBox = styled.div`
  margin: 5px auto 24px;
  // max-width: 340px;

  div {
    max-width: 340px;

    &:first-child {
      margin: 0 5px 0 0;
    }

    &:not(:first-child) {
      margin: 0 0 0 5px;
    }
  }
`;

export const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  // justify-content: center;
  padding: 16px 0 0 0;

  max-width: 340px;
  width: 100%;

  strong {
    font-size: 16px !important;
    color: #333;
    font-weight: 500;
  }
`;

export const Select = styled.select`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: none;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

  height: 22px;
  width: 200px;

  background: #222;
  border-radius: 4px;
  border: 0;
  padding: 0 8px;
  font-size: 14px;
  font-weight: 500;
  color: #ccc;
  text-align: center;
  text-align-last: center;
  -moz-text-align-last: center;
`;

export const ButtonBox = styled.div`
  margin: 50px auto 0 auto;
  max-width: 340px;
`;
