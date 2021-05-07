import React from 'react';
import { Container } from './styles';

interface ICardToolTipProps {
  title: string;
  className?: string;
}

const CardToolTip: React.FC<ICardToolTipProps> = ({
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
