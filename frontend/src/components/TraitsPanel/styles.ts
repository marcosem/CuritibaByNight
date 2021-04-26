import styled, { css } from 'styled-components';
import { lighten, darken } from 'polished';

interface ITraitColor {
  traitColor?: string;
}

interface ITypeContainer {
  borderTop?: boolean;
  borderLeft?: boolean;
}

interface ITraitContainer {
  alignment?: string;
}

export const Container = styled.div`
  display: flex;
  flex-direction: column !important;

  padding: 15px !important;
  width: 100%;
  height: 100%;
  display: flex;
  background: #fff;
  color: #000;
  border: 1px solid #000;
  border-radius: 4px;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
`;

export const TypeContainer = styled.div<ITypeContainer>`
  display: flex;
  flex-direction: column !important;
  width: 100%;
  background: transparent;
  padding: 0 0 15px 0 !important;

  ${props =>
    props.borderTop &&
    css`
      border-top: 1px solid #000;
      padding-top: 5px !important;
    `}

  ${props =>
    props.borderLeft &&
    css`
      border-left: 1px solid #000;
      padding-left: 5px !important;
    `}

  h1 {
    font-size: 16px !important;
    font-weight: 500;
    text-align: center;
    padding: 0 0 5px 0 !important;
    margin: 0 !important;
  }
`;

export const DoubleTypeContainer = styled.div`
  display: flex;
  flex-direction: row !important;
  width: 100%;
  background: transparent;
`;

export const TraitsRow = styled.div`
  display: flex;
  flex-direction: space-between !important;
  background: transparent;
  padding: 2px 0 5px 2px !important;
  width: 100% !important;

  justify-content: center;
  animation: auto !important;
`;

export const TraitContainer = styled.div<ITraitContainer>`
  display: flex;
  flex-direction: row !important;
  background: transparent;
  padding: 0 !important;
  animation: auto !important;

  ${props =>
    props.alignment === 'right' &&
    css`
      width: 100% !important;
      margin-right: auto !important;
    `}

  ${props =>
    props.alignment === 'left' &&
    css`
      width: 100% !important;
      margin-left: auto !important;
    `}

    ${props =>
    props.alignment === 'center' &&
    css`
      width: auto !important;
    `}

  strong {
    font-size: 12px !important;
    font-weight: 500;
    text-align: left;
    margin: 0 5px 0 0 !important;
    padding: 0 !important;
  }

  span {
    font-size: 12px !important;
    font-weight: 400;
    text-align: left;
    padding: 0 !important;
    margin: 0 5px 0 0 !important;
  }
`;

export const VirtuesContainer = styled.div`
  display: flex;
  background: transparent;
  padding: 0 !important;
  width: auto;
  margin: auto;
  animation: auto !important;
`;

export const SingleTraitContainer = styled.div`
  display: flex;
  flex-direction: row !important;
  background: transparent;
  padding: 1px 0 !important;
  animation: auto !important;
  width: auto !important;
  height: 18px;

  strong {
    font-size: 12px !important;
    font-weight: 500;
    text-align: left;
    margin: 0 5px !important;
    padding: 0 !important;
  }

  span {
    font-size: 12px !important;
    font-weight: 400;
    text-align: left;
    padding: 0 !important;
    margin: 0 5px 0 0 !important;
  }
`;

export const AttributeContainer = styled.div<ITraitContainer>`
  display: flex;
  flex-direction: column !important;
  background: transparent;
  padding: 0 !important;
  animation: auto !important;

  ${props =>
    props.alignment === 'right' &&
    css`
      width: 100% !important;
      align-items: flex-end;

      div {
        width: auto !important;
        margin: 0 0 0 auto !important;
        }
      }
    `}

  ${props =>
    props.alignment === 'left' &&
    css`
      width: 100% !important;
      align-items: flex-start;

      div {
        width: auto !important;
        margin: 0 auto 0 0 !important;
        }
      }
    `}

    ${props =>
    props.alignment === 'center' &&
    css`
      width: auto !important;
      align-items: center;

      div {
        width: auto !important;
        margin: 0 auto !important;
      }
    `}

  div {
    display: flex;
    flex-direction: row !important;
    background: transparent;
    padding: 0 0 3px 0 !important;
    animation: auto !important;

    strong {
      font-size: 12px !important;
      font-weight: 500;
      margin: 0 5px 0 0 !important;
      padding: 0 !important;
    }

    span {
      font-size: 12px !important;
      font-weight: 400;
      padding: 0 !important;
      margin: 0 5px 0 0 !important;
    }
  }
`;

export const TraitsListRow = styled.div`
  display: flex;
  flex-direction: column !important;
  background: transparent;
  padding: 0 !important;
  margin: 0 !important;
  width: auto !important;
  animation: auto !important;
`;

export const TraitsList = styled.div`
  display: flex;
  flex-direction: row !important;
  background: transparent;
  padding: 0 !important;
  margin: 0 !important;
  width: auto !important;
  animation: auto !important;
`;

export const SingleTraitsList = styled.div`
  display: flex;
  flex-direction: row !important;
  background: transparent;
  padding: 0 !important;
  margin: 0 !important;
  width: 112px !important;
  animation: auto !important;
  justify-content: left;
`;

export const TraitButton = styled.button<ITraitColor>`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #000 !important;
  border-radius: 50% !important;
  width: 16px !important;
  height: 16px !important;
  margin: 0 !important;
  padding: 0 !important;
  transition: background-color 0.3s;

  svg {
    padding: 0 !important;
    transition: color 0.3s;

    ${props =>
      props.traitColor === 'red'
        ? css`
            width: 15px !important;
            height: 15px !important;
            color: #560209 !important;
          `
        : css`
            width: 12px !important;
            height: 12px !important;
            color: #000 !important;
          `}
  }

  &:hover {
    ${props =>
      props.disabled
        ? css`
            cursor: default;
          `
        : css`
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
