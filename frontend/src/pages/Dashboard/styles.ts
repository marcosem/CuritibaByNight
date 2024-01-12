import styled, { css } from 'styled-components';

interface IContainerProps {
  isMobile: boolean;
}

export const Container = styled.div<IContainerProps>`
  ${props =>
    props.isMobile
      ? css`
          min-height: calc(100vh - 110px);
        `
      : css`
          min-height: calc(100vh - 140px);
        `}
`;
