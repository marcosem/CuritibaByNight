import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import { Container } from './styles';

const Loading: React.FC = () => {
  return (
    <Container>
      <FaSpinner />
    </Container>
  );
};

export default Loading;
