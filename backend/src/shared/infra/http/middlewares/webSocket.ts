import express from 'express';
import expressWs from 'express-ws';
import validateToken from '@modules/users/infra/http/middlewares/validateToken';

const { app } = expressWs(express());

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

interface ITokenResult {
  user_id: string;
  st: boolean;
  valid: boolean;
}

let sockets: IMyConnection[] = [];
app.ws('/ws', (ws, req) => {
  const id = req.headers['sec-websocket-key'];
  // const mySocket = sockets.find(myWs => myWs.id === id);
  let socket: IMyConnection | undefined = sockets.find(myWs => myWs.id === id);
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

            if (!validation.valid || validation.user_id !== parsedMsg.user_id) {
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

            const getChar1Socket = sockets.find(
              myWs => myWs.char_id === char1_id,
            );

            if (!getChar1Socket) {
              isError = true;
              errorMsg =
                'Character One is not connected, ask him to connect and try again';
              closeMe = false;
              break;
            }

            const getChar2Socket = sockets.find(
              myWs => myWs.char_id === char2_id,
            );

            if (!getChar2Socket) {
              isError = true;
              errorMsg =
                'Character Two is not connected, ask him to connect and try again';
              closeMe = false;
              break;
            }

            getChar1Socket.ws.send(
              JSON.stringify({
                message: 'Selected',
                opponentChar: getChar2Socket.char,
              }),
            );

            getChar2Socket.ws.send(
              JSON.stringify({
                message: 'Selected',
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
            errorMsg = 'Only authenticates storyteller can cancel a challange';
          } else {
            const { char1_id, char2_id } = parsedMsg;

            const getChar1Socket = sockets.find(
              myWs => myWs.char_id === char1_id,
            );

            if (!getChar1Socket) {
              isError = true;
              errorMsg =
                'Character One is not connected, ask him to connect and try again';
              closeMe = false;
              break;
            }

            getChar1Socket.ws.send(
              JSON.stringify({
                message: 'Restart',
              }),
            );

            const getChar2Socket = sockets.find(
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
                message: 'Restart',
              }),
            );
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
    sockets = sockets.filter(myWs => myWs.id !== id);
  });

  if (!socket && id !== undefined) {
    socket = {
      id: typeof id === 'string' ? id : id[0],
      ws,
      st: newSocket.st,
      user_id: newSocket.user_id,
    };

    sockets = [...sockets, socket];
    ws.send(JSON.stringify({ id }));
  }
});

app.listen(3334);

export default app;
