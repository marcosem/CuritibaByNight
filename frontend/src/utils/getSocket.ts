// const socketProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const socketUrl = process.env.REACT_APP_API_URL?.replace('https', 'ws')
  .replace('api', 'ws')
  .replace('http', 'ws')
  .replace('3333', '3334');

export default function getSocket(): WebSocket {
  const echoSocketUrl = `${socketUrl}/ws`;
  const newSocket = new WebSocket(echoSocketUrl);

  return newSocket;
}
