/* eslint-disable @typescript-eslint/no-explicit-any */
import { Express } from 'express';
import expressWs from 'express-ws';
import { container } from 'tsyringe';
import validateToken from '@modules/users/infra/http/middlewares/validateToken';
import GetUserService from '@modules/users/services/GetUserService';
import GetCharacterService from '@modules/characters/services/GetCharacterService';
import { compareJanKenPo } from 'rolld20';

interface IMyConnection {
  ws: any;
  id: string;
  user_id?: string;
  char_id?: string;
  char?: any;
  stChar?: any;
  st?: boolean;
}

interface IMatch {
  char1: any;
  char1JanKenPo?: string;
  char2: any;
  char2JanKenPo?: string;
  stConnection: IMyConnection;
}

interface ITokenResult {
  user_id: string;
  st: boolean;
  valid: boolean;
}

interface ISocketClientMessage {
  type: string;
  user_id?: string;
  token?: string;
  char_id?: string;
  char?: any;
  trait?: any;
  masquerade_level?: number;
  char1?: any;
  char2?: any;
  play?: string;
}

interface IUser {
  user_id: string;
  char_id: string;
}

interface ISocketServerMessage {
  message: string;
  id?: string;
  error?: string;
  connected?: boolean;
  trait?: any;
  users?: IUser[];
  user_id?: string;
  user_name?: string;
  char_id?: string;
  char_name?: string;
  masquerade_level?: number;
  opponentChar?: any;
  character?: string;
  result?: string;
  char1_jkp?: string;
  char2_jkp?: string;
}

class WebSocketServer {
  private app: expressWs.Application;

  private sockets: IMyConnection[];

  private matches: IMatch[];

  private usersService: GetUserService;

  private charactersService: GetCharacterService;

  constructor() {
    this.sockets = [];

    this.matches = [];
  }

  private sendMsg(ws: any, msg: ISocketServerMessage): boolean {
    try {
      if (ws.readyState !== ws.OPEN) {
        return false;
      }

      ws.send(JSON.stringify(msg));
      return true;
    } catch {
      return false;
    }
  }

  private sendMsgToSts(msg: ISocketServerMessage): boolean {
    const wsSts = this.sockets.filter(myWs => myWs.st);

    if (wsSts.length >= 1) {
      wsSts.forEach(myWs => {
        this.sendMsg(myWs.ws, msg);
      });

      return true;
    }
    return false;
  }

  public initializeServer(serverApp: Express): expressWs.Application {
    this.app = expressWs(serverApp).app;

    this.app.ws('/ws', (ws, req) => {
      const id = req.headers['sec-websocket-key'];
      let socket: IMyConnection | undefined = this.sockets.find(
        myWs => myWs.id === id,
      );

      ws.on('message', async (msg: string) => {
        try {
          const parsedMsg: ISocketClientMessage = JSON.parse(msg);
          let isError = false;
          let errorMsg = '';
          let closeMe = false;

          if (!parsedMsg.type) {
            isError = true;
            errorMsg = 'Invalid Message Format';
          }

          if (!isError) {
            switch (parsedMsg.type) {
              case 'connection:auth':
                {
                  if (!parsedMsg.token || !parsedMsg.user_id) {
                    isError = true;
                    errorMsg = 'Missing validation data';
                    closeMe = true;
                    break;
                  }

                  const validation: ITokenResult = await validateToken(
                    parsedMsg.token,
                  );

                  if (
                    !validation.valid ||
                    validation.user_id !== parsedMsg.user_id
                  ) {
                    isError = true;
                    errorMsg = 'Invalid JWT token';
                    closeMe = true;
                    break;
                  }

                  if (!socket && id !== undefined) {
                    socket = {
                      id: typeof id === 'string' ? id : id[0],
                      ws,
                      st: validation.st,
                      user_id: validation.user_id,
                      char_id: parsedMsg.char_id,
                      char: parsedMsg.char,
                    };

                    this.sockets = [...this.sockets, socket];
                    this.sendMsg(ws, { message: 'id', id: socket.id });

                    if (!socket.st) {
                      const connectedStUser = this.sockets.find(
                        myWs => myWs.st,
                      );

                      if (connectedStUser) {
                        this.usersService = container.resolve(GetUserService);
                        this.charactersService = container.resolve(
                          GetCharacterService,
                        );

                        const userName = socket.user_id
                          ? await this.usersService.execute({
                              user_id: socket.user_id,
                            })
                          : '';

                        const charName =
                          socket.char_id && connectedStUser.user_id
                            ? await this.charactersService.execute({
                                user_id: connectedStUser.user_id,
                                char_id: socket.char_id,
                              })
                            : '';

                        if (userName) {
                          this.sendMsgToSts({
                            message: 'connection:user',
                            user_id: socket.user_id,
                            user_name: userName.name,
                            char_name: charName ? charName.name : '',
                          });
                        }
                      }
                    }
                  }
                }
                break;

              case 'connection:connectedusers':
                if (!socket) {
                  isError = true;
                  errorMsg = 'User not Authenticated';
                  closeMe = true;
                } else {
                  const userList = this.sockets.map(
                    myWs =>
                      ({
                        user_id: myWs.user_id || '',
                        char_id: myWs.char_id || '',
                      } as IUser),
                  );

                  if (userList.length > 0) {
                    this.sendMsg(socket.ws, {
                      message: 'connection:connectedusers',
                      users: userList,
                    });
                  }
                }
                break;

              case 'challenge:select':
                if (!socket) {
                  isError = true;
                  errorMsg = 'User not Authenticated';
                  closeMe = true;
                } else if (socket.st === false) {
                  isError = true;
                  errorMsg =
                    'Only authenticates storyteller can select characters for challanges';
                } else {
                  const { char1, char2 } = parsedMsg;

                  let getChar1Socket: IMyConnection | undefined;

                  const isSTChar =
                    char1.npc || char1.id.indexOf('Storyteller') >= -1;

                  if (isSTChar) {
                    getChar1Socket = socket;
                    getChar1Socket.stChar = char1;

                    this.sockets = this.sockets.map(mySocket =>
                      mySocket.id === getChar1Socket?.id
                        ? getChar1Socket
                        : mySocket,
                    );
                  } else {
                    getChar1Socket = this.sockets.find(
                      myWs => myWs.char_id === char1.id,
                    );

                    if (!getChar1Socket || !getChar1Socket.char) {
                      isError = true;
                      errorMsg =
                        'Character One is not connected, ask him to connect and try again';
                      closeMe = false;
                      break;
                    }
                  }

                  const getChar2Socket = this.sockets.find(
                    myWs => myWs.char_id === char2.id,
                  );

                  if (!getChar2Socket || !getChar2Socket.char) {
                    isError = true;
                    errorMsg =
                      'Character Two is not connected, ask him to connect and try again';
                    closeMe = false;
                    break;
                  }

                  this.matches.push({
                    char1,
                    char2,
                    stConnection: socket,
                  });

                  if (!isSTChar) {
                    this.sendMsg(getChar1Socket.ws, {
                      message: 'challenge:opponentSelected',
                      opponentChar: getChar2Socket.char,
                    });
                  }

                  this.sendMsg(getChar2Socket.ws, {
                    message: 'challenge:opponentSelected',
                    opponentChar: isSTChar
                      ? getChar1Socket.stChar
                      : getChar1Socket.char,
                  });
                }
                break;

              case 'challenge:cancel':
                if (!socket) {
                  isError = true;
                  errorMsg = 'User not Authenticated';
                  closeMe = true;
                } else if (socket.st === false) {
                  isError = true;
                  errorMsg =
                    'Only authenticates storyteller can cancel a challange';
                } else {
                  const { char1, char2 } = parsedMsg;

                  if (char1 && char2) {
                    let getChar1Socket;
                    const isSTChar =
                      char1.npc || char1.id.indexOf('Storyteller') >= -1;

                    if (!isSTChar) {
                      getChar1Socket = this.sockets.find(
                        myWs => myWs.char_id === char1.id,
                      );

                      if (!getChar1Socket || !getChar1Socket.char) {
                        isError = true;
                        errorMsg =
                          'Character One is not connected, ask him to connect and try again';
                        closeMe = false;
                        break;
                      }

                      this.sendMsg(getChar1Socket.ws, {
                        message: 'challenge:restart',
                      });
                    }

                    const getChar2Socket = this.sockets.find(
                      myWs => myWs.char_id === char2.id,
                    );

                    if (!getChar2Socket || !getChar2Socket.char) {
                      isError = true;
                      errorMsg =
                        'Character Two is not connected, ask him to connect and try again';
                      closeMe = false;
                      break;
                    }

                    this.sendMsg(getChar2Socket.ws, {
                      message: 'challenge:restart',
                    });
                  } else {
                    const openedMatch = this.matches.find(
                      myMatch =>
                        myMatch.stConnection.user_id === socket?.user_id,
                    );

                    if (openedMatch !== undefined) {
                      const getChar1Socket = this.sockets.find(
                        myWs => myWs.char_id === openedMatch.char1.id,
                      );

                      if (getChar1Socket) {
                        if (getChar1Socket.id !== socket.id) {
                          this.sendMsg(getChar1Socket.ws, {
                            message: 'challenge:restart',
                          });

                          this.matches = this.matches.filter(
                            myMatch =>
                              myMatch.char1.id !== getChar1Socket.char_id,
                          );
                        }
                      }

                      const getChar2Socket = this.sockets.find(
                        myWs => myWs.char_id === openedMatch.char2.id,
                      );

                      if (getChar2Socket) {
                        this.sendMsg(getChar2Socket.ws, {
                          message: 'challenge:restart',
                        });

                        this.matches = this.matches.filter(
                          myMatch =>
                            myMatch.char2.id !== getChar2Socket.char_id,
                        );
                      }
                    }
                  }
                }
                break;

              case 'challenge:play':
                {
                  if (!socket) {
                    isError = true;
                    errorMsg = 'User not Authenticated';
                    closeMe = true;
                    break;
                  }

                  const { char_id } = parsedMsg;

                  const myMatch = this.matches.find(
                    mtch =>
                      mtch.char1.id === char_id || mtch.char2.id === char_id,
                  );

                  if (myMatch) {
                    if (!parsedMsg.play) {
                      isError = true;
                      errorMsg = 'Missing Jan-Ken-Po option';
                      closeMe = false;
                      break;
                    }

                    const getChar1Socket = this.sockets.find(myWs => {
                      if (
                        (myMatch.char1.npc ||
                          myMatch.char1.id.indexOf('Storyteller') >= 0) &&
                        myWs.stChar
                      ) {
                        return myWs.stChar.id === myMatch.char1.id;
                      }

                      return myWs.char_id === myMatch.char1.id;
                    });

                    if (!getChar1Socket) {
                      isError = true;
                      errorMsg =
                        'Character One is not connected, ask him to connect and try again';
                      closeMe = false;
                      break;
                    }

                    const getChar2Socket = this.sockets.find(
                      myWs => myWs.char_id === myMatch.char2.id,
                    );

                    if (!getChar2Socket) {
                      isError = true;
                      errorMsg =
                        'Character Two is not connected, ask him to connect and try again';
                      closeMe = false;
                      break;
                    }

                    if (myMatch.char1.id === char_id) {
                      myMatch.char1JanKenPo = parsedMsg.play;

                      this.sendMsg(getChar2Socket.ws, {
                        message: 'challenge:ready:1',
                        character: 'opponent',
                      });

                      if (myMatch.stConnection.id !== getChar1Socket.id) {
                        this.sendMsg(myMatch.stConnection.ws, {
                          message: 'challenge:ready:1',
                          character: '1',
                        });
                      }
                    } else {
                      myMatch.char2JanKenPo = parsedMsg.play;
                      this.sendMsg(getChar1Socket.ws, {
                        message: 'challenge:ready:2',
                        character: 'opponent',
                      });

                      this.sendMsg(myMatch.stConnection.ws, {
                        message: 'challenge:ready:2',
                        character: '2',
                      });
                    }

                    if (myMatch.char1JanKenPo && myMatch.char2JanKenPo) {
                      // Process tie first
                      if (
                        compareJanKenPo(
                          myMatch.char1JanKenPo,
                          myMatch.char2JanKenPo,
                        ) === 0
                      ) {
                        if (
                          myMatch.stConnection.id !== getChar1Socket.id &&
                          myMatch.stConnection.id !== getChar2Socket.id
                        ) {
                          this.sendMsg(myMatch.stConnection.ws, {
                            message: 'challenge:result',
                            result: 'tie',
                            char1_jkp: myMatch.char1JanKenPo,
                            char2_jkp: myMatch.char2JanKenPo,
                          });
                        }

                        this.sendMsg(getChar1Socket.ws, {
                          message: 'challenge:result',
                          result: 'tie',
                          char1_jkp: myMatch.char1JanKenPo,
                          char2_jkp: myMatch.char2JanKenPo,
                        });

                        this.sendMsg(getChar2Socket.ws, {
                          message: 'challenge:result',
                          result: 'tie',
                          char1_jkp: myMatch.char2JanKenPo,
                          char2_jkp: myMatch.char1JanKenPo,
                        });
                      } else if (
                        compareJanKenPo(
                          myMatch.char1JanKenPo,
                          myMatch.char2JanKenPo,
                        ) === -1
                      ) {
                        if (
                          myMatch.stConnection.id !== getChar1Socket.id &&
                          myMatch.stConnection.id !== getChar2Socket.id
                        ) {
                          this.sendMsg(myMatch.stConnection.ws, {
                            message: 'challenge:result',
                            result: '1',
                            char1_jkp: myMatch.char1JanKenPo,
                            char2_jkp: myMatch.char2JanKenPo,
                          });
                        }

                        this.sendMsg(getChar1Socket.ws, {
                          message: 'challenge:result',
                          result: 'win',
                          char1_jkp: myMatch.char1JanKenPo,
                          char2_jkp: myMatch.char2JanKenPo,
                        });

                        this.sendMsg(getChar2Socket.ws, {
                          message: 'challenge:result',
                          result: 'lose',
                          char1_jkp: myMatch.char2JanKenPo,
                          char2_jkp: myMatch.char1JanKenPo,
                        });
                      } else {
                        if (
                          myMatch.stConnection.id !== getChar1Socket.id &&
                          myMatch.stConnection.id !== getChar2Socket.id
                        ) {
                          this.sendMsg(myMatch.stConnection.ws, {
                            message: 'challenge:result',
                            result: '2',
                            char1_jkp: myMatch.char1JanKenPo,
                            char2_jkp: myMatch.char2JanKenPo,
                          });
                        }

                        this.sendMsg(getChar1Socket.ws, {
                          message: 'challenge:result',
                          result: 'lose',
                          char1_jkp: myMatch.char1JanKenPo,
                          char2_jkp: myMatch.char2JanKenPo,
                        });

                        this.sendMsg(getChar2Socket.ws, {
                          message: 'challenge:result',
                          result: 'win',
                          char1_jkp: myMatch.char2JanKenPo,
                          char2_jkp: myMatch.char1JanKenPo,
                        });
                      }

                      this.matches = this.matches.filter(
                        mtch => mtch !== myMatch,
                      );
                    }
                  }
                }
                break;

              case 'challenge:retest':
                if (!socket) {
                  isError = true;
                  errorMsg = 'User not Authenticated';
                  closeMe = true;
                } else if (socket.st === false) {
                  isError = true;
                  errorMsg =
                    'Only authenticates storyteller can ask for a restest challange';
                } else {
                  const { char1, char2 } = parsedMsg;

                  const getChar1Socket = this.sockets.find(myWs => {
                    if (
                      (char1.npc || char1.id.indexOf('Storyteller') >= 0) &&
                      myWs.stChar
                    ) {
                      return myWs.stChar.id === char1.id;
                    }

                    return myWs.char_id === char1.id;
                  });

                  this.matches = this.matches.filter(mtch => {
                    return (
                      mtch.char1.id !== char1.id && mtch.char2.id !== char2.id
                    );
                  });

                  if (!getChar1Socket) {
                    isError = true;
                    errorMsg =
                      'Character One is not connected, ask him to connect and try again';
                    closeMe = false;
                    break;
                  }

                  this.sendMsg(getChar1Socket.ws, {
                    message: 'challenge:retest',
                  });

                  const getChar2Socket = this.sockets.find(
                    myWs => myWs.char_id === char2.id,
                  );

                  if (!getChar2Socket) {
                    isError = true;
                    errorMsg =
                      'Character Two is not connected, ask him to connect and try again';
                    closeMe = false;
                    break;
                  }

                  this.matches.push({
                    char1,
                    char2,
                    stConnection: socket,
                  });

                  this.sendMsg(getChar2Socket.ws, {
                    message: 'challenge:retest',
                  });
                }
                break;

              case 'trait:notify':
                if (!socket) {
                  isError = true;
                  errorMsg = 'User not Authenticated';
                  closeMe = true;
                } else {
                  const { trait, char_id } = parsedMsg;
                  const wsToNotify = this.sockets.filter(
                    myWs =>
                      myWs.char_id === char_id ||
                      (myWs.st && myWs.id !== socket?.id),
                  );

                  if (wsToNotify.length >= 1) {
                    wsToNotify.forEach(myWs => {
                      this.sendMsg(myWs.ws, {
                        message: 'trait:update',
                        trait,
                      });
                    });
                  }
                }
                break;

              case 'trait:reset':
                if (!socket) {
                  isError = true;
                  errorMsg = 'User not Authenticated';
                  closeMe = true;
                } else {
                  const { char_id } = parsedMsg;
                  const wsToNotify = this.sockets.filter(
                    myWs => myWs.char_id === char_id || myWs.st,
                  );

                  if (wsToNotify.length >= 1) {
                    wsToNotify.forEach(myWs => {
                      this.sendMsg(myWs.ws, {
                        message: 'trait:reload',
                        char_id,
                      });
                    });
                  }
                }
                break;

              case 'masquerade:notify:up':
                if (!socket) {
                  isError = true;
                  errorMsg = 'User not Authenticated';
                  closeMe = true;
                } else if (parsedMsg.masquerade_level) {
                  if (this.sockets.length >= 1) {
                    this.sockets.forEach(myWs => {
                      this.sendMsg(myWs.ws, {
                        message: 'masquerade:increased',
                        masquerade_level: parsedMsg.masquerade_level,
                      });
                    });
                  }
                }
                break;

              case 'masquerade:notify:down':
                if (!socket) {
                  isError = true;
                  errorMsg = 'User not Authenticated';
                  closeMe = true;
                } else if (parsedMsg.masquerade_level) {
                  if (this.sockets.length >= 1) {
                    this.sockets.forEach(myWs => {
                      this.sendMsg(myWs.ws, {
                        message: 'masquerade:decreased',
                        masquerade_level: parsedMsg.masquerade_level,
                      });
                    });
                  }
                }
                break;

              case 'ping':
                this.sendMsg(ws, { message: 'pong' });
                break;

              default:
            }
          }

          if (isError) {
            this.sendMsg(ws, { message: 'error', error: errorMsg });
            if (closeMe) ws.close();
          }
        } catch (error) {
          const parsedError: any = error;

          this.sendMsg(ws, { message: 'error', error: parsedError.message });
          ws.close();
        }
      });

      ws.on('close', () => {
        const charId = socket?.char_id;
        this.sockets = this.sockets.filter(myWs => myWs.id !== id);

        if (charId !== undefined) {
          const stSockets = this.sockets.filter(myWs => myWs.st);
          if (stSockets.length >= 1) {
            stSockets.forEach(stWs => {
              this.sendMsg(stWs.ws, {
                message: 'connection',
                char_id: charId,
                connected: false,
              });
            });
          }
        }
      });

      ws.on('error', err => {
        // eslint-disable-next-line no-console
        console.log('Caught flash policy server socket error: ');
        // eslint-disable-next-line no-console
        console.log(err.stack);
      });

      ws.on('unexpected-response', () => {
        // eslint-disable-next-line no-console
        console.log('Unexpected Response');
      });
    });

    return this.app;
  }
}

export default WebSocketServer;
