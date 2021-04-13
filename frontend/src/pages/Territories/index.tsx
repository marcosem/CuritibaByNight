/* eslint-disable camelcase */
import React, { useCallback, useEffect, useState, MouseEvent } from 'react';
// import { FiCopy, FiArrowLeft } from 'react-icons/fi';
import { FiEdit, FiSave, FiX, FiTrash2 } from 'react-icons/fi';
import Header from '../../components/Header';
import api from '../../services/api';

import {
  Container,
  TitleBox,
  TablesContainer,
  TableWrapper,
  Table,
  TableCell,
  ActionsContainer,
  ActionButton,
} from './styles';
import { useToast } from '../../hooks/toast';
import Loading from '../../components/Loading';

interface ITerritory {
  id: string;
  name: string;
  population: number;
  formattedPopulation?: string;
  sect?: string;
  editMode?: boolean;
}

const Influences: React.FC = () => {
  const [isBusy, setBusy] = useState(false);
  const [territoryList, setTerritoryList] = useState<ITerritory[]>([]);
  const [selTerritoryList, setSelTerritoryList] = useState<ITerritory[]>([]);
  const [selectedSect, setSelectedSect] = useState<string>('');
  const [sectList, setSectList] = useState<ITerritory[]>([]);
  const { addToast } = useToast();
  // const isMobileVersion = true;

  /*
  const loadInfluences = useCallback(() => {
    const infList: IInfluence[] = influences.map(inf => {
      const parsedInfluence: IInfluence = {
        influence: inf.influence,
        key_ability: inf.key_ability,
        description: inf.description,
        levels: inf.levels,
        notes: inf.notes,
      };

      return parsedInfluence;
    });

    setInfluencesList(infList);
  }, []);
  */

  /*
  const handleShowDetails = useCallback((influence: IInfluence) => {
    const newInfluence = influence;

    setSelInfluence(newInfluence);
  }, []);

  const handleCopyToClipboard = useCallback(
    (textId: string) => {
      const spanText = document.getElementById(textId);
      const textArea = document.createElement('textarea');

      const firstIndex = textId.indexOf('-');
      const lastIndex = textId.lastIndexOf('-');
      let myText = '';

      if (firstIndex >= 0 && lastIndex > firstIndex) {
        const level = textId.substr(lastIndex + 1, 1);
        const numLevel = Number(level) + 1;

        const influence = textId.substr(
          firstIndex + 1,
          lastIndex - firstIndex - 1,
        );

        myText = spanText?.textContent
          ? `${influence} x${numLevel}\r${spanText.textContent}\r`
          : '';
      } else {
        myText = spanText?.textContent ? spanText.textContent : '';
      }

      textArea.value = myText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');

      textArea.remove();

      addToast({
        type: 'success',
        title: 'Texto Copiado',
        description: 'Texto Copiado para Área de Transferência!',
      });
    },
    [addToast],
  );

  const handleGoBack = useCallback(() => {
    setSelInfluence(undefined);
  }, []);
*/
  /*
  useEffect(() => {
    loadInfluences();
  }, [loadInfluences]);
  */

  const loadTerritories = useCallback(async () => {
    setBusy(true);

    try {
      await api.get('territories/list').then(response => {
        const res: ITerritory[] = response.data;
        // const tempSectList: ITerritory[] = [];
        let newSectList: ITerritory[] = [];

        const formattedTerritories: ITerritory[] = res.map(
          (territory: ITerritory) => {
            const terr: ITerritory = {
              id: territory.id,
              name: territory.name,
              population: territory.population,
              formattedPopulation: new Intl.NumberFormat('pt-BR').format(
                territory.population,
              ),
              sect: territory.sect ? territory.sect : '',
              editMode: false,
            };

            if (terr.sect) {
              const currSect: ITerritory[] = newSectList.filter(
                sect => sect.sect === territory.sect,
              );

              if (currSect.length === 0) {
                const newSect = {
                  id: terr.sect,
                  name: terr.sect,
                  population: Number(terr.population),
                  formattedPopulation: terr.formattedPopulation,
                  sect: terr.sect,
                  editMode: false,
                };

                if (newSectList.length > 0) {
                  newSectList = [...newSectList, newSect].sort(
                    (a: ITerritory, b: ITerritory) => {
                      if (a.name < b.name) {
                        return -1;
                      }

                      if (a.name > b.name) {
                        return 1;
                      }

                      return 0;
                    },
                  );
                } else {
                  newSectList = [newSect];
                }
              } else {
                const newPop =
                  Number(currSect[0].population) + Number(terr.population);
                const newSect: ITerritory = {
                  id: currSect[0].id,
                  name: currSect[0].name,
                  population: newPop,
                  formattedPopulation: new Intl.NumberFormat('pt-BR').format(
                    newPop,
                  ),
                  sect: currSect[0].sect,
                  editMode: false,
                };

                newSectList = newSectList.map(sect =>
                  sect.id === newSect.id ? newSect : sect,
                );
              }
            }

            return terr;
          },
        );

        setSectList(newSectList);
        setSelTerritoryList(formattedTerritories);
        setTerritoryList(formattedTerritories);
      });
    } catch (error) {
      if (error.response) {
        const { message } = error.response.data;

        if (error.response.status !== 401) {
          addToast({
            type: 'error',
            title: 'Erro ao tentar listar os territórios',
            description: `Erro: '${message}'`,
          });
        }
      }
    }

    setBusy(false);
  }, [addToast]);

  const handleSelectSectTerritories = useCallback(
    async (e: MouseEvent<HTMLTableRowElement>) => {
      const currentSelection = e.currentTarget.id;

      if (selectedSect === currentSelection) {
        setSelectedSect('');
        setSelTerritoryList(territoryList);
      } else {
        setSelectedSect(currentSelection);
        const newSelTerrList = territoryList.filter(
          terr => terr.sect === currentSelection,
        );
        setSelTerritoryList(newSelTerrList);
      }
    },
    [selectedSect, territoryList],
  );

  useEffect(() => {
    loadTerritories();
  }, [loadTerritories]);

  return (
    <Container>
      <Header page="territories" />

      <TitleBox>
        <strong>
          {`Lista de Territórios${
            selectedSect !== '' ? ` (${selectedSect})` : ''
          }`}
        </strong>
      </TitleBox>
      {isBusy ? (
        <Loading />
      ) : (
        <TablesContainer>
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <th>Município</th>
                  <th>População</th>
                  <th>Secto</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {selTerritoryList.map(terr => (
                  <tr key={terr.id}>
                    <td>
                      <TableCell alignment="left">
                        <strong>{terr.name}</strong>
                      </TableCell>
                    </td>
                    <td>
                      <TableCell alignment="right">
                        {terr.formattedPopulation}
                      </TableCell>
                    </td>
                    <td>
                      <TableCell alignment="center">{terr.sect}</TableCell>
                    </td>
                    <td>
                      <ActionsContainer>
                        {terr.editMode ? (
                          <>
                            <ActionButton
                              id={`save:${terr.id}`}
                              type="button"
                              title="Salvar"
                            >
                              <FiSave />
                            </ActionButton>
                            <ActionButton
                              id={`cancel:${terr.id}`}
                              type="button"
                              title="Cancelar"
                            >
                              <FiX />
                            </ActionButton>
                          </>
                        ) : (
                          <>
                            <ActionButton
                              id={`edit:${terr.id}`}
                              type="button"
                              title="Editar"
                            >
                              <FiEdit />
                            </ActionButton>
                            <ActionButton
                              id={`delete:${terr.id}`}
                              type="button"
                              title="Remover"
                            >
                              <FiTrash2 />
                            </ActionButton>
                          </>
                        )}
                      </ActionsContainer>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>

          <TableWrapper isSectTable>
            <Table isSectTable>
              <thead>
                <tr>
                  <th>Secto</th>
                  <th>População</th>
                </tr>
              </thead>
              <tbody>
                {sectList.map(sect => (
                  <tr
                    key={sect.id}
                    id={sect.id}
                    onClick={handleSelectSectTerritories}
                  >
                    <td>
                      <TableCell
                        alignment="left"
                        selected={sect.id === selectedSect}
                      >
                        <strong>{sect.name}</strong>
                      </TableCell>
                    </td>
                    <td>
                      <TableCell
                        alignment="right"
                        selected={sect.id === selectedSect}
                      >
                        {sect.formattedPopulation}
                      </TableCell>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>
        </TablesContainer>
      )}
    </Container>
  );
};

export default Influences;
