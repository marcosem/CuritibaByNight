import React, { InputHTMLAttributes } from 'react';
import {
  Container,
  CheckboxContainer,
  HiddenCheckbox,
  StyledCheckbox,
  Icon,
} from './styles';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  id: string;
  checked: boolean;
};

const Checkbox: React.FC<InputProps> = ({
  children,
  id,
  name,
  checked,
  ...rest
}) => (
  <Container htmlFor={id}>
    <CheckboxContainer>
      <HiddenCheckbox
        type="checkbox"
        checked={checked}
        name={name}
        id={id}
        {...rest}
      />
      <StyledCheckbox checked={checked}>
        <Icon viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12" />
        </Icon>
      </StyledCheckbox>
    </CheckboxContainer>

    <span>{children}</span>
  </Container>
);

export default Checkbox;
