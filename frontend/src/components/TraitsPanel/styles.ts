import styled, { css, keyframes } from 'styled-components';
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

const divFadeIn = keyframes`
  from {
    height: 0;
  }
  to {
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
    `}

  h1 {
    font-size: 16px;
    text-align: center;
    padding: 0 0 5px 0;
  }
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
    font-size: 12px;
    margin-right: 5px;
  }

  span {
    font-size: 12px;
    margin-right: 5px;
  }
`;

export const VirtuesContainer = styled.div`
  display: flex;
`;

export const SingleTraitContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 1px 0;
  height: 18px;

  strong {
    font-size: 12px;
    margin-right: 5px;
  }

  span {
    font-size: 12px;
    margin-right: 5px;
  }
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
      font-size: 12px;
      margin-right: 5px;
    }

    span {
      font-size: 12px;
    }
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

export const SingleTraitsList = styled.div`
  display: flex;
  flex-direction: row;
  width: 112px;
`;

export const TraitButton = styled.button<ITraitColor>`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #000 !important;
  border-radius: 50%;
  width: 16px !important;
  height: 16px !important;
  margin: 0 !important;
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
