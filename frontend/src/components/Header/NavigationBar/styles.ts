import styled, { keyframes, css } from 'styled-components';
// import { lighten } from 'polished';

const appear = keyframes`
  from {
    width: 0;
  }

  to {
    width: 100%;
  }
`;

interface INavWrapperProps {
  items: number;
}

interface INavOptionsProps {
  selected?: boolean;
}

export const Container = styled.div`
  height: 32px;
  width: 100%;
  margin-bottom: 4px;

  @media only screen and (min-width: 1440px) {
    padding: 0 18px 0 32px;
  }

  @media only screen and (min-width: 778px) {
    padding: 0 16px;
  }

  @media only screen and (min-width: 360px) {
    padding: 0 12px;
  }

  background: var(--background-white);
  border-top: 1px solid var(--cbn-neutral-3);
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

export const NavWrapper = styled.ul<INavWrapperProps>`
  display: grid;
  grid-template-columns: repeat(${props => props.items}, 110px);
  grid-template-rows: 32px;
`;

export const NavOption = styled.li<INavOptionsProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 4px;

  &:not(:first-child) {
    border-left: 1px solid var(--background-grey);
  }

  border-right: 1px solid var(--background-grey);

  transition: background-color 0.3s;

  > span,
  > a {
    font-size: 12px;
    color: var(--cbn-neutral-4);
    text-transform: uppercase;
    transition: color 0.3s;
  }

  > a {
    text-decoration: none;
    display: flex;
    justify-content: center;
    align-items: center;

    height: 100%;
    width: 100%;
  }

  ${props =>
    props.selected
      ? css`
          span {
            color: var(--cbn-red-1);
          }

          &:after {
            content: '';
            position: absolute;
            bottom: 0;

            border-bottom: 3px solid var(--cbn-red-1);
            width: 100%;
          }
        `
      : css`
          cursor: pointer;

          &:hover {
            background-color: var(--background-grey);

            > span,
            > a {
              color: var(--cbn-red-1);
            }

            &:after {
              content: '';
              position: absolute;
              bottom: 0;

              border-bottom: 3px solid var(--cbn-red-1);
              width: 100%;
              animation: ${appear} 0.2s linear;
            }
          }
        `}
`;
