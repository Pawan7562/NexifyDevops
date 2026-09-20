import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin.replace(':5174', ':5001');
    socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 2000,
    });

    socket.on('connect', () => {
      console.log('⚡ Connected to Nexify DevOps Real-Time Telemetry Socket');
    });

    socket.on('disconnect', () => {
      console.log('🔌 Disconnected from Nexify DevOps Telemetry Socket');
    });
  }
  return socket;
}

export function subscribeToUptime(callback: (data: any) => void) {
  const s = getSocket();
  s.on('uptime:ping', callback);
  return () => {
    s.off('uptime:ping', callback);
  };
}
