/* eslint-disable camelcase */
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Container } from './styles';
import Header from '../../components/Header';
import HeaderMobile from '../../components/HeaderMobile';
import { useMobile } from '../../hooks/mobile';
import { useSelection } from '../../hooks/selection';
import CharacterPanel from '../../components/CharacterPanel';

const CharacterDetails: React.FC = () => {
  const { char } = useSelection();
  const { isMobileVersion } = useMobile();
  const history = useHistory();

  useEffect(() => {
    if (char === undefined) {
      history.push('/');
    }
  }, [char, history]);

  return (
    <Container>
      {isMobileVersion ? (
        <HeaderMobile page="dashboard" />
      ) : (
        <Header page="dashboard" />
      )}

      {char && <CharacterPanel myChar={char} />}
    </Container>
  );
};

export default CharacterDetails;
