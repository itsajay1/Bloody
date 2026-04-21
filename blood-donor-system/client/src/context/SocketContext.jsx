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
      // WebSockets often require specific transport settings for cross-origin/mobile reliability
      const serverUrl = import.meta.env.VITE_API_URL;
      const newSocket = io(serverUrl, {
        transports: ['websocket'],
      });
      
      setSocket(newSocket);

      // Join personal room based on user ID for targeted events
      if (user._id || user.id) {
        newSocket.emit('join', user._id || user.id);
      }

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
