import styled, { css } from 'styled-components';

interface IAvatarProps {
  storyteller: boolean;
}

interface ITooltipProps {
  visible: boolean;
}

export const Container = styled.div`
  background-color: transparent;
  width: auto;
  height: auto;
  display: flex;
  z-index: 1003;
  // position: relative;

  > a {
    cursor: pointer;
    flex: 0 0 57px;
    padding: 11px;
    text-decoration: none;
  }
`;

export const AvatarImg = styled.img<IAvatarProps>`
  vertical-align: middle;
  width: 35px;
  height: 35px;
  border-radius: 50%;

  ${props =>
    props.storyteller
      ? css`
          border: 2px solid var(--cbn-storyteller-border);
        `
      : css`
          border: 2px solid var(--cbn-player-border);
        `}
`;

export const Tooltip = styled.div<ITooltipProps>`
  position: absolute;
  top: 48px;
  right: 13px;
  z-index: 1;

  filter: drop-shadow(1px 0px 0px var(--cbn-neutral-3))
    drop-shadow(0px 1px 0px var(--cbn-neutral-3))
    drop-shadow(-1px 0px 0px var(--cbn-neutral-3))
    drop-shadow(0px -1px 0px var(--cbn-neutral-3));

  transition: opacity 0.15s;

  ${props =>
    props.visible
      ? css`
          opacity: 1;
          pointer-events: all;
          visibility: visible;
        `
      : css`
          opacity: 0;
          pointer-events: none;
          visibility: hidden;
        `}
`;

export const TooltipWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 0 0 4px 4px;

  -webkit-clip-path: polygon(
    calc(100% - 16px) 12px,
    100% 12px,
    100% 100%,
    0 100%,
    0 12px,
    calc(100% - 40px) 12px,
    calc(100% - 28px) 0
  );

  clip-path: polygon(
    calc(100% - 16px) 12px,
    100% 12px,
    100% 100%,
    0 100%,
    0 12px,
    calc(100% - 40px) 12px,
    calc(100% - 28px) 0
  );

  padding: 32px 24px 16px;
  background: var(--background-white);
`;

export const TooltipAvatar = styled.img<IAvatarProps>`
  display: block;
  flex: 0 0 48px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 12px;

  ${props =>
    props.storyteller
      ? css`
          border: 2px solid var(--cbn-storyteller-border);
        `
      : css`
          border: 2px solid var(--cbn-player-border);
        `}
`;

export const TooltipData = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TooltipDataTitle = styled.strong`
  font-size: 14px;
  line-height: 1.25;
  font-weight: 500;
  margin-bottom: 2px;
  color: var(--cbn-red-1);
`;

export const TooltipDataEmail = styled.span`
  font-size: 12px;
  line-height: 1.28571;
  font-weight: 400;
  color: var(--cbn-neutral-4);
`;

export const TooltipDataStoryteller = styled.span`
  font-size: 12px;
  line-height: 1.28571;
  font-weight: 500;
  color: var(--cbn-neutral-4);
`;
