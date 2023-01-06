import styled, { css } from 'styled-components';

interface ITypeContainer {
  isMobile: boolean;
  isFirst: boolean;
}

interface IPowerTitle {
  isMobile: boolean;
}

export const PowerContainer = styled.div<ITypeContainer>`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: transparent;

  ${props =>
    !props.isFirst &&
    css`
      &:not(:first-of-type) {
        border-top: 1px solid #888;
        margin-top: 10px;
      }
    `}

  h2 {
    text-align: center;
    padding: 5px 0;

    ${props =>
      props.isMobile
        ? css`
            font-size: 13px;
          `
        : css`
            font-size: 15px;
          `}
  }

  strong {
    text-align: left;
    padding: 5px 0 0 0;
    font-weight: 500;

    ${props =>
      props.isMobile
        ? css`
            font-size: 9px;
          `
        : css`
            font-size: 11px;
          `}
  }

  span {
    text-align: left;
    padding: 0 0 0 0;

    ${props =>
      props.isMobile
        ? css`
            font-size: 9px;
          `
        : css`
            font-size: 11px;
          `}
  }

  p {
    text-align: justify;
    padding: 5px 0 0 0;

    ${props =>
      props.isMobile
        ? css`
            font-size: 9px;
          `
        : css`
            font-size: 11px;
          `}
  }

  h3 {
    text-align: left;
    padding: 5px 0;
    font-style: italic;
    font-weight: 400;

    ${props =>
      props.isMobile
        ? css`
            font-size: 12px;
          `
        : css`
            font-size: 13px;
          `}
  }

  h4 {
    text-align: left;
    padding: 8px 0 0 0;
    font-weight: 500;

    ${props =>
      props.isMobile
        ? css`
            font-size: 11px;
          `
        : css`
            font-size: 12px;
          `}
  }
`;

export const PowerTitle = styled.div<IPowerTitle>`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: transparent;

  border-top: 1px solid #888;
  margin-top: 10px;

  h1 {
    text-align: center;
    margin-top: 10px;
    padding: 0 0 5px 0;

    ${props =>
      props.isMobile
        ? css`
            font-size: 14px;
          `
        : css`
            font-size: 16px;
          `}
  }
`;
