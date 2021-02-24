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
  FaHandshake,
  FaUnlink,
  FaSmile,
  FaDizzy,
} from 'react-icons/fa';
import api from '../../services/api';

import {
  Container,
  TitleBox,
  SelectCharacter,
  Content,
  CardsContent,
  CharCardContainer,
  ConnectionStatus,
  ChallangeArena,
  ArenaContainer,
  JanKenPoContainer,
  JanKenPoButton,
  ButtonBox,
  ConnectionButton,
  TitleContainerMobile,
  SelectorContainerMobile,
  CardContainerMobile,
  CharCardContainerMobile,
  ChallangeArenaMobile,
  JanKenPoContainerMobile,
} from './styles';
import Header from '../../components/Header';
import HeaderMobile from '../../components/HeaderMobile';
import CharacterCard from '../../components/CharacterCard';
import Button from '../../components/Button';
import ICharacter from '../../components/CharacterList/ICharacter';
import getSocket from '../../utils/getSocket';

import { useAuth } from '../../hooks/auth';
import { useMobile } from '../../hooks/mobile';
import { useToast } from '../../hooks/toast';

interface ISocketMessage {
  type: string;
  user_id?: string;
  token?: string;
  char_id?: string;
  char?: ICharacter;
  play?: string;
  char1_id?: string;
  char2_id?: string;
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
  const connList = useRef<string[]>([]);
  const [socket, setSocket] = useState<WebSocket>(getSocket());
  const [mode, setMode] = useState<string>('initial');
  const [title, setTitle] = useState<string>('');
  const [connected, setConnected] = useState<boolean>(false);
  const { addToast } = useToast();
  const { isMobileVersion } = useMobile();
  const [play, setPlay] = useState<boolean>(false);
  const [changingConState, setChanConState] = useState<boolean>(true);
  const [connStatus1, setConnStatus1] = useState<boolean>(false);
  const [connStatus2, setConnStatus2] = useState<boolean>(false);
  const char1Id = useRef<string>('');
  const char2Id = useRef<string>('');
  const [retestMode, setRetestMode] = useState<boolean>(false);

  const token = useRef<string>(
    api.defaults.headers.Authorization.replace('Bearer ', ''),
  );
  const serverPing = useRef<number>(0);

  const sendSocketMessage = useCallback(
    (msg: ISocketMessage) => {
      if (socket.readyState === socket.OPEN) {
        socket.send(JSON.stringify(msg));
      }
    },
    [socket],
  );

  const startPing = useCallback(() => {
    if (serverPing.current !== 0) return;

    serverPing.current = setTimeout(() => {
      sendSocketMessage({ type: 'ping' });
      serverPing.current = 0;
      startPing();
    }, 20000);
  }, [sendSocketMessage]);

  useEffect(() => {
    if (myChar?.npc || myChar?.id === char.id) {
      setConnStatus1(connected);
    } else {
      setConnStatus1(connList.current.findIndex(ch => ch === myChar?.id) >= 0);
    }

    setConnStatus2(
      connList.current.findIndex(ch => ch === opponentChar?.id) >= 0,
    );
  }, [char.id, connected, myChar, opponentChar]);

  const popupCharacterConnectionStatus = useCallback(
    (charId: string, isConnected: boolean) => {
      const charStatus = charListRef.current.find(ch => ch.id === charId);

      if (charStatus) {
        addToast({
          type: isConnected ? 'success' : 'error',
          title: `Personagem ${isConnected ? 'Conectado' : 'Desconectado'}`,
          description: `[${charStatus.name}] está ${
            isConnected ? 'Online' : 'Offline'
          }`,
        });

        if (charStatus.id === char1Id.current) {
          setConnStatus1(isConnected);
        } else if (charStatus.id === char2Id.current) {
          setConnStatus2(isConnected);
        }
      }
    },
    [addToast],
  );

  const initializeSocket = useCallback(() => {
    // const token = api.defaults.headers.Authorization.replace('Bearer ', '');
    if (socket.readyState === socket.OPEN) {
      sendSocketMessage({
        type: 'auth',
        user_id: user.id,
        token: token.current,
      });

      setConnected(true);
    }

    if (socket.readyState !== socket.CONNECTING) {
      return;
    }

    socket.addEventListener('open', () => {
      addToast({
        type: 'success',
        title: 'Conectado ao Servidor',
        description: 'Você está conectado ao Servidor do Jan-ken-po!',
      });

      sendSocketMessage({
        type: 'auth',
        user_id: user.id,
        token: token.current,
      });

      startPing();

      setConnected(true);
    });

    socket.addEventListener('close', () => {
      addToast({
        type: 'error',
        title: 'Desconectado ao Servidor',
        description: 'Você foi desconectador do Servidor do Jan-ken-po!',
      });

      setConnected(false);
    });

    socket.addEventListener('message', msg => {
      try {
        const parsedMsg = JSON.parse(msg.data);

        if (parsedMsg.error) {
          addToast({
            type: 'error',
            title: 'Erro de Comunicação com servidor',
            description: `Erro: ${parsedMsg.error}`,
          });
        } else if (parsedMsg.message) {
          switch (parsedMsg.message) {
            case 'selected':
              {
                const opponent = parsedMsg.opponentChar;

                if (opponent) {
                  setOpponentChar({
                    id: opponent.id,
                    name: opponent.name,
                    clan: opponent.clan,
                    creature_type: opponent.creture_type,
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
                    formatedDate: format(
                      new Date(opponent.updated_at),
                      'dd/MM/yyyy',
                    ),
                  });

                  char2Id.current = opponent.id;
                }

                addToast({
                  type: 'info',
                  title: 'Hora do Desafio',
                  description: `Oponente selecionado: [${opponent.name}]...`,
                });

                setMode('battle');
              }
              break;

            case 'restart':
              if (!user.storyteller) {
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

                addToast({
                  type: 'info',
                  title: 'Desafio encerrado',
                  description: 'Desafio encerrado pelo narrador.',
                });
              }
              break;

            case 'retest':
              setSelectedPo('');
              setMyPo('');
              setSelOpponentPo('');
              setChar1Result(-5);
              setChar2Result(-5);
              setPlay(false);
              setRetestMode(true);

              addToast({
                type: 'info',
                title: 'Reteste Requisitado',
                description:
                  'Novo teste requisitado pelo narrador ou seu oponente.',
              });

              setMode('battle');
              break;

            case 'connection':
              if (parsedMsg.character) {
                popupCharacterConnectionStatus(
                  parsedMsg.character,
                  parsedMsg.connected,
                );

                if (parsedMsg.connected) {
                  if (
                    connList.current.find(
                      charId => charId === parsedMsg.character,
                    ) === undefined
                  ) {
                    const newList = connList.current;
                    newList.push(parsedMsg.character);
                    connList.current = newList;
                  }
                } else {
                  const tmpConnList = connList.current.filter(
                    charId => charId !== parsedMsg.character,
                  );
                  connList.current = tmpConnList;
                }
              }

              break;

            case 'ready':
              if (parsedMsg.character === '1') {
                setSelectedPo('rock');
                setChar1Result(0);
              } else {
                setSelOpponentPo('rock');
                setChar2Result(0);
              }
              break;

            case 'result':
              {
                const matchResult = parsedMsg.result;
                const char1Res = parsedMsg.char1;
                const char2Res = parsedMsg.char2;

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
              break;

            default:
          }
        }
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Mensagem Inválida',
          description: 'O servidor enviou uma mensagem inválida!',
        });
      }
    });
  }, [
    addToast,
    popupCharacterConnectionStatus,
    sendSocketMessage,
    socket,
    startPing,
    user.id,
    user.storyteller,
  ]);

  useEffect(() => {
    setChanConState(false);
  }, [connected]);

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
          coterie: 'Curitiba By Night',
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

        sendSocketMessage({
          type: 'char',
          char_id: loadedChar.id,
          char: loadedChar,
        });
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
  }, [addToast, char, sendSocketMessage, signOut]);

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

    if (selectedPo !== undefined) {
      sendSocketMessage({ type: 'play', play: selectedPo });
    }

    setMode('ready');
  }, [selectedPo, sendSocketMessage]);

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

      if (selectedCharacter !== undefined) {
        if (selectedCharacter.npc || selectedCharacter.id === char.id) {
          sendSocketMessage({
            type: 'char',
            char_id: selectedCharacter.id,
            char: selectedCharacter,
          });
        } else {
          sendSocketMessage({
            type: 'is_connected',
            char_id: selectedCharacter.id,
          });
        }

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
    [SelectCharByIndex, char.id, charList, sendSocketMessage],
  );

  const handleCharacter2Change = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const selIndex = event.target.selectedIndex;

      const selectedCharacter: ICharacter | undefined = SelectCharByIndex(
        selIndex,
        opponentList,
      );

      if (selectedCharacter !== undefined) {
        setOpponentChar(selectedCharacter);

        char2Id.current = selectedCharacter.id;

        sendSocketMessage({
          type: 'is_connected',
          char_id: selectedCharacter.id,
        });
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
    [SelectCharByIndex, opponentList, sendSocketMessage],
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

    if (connStatus2 === false) {
      addToast({
        type: 'error',
        title: 'Personagem Desconectado',
        description: `O pesonagem [${opponentChar?.name}] está desconectado!`,
      });

      return;
    }

    if (connStatus1 === false) {
      addToast({
        type: 'error',
        title: 'Personagem Desconectado',
        description: `O pesonagem [${opponentChar?.name}] está desconectado!`,
      });

      return;
    }

    setRetestMode(false);

    sendSocketMessage({
      type: 'select',
      char1_id: myChar?.id,
      char2_id: opponentChar?.id,
    });

    setMode('battle');
  }, [
    addToast,
    connStatus1,
    connStatus2,
    myChar,
    opponentChar,
    sendSocketMessage,
  ]);

  const handleRetestButton = useCallback(() => {
    if (connStatus2 === false) {
      addToast({
        type: 'error',
        title: 'Personagem Desconectado',
        description: `O pesonagem [${opponentChar?.name}] está desconectado!`,
      });

      return;
    }

    if (connStatus1 === false) {
      addToast({
        type: 'error',
        title: 'Personagem Desconectado',
        description: `O pesonagem [${opponentChar?.name}] está desconectado!`,
      });

      return;
    }

    sendSocketMessage({
      type: 'retest',
      char1_id: myChar?.id,
      char2_id: opponentChar?.id,
    });

    setRetestMode(true);

    setSelectedPo('');
    setMyPo('');
    setSelOpponentPo('');
    setChar1Result(-5);
    setChar2Result(-5);
    setPlay(false);
    setMode('battle');
  }, [
    addToast,
    connStatus1,
    connStatus2,
    myChar,
    opponentChar,
    sendSocketMessage,
  ]);

  const handleCancelChallangeButton = useCallback(() => {
    sendSocketMessage({
      type: 'cancel',
      char1_id: myChar?.id,
      char2_id: opponentChar?.id,
    });

    setRetestMode(false);

    setSelectedPo('');
    setMyPo('');
    setSelOpponentPo('');
    setChar1Result(-5);
    setChar2Result(-5);
    setPlay(false);
    setMode('initial');
  }, [myChar, opponentChar, sendSocketMessage]);

  const handleConnection = useCallback(() => {
    if (connected) {
      setChanConState(true);
      socket.close();
    } else {
      setSelectedPo('');
      setMyPo('');
      setSelOpponentPo('');
      setChar1Result(-5);
      setChar2Result(-5);
      setPlay(false);
      setMode('initial');

      if (!user.storyteller) {
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

      setChanConState(true);
      setSocket(getSocket());
    }
  }, [connected, socket, user.storyteller]);

  useEffect(() => {
    initializeSocket();
  }, [initializeSocket]);

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
    return () => {
      if (serverPing.current !== 0) {
        clearTimeout(serverPing.current);
      }
      socket.close();
    };
  }, [socket]);

  return (
    <Container>
      {isMobileVersion ? (
        <HeaderMobile page="challenge" />
      ) : (
        <Header page="challenge" />
      )}
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
                  <option value="">Selecione um Personagem:</option>
                  {charList.map(character => (
                    <option key={`1${character.id}`} value={character.name}>
                      {character.name}
                    </option>
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
                      connected={connStatus1}
                      title={connStatus1 ? 'Online' : 'Offline'}
                    >
                      {connStatus1 ? <FaSmile /> : <FaDizzy />}
                    </ConnectionStatus>
                  )}
                </CharCardContainerMobile>
                <JanKenPoContainerMobile vertical>
                  {showOptions() && (
                    <>
                      <JanKenPoButton
                        isMobile={isMobileVersion}
                        type="button"
                        title="Pedra"
                        onClick={() => HandleSelectPo('rock')}
                        victory={myPo === 'rock' ? 1 : -5}
                        disabled={mode !== 'battle'}
                      >
                        <FaHandRock />
                      </JanKenPoButton>
                      <JanKenPoButton
                        isMobile={isMobileVersion}
                        type="button"
                        title="Papel"
                        onClick={() => HandleSelectPo('paper')}
                        victory={myPo === 'paper' ? 1 : -5}
                        disabled={mode !== 'battle'}
                      >
                        <FaHandPaper />
                      </JanKenPoButton>
                      <JanKenPoButton
                        isMobile={isMobileVersion}
                        type="button"
                        title="Tesoura"
                        onClick={() => HandleSelectPo('scissors')}
                        victory={myPo === 'scissors' ? 1 : -5}
                        disabled={mode !== 'battle'}
                      >
                        <FaHandScissors />
                      </JanKenPoButton>
                      <JanKenPoButton
                        isMobile={isMobileVersion}
                        type="button"
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
                    type="button"
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
                    type="button"
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
                  <option value="">Selecione um Personagem:</option>
                  {opponentList.map(character => (
                    <option key={`2${character.id}`} value={character.name}>
                      {character.name}
                    </option>
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
                      connected={connStatus2}
                      title={connStatus2 ? 'Online' : 'Offline'}
                    >
                      {connStatus2 ? <FaSmile /> : <FaDizzy />}
                    </ConnectionStatus>
                  )}
                </CharCardContainerMobile>
              </CardContainerMobile>
            )}
            {mode === 'initial' &&
              myChar?.id !== '' &&
              opponentChar?.id !== '' && (
                <ButtonBox isMobile={isMobileVersion}>
                  <Button type="button" onClick={handleInitChallangeButton}>
                    Iniciar Desafio
                  </Button>
                </ButtonBox>
              )}
            {mode === 'battle' && user.storyteller && (
              <ButtonBox isMobile={isMobileVersion}>
                <Button type="button" onClick={handleCancelChallangeButton}>
                  Cancelar Desafio
                </Button>
              </ButtonBox>
            )}
            {mode !== 'initial' && mode !== 'battle' && user.storyteller && (
              <ButtonBox isMobile={isMobileVersion}>
                <Button type="button" onClick={handleRetestButton}>
                  Retestar
                </Button>

                <Button type="button" onClick={handleCancelChallangeButton}>
                  Reiniciar Desafio
                </Button>
              </ButtonBox>
            )}
            <ConnectionButton
              type="button"
              connected={connected}
              title={connected ? 'Desconectar' : 'Conectar'}
              onClick={handleConnection}
              disabled={changingConState}
            >
              {connected ? <FaHandshake /> : <FaUnlink />}
            </ConnectionButton>
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
                      connected={connStatus1}
                      title={connStatus1 ? 'Online' : 'Offline'}
                    >
                      {connStatus1 ? <FaSmile /> : <FaDizzy />}
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
                            type="button"
                            title="Pedra"
                            onClick={() => HandleSelectPo('rock')}
                            victory={myPo === 'rock' ? 1 : -5}
                            disabled={mode !== 'battle'}
                          >
                            <FaHandRock />
                          </JanKenPoButton>
                          <JanKenPoButton
                            isMobile={isMobileVersion}
                            type="button"
                            title="Papel"
                            onClick={() => HandleSelectPo('paper')}
                            victory={myPo === 'paper' ? 1 : -5}
                            disabled={mode !== 'battle'}
                          >
                            <FaHandPaper />
                          </JanKenPoButton>
                          <JanKenPoButton
                            isMobile={isMobileVersion}
                            type="button"
                            title="Tesoura"
                            onClick={() => HandleSelectPo('scissors')}
                            victory={myPo === 'scissors' ? 1 : -5}
                            disabled={mode !== 'battle'}
                          >
                            <FaHandScissors />
                          </JanKenPoButton>
                          <JanKenPoButton
                            isMobile={isMobileVersion}
                            type="button"
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
                          type="button"
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
                          type="button"
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
                      connected={connStatus2}
                      title={connStatus2 ? 'Online' : 'Offline'}
                    >
                      {connStatus2 ? <FaSmile /> : <FaDizzy />}
                    </ConnectionStatus>
                  )}
                </CharCardContainer>
              </CardsContent>
              {mode === 'initial' &&
                myChar.id !== '' &&
                opponentChar.id !== '' && (
                  <ButtonBox isMobile={isMobileVersion}>
                    <Button type="button" onClick={handleInitChallangeButton}>
                      Iniciar Desafio
                    </Button>
                  </ButtonBox>
                )}
              {mode === 'battle' && user.storyteller && (
                <ButtonBox isMobile={isMobileVersion}>
                  <Button type="button" onClick={handleCancelChallangeButton}>
                    Cancelar Desafio
                  </Button>
                </ButtonBox>
              )}
              {mode !== 'initial' && mode !== 'battle' && user.storyteller && (
                <ButtonBox isMobile={isMobileVersion}>
                  <Button type="button" onClick={handleRetestButton}>
                    Retestar
                  </Button>

                  <Button type="button" onClick={handleCancelChallangeButton}>
                    Reiniciar Desafio
                  </Button>
                </ButtonBox>
              )}
              <ConnectionButton
                type="button"
                connected={connected}
                title={connected ? 'Desconectar' : 'Conectar'}
                onClick={handleConnection}
                disabled={changingConState}
              >
                {connected ? <FaHandshake /> : <FaUnlink />}
              </ConnectionButton>
            </Content>
          )}
        </>
      )}
    </Container>
  );
};

export default Challenges;
