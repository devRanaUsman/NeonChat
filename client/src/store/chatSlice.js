import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  conversations: [],
  activeConversation: null,
  messages: [],
  onlineUsers: {}, // Set of user IDs
  typingUsers: {}, // conversationId -> array of userIds
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },
    addConversation: (state, action) => {
      const exists = state.conversations.find(c => c._id === action.payload._id);
      if (!exists) {
        state.conversations.unshift(action.payload);
      }
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
      // Also update latest message in conversations
      const conv = state.conversations.find(c => c._id === action.payload.conversationId);
      if (conv) {
        conv.lastMessage = action.payload;
      }
    },
    updateMessageStatus: (state, action) => {
      const { messageId, status, userId } = action.payload;
      const msg = state.messages.find(m => m._id === messageId);
      if (msg) {
        if (status === 'delivered') msg.deliveredTo.push(userId);
        if (status === 'read') msg.readBy.push({ userId, readAt: Date.now() });
      }
    },
    updateMessageReactions: (state, action) => {
      const { messageId, reactions } = action.payload;
      const msg = state.messages.find(m => m._id === messageId);
      if (msg) {
        msg.reactions = reactions;
      }
    },
    removeMessageLocally: (state, action) => {
      const { messageId } = action.payload;
      const msg = state.messages.find(m => m._id === messageId);
      if (msg) {
        msg.isDeleted = true;
      }
    },
    setOnlineUsers: (state, action) => {
      const { userId, status, lastSeen } = action.payload;
      if (status === 'online') {
        state.onlineUsers[userId] = true;
      } else {
        delete state.onlineUsers[userId];
      }
      // Update in conversation list
      state.conversations.forEach(c => {
        const p = c.participants.find(part => part._id === userId);
        if (p) {
          p.status = status;
          if (lastSeen) p.lastSeen = lastSeen;
        }
      });
    },
    setTypingStatus: (state, action) => {
      const { conversationId, userId, isTyping } = action.payload;
      if (!state.typingUsers[conversationId]) state.typingUsers[conversationId] = [];
      
      if (isTyping) {
        if (!state.typingUsers[conversationId].includes(userId)) {
          state.typingUsers[conversationId].push(userId);
        }
      } else {
        state.typingUsers[conversationId] = state.typingUsers[conversationId].filter(id => id !== userId);
      }
    }
  },
});

export const { 
  setConversations,
  setActiveConversation, 
  addConversation,
  setMessages, 
  addMessage, 
  updateMessageStatus,
  updateMessageReactions,
  removeMessageLocally,
  setOnlineUsers,
  setTypingStatus
} = chatSlice.actions;

export default chatSlice.reducer;
