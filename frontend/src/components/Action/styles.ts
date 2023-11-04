import styled, { css } from 'styled-components';
import { TextField, withStyles } from '@material-ui/core';
import { lighten, shade } from 'polished';

const CssTextField = withStyles({
  root: {
    '& label': {
      color: '#777',
      fontSize: '12px',
    },
    '&:hover label': {
      color: `${lighten(0.2, '#860209')}`,
    },
    '& label.Mui-focused': {
      color: '#860209',
    },
    '& .MuiFormHelperText-root': {
      fontSize: '10px',
    },

    '& .MuiOutlinedInput-root': {
      color: '#222',
      '&:hover': {
        color: `${lighten(0.2, '#860209')}`,
      },
      '&.Mui-focused': {
        color: '#860209',
      },

      '& input': {
        color: '#111',
        fontSize: '12px',
      },
      '&.Mui-focused input': {
        color: '#000',
      },

      '& textarea': {
        color: 'rgba(0, 0, 0, 0.87)',
        fontSize: '11px',
        fontWeight: '400',
        letterSpacing: '0.01071em',
        lineHeight: '1.43',
      },
      '&.Mui-focused textarea': {
        color: '#000',
      },

      '& fieldset': {
        borderColor: '#222',
      },
      '&:hover fieldset': {
        borderColor: `${lighten(0.2, '#860209')}`,
      },
      '&.Mui-focused fieldset': {
        borderColor: '#860209',
      },
    },
    '& .MuiSelect-root': {
      fontSize: '12px',
    },
  },
})(TextField);

interface ITextFieldProps {
  // readonly type: 'search' | 'number' | 'password' | 'email' | undefined;
  readonly variant: 'outlined' | 'filled' | undefined;
}

interface IButtonProps {
  readonly type: 'button' | 'submit' | 'reset' | undefined;
}

interface IFieldProps {
  align?: string;
  addmargin?: string;
  highlight?: string;
}

interface IFieldBoxChildProps {
  proportion?: number;
  addmargin?: string;
  flexDirection?: string;
  invisible?: boolean;
}

export const ActionContainer = styled.div`
  padding: 8px 24px 24px 24px;
  width: 100%;

  border-top: 1px solid #888;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: right;
`;

export const ButtonBox = styled.div`
  display: flex;
  flex-direction: column;

  &:first-of-type {
    margin-right: 10px;
  }

  &:last-of-type {
    margin-left: 10px;
  }

  width: 100px;

  button:disabled {
    cursor: default;
    background: ${shade(0.2, '#860209')};
  }
`;

export const FieldBox = styled.div`
  display: flex;
  flex-direction: row;
`;

export const FieldBoxChild = styled.div<IFieldBoxChildProps>`
  display: flex;
  flex-direction: ${props =>
    props.flexDirection === 'column' ? 'column' : 'row'};

  ${props =>
    props.proportion
      ? css`
          width: ${props.proportion}%;
        `
      : css`
          width: 50%;
        `}

  ${props =>
    props.addmargin &&
    props.addmargin === 'left' &&
    css`
      margin-right: 0;
    `}

    ${props =>
    props.addmargin &&
    props.addmargin === 'right' &&
    css`
      margin-left: 0;
    `}

      ${props =>
    props.addmargin &&
    props.addmargin === 'auto' &&
    css`
      margin-right: auto;
      margin-left: auto;
    `}

    ${props =>
    props.invisible &&
    css`
      opacity: 0;
      pointer-events: none;
      visibility: hidden;
    `}
`;

export const InputField = styled(CssTextField).attrs<ITextFieldProps>(() => ({
  variant: 'outlined',
}))<IFieldProps>`
  && {
    margin: 8px 0;

    ${props =>
      props.addmargin &&
      props.addmargin === 'left' &&
      css`
        margin-left: 16px;
      `}

    ${props =>
      props.addmargin &&
      props.addmargin === 'right' &&
      css`
        margin-right: 16px;
      `}

    ${props =>
      props.align !== undefined &&
      css`
        input {
          text-align: ${props.align};
        }
      `}

    ${props =>
      props.highlight === 'true' &&
      css`
        input {
          font-size: 20px !important;
        }
      `}
  }
`;

export const ActionButton = styled.button.attrs<IButtonProps>(() => ({
  type: 'button',
}))`
  width: 24px;
  height: 24px;

  &:first-of-type {
    margin: 8px auto;
  }

  &:not(:first-of-type) {
    margin: 0 auto auto auto;
  }

  display: flex;
  flex-direction: space-between;
  align-items: center;
  justify-content: center;

  border: 0;
  border-radius: 6px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

  transition: background-color 0.2s;

  ${props =>
    props.disabled
      ? css`
          background: ${props.color === 'red' ? '#1a0001' : '#001a01'};
          cursor: default;
        `
      : css`
          background: ${props.color === 'red' ? '#860209' : '#028609'};
          &:hover {
            background: ${props.color === 'red'
              ? shade(0.2, '#860209')
              : shade(0.2, '#028609')};
          }
        `}

  svg {
    width: 20px;
    height: 20px;

    ${props =>
      props.disabled
        ? css`
            color: #7f7f7f;
          `
        : css`
            color: #fff;
          `}
  }
`;
