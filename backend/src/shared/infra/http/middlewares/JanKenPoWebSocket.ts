import { Express } from 'express';
import expressWs from 'express-ws';
import validateToken from '@modules/users/infra/http/middlewares/validateToken';

interface IMyConnection {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ws: any;
  id: string;
  user_id?: string;
  char_id?: string;
  char?: string;
  opponent_char?: string;
  st?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  keepAlive?: any;
}

interface IMatch {
  char1Connection: IMyConnection;
  char1JanKenPo?: string;
  char2Connection: IMyConnection;
  char2JanKenPo?: string;
  stConnection: IMyConnection;
}

interface ITokenResult {
  user_id: string;
  st: boolean;
  valid: boolean;
}

class JanKenPoWebSocket {
  private app: expressWs.Application;

  private sockets: IMyConnection[];

  private matches: IMatch[];

  private keepAliveInterval: number;

  constructor() {
    this.sockets = [];
    this.matches = [];
    this.keepAliveInterval = 20000;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private sendMsg(ws: any, msg: any): boolean {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private ping(socket: IMyConnection): any {
    if (socket.keepAlive !== undefined) {
      clearTimeout(socket.keepAlive);
    }

    const keepAlive = setTimeout(() => {
      this.sendMsg(socket.ws, { message: 'ping' });
    }, this.keepAliveInterval);

    return keepAlive;
  }

  public initializeServer(serverApp: Express): expressWs.Application {
    this.app = expressWs(serverApp).app;

    this.app.ws('/ws', (ws, req) => {
      const id = req.headers['sec-websocket-key'];
      let socket: IMyConnection | undefined = this.sockets.find(
        myWs => myWs.id === id,
      );
      let newSocket: IMyConnection = {
        ws: '',
        id: '',
        st: false,
        user_id: '',
      };

      ws.on('message', async (msg: string) => {
        const parsedMsg = JSON.parse(msg);
        let isError = false;
        let errorMsg = '';
        let closeMe = false;

        if (!parsedMsg.type) {
          isError = true;
          errorMsg = 'Invalid Message Format';
        }

        if (!isError) {
          if (socket !== undefined) {
            socket.keepAlive = this.ping(socket);
          }

          switch (parsedMsg.type) {
            case 'auth':
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

                if (socket) {
                  socket.st = validation.st;
                  socket.user_id = validation.user_id;
                } else {
                  newSocket = {
                    ws: '',
                    id: '',
                    st: validation.st,
                    user_id: validation.user_id,
                  };
                }
              }
              break;
            case 'char':
              if (!socket) {
                isError = true;
                errorMsg = 'User not Authenticated';
                closeMe = true;
              } else {
                socket.char = parsedMsg.char;
                socket.char_id = parsedMsg.char_id;

                const stSockets = this.sockets.filter(myWs => myWs.st);
                if (stSockets.length >= 1) {
                  stSockets.forEach(stWs => {
                    this.sendMsg(stWs.ws, {
                      message: 'connection',
                      character: parsedMsg.char_id,
                      connected: true,
                    });
                  });
                }
              }
              break;
            case 'select':
              if (!socket) {
                isError = true;
                errorMsg = 'User not Authenticated';
                closeMe = true;
              } else if (socket.st === false) {
                isError = true;
                errorMsg =
                  'Only authenticates storyteller can select characters for challanges';
              } else {
                const { char1_id, char2_id } = parsedMsg;

                const getChar1Socket = this.sockets.find(
                  myWs => myWs.char_id === char1_id,
                );

                if (!getChar1Socket) {
                  isError = true;
                  errorMsg =
                    'Character One is not connected, ask him to connect and try again';
                  closeMe = false;
                  break;
                }

                const getChar2Socket = this.sockets.find(
                  myWs => myWs.char_id === char2_id,
                );

                if (!getChar2Socket) {
                  isError = true;
                  errorMsg =
                    'Character Two is not connected, ask him to connect and try again';
                  closeMe = false;
                  break;
                }

                this.matches.push({
                  char1Connection: getChar1Socket,
                  char2Connection: getChar2Socket,
                  stConnection: socket,
                });

                this.sendMsg(getChar1Socket.ws, {
                  message: 'selected',
                  opponentChar: getChar2Socket.char,
                });

                this.sendMsg(getChar2Socket.ws, {
                  message: 'selected',
                  opponentChar: getChar1Socket.char,
                });
              }
              break;
            case 'cancel':
              if (!socket) {
                isError = true;
                errorMsg = 'User not Authenticated';
                closeMe = true;
              } else if (socket.st === false) {
                isError = true;
                errorMsg =
                  'Only authenticates storyteller can cancel a challange';
              } else {
                const { char1_id, char2_id } = parsedMsg;

                const getChar1Socket = this.sockets.find(
                  myWs => myWs.char_id === char1_id,
                );

                this.matches = this.matches.filter(mtch => {
                  return (
                    mtch.char1Connection.char_id !== char1_id &&
                    mtch.char2Connection.char_id !== char2_id
                  );
                });

                if (!getChar1Socket) {
                  isError = true;
                  errorMsg =
                    'Character One is not connected, ask him to connect and try again';
                  closeMe = false;
                  break;
                }

                this.sendMsg(getChar1Socket.ws, { message: 'restart' });

                const getChar2Socket = this.sockets.find(
                  myWs => myWs.char_id === char2_id,
                );

                if (!getChar2Socket) {
                  isError = true;
                  errorMsg =
                    'Character Two is not connected, ask him to connect and try again';
                  closeMe = false;
                  break;
                }

                this.sendMsg(getChar2Socket.ws, { message: 'restart' });
              }
              break;
            case 'is_connected':
              {
                if (!socket) {
                  isError = true;
                  errorMsg = 'User not Authenticated';
                  closeMe = true;
                  break;
                }

                if (!parsedMsg.char_id) {
                  isError = true;
                  errorMsg = 'Missing Character id';
                  closeMe = false;
                  break;
                }

                const charId = this.sockets.find(
                  sck => sck.char_id === parsedMsg.char_id,
                );

                this.sendMsg(socket.ws, {
                  message: 'connection',
                  character: parsedMsg.char_id,
                  connected: !!charId,
                });
              }
              break;
            case 'play':
              {
                if (!socket) {
                  isError = true;
                  errorMsg = 'User not Authenticated';
                  closeMe = true;
                  break;
                }

                const myMatch = this.matches.find(
                  mtch =>
                    mtch.char1Connection.id === id ||
                    mtch.char2Connection.id === id,
                );

                if (myMatch) {
                  if (!parsedMsg.play) {
                    isError = true;
                    errorMsg = 'Missing Jan-Ken-Po option';
                    closeMe = false;
                    break;
                  }

                  if (myMatch.char1Connection.id === id) {
                    myMatch.char1JanKenPo = parsedMsg.play;

                    this.sendMsg(myMatch.char2Connection.ws, {
                      message: 'ready',
                      character: 'opponent',
                    });

                    if (
                      myMatch.stConnection.id !== myMatch.char1Connection.id
                    ) {
                      this.sendMsg(myMatch.stConnection.ws, {
                        message: 'ready',
                        character: '1',
                      });
                    }
                  } else {
                    myMatch.char2JanKenPo = parsedMsg.play;

                    this.sendMsg(myMatch.char1Connection.ws, {
                      message: 'ready',
                      character: 'opponent',
                    });

                    this.sendMsg(myMatch.stConnection.ws, {
                      message: 'ready',
                      character: '2',
                    });
                  }

                  if (myMatch.char1JanKenPo && myMatch.char2JanKenPo) {
                    // Process tie first
                    if (myMatch.char1JanKenPo === myMatch.char2JanKenPo) {
                      if (
                        myMatch.stConnection.id !==
                          myMatch.char1Connection.id &&
                        myMatch.stConnection.id !== myMatch.char1Connection.id
                      ) {
                        this.sendMsg(myMatch.stConnection.ws, {
                          message: 'result',
                          result: 'tie',
                          char1: myMatch.char1JanKenPo,
                          char2: myMatch.char2JanKenPo,
                        });
                      }

                      this.sendMsg(myMatch.char1Connection.ws, {
                        message: 'result',
                        result: 'tie',
                        char1: myMatch.char1JanKenPo,
                        char2: myMatch.char2JanKenPo,
                      });

                      this.sendMsg(myMatch.char1Connection.ws, {
                        message: 'result',
                        result: 'tie',
                        char1: myMatch.char2JanKenPo,
                        char2: myMatch.char1JanKenPo,
                      });
                    } else if (
                      (myMatch.char1JanKenPo === 'rock' &&
                        myMatch.char2JanKenPo === 'scissors') ||
                      (myMatch.char1JanKenPo === 'scissors' &&
                        (myMatch.char2JanKenPo === 'paper' ||
                          myMatch.char2JanKenPo === 'bomb')) ||
                      (myMatch.char1JanKenPo === 'bomb' &&
                        (myMatch.char2JanKenPo === 'paper' ||
                          myMatch.char2JanKenPo === 'rock')) ||
                      (myMatch.char1JanKenPo === 'paper' &&
                        myMatch.char2JanKenPo === 'rock')
                    ) {
                      if (
                        myMatch.stConnection.id !==
                          myMatch.char1Connection.id &&
                        myMatch.stConnection.id !== myMatch.char1Connection.id
                      ) {
                        this.sendMsg(myMatch.stConnection.ws, {
                          message: 'result',
                          result: '1',
                          char1: myMatch.char1JanKenPo,
                          char2: myMatch.char2JanKenPo,
                        });
                      }

                      this.sendMsg(myMatch.char1Connection.ws, {
                        message: 'result',
                        result: 'win',
                        char1: myMatch.char1JanKenPo,
                        char2: myMatch.char2JanKenPo,
                      });

                      this.sendMsg(myMatch.char2Connection.ws, {
                        message: 'result',
                        result: 'lose',
                        char1: myMatch.char2JanKenPo,
                        char2: myMatch.char1JanKenPo,
                      });
                    } else {
                      if (
                        myMatch.stConnection.id !==
                          myMatch.char1Connection.id &&
                        myMatch.stConnection.id !== myMatch.char1Connection.id
                      ) {
                        this.sendMsg(myMatch.stConnection.ws, {
                          message: 'result',
                          result: '2',
                          char1: myMatch.char1JanKenPo,
                          char2: myMatch.char2JanKenPo,
                        });
                      }

                      this.sendMsg(myMatch.char1Connection.ws, {
                        message: 'result',
                        result: 'lose',
                        char1: myMatch.char1JanKenPo,
                        char2: myMatch.char2JanKenPo,
                      });

                      this.sendMsg(myMatch.char2Connection.ws, {
                        message: 'result',
                        result: 'win',
                        char1: myMatch.char2JanKenPo,
                        char2: myMatch.char1JanKenPo,
                      });
                    }

                    this.matches = this.matches.filter(
                      mtch => mtch !== myMatch,
                    );
                  }
                }
              }
              break;
            case 'pong':
              if (!socket) {
                isError = true;
                errorMsg = 'User not Authenticated';
                closeMe = true;
                break;
              }
              break;

            default:
          }
        }

        if (isError) {
          this.sendMsg(ws, { error: errorMsg });

          if (closeMe) ws.close();
        }
      });

      ws.on('close', () => {
        const stSockets = this.sockets.filter(myWs => myWs.st);

        if (stSockets.length >= 1) {
          stSockets.forEach(stWs => {
            if (stWs.id !== id && stWs.char_id !== '') {
              this.sendMsg(stWs.ws, {
                message: 'connection',
                character: stWs.char_id,
                connected: false,
              });
            }
          });
        }

        this.sockets = this.sockets.filter(myWs => myWs.id !== id);
        this.matches = this.matches.filter(
          mtch =>
            mtch.char1Connection.id !== id && mtch.char2Connection.id !== id,
        );
      });

      if (!socket && id !== undefined) {
        socket = {
          id: typeof id === 'string' ? id : id[0],
          ws,
          st: newSocket.st,
          user_id: newSocket.user_id,
        };

        socket.keepAlive = this.ping(socket);

        this.sockets = [...this.sockets, socket];
      }
    });

    return this.app;
  }
}

export default JanKenPoWebSocket;
