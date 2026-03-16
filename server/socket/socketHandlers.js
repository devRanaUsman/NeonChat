import User from '../models/User.js';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import Notification from '../models/Notification.js';
import { notificationHandlers } from './notificationHandlers.js';

export const SocketHandlers = (io) => {
  const onlineUsers = new Map(); // socket.id -> userId

  io.on('connection', (socket) => {
    console.log(`New Socket Connection: ${socket.id}`);

    // Connection & Presence
    socket.on('user:connect', async (userId) => {
      onlineUsers.set(socket.id, userId);
      socket.join(userId); // Join personal room for direct events
      
      try {
        await User.findByIdAndUpdate(userId, { status: 'online' });
        // Broadcast to all to update global list (or just contacts if scaling)
        socket.broadcast.emit('user:status_change', { userId, status: 'online' });
      } catch (err) {
        console.error('user:connect error', err);
      }
    });

    socket.on('disconnect', async () => {
      const userId = onlineUsers.get(socket.id);
      if (userId) {
        onlineUsers.delete(socket.id);
        
        // Wait a bit to check if user reconnected quickly (e.g., refresh)
        setTimeout(async () => {
          const isStillOnline = Array.from(onlineUsers.values()).includes(userId);
          if (!isStillOnline) {
            try {
              await User.findByIdAndUpdate(userId, { 
                status: 'offline',
                lastSeen: Date.now()
              });
              io.emit('user:status_change', { userId, status: 'offline', lastSeen: Date.now() });
            } catch (err) {
              console.error('disconnect error', err);
            }
          }
        }, 3000);
      }
      console.log(`Socket Disconnected: ${socket.id}`);
    });

    // Room Management
    socket.on('join_conversation', (conversationId) => {
      socket.join(conversationId);
    });

    socket.on('leave_conversation', (conversationId) => {
      socket.leave(conversationId);
    });

    // Messaging
    socket.on('message:send', async (data) => {
      // Typically the client triggers an HTTP API to save message, 
      // but if we are saving via socket here:
      try {
        let savedMsg;
        if (data._id) {
          // If already saved via REST, just broadcast
          savedMsg = data;
        } else {
          // Save from socket event
          savedMsg = await Message.create(data);
          savedMsg = await Message.findById(savedMsg._id).populate('senderId', 'displayName avatarGradient initials');
        }
        
        // Emit to everyone in the conversation room
        io.to(data.conversationId.toString()).emit('message:receive', savedMsg);
        
        // Handle Notifications for recipients
        const conversation = await Conversation.findById(data.conversationId);
        if (conversation) {
          const recipients = conversation.participants.filter(p => p.toString() !== savedMsg.senderId._id.toString());
          
          for (const recipientId of recipients) {
            // Check if recipient is in the app, but unfocused tab might still need it,
            // so we always create the notification and emit it
            const notification = await Notification.create({
              recipientId,
              senderId: savedMsg.senderId._id,
              conversationId: data.conversationId,
              messageId: savedMsg._id,
              messagePreview: savedMsg.content ? savedMsg.content.substring(0, 60) : 'Sent an attachment',
              messageType: savedMsg.type || 'text'
            });

            // Emit to recipient's personal room
            io.to(recipientId.toString()).emit('notification:new', {
              notificationId: notification._id,
              conversationId: data.conversationId,
              senderId: savedMsg.senderId._id,
              senderName: savedMsg.senderId.displayName,
              senderInitials: savedMsg.senderId.initials,
              senderGradient: savedMsg.senderId.avatarGradient,
              messagePreview: notification.messagePreview,
              messageType: notification.messageType,
              timestamp: notification.createdAt
            });
          }
        }
      } catch (error) {
        console.error('Socket message send error:', error);
      }
    });

    socket.on('message:delivered', async ({ messageId, userId, conversationId }) => {
      try {
        const msg = await Message.findByIdAndUpdate(messageId, {
          $addToSet: { deliveredTo: userId }
        }, { new: true });
        io.to(conversationId).emit('message:update', msg);
      } catch (error) {}
    });

    socket.on('message:read', async ({ messageId, userId, conversationId }) => {
      try {
        const msg = await Message.findByIdAndUpdate(messageId, {
          $addToSet: { readBy: { userId, readAt: Date.now() } }
        }, { new: true });
        
        io.to(conversationId).emit('message:update', msg);
      } catch (error) {}
    });
    
    socket.on('message:react', async ({ messageId, userId, emoji, conversationId }) => {
       io.to(conversationId).emit('message:reaction_updated', { messageId, userId, emoji });
    });
    
    socket.on('message:edit', async ({ messageId, content, conversationId }) => {
       io.to(conversationId).emit('message:updated_content', { messageId, content });
    });

    socket.on('message:delete', async ({ messageId, conversationId }) => {
       io.to(conversationId).emit('message:deleted', { messageId });
    });

    // Typing
    socket.on('typing:start', ({ conversationId, userId }) => {
      socket.to(conversationId).emit('typing:start', { conversationId, userId });
    });

    socket.on('typing:stop', ({ conversationId, userId }) => {
      socket.to(conversationId).emit('typing:stop', { conversationId, userId });
    });

    socket.on('upload:progress', ({ percent, to }) => {
       socket.to(to).emit('upload:progress', { percent });
    });

    // Video Call Signaling
    socket.on('call:initiate', ({ recipientId, signalData, from }) => {
      io.to(recipientId).emit('call:incoming', { signal: signalData, from });
    });

    socket.on('call:answer', ({ to, signal }) => {
      io.to(to).emit('call:accepted', signal);
    });
    
    socket.on('call:ice_candidate', ({ to, candidate }) => {
      io.to(to).emit('call:ice_candidate', candidate);
    });

    socket.on('call:end', ({ to }) => {
      io.to(to).emit('call:ended');
    });

    socket.on('call:declined', ({ to }) => {
      io.to(to).emit('call:declined');
    });

    // Register other handlers
    notificationHandlers(io, socket);
  });
};
