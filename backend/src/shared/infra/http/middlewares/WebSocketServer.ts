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
  st?: boolean;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  char?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trait?: any;
}

interface ISocketServerMessage {
  message: string;
  id?: string;
  error?: string;
  character?: string;
  connected?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trait?: any;
}

class WebSocketServer {
  private app: expressWs.Application;

  private sockets: IMyConnection[];

  constructor() {
    this.sockets = [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                    };

                    this.sockets = [...this.sockets, socket];
                    this.sendMsg(ws, { message: 'id', id: socket.id });
                  }
                }
                break;

              case 'trait:notify':
                {
                  const { trait, char_id } = parsedMsg;
                  const wsToNotify = this.sockets.filter(
                    myWs => myWs.char_id === char_id || myWs.st,
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
          this.sendMsg(ws, { message: 'error', error });
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
                character: charId,
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
