import styled, { css } from 'styled-components';
import { lighten } from 'polished';

interface IMenuProps {
  isMobile: boolean;
}

export const Container = styled.div<IMenuProps>`
  display: block;
  border-radius: 10px;
  width: 35px;
  height: 35px;
  margin: 0 16px;

  > svg {
    width: 32px;
    height: 32px;
    margin: 0;
    color: #2c2f33;

    transition: color 0.2s;

    &:hover {
      color: ${lighten(0.1, '#2c2c2c')};
      cursor: pointer;
    }
  }

  > div {
    position: relative;
    top: -8px;
    width: 0;
    height: 0;
    opacity: 0;

    ${props =>
      props.isMobile &&
      css`
        top: -4px;
        left: 16px;
      `}
  }

  &:hover {
    > div {
      width: 153px;
      height: 111px;
      display: fixed;
      opacity: 0.8;
    }
  }
`;

export const MenuList = styled.div`
  overflow: hidden;
  border-radius: 10px;
  background-color: #0d0d0d;
  transition: width 0.3s ease, height 0.3s ease;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);

  &::after {
    transition: all 0.3s ease;
    left: 50%;
    top: 10px;
    transform: translateY(-5px) translateX(-50%);
  }

  a {
    display: flex;
    flex-direction: row;
    position: relative;
    color: #ddd;
    text-decoration: none;
    overflow: hidden;
    padding: 5px;
    border-radius: 5px;
    margin: 3px 1px 3px 3px;

    transition: background-color 0.5s ease, color 0.2s;

    &:hover {
      text-decoration: inherit;
      color: #fff;
      background-color: #860209;

      svg {
        color: #fff;
      }
    }

    svg {
      margin: 0 16px 0 5px;
      width: 23px;
      height: 23px;
      color: #ddd;

      transition: color 0.2s;
    }

    ul {
      list-style-type: none;
      opacity: 1;
      height: 100%;
      margin-top: 30px;

      transition: all 1s ease;

      li {
        margin: 0;
        padding: 0;
        height: 25px;
        transition: height 1s ease;

        &:hover {
          border-bottom: 1px solid darken(#e9e5e5, 10);
        }
      }
    }
  }
`;
