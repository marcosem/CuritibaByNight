import React from 'react';
import { Container } from './styles';

interface CardToolTipProps {
  title: string;
  className?: string;
}

const CardToolTip: React.FC<CardToolTipProps> = ({
  title,
  className,
  children,
  ...rest
}) => {
  return (
    <Container {...rest} className={className}>
      {children}
      <span>{title}</span>
    </Container>
  );
};

export default CardToolTip;
