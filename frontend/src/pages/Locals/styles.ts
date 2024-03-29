import styled, { css } from 'styled-components';
import { shade } from 'polished';

interface IContainerProps {
  isMobile: boolean;
}

interface ILocalsProps {
  isMobile: boolean;
  isSt?: boolean;
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

export const Content = styled.main<ILocalsProps>`
  min-width: 340px;
  max-width: 1012px;
  margin: 5px auto;
  position: relative;
  height: 74vh;

  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */

  ${props =>
    props.isMobile &&
    css`
      max-width: 340px;
    `}

  div {
    z-index: 5;
  }
`;

export const FunctionsContainer = styled.div<ILocalsProps>`
  position: absolute;
  right: 20px;
  bottom: 20px;
  width: 64px;
  ${props =>
    props.isMobile
      ? css`
          height: 136px;
        `
      : css`
          height: 304px;
        `}

  display: flex;
  flex-direction: column;

  z-index: 10;

  a {
    width: 64px;
    height: 64px;

    background: #860209;
    border-radius: 20px;

    display: flex;
    justify-content: center;
    align-items: center;

    transition: background-color 0.2s;

    &:hover {
      background: ${shade(0.2, '#860209')};
    }

    &:not(:first-child) {
      ${props =>
        props.isMobile
          ? css`
              margin-top: 8px;
            `
          : css`
              margin-top: 16px;
            `}
    }

    svg {
      width: 32px;
      height: 32px;
      color: #ccc;
    }
  }
`;

export const CheckboxContainer = styled.div`
  position: absolute;
  right: 20px;
  top: 20px;
  width: 200px;
  height: 40px;
  background: #000;
  padding: 5px 10px;
  border-radius: 4px;
  opacity: 0.5;

  display: flex;
  flex-direction: row;
  align-items: center !important;

  div {
    display: flex !important;
  }

  span {
    color: #fff !important;
    font-weight: 400 !important;
  }
`;

export const LocationLegend = styled.div`
  position: absolute;
  left: 20px;
  bottom: 20px;
  display: flex;
  flex-direction: column;

  width: 140px;
  height: 230px;
  background: #000;
  opacity: 0.5;
  border-radius: 4px;

  strong {
    font-size: 16px;
    font-style: normal;
    font-weight: 550;
    margin: 5px auto;
    color: #f00;
  }

  span {
    display: flex;
    flex-direction: row;

    font-size: 12px;
    font-style: normal;
    font-weight: 300;
    text-decoration: none;
    color: #fff;
    margin: 1px 0 1px 5px;
    margin-left: 5px;
    // padding: 5px;

    svg {
      width: 16px;
      height: 16px;
      color: #fff;
      margin-right: 5px;
    }
  }
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

  text-align: left;
  text-align-last: center;
  -moz-text-align-last: center;
`;

export const LocationContainer = styled.div`
  padding: 0 !important;
  margin: 0 !important;
  width: auto !important;
  height: auto !important;
  cursor: pointer !important;
`;
