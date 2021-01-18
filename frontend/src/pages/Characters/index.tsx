/* eslint-disable camelcase */
import React, { useState, useCallback, useEffect, ChangeEvent } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { FiPlus, FiUpload } from 'react-icons/fi';
import api from '../../services/api';
import Header from '../../components/Header';
import HeaderMobile from '../../components/HeaderMobile';
import Loading from '../../components/Loading';

import {
  Container,
  TitleBox,
  Content,
  Select,
  Functions,
  FunctionLink,
} from './styles';
import CharacterList from '../../components/CharacterList';
import ICharacter from '../../components/CharacterList/ICharacter';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import { useMobile } from '../../hooks/mobile';

interface IRouteParams {
  filter: string;
}

const Characters: React.FC = () => {
  const { filter } = useParams<IRouteParams>();
  const [charList, setCharList] = useState<ICharacter[]>([]);
  const [filterList, setFilterList] = useState<string[]>([]);
  const [selectedClan, setSelectedClan] = useState<string>('');
  const [isBusy, setBusy] = useState(false);
  const { signOut } = useAuth();
  const { addToast } = useToast();
  const { isMobileVersion } = useMobile();

  const loadCharacters = useCallback(async () => {
    setBusy(true);

    try {
      await api.get(`characters/list/${filter}`).then(response => {
        const res = response.data;

        // Get list of clan
        const clanList = res.map((char: ICharacter) => {
          const clanFilter1 = char.clan.split(':');
          const clanFilter2 = clanFilter1[0].split(' (');

          return clanFilter2[0];
        });
        // Sort clan list and remove duplicated
        const filteredClanList = clanList
          .sort()
          .filter((clan: string, pos: number, ary: string[]) => {
            return !pos || clan !== ary[pos - 1];
          });

        setFilterList(filteredClanList);
        setCharList(res);
      });
    } catch (error) {
      if (error.response) {
        const { message } = error.response.data;

        if (message.indexOf('token') > 0 && error.response.status === 401) {
          addToast({
            type: 'error',
            title: 'Sessão Expirada',
            description: 'Sessão de usuário expirada, faça o login novamente!',
          });

          signOut();
        } else {
          addToast({
            type: 'error',
            title: 'Erro ao tentar listar personagens',
            description: `Erro: '${message}'`,
          });
        }
      }
    }
    setBusy(false);
  }, [addToast, filter, signOut]);

  useEffect(() => {
    loadCharacters();
  }, [loadCharacters]);

  useEffect(() => {
    setSelectedClan('');
  }, []);

  const handleFilterChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const clan = event.target.value;
      setSelectedClan(clan);
    },
    [],
  );

  return (
    <Container>
      {isMobileVersion ? (
        <HeaderMobile page={filter === 'npc' ? 'npcs' : 'characters'} />
      ) : (
        <Header page={filter === 'npc' ? 'npcs' : 'characters'} />
      )}
      {isBusy ? (
        <Loading />
      ) : (
        <>
          <TitleBox>
            {charList.length > 0 ? (
              <>
                <strong>
                  {filter === 'npc'
                    ? 'Clique no nome do NPC para visualizar a ficha:'
                    : 'Clique no nome do personagem para visualizar a ficha:'}
                </strong>
                {filterList.length > 0 && (
                  <Select
                    name="clan"
                    id="clan"
                    value={selectedClan}
                    onChange={handleFilterChange}
                  >
                    <option value="">Selecione um Clan:</option>
                    {filterList.map(clan => (
                      <option key={clan} value={clan}>
                        {clan}
                      </option>
                    ))}
                  </Select>
                )}
              </>
            ) : (
              <strong>
                {filter === 'npc'
                  ? 'Não foi encontrado nenhum NPC na base de dados.'
                  : 'Não foi encontrado nenhum personagem na base de dados.'}
              </strong>
            )}
          </TitleBox>

          <Content isMobile={isMobileVersion}>
            <CharacterList chars={charList} locked filterClan={selectedClan} />
          </Content>

          {!isMobileVersion && (
            <Functions>
              <FunctionLink>
                <Link to={`/updatechar/${filter}`} title="Atualizar Personagem">
                  <FiUpload />
                </Link>
              </FunctionLink>
              <FunctionLink>
                <Link to={`/addchar/${filter}`} title="Adicionar Personagem">
                  <FiPlus />
                </Link>
              </FunctionLink>
            </Functions>
          )}
        </>
      )}
    </Container>
  );
};

export default Characters;
