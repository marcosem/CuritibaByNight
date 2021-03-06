import styled, { css } from 'styled-components';

interface ICheckBoxProps {
  checked: boolean;
}

interface IContainerProps {
  titlebar: boolean;
}

export const Container = styled.label<IContainerProps>`
  display: flex;
  flex-direction: row;
  padding: 5px 0;

  align-items: center;
  justify-content: center;

  ${props =>
    props.titlebar
      ? css`
          width: 50%;
          span {
            margin-left: 8px;
            color: #eee;
            text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
            font-size: 14px !important;
            font-weight: 500;
          }
        `
      : css`
          width: 100%;
          span {
            margin-left: 8px;
            font-size: 16px !important;
            color: #333;
            font-weight: 500;
          }
        `}
`;

export const CheckboxContainer = styled.div`
  display: inline-block !important;
  margin: 0 5px 0 0 !important;
  width: 16px !important;
`;

export const HiddenCheckbox = styled.input`
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

export const StyledCheckbox = styled.div<ICheckBoxProps>`
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 3px;
  transition: all 150ms;

  ${props =>
    props.checked
      ? css`
          background: #028609;
        `
      : css`
          background: #860209;
        `}

  ${HiddenCheckbox}:focus + & {
    box-shadow: 0 0 0 3px #888;
  }

  svg {
    color: #fff;
    width: 16px;
    height: 16px;

    ${props =>
      props.checked
        ? css`
            visibility: visible;
          `
        : css`
            visibility: hidden;
          `}
  }
`;
