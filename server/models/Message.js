import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'image', 'file', 'voice'],
    default: 'text'
  },
  content: { type: String }, // text content
  attachment: {
    url: String,       // Cloudinary URL
    name: String,      // original filename
    size: Number,      // in bytes
    mimeType: String,  // e.g. 'application/pdf'
    thumbnail: String  // for images/videos
  },
  reactions: [{
    emoji: String,     // e.g. "🔥"
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  }],
  readBy: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    readAt: { type: Date, default: Date.now }
  }],
  deliveredTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isEdited: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Message', messageSchema);
