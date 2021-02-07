import styled, { css } from 'styled-components';

interface IInfluenceProps {
  isMobile: boolean;
}

interface ICardProps {
  cardImg: string;
}

interface ICardTitle {
  textLength: number;
}

export const Container = styled.div<IInfluenceProps>`
  width: 248px;
  height: 350px;
  display: flex;
  background: #000;
  background: transparent;

  & + div {
    ${props =>
      props.isMobile
        ? css`
            margin-top: 20px;
          `
        : css`
            margin-left: 20px;
          `}
  }
`;

export const CardSquare = styled.div<ICardProps>`
  position: relative;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;
  border-radius: 10px;

  ${props => css`
    background: url(${props.cardImg});
  `}

  background-repeat: no-repeat;
  background-size: cover;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.8);
`;

export const CardTitle = styled.div<ICardTitle>`
  position: absolute;
  top: 4px;
  left: 10px;
  width: 200px;
  height: 23px;
  display: flex;

  background: transparent;

  span {
    ${props =>
      props.textLength > 22
        ? css`
            font-size: 12px;
          `
        : css`
            font-size: 16px;
          `}

    font-style: normal;
    font-weight: 550;
    text-decoration: none;
    max-width: 200px;

    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;

    color: #fff;
  }
`;

export const InfluenceImage = styled.div`
  position: absolute;
  top: 30px;
  left: 44px;

  width: 198px;
  height: 172px;

  background: #888;

  input {
    display: none;
  }

  img {
    object-fit: cover;
    object-position: 0 50%;

    width: 198px;
    height: 172px;
  }
`;

export const InfluenceInfo = styled.div`
  position: absolute;
  top: 223px;
  left: 47px;

  width: 193px;
  height: 117px;

  background: transparent;

  line-height: 90%;

  display: flex;
  flex-direction: column;
  line-height: normal;

  strong {
    font-size: 13px !important;
    font-weight: 550 !important;
    text-decoration: none !important;
    padding: 5px 5px 10px 5px !important;
    margin: 0 auto !important;

    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: pre-wrap !important;

    color: #000;
  }

  span {
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    text-decoration: none;
    padding: 0 5px 0 5px;
    margin: auto;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre-wrap;

    color: #000;
  }

  small {
    font-size: 11px;
    font-style: normal;
    font-weight: 500;
    text-decoration: none;
    padding: 0 5px 0 5px;
    margin: auto auto 0 auto;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre-wrap;

    color: #000;
  }
`;
