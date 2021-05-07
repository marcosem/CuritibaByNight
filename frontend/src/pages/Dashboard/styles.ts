import styled, { css } from 'styled-components';

interface ContainerProps {
  isMobile: boolean;
}

export const Container = styled.div<ContainerProps>`
  ${props =>
    props.isMobile
      ? css`
          height: calc(100vh - 110px);
        `
      : css`
          height: calc(100vh - 140px);
        `}
`;
