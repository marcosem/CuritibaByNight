import React, { ButtonHTMLAttributes } from 'react';
import { Container } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  loadingMessage?: string;
};

const Button: React.FC<ButtonProps> = ({
  children,
  loading,
  loadingMessage = 'Carregando...',
  ...rest
}) => (
  <Container type="button" {...rest}>
    {loading ? loadingMessage : children}
  </Container>
);

export default Button;
