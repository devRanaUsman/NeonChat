import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  messagePreview: { type: String, maxlength: 100 },
  messageType: { type: String, enum: ['text', 'image', 'file', 'voice', 'emoji'], default: 'text' },
  isRead: { type: Boolean, default: false },
  readAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Notification', notificationSchema);
