import styled from 'styled-components';

import { TextField, withStyles } from '@material-ui/core';

const CssTextField = withStyles({
  root: {
    '& label': {
      color: '#756b6b',
    },
    '&:hover label': {
      color: '#d5d5d5',
    },
    '& label.Mui-focused': {
      color: '#fff',
    },
    '& .MuiOutlinedInput-root': {
      color: '#756b6b',
      '&:hover': {
        color: '#d5d5d5',
      },
      '&.Mui-focused': {
        color: '#fff',
      },

      '& input': {
        color: '#756b6b',
        fontSize: '14px',
      },
      '&.Mui-focused input': {
        color: '#fff',
      },

      '& fieldset': {
        borderColor: '#756b6b',
      },
      '&:hover fieldset': {
        borderColor: '#d5d5d5',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#fff',
      },
    },
  },
})(TextField);

interface ITextFieldProps {
  readonly type: 'search' | 'number' | 'password' | 'email' | undefined;
  readonly variant: 'outlined' | 'filled' | undefined;
}

export const StyledTextField = styled(CssTextField).attrs<ITextFieldProps>(
  () => ({
    type: 'search',
    variant: 'outlined',
  }),
)`
  && {
    div {
      border-radius: 10px;
    }
  }
`;
