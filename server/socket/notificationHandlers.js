import Notification from '../models/Notification.js';

export const notificationHandlers = (io, socket) => {
  // Client emits when a notification is read
  socket.on('notification:read', async ({ notificationId }) => {
    try {
      if (notificationId) {
        await Notification.findByIdAndUpdate(notificationId, { isRead: true, readAt: new Date() });
        socket.emit('notification:confirmed', { notificationId });
      }
    } catch (error) {
      console.error('Error confirming notification read:', error);
    }
  });

  // Client emits when all notifications are read
  socket.on('notification:read_all', async ({ userId }) => {
    try {
      if (userId) {
        await Notification.updateMany(
          { recipientId: userId, isRead: false },
          { isRead: true, readAt: new Date() }
        );
        socket.emit('notification:confirmed_all', { userId });
      }
    } catch (error) {
      console.error('Error confirming all notifications read:', error);
    }
  });
};
