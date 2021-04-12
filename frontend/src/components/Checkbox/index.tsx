import React, { InputHTMLAttributes } from 'react';
import { FiCheck } from 'react-icons/fi';
import {
  Container,
  CheckboxContainer,
  HiddenCheckbox,
  StyledCheckbox,
} from './styles';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  id: string;
  checked: boolean;
  titlebar?: boolean;
};

const Checkbox: React.FC<InputProps> = ({
  children,
  id,
  name,
  checked,
  titlebar = false,
  ...rest
}) => (
  <Container htmlFor={id} titlebar={titlebar}>
    <CheckboxContainer>
      <HiddenCheckbox
        type="checkbox"
        checked={checked}
        name={name}
        id={id}
        {...rest}
      />
      <StyledCheckbox checked={checked}>
        <FiCheck />
      </StyledCheckbox>
    </CheckboxContainer>

    <span>{children}</span>
  </Container>
);

export default Checkbox;
