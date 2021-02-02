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

  constructor() {
    this.sockets = [];
    this.matches = [];
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

                getChar1Socket.ws.send(
                  JSON.stringify({
                    message: 'selected',
                    opponentChar: getChar2Socket.char,
                  }),
                );

                getChar2Socket.ws.send(
                  JSON.stringify({
                    message: 'selected',
                    opponentChar: getChar1Socket.char,
                  }),
                );
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

                getChar1Socket.ws.send(
                  JSON.stringify({
                    message: 'restart',
                  }),
                );

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

                getChar2Socket.ws.send(
                  JSON.stringify({
                    message: 'restart',
                  }),
                );
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
                    myMatch.char2Connection.ws.send(
                      JSON.stringify({
                        message: 'ready',
                        character: 'opponent',
                      }),
                    );

                    if (
                      myMatch.stConnection.id !== myMatch.char1Connection.id
                    ) {
                      myMatch.stConnection.ws.send(
                        JSON.stringify({
                          message: 'ready',
                          character: '1',
                        }),
                      );
                    }
                  } else {
                    myMatch.char2JanKenPo = parsedMsg.play;
                    myMatch.char1Connection.ws.send(
                      JSON.stringify({
                        message: 'ready',
                        character: 'opponent',
                      }),
                    );
                    myMatch.stConnection.ws.send(
                      JSON.stringify({
                        message: 'ready',
                        character: '2',
                      }),
                    );
                  }

                  if (myMatch.char1JanKenPo && myMatch.char2JanKenPo) {
                    // Process tie first
                    if (myMatch.char1JanKenPo === myMatch.char2JanKenPo) {
                      if (
                        myMatch.stConnection.id !==
                          myMatch.char1Connection.id &&
                        myMatch.stConnection.id !== myMatch.char1Connection.id
                      ) {
                        myMatch.stConnection.ws.send(
                          JSON.stringify({
                            message: 'result',
                            result: 'tie',
                            char1: myMatch.char1JanKenPo,
                            char2: myMatch.char2JanKenPo,
                          }),
                        );
                      }

                      myMatch.char1Connection.ws.send(
                        JSON.stringify({
                          message: 'result',
                          result: 'tie',
                          char1: myMatch.char1JanKenPo,
                          char2: myMatch.char2JanKenPo,
                        }),
                      );
                      myMatch.char2Connection.ws.send(
                        JSON.stringify({
                          message: 'result',
                          result: 'tie',
                          char1: myMatch.char2JanKenPo,
                          char2: myMatch.char1JanKenPo,
                        }),
                      );
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
                        myMatch.stConnection.ws.send(
                          JSON.stringify({
                            message: 'result',
                            result: '1',
                            char1: myMatch.char1JanKenPo,
                            char2: myMatch.char2JanKenPo,
                          }),
                        );
                      }

                      myMatch.char1Connection.ws.send(
                        JSON.stringify({
                          message: 'result',
                          result: 'win',
                          char1: myMatch.char1JanKenPo,
                          char2: myMatch.char2JanKenPo,
                        }),
                      );
                      myMatch.char2Connection.ws.send(
                        JSON.stringify({
                          message: 'result',
                          result: 'lose',
                          char1: myMatch.char2JanKenPo,
                          char2: myMatch.char1JanKenPo,
                        }),
                      );
                    } else {
                      if (
                        myMatch.stConnection.id !==
                          myMatch.char1Connection.id &&
                        myMatch.stConnection.id !== myMatch.char1Connection.id
                      ) {
                        myMatch.stConnection.ws.send(
                          JSON.stringify({
                            message: 'result',
                            result: '2',
                            char1: myMatch.char1JanKenPo,
                            char2: myMatch.char2JanKenPo,
                          }),
                        );
                      }
                      myMatch.char1Connection.ws.send(
                        JSON.stringify({
                          message: 'result',
                          result: 'lose',
                          char1: myMatch.char1JanKenPo,
                          char2: myMatch.char2JanKenPo,
                        }),
                      );
                      myMatch.char2Connection.ws.send(
                        JSON.stringify({
                          message: 'result',
                          result: 'win',
                          char1: myMatch.char2JanKenPo,
                          char2: myMatch.char1JanKenPo,
                        }),
                      );
                    }

                    this.matches = this.matches.filter(
                      mtch => mtch !== myMatch,
                    );
                  }
                }
              }
              break;
            default:
          }
        }

        if (isError) {
          ws.send(JSON.stringify({ error: errorMsg }));
          if (closeMe) ws.close();
        }
      });

      ws.on('close', () => {
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

        this.sockets = [...this.sockets, socket];
        ws.send(JSON.stringify({ id }));
      }
    });

    return this.app;
  }
}

export default JanKenPoWebSocket;
