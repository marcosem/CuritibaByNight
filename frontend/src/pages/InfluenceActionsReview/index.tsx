import React, { useEffect } from 'react';

import { Container, TitleBox } from './styles';

import { useHeader } from '../../hooks/header';

const InfluenceActionsReview: React.FC = () => {
  const { setCurrentPage } = useHeader();

  useEffect(() => {
    setCurrentPage('actionsreview');
  }, [setCurrentPage]);

  return (
    <Container isMobile={false}>
      <TitleBox>
        <strong>Revisar Ações de Influências e Downtime</strong>
      </TitleBox>
    </Container>
  );
};

export default InfluenceActionsReview;
