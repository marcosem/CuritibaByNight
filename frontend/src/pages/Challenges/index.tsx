import React, { useState, useCallback, useEffect, ChangeEvent } from 'react';
import { format } from 'date-fns';
import {
  FaHandRock,
  FaHandPaper,
  FaHandScissors,
  FaBomb,
  FaTimes,
} from 'react-icons/fa';
import api from '../../services/api';

import {
  Container,
  TitleBox,
  SelectCharacter,
  Content,
  CharCardContainer,
  ChallangeArena,
  ArenaContainer,
  JanKenPoContainer,
  JanKenPoButton,
} from './styles';
import Header from '../../components/Header';
import HeaderMobile from '../../components/HeaderMobile';
import CharacterCard from '../../components/CharacterCard';
import ICharacter from '../../components/CharacterList/ICharacter';

import { useAuth } from '../../hooks/auth';
import { useMobile } from '../../hooks/mobile';
import { useToast } from '../../hooks/toast';

const Challenges: React.FC = () => {
  const { user, signOut, char } = useAuth();
  const [myChar, setMyChar] = useState<ICharacter>();
  const [opponentChar, setOpponentChar] = useState<ICharacter>();
  const [charList, setCharList] = useState<ICharacter[]>([]);
  const [opponentList, setOpponentList] = useState<ICharacter[]>([]);
  const [selectedPo, setSelectedPo] = useState<string>('');
  const [readyToPlay, setReadyToPlay] = useState<boolean>(false);
  const [challengeMode, setChallengeMode] = useState<boolean>(true);
  const { addToast } = useToast();
  const { isMobileVersion } = useMobile();

  const loadCharacters = useCallback(async () => {
    try {
      await api.get('characters/list/all').then(response => {
        const res = response.data;
        const fullList: ICharacter[] = res;

        const filteredList = fullList.filter(ch => ch.situation === 'active');
        const filteredPCs = filteredList.filter(ch => !ch.npc);

        setCharList(filteredList);
        setOpponentList(filteredPCs);
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
  }, [addToast, signOut]);

  const loadMyChar = useCallback(async () => {
    if (char === undefined) {
      return;
    }

    try {
      await api.get(`character/${char.id}`).then(response => {
        const res = response.data;
        const loadedChar: ICharacter = res;

        loadedChar.formatedDate = format(
          new Date(loadedChar.updated_at),
          'dd/MM/yyyy',
        );

        let filteredClan: string[];
        if (loadedChar.clan) {
          filteredClan = loadedChar.clan.split(' (');
          filteredClan = filteredClan[0].split(':');
        } else {
          filteredClan = [''];
        }

        const clanIndex = 0;
        loadedChar.clan = filteredClan[clanIndex];

        setMyChar(loadedChar);
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
        }
      }
    }
  }, [addToast, char, signOut]);

  const HandleSelectPo = useCallback(
    po => {
      if (po === selectedPo) {
        setSelectedPo('');
      } else {
        setSelectedPo(po);
      }
    },
    [selectedPo],
  );

  const HandleSendPo = useCallback(() => {
    setReadyToPlay(true);
  }, []);

  const SwitchJanKenPo = useCallback(po => {
    switch (po) {
      case 'rock':
        return <FaHandRock />;
      case 'paper':
        return <FaHandPaper />;
      case 'scissors':
        return <FaHandScissors />;
      case 'bomb':
        return <FaBomb />;
      default:
    }
    return <></>;
  }, []);

  const SelectCharByIndex = useCallback((index, myList) => {
    let selectedCharacter: ICharacter | undefined;
    if (index > 0) {
      const selChar = myList[index - 1];
      selChar.formatedDate = format(new Date(selChar.updated_at), 'dd/MM/yyyy');

      let filteredClan: string[];
      if (selChar.clan) {
        filteredClan = selChar.clan.split(' (');
        filteredClan = filteredClan[0].split(':');
      } else {
        filteredClan = [''];
      }

      const clanIndex = 0;
      selChar.clan = filteredClan[clanIndex];

      selectedCharacter = selChar;
    } else {
      selectedCharacter = undefined;
    }

    return selectedCharacter;
  }, []);

  const handleCharacter1Change = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const selIndex = event.target.selectedIndex;

      const selectedCharacter: ICharacter | undefined = SelectCharByIndex(
        selIndex,
        charList,
      );

      setMyChar(selectedCharacter);
    },
    [SelectCharByIndex, charList],
  );

  const handleCharacter2Change = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const selIndex = event.target.selectedIndex;

      const selectedCharacter: ICharacter | undefined = SelectCharByIndex(
        selIndex,
        opponentList,
      );

      setOpponentChar(selectedCharacter);
    },
    [SelectCharByIndex, opponentList],
  );

  const showOptions = useCallback(() => {
    if (myChar === undefined) {
      return false;
    }

    if (
      (user.storyteller && myChar.npc) ||
      myChar.id === char.id ||
      !user.storyteller
    ) {
      return true;
    }

    return false;
  }, [char.id, myChar, user.storyteller]);

  useEffect(() => {
    setOpponentChar({
      id: '',
      name: 'Desconhecido',
      clan: 'Desconhecido',
      title: '',
      coterie: '',
      avatar_url: '',
      experience: '',
      experience_total: '',
      updated_at: new Date(),
      character_url: '',
      situation: 'active',
      npc: true,
      retainer_level: '0',
      formatedDate: format(new Date(), 'dd/MM/yyyy'),
    });

    if (user.storyteller) {
      setMyChar({
        id: '',
        name: 'Desconhecido',
        clan: 'Desconhecido',
        title: '',
        coterie: '',
        avatar_url: '',
        experience: '',
        experience_total: '',
        updated_at: new Date(),
        character_url: '',
        situation: 'active',
        npc: false,
        retainer_level: '0',
        formatedDate: format(new Date(), 'dd/MM/yyyy'),
      });
      loadCharacters();
    } else {
      loadMyChar();
    }
  }, [char, loadCharacters, loadMyChar, user.storyteller]);

  return (
    <Container>
      {isMobileVersion ? (
        <HeaderMobile page="challenge" />
      ) : (
        <Header page="challenge" />
      )}
      <TitleBox>
        {user.storyteller ? (
          <>
            <SelectCharacter
              name="character1"
              id="character1"
              value={myChar && myChar.id !== '' ? myChar.name : undefined}
              defaultValue={
                myChar && myChar.id !== '' ? myChar.name : undefined
              }
              onChange={handleCharacter1Change}
            >
              <option value="">Selecione um Personagem:</option>
              {charList.map(character => (
                <option key={`1${character.id}`} value={character.name}>
                  {character.name}
                </option>
              ))}
            </SelectCharacter>
            <strong>Modo de Desafio</strong>
            <SelectCharacter
              name="character2"
              id="character2"
              value={
                opponentChar && opponentChar.id !== ''
                  ? opponentChar.name
                  : undefined
              }
              defaultValue={
                opponentChar && opponentChar.id !== ''
                  ? opponentChar.name
                  : undefined
              }
              onChange={handleCharacter2Change}
            >
              <option value="">Selecione um Personagem:</option>
              {opponentList.map(character => (
                <option key={`2${character.id}`} value={character.name}>
                  {character.name}
                </option>
              ))}
            </SelectCharacter>
          </>
        ) : (
          <strong>Modo de Desafio</strong>
        )}
      </TitleBox>
      {myChar !== undefined && opponentChar !== undefined && (
        <Content isMobile={isMobileVersion}>
          <CharCardContainer isMobile={isMobileVersion}>
            <CharacterCard
              charId={myChar.id}
              name={myChar.name}
              experience={myChar.experience}
              sheetFile={myChar.character_url}
              clan={myChar.clan}
              title={myChar.title}
              coterie={myChar.coterie}
              avatar={myChar.avatar_url}
              updatedAt={myChar.formatedDate ? myChar.formatedDate : ''}
              npc={myChar.npc}
              regnant={myChar.regnant_char ? myChar.regnant_char.name : ''}
              locked
            />
          </CharCardContainer>
          <ChallangeArena isMobile={isMobileVersion}>
            {challengeMode ? (
              <>
                <div>
                  <h1>Selecione seu Jan-Ken-Pô</h1>
                </div>
                <ArenaContainer>
                  <JanKenPoContainer>
                    {showOptions() && (
                      <>
                        <JanKenPoButton
                          type="button"
                          title="Pedra"
                          onClick={() => HandleSelectPo('rock')}
                        >
                          <FaHandRock />
                        </JanKenPoButton>
                        <JanKenPoButton
                          type="button"
                          title="Papel"
                          onClick={() => HandleSelectPo('paper')}
                        >
                          <FaHandPaper />
                        </JanKenPoButton>
                        <JanKenPoButton
                          type="button"
                          title="Tesoura"
                          onClick={() => HandleSelectPo('scissors')}
                        >
                          <FaHandScissors />
                        </JanKenPoButton>
                        <JanKenPoButton
                          type="button"
                          title="Bomba"
                          onClick={() => HandleSelectPo('bomb')}
                        >
                          <FaBomb />
                        </JanKenPoButton>
                      </>
                    )}
                  </JanKenPoContainer>
                  <JanKenPoContainer>
                    {selectedPo !== '' && (
                      <JanKenPoButton
                        type="button"
                        title="Confirmar jogada!"
                        onClick={HandleSendPo}
                        disabled={readyToPlay}
                        readyToPlay={readyToPlay}
                        victory={0}
                      >
                        {SwitchJanKenPo(selectedPo)}
                      </JanKenPoButton>
                    )}
                  </JanKenPoContainer>
                  <JanKenPoContainer>
                    {readyToPlay && <FaTimes />}
                  </JanKenPoContainer>
                  <JanKenPoContainer>
                    {selectedPo !== '' && (
                      <JanKenPoButton
                        type="button"
                        title="Confirmar jogada!"
                        onClick={undefined}
                        disabled
                        readyToPlay={readyToPlay}
                        victory={0}
                      >
                        {SwitchJanKenPo('rock')}
                      </JanKenPoButton>
                    )}
                  </JanKenPoContainer>
                  <JanKenPoContainer />
                </ArenaContainer>
              </>
            ) : (
              <div>
                <h1>Aguardando Desafio...</h1>
              </div>
            )}
          </ChallangeArena>
          <CharCardContainer isMobile={isMobileVersion}>
            <CharacterCard
              charId={opponentChar.id}
              name={opponentChar.name}
              experience={opponentChar.experience}
              sheetFile={opponentChar.character_url}
              clan={opponentChar.clan}
              title={opponentChar.title}
              coterie={opponentChar.coterie}
              avatar={opponentChar.avatar_url}
              updatedAt={
                opponentChar.formatedDate ? opponentChar.formatedDate : ''
              }
              npc={opponentChar.npc}
              regnant={
                opponentChar.regnant_char ? opponentChar.regnant_char.name : ''
              }
              locked
              readOnly={!user.storyteller}
            />
          </CharCardContainer>
        </Content>
      )}
    </Container>
  );
};

export default Challenges;
