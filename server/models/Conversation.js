import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  type: { type: String, enum: ['direct', 'group'], default: 'direct' },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  name: String, // for group chats
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  lastActivity: { type: Date, default: Date.now },
  unreadCount: { type: Map, of: Number, default: {} },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Conversation', conversationSchema);
