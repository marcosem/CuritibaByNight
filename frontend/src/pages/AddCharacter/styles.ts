import styled, { css } from 'styled-components';
import { lighten } from 'polished';
import bgImg from '../../assets/yellow-old-paper.jpg';

interface IContainerProps {
  isMobile: boolean;
}

export const Container = styled.div<IContainerProps>`
  ${props =>
    props.isMobile
      ? css`
          min-height: calc(100vh - 110px);
        `
      : css`
          min-height: calc(100vh - 140px);
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
    margin: auto 0;
  }

  > span {
    color: #eee;
    text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
    font-size: 14px;
    font-weight: 500;
    margin: auto 0 auto auto;
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
  font-weight: 500;
  color: #888;
`;

export const CharCardContainer = styled.div`
  padding: 16px;
`;

export const CharacterFormContainer = styled.div`
  width: 100%;
  margin: 20px;

  display: flex;
  flex-direction: column;

  form {
    margin-top: 10px;
    border-top: 2px solid #333;
    padding-top: 10px;
  }

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

    strong {
      font-size: 18px;
      font-weight: 500;
      color: #333;

      &:not(:first-child) {
        margin-left: auto;
      }
    }

    span {
      font-size: 18px;
      font-weight: 400;
      color: #333;
      margin-left: 10px;
    }
  }
`;

export const InputFileBox = styled.div`
  margin: 5px 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;

  strong {
    font-size: 16px !important;
    margin: 0 5px 0 10px !important;
  }

  span {
    font-size: 16px !important;
    margin-left: 0 !important;
  }

  label {
    max-width: 340px;
    position: relative;
    background: #100909;
    padding: 16px;
    font-size: 16px;
    color: #eee;

    border-radius: 10px;
    margin: 16px 0;
    border: 0;
    width: 100%;

    transition: background-color 0.2s;

    &:hover {
      background: ${lighten(0.05, '#100909')};
      cursor: pointer;
    }

    svg {
      height: 20px;
      width: 20px;
      margin: auto 16px auto auto;
    }

    input {
      display: none;
    }
  }
`;

export const SelectRegnant = styled.select`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: none;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

  width: 250px;
  height: 22px;

  border: 0;
  border-radius: 4px;
  padding: 0 8px;
  margin-left: 10px;

  color: #ccc;
  background: #222;
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  text-align-last: center;
  -moz-text-align-last: center;
`;

export const ButtonBox = styled.div`
  margin: 50px auto 0 auto;
  max-width: 340px;
`;
