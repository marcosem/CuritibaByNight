import styled, { css, keyframes } from 'styled-components';
import { lighten, darken } from 'polished';

interface ITraitProps {
  traitColor?: string;
  isMobile: boolean;
}

interface ISingleTraitProps {
  traitColor?: string;
  isMobile: boolean;
  maxTraits: number;
}

interface ITypeContainer {
  borderTop?: boolean;
  borderLeft?: boolean;
  isMobile: boolean;
  statusContainer?: boolean;
}

interface ITraitContainer {
  alignment?: string;
  isMobile: boolean;
}

const divFadeIn = keyframes`
  from {
    opacity: 0;
    height: 0;
  }
  to {
    opacity: 1;
    height: 100%;
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  padding: 15px;
  width: 100%;
  height: 100%;
  display: flex;
  background: #fff;
  color: #000;
  border: 1px solid #000;
  border-radius: 4px;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);

  animation: ${divFadeIn} 0.6s ease-in 1;
`;

export const TypeContainer = styled.div<ITypeContainer>`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: transparent;
  padding: 0 0 15px 0;

  ${props =>
    props.borderTop &&
    css`
      border-top: 1px solid #000;
      padding-top: 5px;
    `}

  ${props =>
    props.borderLeft &&
    css`
      border-left: 1px solid #000;
      padding-left: 5px;
      min-width: 50%;
    `}

  h1 {
    text-align: center;
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

  h2 {
    text-align: center;
    padding: 5px 0 5px 0;

    ${props =>
      props.isMobile
        ? css`
            font-size: 0.75rem;
          `
        : css`
            font-size: 0.875rem;
          `}
  }

  ${props =>
    props.statusContainer &&
    css`
      position: relative;

      svg {
        padding-left: 5px;
        width: 20px;
        height: 20px;
        color: #000;
        visibility: hidden;

        top: 50%;
        right: 5px;

        position: absolute;
      }

      &:hover {
        cursor: pointer;
        svg {
          visibility: visible;
        }
      }
    `}
`;

export const DoubleTypeContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

export const TraitsRow = styled.div`
  display: flex;
  padding: 2px 0 5px 2px;
  justify-content: center;
`;

export const TraitContainer = styled.div<ITraitContainer>`
  display: flex;
  flex-direction: row;

  ${props =>
    props.alignment === 'right' &&
    css`
      width: 100%;
      margin-right: auto;
    `}

  ${props =>
    props.alignment === 'left' &&
    css`
      width: 100%;
      margin-left: auto;
    `}

    ${props =>
    props.alignment === 'center' &&
    css`
      width: auto;
    `}

  strong {
    margin-right: 5px;
  }

  span {
    margin-right: 5px;
  }

  ${props =>
    props.isMobile
      ? css`
          strong {
            font-size: 10px;
          }

          span {
            font-size: 10px;
          }
        `
      : css`
          strong {
            font-size: 12px;
          }

          span {
            font-size: 12px;
          }
        `}
`;

export const VirtuesContainer = styled.div`
  display: flex;
`;

export const SingleTraitContainer = styled.div<ITraitContainer>`
  display: flex;
  flex-direction: row;
  padding: 1px 0;
  min-height: 18px;

  strong {
    margin-right: 5px;
    /*
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    */
  }

  span {
    margin-right: 5px;
  }

  ${props =>
    props.isMobile
      ? css`
          strong {
            font-size: 10px;
          }

          span {
            font-size: 10px;
          }
        `
      : css`
          strong {
            font-size: 12px;
          }

          span {
            font-size: 12px;
          }
        `}
`;

export const AttributeContainer = styled.div<ITraitContainer>`
  display: flex;
  flex-direction: column;

  ${props =>
    props.alignment === 'right' &&
    css`
      width: 100%;
      align-items: flex-end;
    `}

  ${props =>
    props.alignment === 'left' &&
    css`
      width: 100%;
    `}

    ${props =>
    props.alignment === 'center' &&
    css`
      align-items: center;
    `}

  div {
    display: flex;
    flex-direction: row !important;
    padding-bottom: 3px !important;

    strong {
      margin-right: 5px;
    }

    ${props =>
      props.isMobile
        ? css`
            strong {
              font-size: 10px;
            }

            span {
              font-size: 10px;
            }
          `
        : css`
            strong {
              font-size: 12px;
            }

            span {
              font-size: 12px;
            }
          `}
  }
`;

export const TraitsListRow = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TraitsList = styled.div`
  display: flex;
  flex-direction: row;
`;

export const SingleTraitsList = styled.div<ISingleTraitProps>`
  display: flex;
  flex-direction: row;

  ${props =>
    props.isMobile
      ? css`
          width: calc(calc(14px * ${props.maxTraits}) + 4px);
          min-width: calc(calc(14px * ${props.maxTraits}) + 4px);
        `
      : css`
          width: calc(calc(16px * ${props.maxTraits}) + 4px);
          min-width: calc(calc(16px * ${props.maxTraits}) + 4px);
        `}
`;

export const TraitButton = styled.button<ITraitProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #000 !important;
  border-radius: 50%;

  margin: 0 !important;
  transition: background-color 0.3s;
  transition: transform 0.2s;

  ${props =>
    props.isMobile
      ? css`
          width: 14px !important;
          height: 14px !important;
        `
      : css`
          width: 16px !important;
          height: 16px !important;
        `}

  svg {
    padding: 0 !important;
    transition: color 0.3s;
    transition: transform 0.2s;

    ${props =>
      props.isMobile
        ? css`
            width: 10px !important;
            height: 10px !important;
          `
        : css`
            width: 12px !important;
            height: 12px !important;
          `}

    ${props =>
      props.traitColor === 'red'
        ? css`
            color: #560209 !important;
          `
        : css`
            color: #000 !important;
          `}
  }

  &:hover {
    ${props =>
      props.disabled
        ? css`
            cursor: default !important;
          `
        : css`
            transform: scale(1.4);
            background-color: ${darken(0.3, '#fff')} !important;
            svg {
              ${props.traitColor === 'red'
                ? css`
                    color: ${lighten(0.3, '#560209')} !important;
                  `
                : css`
                    color: ${lighten(0.3, '#000')} !important;
                  `}
            }
          `}
  }
`;
