/* eslint-disable camelcase */
import React, { useState, useCallback, useEffect, ChangeEvent } from 'react';
import { FiUpload } from 'react-icons/fi';
import { Form } from '@unform/web';
import { format } from 'date-fns';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useHistory } from 'react-router-dom';
import api from '../../services/api';

import {
  Container,
  TitleBox,
  Select,
  Content,
  CharCardContainer,
  CharacterFormContainer,
  InputFileBox,
  ButtonBox,
} from './styles';
import Header from '../../components/Header';

import Button from '../../components/Button';

import Loading from '../../components/Loading';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import CharacterCard from '../../components/CharacterCard';
import ICharacter from '../../components/CharacterList/ICharacter';

interface IPlayer {
  id: string;
  name: string;
}

const AddCharacter: React.FC = () => {
  const [playerList, setPlayerList] = useState<IPlayer[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<IPlayer>();
  const [savedChar, setSavedChar] = useState<ICharacter>({
    id: '',
    name: 'Personagem',
    clan: 'Clã',
    avatar_url: '',
    updated_at: new Date(Date.now()),
    character_url: '',
    situation: 'active',
    experience: '0',
  });
  const [charSheet, setCharSheet] = useState<File>();
  const { addToast } = useToast();
  const { signOut } = useAuth();
  const history = useHistory();
  const [isBusy, setBusy] = useState(true);
  const [uploading, setUploading] = useState(false);

  const loadPlayers = useCallback(async () => {
    setBusy(true);

    try {
      await api.get('users/list').then(response => {
        const res = response.data;
        const newArray = res.map((user: IPlayer) => {
          const newUser = {
            id: user.id,
            name: user.name,
          };
          return newUser;
        });

        setPlayerList(newArray);
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
            title: 'Erro ao tentar listar jogadores',
            description: `Erro: '${message}'`,
          });
        }
      }
    }
    setBusy(false);
  }, [addToast, signOut]);

  const handleAddSheet = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const file = e.target.files[0];
        setCharSheet(file);
      }
    },
    [],
  );

  const handleSubmit = useCallback(async () => {
    try {
      if (!charSheet) {
        addToast({
          type: 'error',
          title: 'Ficha não selecionada',
          description: 'Selecione uma Ficha de Personagem e tente novamente.',
        });

        return;
      }

      if (selectedPlayer === undefined) {
        addToast({
          type: 'error',
          title: 'Jogador não selecionado',
          description: 'Selecione um Jogador e tente novamente.',
        });

        return;
      }

      const formData = new FormData();
      formData.append('player_id', selectedPlayer.id);
      formData.append('sheet', charSheet);

      setUploading(true);

      await api.post('/character/add', formData).then(response => {
        const justSavedChar: ICharacter = response.data;

        justSavedChar.formatedDate = format(
          new Date(justSavedChar.updated_at),
          'dd/MM/yyyy',
        );

        setSavedChar(justSavedChar);
      });

      addToast({
        type: 'success',
        title: 'Personagem Adicionado!',
        description: 'Personagem adicionado com sucesso!',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro na atualização',
        description: err.response.data.message
          ? err.response.data.message
          : 'Erro ao adicionar o personagem, tente novamente.',
      });
    }
    setUploading(false);
  }, [charSheet, selectedPlayer, addToast]);

  const handlePlayerChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const selIndex = event.target.selectedIndex;

      let selPlayer: IPlayer | undefined;
      if (selIndex > 0) {
        selPlayer = playerList[selIndex - 1];
      } else {
        selPlayer = undefined;
      }

      setSelectedPlayer(selPlayer);
    },
    [playerList],
  );

  const handleGoBack = useCallback(() => {
    history.goBack();
  }, [history]);

  useEffect(() => {
    loadPlayers();
  }, [loadPlayers]);

  return (
    <Container>
      <Header page="addchar" />

      <TitleBox>
        {playerList.length > 0 ? (
          <>
            <strong>Selecione o Jogador do novo personagem:</strong>

            {savedChar.id === '' ? (
              <Select
                name="player"
                id="player"
                value={selectedPlayer ? selectedPlayer.name : undefined}
                defaultValue={selectedPlayer ? selectedPlayer.name : undefined}
                onChange={handlePlayerChange}
              >
                <option value="">Selecione um jogador:</option>
                {playerList.map(player => (
                  <option key={player.id} value={player.name}>
                    {player.name}
                  </option>
                ))}
              </Select>
            ) : (
              <span>{selectedPlayer?.name}</span>
            )}
          </>
        ) : (
          <strong>Não foi encontrado nenhum jogador de dados.</strong>
        )}
      </TitleBox>
      <Content>
        {isBusy ? (
          <Loading />
        ) : (
          <>
            <CharCardContainer>
              <CharacterCard
                charId={savedChar.id}
                name={savedChar.name}
                experience={savedChar.experience}
                sheetFile={savedChar.character_url}
                clan={savedChar.clan}
                avatar={savedChar.avatar_url}
                updatedAt={savedChar.formatedDate ? savedChar.formatedDate : ''}
                locked
              />
            </CharCardContainer>
            <CharacterFormContainer>
              <div>
                <h1>{savedChar.name}</h1>
                <h1>{savedChar.clan}</h1>
              </div>
              <div>
                <strong>Experiêcia disponível:</strong>
                <span>{savedChar.experience}</span>
              </div>
              <div>
                <strong>Jogador:</strong>
                <span>{selectedPlayer?.name}</span>
              </div>
              <Form onSubmit={handleSubmit}>
                <div>
                  <h1>Entre com os novos dados do Personagem:</h1>
                </div>
                <InputFileBox>
                  <label htmlFor="sheet">
                    <FiUpload />
                    Selecionar a ficha em .pdf...
                    <input
                      type="file"
                      name=""
                      id="sheet"
                      onChange={handleAddSheet}
                      readOnly={uploading}
                    />
                  </label>
                  <strong>Arquivo:</strong>
                  <span>{charSheet ? `"${charSheet.name}"` : 'Nenhum'}</span>
                </InputFileBox>

                <ButtonBox>
                  {savedChar.id === '' ? (
                    <Button
                      type="submit"
                      loading={uploading}
                      loadingMessage="Enviando Arquivo..."
                    >
                      Confirmar Inclusão
                    </Button>
                  ) : (
                    <Button type="button" onClick={handleGoBack}>
                      Voltar
                    </Button>
                  )}
                </ButtonBox>
              </Form>
            </CharacterFormContainer>
          </>
        )}
      </Content>
    </Container>
  );
};

export default AddCharacter;
