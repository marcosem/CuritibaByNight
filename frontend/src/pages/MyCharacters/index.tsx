/* eslint-disable camelcase */
import React, { useState, useCallback, useEffect, ChangeEvent } from 'react';

import api from '../../services/api';
import Loading from '../../components/Loading';

import {
  Container,
  TitleBox,
  SelectionContainer,
  Content,
  Select,
} from './styles';
import CharacterList from '../../components/CharacterList';
import ICharacter from '../../components/CharacterList/ICharacter';
import Checkbox from '../../components/Checkbox';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import { useMobile } from '../../hooks/mobile';
import { useHeader } from '../../hooks/header';

const Characters: React.FC = () => {
  const [charList, setCharList] = useState<ICharacter[]>([]);
  const [filterList, setFilterList] = useState<string[]>([]);
  const [selectedClan, setSelectedClan] = useState<string>('');
  const [isBusy, setBusy] = useState(false);
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const { user, signOut } = useAuth();
  const { addToast } = useToast();
  const { isMobileVersion } = useMobile();
  const { setCurrentPage } = useHeader();

  const loadCharacters = useCallback(async () => {
    setBusy(true);

    try {
      await api
        .post('character/list', {
          player_id: user.id,
          situation: 'all',
        })
        .then(response => {
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
        }
      }
    }
    setBusy(false);
  }, [addToast, signOut, user.id]);

  useEffect(() => {
    setCurrentPage('myCharacters');
    loadCharacters();
  }, [loadCharacters, setCurrentPage]);

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
                    Clique no nome do personagem para visualizar a ficha:
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
                Não foi encontrado nenhum personagem na base de dados.
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
        </>
      )}
    </Container>
  );
};

export default Characters;
