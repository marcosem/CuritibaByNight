/* eslint-disable camelcase */
import React, { useState, useCallback, useEffect, ChangeEvent } from 'react';
import { useParams } from 'react-router';
import { FiMessageSquare, FiUpload } from 'react-icons/fi';
import { Form } from '@unform/web';
import { format } from 'date-fns';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import api from '../../services/api';

import {
  Container,
  TitleBox,
  Select,
  Content,
  CharCardContainer,
  CharacterFormContainer,
  SelectSituation,
  SelectRegnant,
  InputBox,
  InputFileBox,
  ButtonBox,
} from './styles';
import Header from '../../components/Header';

import Input from '../../components/Input';
import Button from '../../components/Button';

import Loading from '../../components/Loading';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import CharacterCard from '../../components/CharacterCard';
import ICharacter from '../../components/CharacterList/ICharacter';

interface ISituation {
  title: string;
  titleEn: string;
}

const situationList: ISituation[] = [
  {
    title: 'Ativo',
    titleEn: 'active',
  },
  {
    title: 'Aposentado',
    titleEn: 'retired',
  },
  {
    title: 'Arquivado',
    titleEn: 'shelved',
  },
  {
    title: 'Destruído',
    titleEn: 'destroyed',
  },
  {
    title: 'Inativo',
    titleEn: 'inactive',
  },
  {
    title: 'Morto',
    titleEn: 'dead',
  },
  {
    title: 'Torpor',
    titleEn: 'torpor',
  },
  {
    title: 'Transferido',
    titleEn: 'transfered',
  },
];

interface IRouteParams {
  filter: string;
}

const CharacterUpdate: React.FC = () => {
  const { filter } = useParams<IRouteParams>();
  const [charList, setCharList] = useState<ICharacter[]>([]);
  const [regnantList, setRegnatList] = useState<ICharacter[]>([]);
  const [selectedChar, setSelectedChar] = useState<ICharacter>();
  const [selectedRegnant, setSelectedRegnant] = useState<ICharacter>();
  const [charSituation, setCharSituation] = useState<ISituation>();
  const [charSheet, setCharSheet] = useState<File>();
  const [lastComment, setLastComment] = useState<string>();
  const { addToast } = useToast();
  const { signOut } = useAuth();
  const [isBusy, setBusy] = useState(true);
  const [uploading, setUploading] = useState(false);

  const loadCharacters = useCallback(async () => {
    setBusy(true && !uploading);

    const characterType = filter === 'npc' ? 'NPCs' : 'personagens';

    try {
      await api.get(`characters/list/${filter}`).then(response => {
        const res = response.data;

        const fullList: ICharacter[] = res;

        setCharList(fullList);
      });

      await api.get('characters/list/all').then(response => {
        const res = response.data;

        const fullList: ICharacter[] = res;

        setRegnatList(fullList);
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
            title: `Erro ao tentar listar ${characterType}`,
            description: `Erro: '${message}'`,
          });
        }
      }
    }
    setBusy(false);
  }, [addToast, filter, signOut, uploading]);

  const handleSubmit = useCallback(
    async ({ comments }) => {
      const characterType = filter === 'npc' ? 'NPC' : 'Personagem';

      try {
        if (!charSheet) {
          addToast({
            type: 'error',
            title: 'Ficha não selecionada',
            description: `Selecione uma Ficha de ${characterType} e tente novamente.`,
          });

          return;
        }

        if (selectedChar === undefined) {
          addToast({
            type: 'error',
            title: `${characterType} não selecionado`,
            description: `Selecione um ${characterType} e tente novamente.`,
          });

          return;
        }

        const formData = new FormData();
        formData.append('character_id', selectedChar.id);
        if (comments) {
          formData.append('comments', comments);
          setLastComment(comments);
        }
        if (filter === 'npc') formData.append('is_npc', 'true');

        if (
          charSituation?.titleEn !== selectedChar.situation &&
          charSituation !== undefined
        ) {
          formData.append('situation', charSituation.titleEn);
        }

        if (selectedRegnant) {
          formData.append('regnant_id', selectedRegnant.id);
        }

        formData.append('sheet', charSheet);

        setUploading(true);

        await api.patch('/character/update', formData).then(response => {
          const savedChar: ICharacter = response.data;

          savedChar.formatedDate = format(
            new Date(savedChar.updated_at),
            'dd/MM/yyyy',
          );

          let filteredClan: string[];
          if (savedChar.clan) {
            filteredClan = savedChar.clan.split(' (');
            filteredClan = filteredClan[0].split(':');
          } else {
            filteredClan = [''];
          }

          const clanIndex = 0;
          savedChar.clan = filteredClan[clanIndex];

          setSelectedChar(savedChar);
          loadCharacters();
        });

        await api.patch('/character/updateretainers', {
          character_id: selectedChar.id,
        });

        addToast({
          type: 'success',
          title: `${characterType} Atualizado!`,
          description: `${characterType} atualizado com sucesso!`,
        });
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro na atualização',
          description: err.response.data.message
            ? err.response.data.message
            : `Erro ao atualizar o ${characterType}, tente novamente.`,
        });
      }
      setUploading(false);
    },
    [
      filter,
      charSheet,
      selectedChar,
      charSituation,
      selectedRegnant,
      addToast,
      loadCharacters,
    ],
  );

  const handleSituationChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const selIndex = event.target.selectedIndex;

      let selectedSituation: ISituation | undefined;
      if (selIndex > 0) {
        const selSituation = situationList[selIndex - 1];
        selectedSituation = selSituation;
      } else {
        selectedSituation = undefined;
      }

      setCharSituation(selectedSituation);
    },
    [],
  );

  const handleConfirm = useCallback(
    ({ comments }) => {
      if (!charSheet) {
        addToast({
          type: 'error',
          title: 'Ficha não selecionada',
          description:
            'Nenhuma ficha foi selecionada, adicione uma ficha e tente novamente.',
        });

        return;
      }

      const charName = selectedChar ? selectedChar.name : '';
      const charSheetName = charSheet ? charSheet.name : '';
      const characterType = filter === 'npc' ? 'NPC' : 'Personagem';

      if (charSheetName.indexOf(charName) === -1) {
        confirmAlert({
          title: 'Confirmar atualização',
          message: `O nome do ${characterType} [${charName}] não combina com o nome do arquivo [${charSheetName}], confirma a atualização?`,
          buttons: [
            {
              label: 'Sim',
              onClick: () => handleSubmit({ comments }),
            },
            {
              label: 'Não',
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              onClick: () => {},
            },
          ],
        });
      } else {
        handleSubmit({ comments });
      }
    },
    [addToast, charSheet, filter, handleSubmit, selectedChar],
  );

  const handleCharacterChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const selIndex = event.target.selectedIndex;

      let selectedCharacter: ICharacter | undefined;
      let selRegnant: ICharacter | undefined;
      if (selIndex > 0) {
        const selChar = charList[selIndex - 1];
        selChar.formatedDate = format(
          new Date(selChar.updated_at),
          'dd/MM/yyyy',
        );

        let filteredClan: string[];
        if (selChar.clan) {
          filteredClan = selChar.clan.split(' (');
          filteredClan = filteredClan[0].split(':');
        } else {
          filteredClan = [''];
        }

        const clanIndex = 0;
        selChar.clan = filteredClan[clanIndex];

        selRegnant = selChar.regnant
          ? regnantList.find(regChar => regChar.id === selChar.regnant)
          : undefined;

        selectedCharacter = selChar;
      } else {
        selectedCharacter = undefined;
        selRegnant = undefined;
      }

      setSelectedChar(selectedCharacter);
      setCharSheet(undefined);
      setSelectedRegnant(selRegnant);
    },
    [charList, regnantList],
  );

  const handleRegnantChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const selIndex = event.target.selectedIndex;

      let selRegnant: ICharacter | undefined;
      if (selIndex > 0) {
        const selChar = regnantList[selIndex - 1];
        selRegnant = selChar;
      } else {
        selRegnant = undefined;
      }

      setSelectedRegnant(selRegnant);
    },
    [regnantList],
  );

  const handleSheetChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const file = e.target.files[0];
        setCharSheet(file);
      }
    },
    [],
  );

  useEffect(() => {
    if (selectedChar) {
      const selSituation = situationList.find(
        sit => sit.titleEn === selectedChar.situation,
      );

      setCharSituation(selSituation);
    }
  }, [selectedChar, setCharSituation]);

  useEffect(() => {
    loadCharacters();
  }, [loadCharacters]);

  return (
    <Container>
      <Header page="updatechar" />

      <TitleBox>
        {charList.length > 0 ? (
          <>
            <strong>
              {filter === 'npc'
                ? 'Selecione o NPC a ser Atualizado:'
                : 'Selecione o Personagem a ser Atualizado:'}
            </strong>

            <Select
              name="character"
              id="character"
              value={selectedChar ? selectedChar.name : undefined}
              defaultValue={selectedChar ? selectedChar.name : undefined}
              onChange={handleCharacterChange}
            >
              <option value="">
                {filter === 'npc'
                  ? 'Selecione um NPC:'
                  : 'Selecione um Personagem:'}
              </option>
              {charList.map(character => (
                <option key={character.id} value={character.name}>
                  {character.name}
                </option>
              ))}
            </Select>
          </>
        ) : (
          <strong>
            {filter === 'npc'
              ? 'Não foi encontrado nenhum NPC na base de dados.'
              : 'Não foi encontrado nenhum Personagem na base de dados.'}
          </strong>
        )}
      </TitleBox>
      <Content>
        {isBusy ? (
          <Loading />
        ) : (
          <>
            {selectedChar && (
              <>
                <CharCardContainer>
                  <CharacterCard
                    charId={selectedChar.id}
                    name={selectedChar.name}
                    experience={selectedChar.experience}
                    sheetFile={selectedChar.character_url}
                    clan={selectedChar.clan}
                    title={selectedChar.title}
                    coterie={selectedChar.coterie}
                    avatar={selectedChar.avatar_url}
                    updatedAt={
                      selectedChar.formatedDate ? selectedChar.formatedDate : ''
                    }
                    npc={selectedChar.npc}
                    regnant={selectedChar.regnant ? selectedChar.regnant : ''}
                    locked={filter !== 'npc'}
                  />
                </CharCardContainer>
                <CharacterFormContainer>
                  <div>
                    <h1>{selectedChar.name}</h1>
                    <h1>{selectedChar.clan}</h1>
                  </div>

                  {filter === 'npc' ? (
                    <div>
                      <strong>NPC</strong>
                    </div>
                  ) : (
                    <>
                      <div>
                        <strong>Experiêcia disponível:</strong>
                        <span>{selectedChar.experience}</span>
                      </div>
                      <div>
                        <strong>Jogador:</strong>
                        <span>{selectedChar.user?.name}</span>
                      </div>
                    </>
                  )}

                  <Form
                    onSubmit={handleConfirm}
                    initialData={{
                      comments: lastComment,
                    }}
                  >
                    <div>
                      <h1>
                        {filter === 'npc'
                          ? 'Entre com os novos dados do NPC:'
                          : 'Entre com os novos dados do Personagem:'}
                      </h1>
                    </div>
                    <div>
                      <strong>Situação:</strong>
                      <SelectSituation
                        name="situation"
                        id="situation"
                        value={
                          charSituation ? charSituation.titleEn : undefined
                        }
                        defaultValue={charSituation?.titleEn}
                        onChange={handleSituationChange}
                      >
                        <option value="">Situação:</option>
                        {situationList.map(situation => (
                          <option
                            key={situation.titleEn}
                            value={situation.titleEn}
                          >
                            {situation.title}
                          </option>
                        ))}
                      </SelectSituation>
                    </div>

                    {(selectedChar.clan.indexOf('Ghoul') >= 0 ||
                      selectedChar.clan.indexOf('Retainer') >= 0) && (
                      <div>
                        <strong>Regente / Guardião:</strong>
                        <SelectRegnant
                          name="regnant"
                          id="regnant"
                          value={selectedRegnant ? selectedRegnant.name : ''}
                          onChange={handleRegnantChange}
                        >
                          <option value="">Selecione um Personagem</option>
                          {regnantList.map(character => (
                            <option key={character.id} value={character.name}>
                              {character.name}
                            </option>
                          ))}
                        </SelectRegnant>
                      </div>
                    )}

                    <InputFileBox>
                      <label htmlFor="sheet">
                        <FiUpload />
                        Selecionar a ficha em .pdf...
                        <input
                          type="file"
                          name=""
                          id="sheet"
                          onChange={handleSheetChange}
                          readOnly={uploading}
                        />
                      </label>
                      <strong>Arquivo:</strong>
                      <span>
                        {charSheet ? `"${charSheet.name}"` : 'Nenhum'}
                      </span>
                    </InputFileBox>
                    {filter !== 'npc' && (
                      <InputBox>
                        <Input
                          name="comments"
                          icon={FiMessageSquare}
                          mask=""
                          placeholder="Motivo da Atualização"
                          readOnly={uploading}
                        />
                      </InputBox>
                    )}

                    <ButtonBox>
                      <Button
                        type="submit"
                        loading={uploading}
                        loadingMessage="Enviando Arquivo..."
                      >
                        Confirmar Alterações
                      </Button>
                    </ButtonBox>
                  </Form>
                </CharacterFormContainer>
              </>
            )}
          </>
        )}
      </Content>
    </Container>
  );
};

export default CharacterUpdate;
