import styled, { css, keyframes } from 'styled-components';
import { lighten, shade } from 'polished';
import bgImg from '../../../assets/header_bg.png';

const ringingBell = keyframes`
  0% {transform: rotate(35deg);}
  12.5% {transform: rotate(-30deg);}
  25% {transform: rotate(25deg);}
  37.5% {transform: rotate(-20deg);}
  50% {transform: rotate(15deg);}
  62.5% {transform: rotate(-10deg)}
  75% {transform: rotate(5deg)}
  100% {transform: rotate(0);}
`;

interface IProfileProps {
  isST: boolean;
}

interface IConnectionProps {
  isConnected: boolean;
}

interface INotificationButtonProps {
  hasNotification: boolean;
}

export const Container = styled.header`
  position: relative;
  background: url(${bgImg}) repeat-x;
  height: 99px;

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
      height: 60px;
    }
  }
`;

export const LogoutButton = styled.button`
  margin-right: 35px;
  background: transparent;
  width: 42px;
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
`;

export const NotificationButton = styled.button<INotificationButtonProps>`
  position: relative;
  background: transparent;
  border: 0;

  svg {
    color: #cc030e;
    width: 28px;
    height: 28px;

    transition: color 0.3s;

    ${props =>
      props.hasNotification &&
      css`
        animation: ${ringingBell} 1s ease-in-out 3;
      `}

    &:hover {
      color: ${lighten(1, '#cc030e')};
    }
  }
`;

export const NotificationCount = styled.div`
  position: absolute;
  bottom: 24px;
  left: 18px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #860209;

  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;

  > span {
    cursor: default;
    font-style: normal;
    font-weight: normal;
    font-size: 7px;
    line-height: 7px;
    color: #fff;
  }
`;

export const Profile = styled.div<IProfileProps>`
  display: flex;
  align-items: center;
  margin: auto 8px auto auto;
  padding: 3px 5px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0);
  position: relative;

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

export const ConnectionStatus = styled.div<IConnectionProps>`
  display: flex;
  width: 8px;
  height: 8px;
  margin: 0 !important;
  padding: 0;
  border-radius: 50%;
  position: absolute;
  right: 9px;
  bottom: 28px;

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
  position: relative;
  background: var(--cbn-new-dark-2); // #2e2e2e
  height: 39px;
  padding-bottom: 25px;
  padding-top: 3px;

  border-top: 1px var(--cbn-new-dark-3) solid; // #474747
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;
