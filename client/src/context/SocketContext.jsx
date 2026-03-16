import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import {
  setOnlineUsers,
  addMessage,
  setTypingStatus,
  updateMessageReactions,
  removeMessageLocally,
} from '../store/chatSlice';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const socketUrl = useMemo(() => {
    const rawUrl = import.meta.env.VITE_API_URL?.trim();
    return rawUrl ? rawUrl.replace(/\/$/, '') : window.location.origin;
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      const newSocket = io(socketUrl, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
      });

      setSocket(newSocket);

      newSocket.on('connect', () => {
        newSocket.emit('user:connect', user._id);
      });

      newSocket.on('user:status_change', (data) => {
        dispatch(setOnlineUsers(data));
      });

      newSocket.on('message:receive', (msg) => {
        dispatch(addMessage(msg));
        newSocket.emit('message:delivered', {
          messageId: msg._id,
          userId: user._id,
          conversationId: msg.conversationId,
        });
      });

      newSocket.on('message:update', () => {
        // Keep listener registered for future store updates.
      });

      newSocket.on('message:reaction_updated', ({ messageId, reactions }) => {
        dispatch(updateMessageReactions({ messageId, reactions }));
      });

      newSocket.on('message:deleted', ({ messageId }) => {
        dispatch(removeMessageLocally({ messageId }));
      });

      newSocket.on('typing:start', ({ conversationId, userId }) => {
        dispatch(setTypingStatus({ conversationId, userId, isTyping: true }));
      });

      newSocket.on('typing:stop', ({ conversationId, userId }) => {
        dispatch(setTypingStatus({ conversationId, userId, isTyping: false }));
      });

      return () => {
        newSocket.close();
      };
    }

    if (socket) {
      socket.close();
      setSocket(null);
    }
  }, [isAuthenticated, user, dispatch, socketUrl]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
