import express from 'express';
import expressWs from 'express-ws';

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

  ws.on('message', (msg: string) => {
    const parsedMsg = JSON.parse(msg);

    if (!parsedMsg.type) {
      ws.close();
    }

    switch (parsedMsg.type) {
      case 'auth':
        if (socket) {
          socket.st = parsedMsg.st;
          socket.user_id = parsedMsg.user_id;
        } else {
          newSocket = {
            ws: '',
            id: '',
            st: parsedMsg.st,
            user_id: parsedMsg.user_id,
          };
        }
        break;
      case 'char':
        if (!socket) {
          ws.close();
        } else {
          socket.char = parsedMsg.char;
          socket.char_id = parsedMsg.char_id;
        }
        break;
      case 'select':
        if (!socket) {
          ws.close();
        } else if (socket.st === false) {
          ws.close();
        } else {
          const { char_id, char } = parsedMsg;
          const getSelectedSocket = sockets.find(
            myWs => myWs.char_id === char_id,
          );

          if (getSelectedSocket) {
            getSelectedSocket.ws.send(JSON.stringify({ getReady: true }));
          }
        }

        break;
      default:
    }

    ws.send(msg);
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
    ws.send(id);
  }
});

app.listen(3334);

export default app;
