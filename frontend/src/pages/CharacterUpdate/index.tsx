/* eslint-disable camelcase */
import React, { useState, useCallback, useEffect, ChangeEvent } from 'react';
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

const CharacterUpdate: React.FC = () => {
  const [charList, setCharList] = useState<ICharacter[]>([]);
  const [selectedChar, setSelectedChar] = useState<ICharacter>();
  const [charSituation, setCharSituation] = useState<ISituation>();
  const [charSheet, setCharSheet] = useState<File>();
  const [lastComment, setLastComment] = useState<string>();
  const { addToast } = useToast();
  const { signOut } = useAuth();
  const [isBusy, setBusy] = useState(true);
  const [uploading, setUploading] = useState(false);

  const loadCharacters = useCallback(async () => {
    setBusy(true && !uploading);

    try {
      await api.get('characters/list').then(response => {
        const res = response.data;

        const fullList: ICharacter[] = res;

        setCharList(fullList);
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
  }, [addToast, signOut, uploading]);

  const handleSubmit = useCallback(
    async ({ comments }) => {
      try {
        if (!charSheet) {
          addToast({
            type: 'error',
            title: 'Ficha não selecionada',
            description: 'Selecione uma Ficha de Personagem e tente novamente.',
          });

          return;
        }

        if (selectedChar === undefined) {
          addToast({
            type: 'error',
            title: 'Personagem não selecionado',
            description: 'Selecione um Personagem e tente novamente.',
          });

          return;
        }

        const formData = new FormData();
        formData.append('character_id', selectedChar.id);
        if (comments) {
          formData.append('comments', comments);
          setLastComment(comments);
        }

        if (
          charSituation?.titleEn !== selectedChar.situation &&
          charSituation !== undefined
        ) {
          formData.append('situation', charSituation.titleEn);
        }

        formData.append('sheet', charSheet);

        setUploading(true);

        await api.patch('/character/update', formData).then(response => {
          const savedChar: ICharacter = response.data;

          savedChar.formatedDate = format(
            new Date(savedChar.updated_at),
            'dd/MM/yyyy',
          );

          setSelectedChar(savedChar);
          loadCharacters();
        });

        addToast({
          type: 'success',
          title: 'Personagem Atualizado!',
          description: 'Personagem atualizado com sucesso!',
        });
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro na atualização',
          description: err.response.data.message
            ? err.response.data.message
            : 'Erro ao atualizar o personagem, tente novamente.',
        });
      }
      setUploading(false);
    },
    [charSheet, selectedChar, charSituation, addToast, loadCharacters],
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
      const charName = selectedChar ? selectedChar.name : '';
      const charSheetName = charSheet ? charSheet.name : '';

      if (charSheetName.indexOf(charName) === -1) {
        confirmAlert({
          title: 'Confirmar atualização',
          message: `O nome do personagem [${charName}] não combina com o nome do arquivo [${charSheetName}], confirma a atualização?`,
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
    [charSheet, handleSubmit, selectedChar],
  );

  const handleCharacterChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const selIndex = event.target.selectedIndex;

      let selectedCharacter: ICharacter | undefined;
      if (selIndex > 0) {
        const selChar = charList[selIndex - 1];
        selChar.formatedDate = format(
          new Date(selChar.updated_at),
          'dd/MM/yyyy',
        );

        let filteredClan: string[];
        if (selChar.clan) {
          filteredClan = selChar.clan.split(' (');
        } else {
          filteredClan = [''];
        }

        const clanIndex = 0;
        selChar.clan = filteredClan[clanIndex];

        selectedCharacter = selChar;
      } else {
        selectedCharacter = undefined;
      }

      setSelectedChar(selectedCharacter);
      setCharSheet(undefined);
    },
    [charList],
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
            <strong>Selecione o Personagem a ser Atualizado:</strong>

            <Select
              name="character"
              id="character"
              value={selectedChar ? selectedChar.name : undefined}
              defaultValue={selectedChar ? selectedChar.name : undefined}
              onChange={handleCharacterChange}
            >
              <option value="">Selecione um personagem:</option>
              {charList.map(character => (
                <option key={character.id} value={character.name}>
                  {character.name}
                </option>
              ))}
            </Select>
          </>
        ) : (
          <strong>
            Não foi encontrado nenhum personagem na base de dados.
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
                    avatar={selectedChar.avatar_url}
                    updatedAt={
                      selectedChar.formatedDate ? selectedChar.formatedDate : ''
                    }
                    locked
                  />
                </CharCardContainer>
                <CharacterFormContainer>
                  <div>
                    <h1>{selectedChar.name}</h1>
                    <h1>{selectedChar.clan}</h1>
                  </div>
                  <div>
                    <strong>Experiêcia disponível:</strong>
                    <span>{selectedChar.experience}</span>
                  </div>
                  <div>
                    <strong>Jogador:</strong>
                    <span>{selectedChar.user?.name}</span>
                  </div>
                  <Form
                    onSubmit={handleConfirm}
                    initialData={{
                      comments: lastComment,
                    }}
                  >
                    <div>
                      <h1>Entre com os novos dados do Personagem:</h1>
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
                    <InputBox>
                      <Input
                        name="comments"
                        icon={FiMessageSquare}
                        mask=""
                        placeholder="Motivo da Atualização"
                        readOnly={uploading}
                      />
                    </InputBox>

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
