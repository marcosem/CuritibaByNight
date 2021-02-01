// const socketProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const socketUrl = process.env.REACT_APP_API_URL?.replace('https', 'ws')
  .replace('http', 'ws')
  .replace('3333', '3334');

const echoSocketUrl = `${socketUrl}/ws`;
const socket = new WebSocket(echoSocketUrl);

export default socket;
