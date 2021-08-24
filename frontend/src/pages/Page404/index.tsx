import React, { useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Container,
  Content,
  Vampire,
  VampFace,
  VampHair,
  VampHairR,
  VampHead,
  VampEye,
  VampMonth,
  VampBlood,
  TextContainer,
  ButtonBox,
} from './styles';

import Button from '../../components/Button';

import { useHeader } from '../../hooks/header';

const Page404: React.FC = () => {
  const { setCurrentPage } = useHeader();
  const history = useHistory();

  const handleReturn = useCallback(() => {
    history.push('/');
  }, [history]);

  useEffect(() => {
    setCurrentPage('404', true);
  }, [setCurrentPage]);

  return (
    <Container>
      <Content>
        <div>
          <p>4</p>
          <Vampire>
            <VampFace>
              <VampHair />
              <VampHairR />
              <VampHead />
              <VampEye eyePos="left" />
              <VampEye eyePos="right" />
              <VampMonth />
              <VampBlood />
              <VampBlood drop />
            </VampFace>
          </Vampire>
          <p>4</p>
        </div>

        <TextContainer>
          <p>Opa! Parece que a página que você procura foi diablerizada!</p>
        </TextContainer>

        <ButtonBox>
          <Button title="Retornar" onClick={handleReturn}>
            Retornar
          </Button>
        </ButtonBox>
      </Content>
    </Container>
  );
};

export default Page404;
