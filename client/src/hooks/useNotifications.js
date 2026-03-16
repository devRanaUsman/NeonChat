import { useState, useEffect, useCallback } from 'react';
import api from '../utils/axiosInstance';
import { useSocket } from './useSocket';
import { useAuth } from './useAuth';
import { playNotificationSound } from '../utils/notificationSound';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toastNotification, setToastNotification] = useState(null);
  const socket = useSocket();
  const { user } = useAuth();

  // Request browser notification permission
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (!socket || !user) return;

    const handleNewNotification = (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);

      // Play soft chime for new message
      playNotificationSound();

      // Show browser push if unfocused
      if (document.hidden || !document.hasFocus()) {
        if (Notification.permission === 'granted') {
          const browserNotif = new Notification(notification.senderName, {
            body: notification.messagePreview,
            icon: '/favicon.ico', // Assuming there's a favicon, can't guarantee neonchat-icon.png exists
            tag: notification.conversationId,
            renotify: true,
            silent: false
          });
          
          browserNotif.onclick = () => {
            window.focus();
            // In a more complex app, we'd navigate to the exact conversation via routing/Redux
          };
        }
      } else {
        // Show in-app toast
        setToastNotification(notification);
      }
    };

    socket.on('notification:new', handleNewNotification);

    return () => {
      socket.off('notification:new', handleNewNotification);
    };
  }, [socket, user]);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      if (socket) {
        socket.emit('notification:read', { notificationId: id });
      }
    } catch (error) {
      console.error('Error marking read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      if (socket) {
        socket.emit('notification:read_all', { userId: user._id });
      }
    } catch (error) {
      console.error('Error marking all read:', error);
    }
  };

  const clearToast = () => {
    setToastNotification(null);
  };

  return {
    notifications,
    unreadCount,
    toastNotification,
    markAsRead,
    markAllAsRead,
    clearToast
  };
};
