import React from 'react';
import logoImg from '../../assets/logo.svg';
import { Container } from './styles';

const Logo: React.FC = () => (
  <Container>
    <img src={logoImg} alt="Curitiba By Night" />
  </Container>
);

export default Logo;
