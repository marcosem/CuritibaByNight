import React from 'react';
import { TextFieldProps, InputAdornment } from '@material-ui/core';
import { FiSearch } from 'react-icons/fi';
import { StyledTextField } from './styles';

const SearchField: React.FC<TextFieldProps> = ({ ...rest }) => {
  return (
    <StyledTextField
      {...rest}
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <FiSearch />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchField;
