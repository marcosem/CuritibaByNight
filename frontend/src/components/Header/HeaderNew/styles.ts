import styled from 'styled-components';
import { lighten } from 'polished';

export const Container = styled.header`
  position: sticky;
  top: 0;

  display: flex;
  align-items: center;
  justify-content: space-between;

  height: 56px;
  background: var(--background-white);
  z-index: 1005;

  @media only screen and (min-width: 1440px) {
    padding: 0 18px 0 32px;
  }

  @media only screen and (min-width: 778px) {
    padding: 0 16px;
  }

  @media only screen and (min-width: 360px) {
    padding: 0 12px;
  }

  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
`;

export const HeaderTitle = styled.div`
  display: flex;
  align-items: center;

  height: 100%;
  width: auto;

  @media only screen and (min-width: 1440px) {
    margin: 0 24px 0 0;
  }

  @media only screen and (min-width: 778px) {
    margin: 0 8px 0 0;
  }

  @media only screen and (min-width: 360px) {
    margin: 0 4px 0 0;
  }

  > a {
    display: flex;
    justify-content: center;
    align-items: center;

    float: left;
    text-decoration: none;

    img {
      width: 48px;
      height: 48px;

      transition: filter 0.3s;
    }

    span {
      margin-left: 4px;
      font-size: 18px;
      font-weight: 500;

      color: var(--cbn-red-1);
      transition: color 0.3s;
    }

    &:hover {
      img {
        filter: brightness(1.5);
      }

      span {
        color: ${lighten(0.2, '#860209')};
      }
    }
  }
`;

export const Division = styled.div`
  margin: auto 4px;
  height: 2rem;

  width: 0.125rem;
  background: var(--cbn-neutral-1);
`;
