import styled, { css } from 'styled-components';
import { TextField, withStyles } from '@material-ui/core';
import { lighten } from 'polished';

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

interface IFieldProps {
  align?: string;
  addMarginLeft?: boolean;
  addMarginRight?: boolean;
}

interface IFieldBoxChildProps {
  proportion?: number;
}

export const AddPowerContainer = styled.div`
  padding: 8px 24px 24px 24px;
  height: calc(100vh - 140px);
  width: 100%;

  border-top: 1px solid #888;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: right;

  margin: 24px auto 0 auto;
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
`;

export const FieldBox = styled.div`
  display: flex;
  flex-direction: row;
`;

export const FieldBoxChild = styled.div<IFieldBoxChildProps>`
  display: flex;
  flex-direction: row;

  ${props =>
    props.proportion
      ? css`
          width: ${props.proportion}%;
        `
      : css`
          width: 50%;
        `}
`;

export const InputField = styled(CssTextField).attrs<ITextFieldProps>(() => ({
  variant: 'outlined',
}))<IFieldProps>`
  && {
    margin: 8px 0;

    ${props =>
      props.addMarginLeft &&
      css`
        margin-left: 16px;
      `}

    ${props =>
      props.addMarginRight &&
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
  }
`;
