import { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [iotData, setIotData] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    newSocket.on('alert', (alert) => {
      setAlerts((prev) => [alert, ...prev].slice(0, 50));
    });

    newSocket.on('iot-update', (data) => {
      setIotData(data);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const markAlertRead = (alertId) => {
    if (socket) {
      socket.emit('mark-alert-read', alertId);
    }
  };

  const value = {
    socket,
    connected,
    alerts,
    iotData,
    markAlertRead,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
