import React, { useState, useCallback } from 'react';

import { Container, Content, Character, CharTitle, CharSheet } from './styles';

import Header from '../../components/Header';

const Dashboard: React.FC = () => {
  const [showCharSheet, setShowCharSheet] = useState<boolean>(false);

  const handleShowCharSheet = useCallback(() => {
    setShowCharSheet(!showCharSheet);
  }, [showCharSheet]);

  return (
    <Container>
      <Header />
      <Content>
        <div>
          <strong>Clique no personagem para visualizar sua ficha:</strong>
        </div>
        <Character>
          <CharTitle onClick={handleShowCharSheet}>
            <div>
              <strong>Personagem:</strong>
              <span>Alzarir</span>
            </div>
            <div>
              <strong>XP Disponível:</strong>
              <span>10</span>
            </div>
            <div>
              <strong>Última Atualização:</strong>
              <span>10/10/2020</span>
            </div>
          </CharTitle>
          <CharSheet>
            {showCharSheet && (
              <iframe
                title="Personagem"
                src="http://localhost:3333/character/sheet/6226a8a5796f5f5c08ec-julio grozki.pdf"
                width="100%"
                height="660px"
              />
            )}
          </CharSheet>
        </Character>
        <Character>
          <CharTitle onClick={handleShowCharSheet}>
            <div>
              <strong>Personagem:</strong>
              <span>Alzalaught</span>
            </div>
            <div>
              <strong>XP Disponível:</strong>
              <span>10</span>
            </div>
            <div>
              <strong>Última Atualização:</strong>
              <span>10/10/2020</span>
            </div>
          </CharTitle>
          <CharSheet>
            {showCharSheet && (
              <iframe
                title="Personagem"
                src="http://localhost:3333/character/sheet/6226a8a5796f5f5c08ec-julio grozki.pdf"
                width="100%"
                height="660px"
              />
            )}
          </CharSheet>
        </Character>
      </Content>
    </Container>
  );
};

export default Dashboard;
