import Echo from 'laravel-echo';
import io from 'socket.io-client';

window.io = io;

const echo = new Echo({
  broadcaster: 'pusher',
  key: process.env.wsKey,
  // wsHost: window.location.hostname,
  wsHost: "server1.prolipadigital.com.ec",  // 👈 aquí tu server real
  wsPort: process.env.webSocketPort,
  forceTLS: false,
  disableStats: true,
  cluster: process.env.wsCluster,
  enabledTransports: ['ws', 'wss'],
});

export default echo;
