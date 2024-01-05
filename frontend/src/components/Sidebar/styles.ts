import styled from 'styled-components';

interface IButtonProps {
  isMobile?: boolean;
}

export const SidebarButton = styled.button<IButtonProps>`
  background: transparent;
  border: 0;
  padding: 0;

  position: relative;
  display: flex;
  gap: 16px;
  align-items: center;
  width: 100%;
  border-radius: 6px;
  font-family: inherit;
  font-size: ${props => (props.isMobile ? '12px' : '14px')};
  font-weight: 400;
  line-height: 1;
  padding: 0 16px;
  color: var(--cbn-new-neutral-1); // #eee

  &:is(.active, :hover) {
    background: var(--cbn-new-red-1); // #870202
  }

  &.active {
    svg {
      &:not(:nth-child(1)) {
        rotate: -180deg;
      }
    }
  }

  &:not(.active):hover {
    background: var(--cbn-new-red-2); // #4f0007
  }

  > span {
    transition: 0.3s;
    text-align: left;

    &:nth-child(2) {
      flex: 1 1 auto;
    }
  }

  svg {
    transition: 0.3s;
    color: var(--cbn-new-neutral-1); // #eee
    height: ${props => (props.isMobile ? '18px' : '20px')};
    width: ${props => (props.isMobile ? '18px' : '20px')};
  }
`;

export const SidebarWrapper = styled.aside`
  position: absolute;
  top: 0;
  left: 0;

  display: flex;
  flex-direction: column;
  width: 260px;
  height: 100%;
  padding: 0 16px;
  background: transparent;
  transition: 0.4s;

  button {
    height: 39px;
  }

  > div {
    padding: 4px;

    &:not(:nth-child(1)) {
      background: var(--cbn-new-dark-3); // #474747
      border-right: 1px solid var(--cbn-new-dark-1); // #0a0a0a
    }

    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.8);
  }
`;

export const SidebarHeader = styled.header`
  display: flex;
  align-items: center;
  height: 72px;
  padding: 0 1.25rem 0 0;

  > button {
    width: 54px;
    height: 39px;
  }
`;

export const SidebarSubNav = styled.div`
  overflow: hidden;
  height: 0;
  transition: 0.5s;

  button {
    padding-left: 54px;

    &:before {
      content: '•';
      position: absolute;
      left: 25px;
    }
  }

  > div {
    padding: 4px;
  }
`;
