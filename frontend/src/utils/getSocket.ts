const socketUrl = process.env.REACT_APP_API_URL?.replace('https', 'wss')
  .replace('api', 'ws')
  .replace('http', 'ws');

export default function getSocket(): WebSocket {
  const echoSocketUrl = `${socketUrl}/ws`;
  const newSocket = new WebSocket(echoSocketUrl);

  return newSocket;
}
