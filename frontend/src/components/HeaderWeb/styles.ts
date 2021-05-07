import styled, { css } from 'styled-components';
import { lighten, shade } from 'polished';
import bgImg from '../../assets/header_bg.png';
import navBgImg from '../../assets/nav_bg.png';

interface IProfileProps {
  isST: boolean;
}

interface IConnectionProps {
  isConnected: boolean;
}

export const Container = styled.header`
  position: sticky;
  top: 0;
  background: url(${bgImg}) repeat-x;
  height: 126px;

  z-index: 1000;

  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
`;

export const HeaderContent = styled.div`
  min-width: 340px;
  max-width: 1012px;
  margin: 0 auto;
  display: flex;

  > a {
    float: left;
    img {
      height: 80px;
    }
  }

  button {
    margin-right: 0;
    background: transparent;
    border: 0;

    svg {
      color: #cc030e;
      width: 32px;
      height: 32px;

      transition: color 0.3s;

      &:hover {
        color: ${lighten(0.14, '#cc030e')};
      }
    }
  }
`;

export const Profile = styled.div<IProfileProps>`
  display: flex;
  align-items: center;
  margin: auto 32px auto auto;
  padding: 3px 5px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0);
  position: relative;

  a {
    display: flex;
    flex-direction: row;
    text-decoration: none;
  }

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin: auto;
    border: 3px solid #cc030e;
    background: #888;

    transition: border-color 0.3s;

    ${props =>
      props.isST &&
      css`
        border: 3px solid #ffd700;
      `}
  }

  div {
    display: flex;
    flex-direction: column;
    line-height: 24px;
    margin-right: 16px;

    span {
      color: #fff;
    }

    strong {
      color: #cc030e;
      transition: color 0.3s;
    }
  }

  transition: border-color 0.3s, box-shadow 0.3s;

  &:hover {
    border: 1px #888 solid;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

    strong {
      color: ${lighten(0.14, '#cc030e')};
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }

    img {
      border-color: ${lighten(0.14, '#cc030e')};

      ${props =>
        props.isST &&
        css`
          border-color: ${shade(0.2, '#ffd700')};
        `}
    }
  }
`;

export const ConnectionStatus = styled.div<IConnectionProps>`
  display: flex;
  width: 8px;
  height: 8px;
  margin: 0 !important;
  padding: 0;
  border-radius: 50%;
  position: absolute;
  right: 6px;
  bottom: 6px;

  ${props =>
    props.isConnected
      ? css`
          background: #049c10;
        `
      : css`
          background: #860209;
        `}
`;

export const MyPages = styled.div`
  margin: auto;
  background: transparent;
  border: 0;
  display: flex;
  flex-direction: row;

  a {
    text-decoration: none;
    display: flex;
    flex-direction: column;

    span {
      margin: 3px auto auto auto;
      font-size: 10px;
      color: #999;
    }

    svg {
      width: 32px;
      height: 32px;
      margin: 0 16px;
      color: #999;

      transition: color 0.3s;
    }

    &:hover {
      span {
        color: ${lighten(0.3, '#999')};
      }

      svg {
        color: ${lighten(0.3, '#999')};
      }
    }
  }
`;

export const ToolTip = styled.span`
  visibility: hidden;
  width: 120px;
  height: 30px;
  top: 112%;
  left: 50%;
  margin-left: -60px;
  font-size: 12px;
  font-weight: 400;

  background-color: #000;
  color: #fff;
  border-radius: 6px;
  text-align: center;
  padding: 8px 0;

  opacity: 0;
  position: absolute;
  z-index: 1;

  transition: opacity 0.5s;
`;

export const Navigation = styled.div`
  background: url(${navBgImg}) repeat-x;
  height: 39px;
  padding-bottom: 25px;

  border-top: 1px #888 solid;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

  table {
    border: none;
    tbody {
      border: none;
      display: flex;
      flex-direction: row;

      td {
        padding: 2px 5px;
        width: 120px;
        position: relative;
        display: flex;
        border-radius: 10px;

        a {
          color: #999;
          text-decoration: none;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;

          transition: background-color 0.3s;

          svg {
            margin-top: 3px;

            color: #999;
            height: 24px;
            width: 24px;

            transition: color 0.3s;
          }

          &:hover {
            color: ${lighten(0.5, '#999')};
            svg {
              color: ${lighten(0.5, '#999')};
            }
          }
        }

        &:hover {
          background-color: #333;

          ${ToolTip} {
            visibility: visible;
            opacity: 0.8;
          }
        }
      }
    }
  }
`;

export const NavSpan = styled.span`
  cursor: default;
  display: flex;
  justify-content: center;
  width: 100%;
  border-bottom: 2px #fff solid;

  svg {
    margin-top: 3px;
    color: #fff;
    height: 24px;
    width: 24px;
  }
`;
