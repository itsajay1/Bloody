import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Connect to the socket server
      // WebSockets on mobile often require the full host address for real devices
      const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const newSocket = io(serverUrl, {
        transports: ['websocket'], // Often better for mobile cross-origin
      });
      
      setSocket(newSocket);

      // Join personal room based on user ID for targeted events
      newSocket.emit('join', user.id);

      return () => newSocket.close();
    } else if (socket) {
      socket.close();
      setSocket(null);
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
