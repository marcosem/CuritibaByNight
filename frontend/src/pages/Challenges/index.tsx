import React, { useState, useCallback, useEffect, ChangeEvent } from 'react';
import { format } from 'date-fns';
import {
  FaHandRock,
  FaHandPaper,
  FaHandScissors,
  FaBomb,
  FaTimes,
  FaHandshake,
  FaUnlink,
} from 'react-icons/fa';
import api from '../../services/api';

import {
  Container,
  TitleBox,
  SelectCharacter,
  Content,
  CardsContent,
  CharCardContainer,
  ChallangeArena,
  ArenaContainer,
  JanKenPoContainer,
  JanKenPoButton,
  ButtonBox,
  ConnectionButton,
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

const Challenges: React.FC = () => {
  const { user, signOut, char } = useAuth();
  const [myChar, setMyChar] = useState<ICharacter>();
  const [opponentChar, setOpponentChar] = useState<ICharacter>();
  const [charList, setCharList] = useState<ICharacter[]>([]);
  const [opponentList, setOpponentList] = useState<ICharacter[]>([]);
  const [selectedPo, setSelectedPo] = useState<string>('');
  const [selOpponentPo, setSelOpponentPo] = useState<string>('');
  const [char1Result, setChar1Result] = useState<number>(-2);
  const [char2Result, setChar2Result] = useState<number>(-2);
  const [socket, setSocket] = useState<WebSocket>(getSocket());
  const [mode, setMode] = useState<string>('initial');
  const [title, setTitle] = useState<string>('');
  const [connected, setConnected] = useState<boolean>(false);
  const { addToast } = useToast();
  const { isMobileVersion } = useMobile();
  const [play, setPlay] = useState<boolean>(false);

  const initializeSocket = useCallback(() => {
    const token = api.defaults.headers.Authorization.replace('Bearer ', '');

    if (socket.readyState === socket.OPEN) {
      socket.send(
        JSON.stringify({
          type: 'auth',
          user_id: user.id,
          token,
        }),
      );

      setConnected(true);
    }

    socket.addEventListener('open', () => {
      addToast({
        type: 'success',
        title: 'Conectado ao Servidor',
        description: 'Você está conectado ao Servidor do Jan-ken-po!',
      });

      socket.send(
        JSON.stringify({
          type: 'auth',
          user_id: user.id,
          token,
        }),
      );

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
        } else if (parsedMsg.message === 'Selected') {
          const opponent = parsedMsg.opponentChar;

          if (opponent) {
            setOpponentChar({
              id: opponent.id,
              name: opponent.name,
              clan: opponent.clan,
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
          }

          addToast({
            type: 'info',
            title: 'Hora do Desafio',
            description: `Oponente selecionado: [${opponent.name}]...`,
          });

          setMode('battle');
        } else if (parsedMsg.message === 'Restart' && !user.storyteller) {
          setSelectedPo('');
          setSelOpponentPo('');
          setChar1Result(-5);
          setChar2Result(-5);
          setPlay(false);
          setMode('initial');

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
            npc: false,
            retainer_level: '0',
            formatedDate: format(new Date(), 'dd/MM/yyyy'),
          });

          addToast({
            type: 'info',
            title: 'Desafio encerrado',
            description: 'Desafio encerrado pelo narrador.',
          });
        } else if (parsedMsg.message === 'ready') {
          if (parsedMsg.character === '1') {
            setSelectedPo('rock');
            setChar1Result(0);
          } else {
            setSelOpponentPo('rock');
            setChar2Result(0);
          }
        } else if (parsedMsg.message === 'result') {
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
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Mensagem Inválida',
          description: 'O servidor enviou uma mensagem inválida!',
        });
      }
    });
  }, [addToast, socket, user.id, user.storyteller]);

  const loadCharacters = useCallback(async () => {
    try {
      await api.get('characters/list/all').then(response => {
        const res = response.data;
        const fullList: ICharacter[] = res;

        let filteredList = fullList.filter(ch => ch.situation === 'active');
        const stNames = user.name.split(' ');
        const firsNameIndex = 0;
        const stName = stNames[firsNameIndex];

        const stStaticChar: ICharacter = {
          id: 'Static',
          name: stName,
          clan: 'Curitiba By Night',
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

        socket.send(
          JSON.stringify({
            type: 'char',
            char_id: loadedChar.id,
            char: loadedChar,
          }),
        );
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
  }, [addToast, char, signOut, socket]);

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
    setChar1Result(0);

    socket.send(JSON.stringify({ type: 'play', play: selectedPo }));

    setMode('ready');
  }, [selectedPo, socket]);

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
          socket.send(
            JSON.stringify({
              type: 'char',
              char_id: selectedCharacter.id,
              char: selectedCharacter,
            }),
          );
        }

        setMyChar(selectedCharacter);
      } else {
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
      }
    },
    [SelectCharByIndex, char.id, charList, socket],
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
      } else {
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
          npc: false,
          retainer_level: '0',
          formatedDate: format(new Date(), 'dd/MM/yyyy'),
        });
      }
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

  const handleInitChallangeButton = useCallback(() => {
    if (myChar?.id === opponentChar?.id) {
      addToast({
        type: 'error',
        title: 'Disputa inválida',
        description: 'Um personagem não pode disputar contra ele mesmo!',
      });

      return;
    }

    socket.send(
      JSON.stringify({
        type: 'select',
        char1_id: myChar?.id,
        char2_id: opponentChar?.id,
      }),
    );

    setMode('battle');
  }, [addToast, myChar, opponentChar, socket]);

  const handleCancelChallangeButton = useCallback(() => {
    socket.send(
      JSON.stringify({
        type: 'cancel',
        char1_id: myChar?.id,
        char2_id: opponentChar?.id,
      }),
    );

    setSelectedPo('');
    setSelOpponentPo('');
    setChar1Result(-5);
    setChar2Result(-5);
    setPlay(false);
    setMode('initial');
  }, [myChar, opponentChar, socket]);

  const handleConnection = useCallback(() => {
    if (connected) {
      socket.close();
    } else {
      setSocket(getSocket());
      setTimeout(() => {
        initializeSocket();

        setSelectedPo('');
        setSelOpponentPo('');
        setChar1Result(-5);
        setChar2Result(-5);
        setPlay(false);
        setMode('initial');

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
          npc: false,
          retainer_level: '0',
          formatedDate: format(new Date(), 'dd/MM/yyyy'),
        });
      }, 3000);
    }
  }, [connected, initializeSocket, socket]);

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
      npc: false,
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

    initializeSocket();
  }, [char, initializeSocket, loadCharacters, loadMyChar, user.storyteller]);

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
      setTitle('Você venceu!');
    } else if (mode === 'lose') {
      setTitle('Você perdeu!');
    } else if (mode === 'tie') {
      setTitle('Disputa emparada!');
    } else if (mode === 'resolved') {
      setTitle('Disputa Resulvida!');
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

  return (
    <Container>
      {isMobileVersion ? (
        <HeaderMobile page="challenge" />
      ) : (
        <Header page="challenge" />
      )}
      <TitleBox>
        {user.storyteller && mode === 'initial' ? (
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
          <CardsContent isMobile={isMobileVersion}>
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
                npc={myChar.npc && myChar.id !== 'Static'}
                regnant={myChar.regnant_char ? myChar.regnant_char.name : ''}
                locked
                readOnly={myChar.id === '' || myChar.id === 'Static'}
              />
            </CharCardContainer>
            <ChallangeArena isMobile={isMobileVersion}>
              <div>
                <h1>{title}</h1>
              </div>
              <ArenaContainer>
                <JanKenPoContainer>
                  {showOptions() && (
                    <>
                      <JanKenPoButton
                        type="button"
                        title="Pedra"
                        onClick={() => HandleSelectPo('rock')}
                        disabled={mode !== 'battle'}
                      >
                        <FaHandRock />
                      </JanKenPoButton>
                      <JanKenPoButton
                        type="button"
                        title="Papel"
                        onClick={() => HandleSelectPo('paper')}
                        disabled={mode !== 'battle'}
                      >
                        <FaHandPaper />
                      </JanKenPoButton>
                      <JanKenPoButton
                        type="button"
                        title="Tesoura"
                        onClick={() => HandleSelectPo('scissors')}
                        disabled={mode !== 'battle'}
                      >
                        <FaHandScissors />
                      </JanKenPoButton>
                      <JanKenPoButton
                        type="button"
                        title="Bomba"
                        onClick={() => HandleSelectPo('bomb')}
                        disabled={mode !== 'battle'}
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
                      disabled={mode !== 'battle'}
                      readyToPlay={play}
                      victory={char1Result}
                    >
                      {SwitchJanKenPo(selectedPo)}
                    </JanKenPoButton>
                  )}
                </JanKenPoContainer>
                <JanKenPoContainer>
                  {selectedPo !== '' && selOpponentPo !== '' && <FaTimes />}
                </JanKenPoContainer>
                <JanKenPoContainer>
                  {selOpponentPo !== '' && (
                    <JanKenPoButton
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
              isMobile={isMobileVersion}
              animationMode={mode === 'battle' && showOptions() ? 'in' : ''}
            >
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
                  opponentChar.regnant_char
                    ? opponentChar.regnant_char.name
                    : ''
                }
                locked
                readOnly={!user.storyteller || opponentChar.id === ''}
              />
            </CharCardContainer>
          </CardsContent>
          {mode === 'initial' && myChar.id !== '' && opponentChar.id !== '' && (
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
          >
            {connected ? <FaHandshake /> : <FaUnlink />}
          </ConnectionButton>
        </Content>
      )}
    </Container>
  );
};

export default Challenges;
