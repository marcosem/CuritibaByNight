import styled, { css } from 'styled-components';
import { shade } from 'polished';

interface ICharacterProps {
  isMobile: boolean;
  isSt: boolean;
}

export const Container = styled.div`
  height: 100vh;
`;

export const Content = styled.main<ICharacterProps>`
  min-width: 340px;
  max-width: 1012px;
  margin: 5px auto;
  position: relative;
  height: 74vh;

  ${props =>
    props.isMobile &&
    css`
      max-width: 340px;
    `}

  div {
    z-index: 5;
  }

  ${props =>
    props.isSt &&
    css`
      > a {
        position: absolute;
        right: 40px;
        bottom: 40px;

        width: 64px;
        height: 64px;

        z-index: 10;

        background: #860209;
        border-radius: 20px;

        display: flex;
        justify-content: center;
        align-items: center;

        transition: background-color 0.2s;

        &:hover {
          background: ${shade(0.2, '#860209')};
        }

        svg {
          width: 32px;
          height: 32px;
          color: #ccc;
        }
      }
    `}
`;

export const MapToolTip = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 12px;
  text-align: left;

  img {
    width: 200px;
  }

  strong {
    text-align: center;
    font-weight: 550;
  }
`;

export const TitleBox = styled.div`
  min-width: 340px;
  max-width: 1012px;
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
    font-weight: 500px;
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
  padding: 4px 8px;
  font-size: 14px;
  font-weight: 500px;
  color: #888;
`;
