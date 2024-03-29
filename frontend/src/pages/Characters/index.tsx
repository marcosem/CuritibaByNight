/* eslint-disable camelcase */
import React, { useState, useCallback, useEffect, ChangeEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiPlus, FiUpload, FiUsers } from 'react-icons/fi';

import api from '../../services/api';
import Loading from '../../components/Loading';

import {
  Container,
  TitleBox,
  SelectionContainer,
  Content,
  Select,
  Functions,
  FunctionLink,
} from './styles';
import CharacterList from '../../components/CharacterList';
import ICharacter from '../../components/CharacterList/ICharacter';
import Checkbox from '../../components/Checkbox';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import { useMobile } from '../../hooks/mobile';
import { useHeader } from '../../hooks/header';
import { useSelection } from '../../hooks/selection';

interface IRouteParams {
  filter: string;
}

const Characters: React.FC = () => {
  const { filter } = useParams<IRouteParams>();
  const [charList, setCharList] = useState<ICharacter[]>([]);
  const [filterList, setFilterList] = useState<string[]>([]);
  const [selectedClan, setSelectedClan] = useState<string>('');
  const [isBusy, setBusy] = useState(false);
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const { signOut } = useAuth();
  const { addToast } = useToast();
  const { isMobileVersion } = useMobile();
  const { setCurrentPage } = useHeader();
  const { initializeCharInfoList } = useSelection();

  const loadCharacters = useCallback(async () => {
    setBusy(true);

    try {
      await api.get(`characters/list/${filter}`).then(response => {
        const res = response.data;

        // Get list of clan
        const coteries: string[] = [];

        const clanList = res.map((char: ICharacter) => {
          if (char.coterie !== undefined && char.coterie !== '') {
            const conterie = `Coterie: ${char.coterie}`;
            if (!coteries.includes(conterie)) {
              coteries.push(conterie);
            }
          }

          if (
            (char.creature_type !== 'Vampire' &&
              char.creature_type !== 'Mortal') ||
            (char.creature_type === 'Mortal' && char.clan === '')
          ) {
            return char.creature_type;
          }

          if (char.clan.indexOf('Ghoul') >= 0) {
            return 'Ghoul';
          }

          const clanFilter1 = char.clan.split(':');
          const clanFilter2 = clanFilter1[0].split(' (');

          return clanFilter2[0];
        });
        // Sort clan list and remove duplicated
        const filteredClanList = [
          ...clanList
            .sort()
            .filter((clan: string, pos: number, ary: string[]) => {
              return !pos || clan !== ary[pos - 1];
            }),
          ...coteries,
        ];

        setFilterList(filteredClanList);
        setCharList(res);
      });
    } catch (error) {
      const parsedError: any = error;

      if (parsedError.response) {
        const { message } = parsedError.response.data;

        if (
          message?.indexOf('token') > 0 &&
          parsedError.response.status === 401
        ) {
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
    setCurrentPage(filter === 'npc' ? 'npcs' : 'characters');
    loadCharacters();
    initializeCharInfoList();
  }, [filter, initializeCharInfoList, loadCharacters, setCurrentPage]);

  useEffect(() => {
    setSelectedClan('');
  }, []);

  const handleShowActiveOnlyChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setShowActiveOnly(e.target.checked);
    },
    [],
  );

  const handleFilterChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const clan = event.target.value;
      setSelectedClan(clan);
    },
    [],
  );

  return (
    <Container isMobile={isMobileVersion}>
      {isBusy ? (
        <Loading />
      ) : (
        <>
          <TitleBox>
            {charList.length > 0 ? (
              <>
                {!isMobileVersion && (
                  <strong>
                    {filter === 'npc'
                      ? 'Clique no nome do NPC para visualizar a ficha:'
                      : 'Clique no nome do personagem para visualizar a ficha:'}
                  </strong>
                )}

                <SelectionContainer>
                  <Checkbox
                    name="showActiveOnly"
                    id="showActiveOnly"
                    checked={showActiveOnly}
                    titlebar
                    onChange={handleShowActiveOnlyChange}
                  >
                    Somente Ativos
                  </Checkbox>

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
                </SelectionContainer>
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
            <CharacterList
              chars={charList}
              locked
              filterClan={selectedClan}
              filterSituation={showActiveOnly ? 'active' : 'all'}
            />
          </Content>

          {!isMobileVersion && (
            <Functions>
              <FunctionLink>
                <Link
                  to={`/updatemultichars/${filter}`}
                  title="Atualizar Multiplos Personagens"
                >
                  <FiUsers />
                </Link>
              </FunctionLink>

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
