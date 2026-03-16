import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId })
      .populate('senderId', 'displayName avatarGradient initials')
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { content, conversationId, type, attachment } = req.body;

    if (!conversationId) {
      return res.status(400).json({ success: false, message: 'Invalid data passed into request' });
    }

    const newMessage = {
      senderId: req.user._id,
      content,
      conversationId,
      type: type || 'text',
      attachment,
      deliveredTo: [req.user._id],
      readBy: [{ userId: req.user._id, readAt: Date.now() }]
    };

    let message = await Message.create(newMessage);
    message = await message.populate('senderId', 'displayName avatarGradient initials');

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      lastActivity: Date.now()
    });

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};

export const editMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    if (message.senderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    message.content = req.body.content;
    message.isEdited = true;
    await message.save();

    res.status(200).json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    if (message.senderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    message.isDeleted = true;
    await message.save();

    res.status(200).json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};

export const toggleReaction = async (req, res, next) => {
  try {
    const { emoji } = req.body;
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    const reactionIndex = message.reactions.findIndex(r => r.emoji === emoji);

    if (reactionIndex > -1) {
      // Toggle off if user already reacted with this emoji
      const userIndex = message.reactions[reactionIndex].users.indexOf(req.user._id);
      if (userIndex > -1) {
        message.reactions[reactionIndex].users.splice(userIndex, 1);
        if (message.reactions[reactionIndex].users.length === 0) {
          message.reactions.splice(reactionIndex, 1);
        }
      } else {
        message.reactions[reactionIndex].users.push(req.user._id);
      }
    } else {
      // Add new reaction
      message.reactions.push({ emoji, users: [req.user._id] });
    }

    await message.save();
    res.status(200).json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
}
