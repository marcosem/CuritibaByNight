import React, { ButtonHTMLAttributes } from 'react';
import { FaSpinner } from 'react-icons/fa';
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
    {loading ? (
      <>
        <FaSpinner />
        <span>{loadingMessage}</span>
      </>
    ) : (
      children
    )}
  </Container>
);

export default Button;
