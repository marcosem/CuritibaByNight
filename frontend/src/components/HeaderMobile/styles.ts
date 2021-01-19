import styled, { css } from 'styled-components';
import { lighten, shade } from 'polished';
import bgImg from '../../assets/header_bg.png';
import navBgImg from '../../assets/nav_bg.png';

interface ProfileProps {
  isST: boolean;
}

export const Container = styled.header`
  position: relative;
  background: url(${bgImg}) repeat-x;
  height: 99px;

  z-index: 1000;
`;

export const HeaderContent = styled.div`
  min-width: 340px;
  max-width: 1012px;
  margin: 0 auto;
  display: flex;

  > a {
    float: left;
    img {
      height: 60px;
    }
  }

  button {
    margin-right: 25px;
    background: transparent;
    border: 0;

    svg {
      color: #cc030e;
      width: 28px;
      height: 28px;

      transition: color 0.3s;

      &:hover {
        color: ${lighten(0.14, '#cc030e')};
      }
    }
  }
`;

export const Profile = styled.div<ProfileProps>`
  display: flex;
  align-items: center;
  margin: auto 8px auto auto;
  padding: 3px 5px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0);

  a {
    display: flex;
    flex-direction: column;
    text-decoration: none;
  }

  img {
    width: 32px;
    height: 32px;
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
    line-height: 24px;
    margin: auto;

    strong {
      font-size: 12px;
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
      font-size: 9px;
      color: #999;
    }

    svg {
      width: 26px;
      height: 26px;
      margin: 0 10px;
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

export const Navigation = styled.div`
  background: url(${navBgImg}) repeat-x;
  height: 39px;
  padding: 8px 0 0 25px;

  font-size: 12px;
  border-top: 1px #888 solid;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

  table {
    tbody {
      display: flex;
      flex-direction: row;

      td {
        padding-right: 10px;

        a {
          color: #999;
          text-decoration: none;
          display: flex;
          flex-direction: row;

          transition: color 0.3s;

          svg {
            color: #999;
            height: 16px;
            width: 16px;
            margin: auto 7px auto 0;

            transition: color 0.3s;
          }

          &:hover {
            color: ${lighten(0.3, '#999')};
            svg {
              color: ${lighten(0.3, '#999')};
            }
          }
        }
      }
    }
  }
`;

export const NavSpan = styled.span`
  cursor: default;
  color: #fff;
  display: flex;
  flex-direction: row;

  svg {
    color: #fff;
    height: 16px;
    width: 16px;
    margin: auto 7px auto 0;
  }
`;
