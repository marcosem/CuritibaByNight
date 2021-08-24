/* eslint-disable camelcase */
import React, {
  useState,
  useCallback,
  useEffect,
  ChangeEvent,
  useRef,
} from 'react';
import { format } from 'date-fns';
import {
  FaHandRock,
  FaHandPaper,
  FaHandScissors,
  FaBomb,
  FaTimes,
  FaSmile,
  FaDizzy,
} from 'react-icons/fa';
import api from '../../services/api';

import {
  Container,
  TitleBox,
  SelectCharacter,
  SelectOption,
  Content,
  CardsContent,
  CharCardContainer,
  ConnectionStatus,
  ChallangeArena,
  ArenaContainer,
  JanKenPoContainer,
  JanKenPoButton,
  ButtonBox,
  TitleContainerMobile,
  SelectorContainerMobile,
  CardContainerMobile,
  CharCardContainerMobile,
  ChallangeArenaMobile,
  JanKenPoContainerMobile,
} from './styles';
import CharacterCard from '../../components/CharacterCard';
import Button from '../../components/Button';
import ICharacter from '../../components/CharacterList/ICharacter';

import { useAuth } from '../../hooks/auth';
import { useMobile } from '../../hooks/mobile';
import { useToast } from '../../hooks/toast';
import { useSocket } from '../../hooks/socket';
import { useHeader } from '../../hooks/header';

interface IOnLineUser {
  user_id: string;
  char_id: string;
}

const Challenges: React.FC = () => {
  const { user, signOut, char } = useAuth();
  const [myChar, setMyChar] = useState<ICharacter>();
  const [opponentChar, setOpponentChar] = useState<ICharacter>();
  const [charList, setCharList] = useState<ICharacter[]>([]);
  const charListRef = useRef<ICharacter[]>([]);
  const [opponentList, setOpponentList] = useState<ICharacter[]>([]);
  const [selectedPo, setSelectedPo] = useState<string>('');
  const [myPo, setMyPo] = useState<string>('');
  const [selOpponentPo, setSelOpponentPo] = useState<string>('');
  const [char1Result, setChar1Result] = useState<number>(-2);
  const [char2Result, setChar2Result] = useState<number>(-2);
  const [mode, setMode] = useState<string>('initial');
  const [title, setTitle] = useState<string>('');
  const { addToast } = useToast();
  const { isMobileVersion } = useMobile();
  const { setCurrentPage } = useHeader();
  const [play, setPlay] = useState<boolean>(false);
  const char1Id = useRef<string>('');
  const char2Id = useRef<string>('');
  const [retestMode, setRetestMode] = useState<boolean>(false);
  const {
    onLineUsers,
    challengeOpponent,
    challengeReady,
    challengeResult,
    challengeDoRetest,
    challengeSelect,
    challengeCancel,
    clearChallengeOpponent,
    clearChallengeDoRetest,
    challengePlay,
    clearChallengeReady,
    clearChallengeResult,
    challengeRetest,
    enterChallengeMode,
  } = useSocket();

  const isCharOnline = useCallback(
    (char_id: string, isNPC = false) => {
      if (isNPC) return true;

      if (char_id.indexOf('Storyteller') >= 0) return true;

      if (
        onLineUsers
          .map((connUser: IOnLineUser) => connUser.char_id)
          .indexOf(char_id) >= 0
      )
        return true;

      return false;
    },
    [onLineUsers],
  );

  const loadCharacters = useCallback(async () => {
    try {
      await api.get('characters/list/all').then(response => {
        const res = response.data;
        const fullList: ICharacter[] = res;

        let filteredList = fullList.filter(
          ch => ch.situation === 'active' || ch.situation === 'torpor',
        );
        const stNames = user.name.split(' ');
        const firsNameIndex = 0;
        const stName = stNames[firsNameIndex];

        const stStaticChar: ICharacter = {
          id: `Storyteller-${user.id}`,
          name: stName,
          clan: 'Curitiba By Night',
          creature_type: '',
          sect: '',
          title: 'Narrador',
          coterie: '',
          avatar_url: user.avatar_url,
          experience: '',
          experience_total: '',
          updated_at: new Date(),
          character_url: '',
          situation: 'active',
          npc: true,
          retainer_level: '0',
          user: {
            id: user.id,
            name: user.name,
          },
        };

        filteredList = [stStaticChar, ...filteredList];

        const filteredPCs = filteredList.filter(
          ch => !ch.npc && ch.situation === 'active',
        );

        setCharList(filteredList);
        setOpponentList(filteredPCs);
        charListRef.current = filteredList;
      });
    } catch (error) {
      if (error.response) {
        const { message } = error.response.data;

        if (message?.indexOf('token') > 0 && error.response.status === 401) {
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
  }, [addToast, signOut, user.avatar_url, user.id, user.name]);

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
        char1Id.current = loadedChar.id;
      });
    } catch (error) {
      if (error.response) {
        const { message } = error.response.data;

        if (message?.indexOf('token') > 0 && error.response.status === 401) {
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
        setMyPo('');
      } else {
        setSelectedPo(po);
        setMyPo(po);
      }
    },
    [selectedPo],
  );

  const HandleSendPo = useCallback(() => {
    setChar1Result(0);

    if (selectedPo !== undefined && myChar) {
      challengePlay(myChar.id, selectedPo);
    }

    setMode('ready');
  }, [challengePlay, myChar, selectedPo]);

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

  const SelectCharById = useCallback((id, myList) => {
    let selectedCharacter: ICharacter | undefined;

    if (id !== '') {
      const selChar = myList.find(
        (character: ICharacter) => character.id === id,
      );

      if (selChar) {
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

        selectedCharacter = selChar;
      } else {
        selectedCharacter = undefined;
      }
    } else {
      selectedCharacter = undefined;
    }

    return selectedCharacter;
  }, []);

  const handleCharacter1Change = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const selId = event.target.item(event.target.selectedIndex)?.id;

      const selectedCharacter: ICharacter | undefined = SelectCharById(
        selId,
        charList,
      );

      if (selectedCharacter !== undefined) {
        setMyChar(selectedCharacter);
        char1Id.current = selectedCharacter.id;
      } else {
        setMyChar({
          id: '',
          name: 'Desconhecido',
          clan: 'Desconhecido',
          creature_type: 'Vampire',
          sect: '',
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
        char1Id.current = '';
      }
    },
    [SelectCharById, charList],
  );

  const handleCharacter2Change = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const selId = event.target.item(event.target.selectedIndex)?.id;

      const selectedCharacter: ICharacter | undefined = SelectCharById(
        selId,
        opponentList,
      );

      if (selectedCharacter !== undefined) {
        setOpponentChar(selectedCharacter);
        char2Id.current = selectedCharacter.id;
      } else {
        setOpponentChar({
          id: '',
          name: 'Desconhecido',
          clan: 'Desconhecido',
          creature_type: 'Vampire',
          sect: '',
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

        char2Id.current = '';
      }
    },
    [SelectCharById, opponentList],
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

  const handleInitChallangeButton = useCallback(() => {
    if (myChar?.id === opponentChar?.id) {
      addToast({
        type: 'error',
        title: 'Disputa inválida',
        description: 'Um personagem não pode disputar contra ele mesmo!',
      });

      return;
    }

    if (opponentChar?.id === char.id) {
      addToast({
        type: 'error',
        title: 'Disputa inválida',
        description: 'Você não pode disputar contra o próprio personagem!',
      });

      return;
    }

    if (opponentChar) {
      if (!isCharOnline(opponentChar.id, opponentChar.npc)) {
        addToast({
          type: 'error',
          title: 'Personagem Desconectado',
          description: `O pesonagem [${opponentChar.name}] está desconectado!`,
        });

        return;
      }
    }

    if (myChar) {
      if (!isCharOnline(myChar.id, myChar.npc)) {
        addToast({
          type: 'error',
          title: 'Personagem Desconectado',
          description: `O pesonagem [${myChar.name}] está desconectado!`,
        });

        return;
      }
    }

    setRetestMode(false);

    if (myChar && opponentChar) {
      challengeSelect(myChar, opponentChar);
    }

    setMode('battle');
  }, [addToast, challengeSelect, char.id, isCharOnline, myChar, opponentChar]);

  const handleRetestButton = useCallback(() => {
    if (opponentChar) {
      if (!isCharOnline(opponentChar.id, opponentChar.npc)) {
        addToast({
          type: 'error',
          title: 'Personagem Desconectado',
          description: `O pesonagem [${opponentChar.name}] está desconectado!`,
        });

        return;
      }
    }

    if (myChar) {
      if (!isCharOnline(myChar.id, myChar.npc)) {
        addToast({
          type: 'error',
          title: 'Personagem Desconectado',
          description: `O pesonagem [${myChar.name}] está desconectado!`,
        });

        return;
      }
    }

    if (myChar && opponentChar) {
      challengeRetest(myChar, opponentChar);
    }

    setRetestMode(true);
    setSelectedPo('');
    setMyPo('');
    setSelOpponentPo('');
    setChar1Result(-5);
    setChar2Result(-5);
    setPlay(false);
    setMode('battle');
  }, [addToast, challengeRetest, isCharOnline, myChar, opponentChar]);

  const handleCancelChallangeButton = useCallback(() => {
    if (myChar && opponentChar) {
      challengeCancel(myChar, opponentChar);
    }

    setRetestMode(false);

    setSelectedPo('');
    setMyPo('');
    setSelOpponentPo('');
    setChar1Result(-5);
    setChar2Result(-5);
    setPlay(false);
    setMode('initial');
  }, [challengeCancel, myChar, opponentChar]);

  useEffect(() => {
    setOpponentChar({
      id: '',
      name: 'Desconhecido',
      clan: 'Desconhecido',
      creature_type: 'Vampire',
      sect: '',
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

    char2Id.current = '';

    if (user.storyteller) {
      setMyChar({
        id: '',
        name: 'Desconhecido',
        clan: 'Desconhecido',
        creature_type: 'Vampire',
        sect: '',
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
      char1Id.current = '';

      loadCharacters();
    } else {
      loadMyChar();
    }
  }, [loadCharacters, loadMyChar, user.storyteller]);

  const clearMyChallenge = useCallback(() => {
    setSelectedPo('');
    setMyPo('');
    setSelOpponentPo('');
    setChar1Result(-5);
    setChar2Result(-5);
    setPlay(false);
    setRetestMode(false);
    setMode('initial');

    setOpponentChar({
      id: '',
      name: 'Desconhecido',
      clan: 'Desconhecido',
      creature_type: 'Vampire',
      sect: '',
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

    char2Id.current = '';
  }, []);

  useEffect(() => {
    if (challengeOpponent.id && myChar) {
      if (challengeOpponent.id !== opponentChar?.id) {
        if (!user.storyteller) {
          clearMyChallenge();
        }
      }

      if (challengeOpponent.id === 'restart') {
        clearChallengeOpponent();
      } else if (
        challengeOpponent.id !== myChar.id &&
        challengeOpponent.id !== opponentChar?.id
      ) {
        const opponent = challengeOpponent;

        setOpponentChar({
          id: opponent.id,
          name: opponent.name,
          clan: opponent.clan,
          creature_type: opponent.creature_type,
          sect: opponent.sect,
          title: opponent.title,
          coterie: opponent.coterie,
          avatar_url: opponent.avatar_url,
          experience: '',
          experience_total: '',
          updated_at: opponent.updated_at,
          character_url: '',
          situation: 'active',
          npc: opponent.npc,
          retainer_level: opponent.retainer_level,
          formatedDate: format(new Date(opponent.updated_at), 'dd/MM/yyyy'),
        });

        char2Id.current = opponent.id;

        clearChallengeOpponent();

        setMode('battle');
      }
    }
  }, [
    challengeOpponent,
    clearChallengeOpponent,
    clearMyChallenge,
    myChar,
    opponentChar,
    user.storyteller,
  ]);

  useEffect(() => {
    // Challenge Ready
    if (challengeReady !== '') {
      const ready = challengeReady;
      clearChallengeReady();

      if (ready === '1') {
        setSelectedPo('rock');
        setChar1Result(0);
      } else {
        setSelOpponentPo('rock');
        setChar2Result(0);
      }
    }
  }, [challengeReady, clearChallengeReady]);

  useEffect(() => {
    // Reset Challenge
    if (challengeDoRetest) {
      clearChallengeDoRetest();

      setSelectedPo('');
      setMyPo('');
      setSelOpponentPo('');
      setChar1Result(-5);
      setChar2Result(-5);
      setPlay(false);
      setRetestMode(true);

      if (mode !== 'battle') {
        addToast({
          type: 'info',
          title: 'Reteste Requisitado',
          description: 'Novo teste requisitado pelo narrador ou seu oponente.',
        });
      }

      setMode('battle');
    }
  }, [addToast, challengeDoRetest, clearChallengeDoRetest, mode]);

  useEffect(() => {
    // Challenge Result
    if (challengeResult.result) {
      const matchResult = challengeResult.result;
      const char1Res = challengeResult.char1_jkp;
      const char2Res = challengeResult.char2_jkp;

      clearChallengeResult();

      setMode('resolving');
      setSelectedPo('rock');
      setPlay(true);

      setTimeout(() => {
        if (matchResult === '1' || matchResult === 'win') {
          setChar1Result(1);
          setChar2Result(-1);
        } else if (matchResult === '2' || matchResult === 'lose') {
          setChar1Result(-1);
          setChar2Result(1);
        }

        if (matchResult.length > 1) {
          setMode(matchResult);

          if (matchResult === 'win') {
            addToast({
              type: 'success',
              title: 'Disputa vencida!',
              description: 'Você ganhou a aposta!',
            });
          } else if (matchResult === 'lose') {
            addToast({
              type: 'error',
              title: 'Disputa perdida!',
              description: 'Você perdeu a aposta!',
            });
          } else if (matchResult === 'tie') {
            addToast({
              type: 'info',
              title: 'Disputa empatada!',
              description: 'A aposta foi empatada!',
            });
          }
        } else {
          setMode('resolved');
        }

        setSelectedPo(char1Res);
        setSelOpponentPo(char2Res);
      }, 2200);
    }
  }, [
    addToast,
    challengeResult.char1_jkp,
    challengeResult.char2_jkp,
    challengeResult.result,
    clearChallengeResult,
  ]);

  useEffect(() => {
    if (mode === 'battle') {
      if (myChar?.id === char.id || (myChar?.npc && user.storyteller)) {
        setTitle('Escolha seu Jan-Ken-Po');
      } else {
        setTitle('Aguardando os desafiantes...');
      }
    } else if (mode === 'ready') {
      setTitle('Aguardando oponente...');
    } else if (mode === 'resolving') {
      setTitle('Resolvendo a disputa...');
    } else if (mode === 'win') {
      setTitle('Você Venceu!');
    } else if (mode === 'lose') {
      setTitle('Você Perdeu!');
    } else if (mode === 'tie') {
      setTitle('Disputa Empatada!');
    } else if (mode === 'resolved') {
      setTitle('Disputa Resolvida!');
    } else if (user.storyteller) {
      if (mode === 'initial') {
        if (myChar?.id !== '' && opponentChar?.id !== '') {
          setTitle('Inicie o Desafio');
        } else {
          setTitle('Selecione os Oponentes');
        }
      }
    } else if (mode === 'initial') {
      setTitle('Aguardando Desafio...');
    }
  }, [addToast, char.id, mode, myChar, opponentChar, user.storyteller]);

  useEffect(() => {
    setCurrentPage('challenge');
    enterChallengeMode(true);

    return () => {
      enterChallengeMode(false);
      if (user.storyteller) challengeCancel();
    };
  }, [challengeCancel, enterChallengeMode, setCurrentPage, user.storyteller]);

  return (
    <Container isMobile={isMobileVersion}>
      {isMobileVersion ? (
        <>
          <TitleBox>
            <strong>Modo de Desafio</strong>
          </TitleBox>

          <Content isMobile={isMobileVersion}>
            <TitleContainerMobile>
              <h1>{title}</h1>
            </TitleContainerMobile>
            {user.storyteller && mode === 'initial' && (
              <SelectorContainerMobile>
                <SelectCharacter
                  name="character1"
                  id="character1"
                  value={myChar && myChar.id !== '' ? myChar.name : undefined}
                  onChange={handleCharacter1Change}
                >
                  <SelectOption value="">Selecione um Personagem:</SelectOption>
                  {charList
                    .filter(charFilter =>
                      isCharOnline(charFilter.id, charFilter.npc),
                    )
                    .map(character => (
                      <SelectOption
                        key={`1${character.id}`}
                        id={character.id}
                        value={character.name}
                        isConnected
                      >
                        {character.name}
                      </SelectOption>
                    ))}

                  {charList
                    .filter(
                      charFilter =>
                        !isCharOnline(charFilter.id, charFilter.npc),
                    )
                    .map(character => (
                      <SelectOption
                        key={`1${character.id}`}
                        id={character.id}
                        value={character.name}
                      >
                        {character.name}
                      </SelectOption>
                    ))}
                </SelectCharacter>
              </SelectorContainerMobile>
            )}

            {myChar !== undefined && opponentChar !== undefined && (
              <CardContainerMobile>
                <CharCardContainerMobile position="left">
                  <CharacterCard
                    charId={myChar.id}
                    name={myChar.name}
                    experience={myChar.experience}
                    sheetFile={myChar.character_url}
                    clan={myChar.clan}
                    creature_type={myChar.creature_type}
                    sect={myChar.sect}
                    title={myChar.title}
                    coterie={myChar.coterie}
                    avatar={myChar.avatar_url}
                    updatedAt={myChar.formatedDate ? myChar.formatedDate : ''}
                    npc={myChar.npc && myChar.id.indexOf('Storyteller') === -1}
                    regnant={
                      myChar.regnant_char ? myChar.regnant_char.name : ''
                    }
                    situation={myChar.situation}
                    locked
                    readOnly={
                      myChar.id === '' || myChar.id.indexOf('Storyteller') >= 0
                    }
                  />

                  {user.storyteller && (
                    <ConnectionStatus
                      connected={isCharOnline(myChar.id, myChar.npc)}
                      title={
                        isCharOnline(myChar.id, myChar.npc)
                          ? 'Online'
                          : 'Offline'
                      }
                    >
                      {isCharOnline(myChar.id, myChar.npc) ? (
                        <FaSmile />
                      ) : (
                        <FaDizzy />
                      )}
                    </ConnectionStatus>
                  )}
                </CharCardContainerMobile>
                <JanKenPoContainerMobile vertical>
                  {showOptions() && (
                    <>
                      <JanKenPoButton
                        isMobile={isMobileVersion}
                        title="Pedra"
                        onClick={() => HandleSelectPo('rock')}
                        victory={myPo === 'rock' ? 1 : -5}
                        disabled={mode !== 'battle'}
                      >
                        <FaHandRock />
                      </JanKenPoButton>
                      <JanKenPoButton
                        isMobile={isMobileVersion}
                        title="Papel"
                        onClick={() => HandleSelectPo('paper')}
                        victory={myPo === 'paper' ? 1 : -5}
                        disabled={mode !== 'battle'}
                      >
                        <FaHandPaper />
                      </JanKenPoButton>
                      <JanKenPoButton
                        isMobile={isMobileVersion}
                        title="Tesoura"
                        onClick={() => HandleSelectPo('scissors')}
                        victory={myPo === 'scissors' ? 1 : -5}
                        disabled={mode !== 'battle'}
                      >
                        <FaHandScissors />
                      </JanKenPoButton>
                      <JanKenPoButton
                        isMobile={isMobileVersion}
                        title="Bomba"
                        onClick={() => HandleSelectPo('bomb')}
                        disabled={mode !== 'battle'}
                        victory={myPo === 'bomb' ? 1 : -5}
                      >
                        <FaBomb />
                      </JanKenPoButton>
                    </>
                  )}
                </JanKenPoContainerMobile>
              </CardContainerMobile>
            )}

            <ChallangeArenaMobile>
              <JanKenPoContainerMobile />
              <JanKenPoContainerMobile>
                {selectedPo !== '' && (
                  <JanKenPoButton
                    isMobile={isMobileVersion}
                    title="Confirmar jogada!"
                    onClick={HandleSendPo}
                    disabled={mode !== 'battle'}
                    readyToPlay={play}
                    victory={char1Result}
                  >
                    {SwitchJanKenPo(selectedPo)}
                  </JanKenPoButton>
                )}
              </JanKenPoContainerMobile>
              <JanKenPoContainerMobile animateMe={play}>
                {selectedPo !== '' && selOpponentPo !== '' && <FaTimes />}
              </JanKenPoContainerMobile>
              <JanKenPoContainerMobile>
                {selOpponentPo !== '' && (
                  <JanKenPoButton
                    isMobile={isMobileVersion}
                    title="Confirmar jogada!"
                    onClick={undefined}
                    disabled
                    readyToPlay={play}
                    victory={char2Result}
                  >
                    {SwitchJanKenPo(selOpponentPo)}
                  </JanKenPoButton>
                )}
              </JanKenPoContainerMobile>
              <JanKenPoContainerMobile />
            </ChallangeArenaMobile>

            {user.storyteller && mode === 'initial' && (
              <SelectorContainerMobile>
                <SelectCharacter
                  name="character2"
                  id="character2"
                  value={
                    opponentChar && opponentChar.id !== ''
                      ? opponentChar.name
                      : undefined
                  }
                  onChange={handleCharacter2Change}
                >
                  <SelectOption value="">Selecione um Personagem:</SelectOption>
                  {opponentList
                    .filter(charFilter =>
                      isCharOnline(charFilter.id, charFilter.npc),
                    )
                    .map(character => (
                      <SelectOption
                        key={`1${character.id}`}
                        id={character.id}
                        value={character.name}
                        isConnected
                      >
                        {character.name}
                      </SelectOption>
                    ))}

                  {opponentList
                    .filter(
                      charFilter =>
                        !isCharOnline(charFilter.id, charFilter.npc),
                    )
                    .map(character => (
                      <SelectOption
                        key={`1${character.id}`}
                        id={character.id}
                        value={character.name}
                      >
                        {character.name}
                      </SelectOption>
                    ))}
                </SelectCharacter>
              </SelectorContainerMobile>
            )}

            {myChar !== undefined && opponentChar !== undefined && (
              <CardContainerMobile>
                <CharCardContainerMobile position="right">
                  <CharacterCard
                    charId={opponentChar.id}
                    name={opponentChar.name}
                    experience={opponentChar.experience}
                    sheetFile={opponentChar.character_url}
                    clan={opponentChar.clan}
                    creature_type={opponentChar.creature_type}
                    sect={opponentChar.sect}
                    title={opponentChar.title}
                    coterie={opponentChar.coterie}
                    avatar={opponentChar.avatar_url}
                    updatedAt={
                      opponentChar.formatedDate ? opponentChar.formatedDate : ''
                    }
                    npc={opponentChar.npc}
                    regnant={
                      opponentChar.regnant_char
                        ? opponentChar.regnant_char.name
                        : ''
                    }
                    situation={opponentChar.situation}
                    locked
                    readOnly={!user.storyteller || opponentChar.id === ''}
                  />
                  {user.storyteller && (
                    <ConnectionStatus
                      connected={isCharOnline(
                        opponentChar.id,
                        opponentChar.npc,
                      )}
                      title={
                        isCharOnline(opponentChar.id, opponentChar.npc)
                          ? 'Online'
                          : 'Offline'
                      }
                    >
                      {isCharOnline(opponentChar.id, opponentChar.npc) ? (
                        <FaSmile />
                      ) : (
                        <FaDizzy />
                      )}
                    </ConnectionStatus>
                  )}
                </CharCardContainerMobile>
              </CardContainerMobile>
            )}
            {mode === 'initial' &&
              myChar?.id !== '' &&
              opponentChar?.id !== '' && (
                <ButtonBox isMobile={isMobileVersion}>
                  <Button onClick={handleInitChallangeButton}>
                    Iniciar Desafio
                  </Button>
                </ButtonBox>
              )}
            {mode === 'battle' && user.storyteller && (
              <ButtonBox isMobile={isMobileVersion}>
                <Button onClick={handleCancelChallangeButton}>
                  Cancelar Desafio
                </Button>
              </ButtonBox>
            )}
            {mode !== 'initial' && mode !== 'battle' && user.storyteller && (
              <ButtonBox isMobile={isMobileVersion}>
                <Button onClick={handleRetestButton}>Retestar</Button>

                <Button onClick={handleCancelChallangeButton}>
                  Reiniciar Desafio
                </Button>
              </ButtonBox>
            )}
          </Content>
        </>
      ) : (
        <>
          <TitleBox>
            {user.storyteller && mode === 'initial' ? (
              <>
                <SelectCharacter
                  name="character1"
                  id="character1"
                  value={myChar && myChar.id !== '' ? myChar.name : undefined}
                  onChange={handleCharacter1Change}
                >
                  <SelectOption value="">Selecione um Personagem:</SelectOption>
                  {charList
                    .filter(charFilter =>
                      isCharOnline(charFilter.id, charFilter.npc),
                    )
                    .map(character => (
                      <SelectOption
                        key={`1${character.id}`}
                        id={character.id}
                        value={character.name}
                        isConnected
                      >
                        {character.name}
                      </SelectOption>
                    ))}

                  {charList
                    .filter(
                      charFilter =>
                        !isCharOnline(charFilter.id, charFilter.npc),
                    )
                    .map(character => (
                      <SelectOption
                        key={`1${character.id}`}
                        id={character.id}
                        value={character.name}
                      >
                        {character.name}
                      </SelectOption>
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
                  onChange={handleCharacter2Change}
                >
                  <SelectOption value="">Selecione um Personagem:</SelectOption>
                  {opponentList
                    .filter(charFilter =>
                      isCharOnline(charFilter.id, charFilter.npc),
                    )
                    .map(character => (
                      <SelectOption
                        key={`1${character.id}`}
                        id={character.id}
                        value={character.name}
                        isConnected
                      >
                        {character.name}
                      </SelectOption>
                    ))}

                  {opponentList
                    .filter(
                      charFilter =>
                        !isCharOnline(charFilter.id, charFilter.npc),
                    )
                    .map(character => (
                      <SelectOption
                        key={`1${character.id}`}
                        id={character.id}
                        value={character.name}
                      >
                        {character.name}
                      </SelectOption>
                    ))}
                </SelectCharacter>
              </>
            ) : (
              <strong>Modo de Desafio</strong>
            )}
          </TitleBox>
          {myChar !== undefined && opponentChar !== undefined && (
            <Content isMobile={isMobileVersion}>
              <CardsContent>
                <CharCardContainer>
                  <CharacterCard
                    charId={myChar.id}
                    name={myChar.name}
                    experience={myChar.experience}
                    sheetFile={myChar.character_url}
                    clan={myChar.clan}
                    creature_type={myChar.creature_type}
                    sect={myChar.sect}
                    title={myChar.title}
                    coterie={myChar.coterie}
                    avatar={myChar.avatar_url}
                    updatedAt={myChar.formatedDate ? myChar.formatedDate : ''}
                    npc={myChar.npc && myChar.id.indexOf('Storyteller') === -1}
                    regnant={
                      myChar.regnant_char ? myChar.regnant_char.name : ''
                    }
                    situation={myChar.situation}
                    locked
                    readOnly={
                      myChar.id === '' || myChar.id.indexOf('Storyteller') >= 0
                    }
                  />

                  {user.storyteller && (
                    <ConnectionStatus
                      connected={isCharOnline(myChar.id, myChar.npc)}
                      title={
                        isCharOnline(myChar.id, myChar.npc)
                          ? 'Online'
                          : 'Offline'
                      }
                    >
                      {isCharOnline(myChar.id, myChar.npc) ? (
                        <FaSmile />
                      ) : (
                        <FaDizzy />
                      )}
                    </ConnectionStatus>
                  )}
                </CharCardContainer>
                <ChallangeArena>
                  <div>
                    <h1>{title}</h1>
                  </div>
                  <ArenaContainer>
                    <JanKenPoContainer>
                      {showOptions() && (
                        <>
                          <JanKenPoButton
                            isMobile={isMobileVersion}
                            title="Pedra"
                            onClick={() => HandleSelectPo('rock')}
                            victory={myPo === 'rock' ? 1 : -5}
                            disabled={mode !== 'battle'}
                          >
                            <FaHandRock />
                          </JanKenPoButton>
                          <JanKenPoButton
                            isMobile={isMobileVersion}
                            title="Papel"
                            onClick={() => HandleSelectPo('paper')}
                            victory={myPo === 'paper' ? 1 : -5}
                            disabled={mode !== 'battle'}
                          >
                            <FaHandPaper />
                          </JanKenPoButton>
                          <JanKenPoButton
                            isMobile={isMobileVersion}
                            title="Tesoura"
                            onClick={() => HandleSelectPo('scissors')}
                            victory={myPo === 'scissors' ? 1 : -5}
                            disabled={mode !== 'battle'}
                          >
                            <FaHandScissors />
                          </JanKenPoButton>
                          <JanKenPoButton
                            isMobile={isMobileVersion}
                            title="Bomba"
                            onClick={() => HandleSelectPo('bomb')}
                            disabled={mode !== 'battle'}
                            victory={myPo === 'bomb' ? 1 : -5}
                          >
                            <FaBomb />
                          </JanKenPoButton>
                        </>
                      )}
                    </JanKenPoContainer>
                    <JanKenPoContainer>
                      {selectedPo !== '' && (
                        <JanKenPoButton
                          isMobile={isMobileVersion}
                          title="Confirmar jogada!"
                          onClick={HandleSendPo}
                          disabled={mode !== 'battle'}
                          readyToPlay={play}
                          victory={char1Result}
                        >
                          {SwitchJanKenPo(selectedPo)}
                        </JanKenPoButton>
                      )}
                    </JanKenPoContainer>
                    <JanKenPoContainer animateMe={play}>
                      {selectedPo !== '' && selOpponentPo !== '' && <FaTimes />}
                    </JanKenPoContainer>
                    <JanKenPoContainer>
                      {selOpponentPo !== '' && (
                        <JanKenPoButton
                          isMobile={isMobileVersion}
                          title="Confirmar jogada!"
                          onClick={undefined}
                          disabled
                          readyToPlay={play}
                          victory={char2Result}
                        >
                          {SwitchJanKenPo(selOpponentPo)}
                        </JanKenPoButton>
                      )}
                    </JanKenPoContainer>
                    <JanKenPoContainer />
                  </ArenaContainer>
                </ChallangeArena>
                <CharCardContainer
                  animationMode={
                    mode === 'battle' && !retestMode && showOptions()
                      ? 'in'
                      : ''
                  }
                >
                  <CharacterCard
                    charId={opponentChar.id}
                    name={opponentChar.name}
                    experience={opponentChar.experience}
                    sheetFile={opponentChar.character_url}
                    clan={opponentChar.clan}
                    creature_type={opponentChar.creature_type}
                    sect={opponentChar.sect}
                    title={opponentChar.title}
                    coterie={opponentChar.coterie}
                    avatar={opponentChar.avatar_url}
                    updatedAt={
                      opponentChar.formatedDate ? opponentChar.formatedDate : ''
                    }
                    npc={opponentChar.npc}
                    regnant={
                      opponentChar.regnant_char
                        ? opponentChar.regnant_char.name
                        : ''
                    }
                    situation={opponentChar.situation}
                    locked
                    readOnly={!user.storyteller || opponentChar.id === ''}
                  />
                  {user.storyteller && (
                    <ConnectionStatus
                      connected={isCharOnline(
                        opponentChar.id,
                        opponentChar.npc,
                      )}
                      title={
                        isCharOnline(opponentChar.id, opponentChar.npc)
                          ? 'Online'
                          : 'Offline'
                      }
                    >
                      {isCharOnline(opponentChar.id, opponentChar.npc) ? (
                        <FaSmile />
                      ) : (
                        <FaDizzy />
                      )}
                    </ConnectionStatus>
                  )}
                </CharCardContainer>
              </CardsContent>
              {mode === 'initial' &&
                myChar.id !== '' &&
                opponentChar.id !== '' && (
                  <ButtonBox isMobile={isMobileVersion}>
                    <Button onClick={handleInitChallangeButton}>
                      Iniciar Desafio
                    </Button>
                  </ButtonBox>
                )}
              {mode === 'battle' && user.storyteller && (
                <ButtonBox isMobile={isMobileVersion}>
                  <Button onClick={handleCancelChallangeButton}>
                    Cancelar Desafio
                  </Button>
                </ButtonBox>
              )}
              {mode !== 'initial' && mode !== 'battle' && user.storyteller && (
                <ButtonBox isMobile={isMobileVersion}>
                  <Button onClick={handleRetestButton}>Retestar</Button>

                  <Button onClick={handleCancelChallangeButton}>
                    Reiniciar Desafio
                  </Button>
                </ButtonBox>
              )}
            </Content>
          )}
        </>
      )}
    </Container>
  );
};

export default Challenges;
