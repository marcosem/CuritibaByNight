import styled from 'styled-components';

export const SidebarButton = styled.button`
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
  font-size: 16px;
  font-weight: 400;
  line-height: 1;
  padding: 0 16px;
  color: #fff;
  transition: 0.3s;

  &:is(.active, :hover) {
    background: #004fee;
    color: #elecff;
  }

  &.active {
    svg {
      &:not(:nth-child(1)) {
        rotate: -180deg;
      }
    }
  }

  &:not(.active):hover {
    background: #2e303e;
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
    color: #fff;
    height: 20px;
    width: 20px;
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
      background: #888;
      border-right: 1px solid #2e303e;
    }
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

export const SidebarLogo = styled.div`
  height: 20px;
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
    transition: 0.5s;
  }
`;
