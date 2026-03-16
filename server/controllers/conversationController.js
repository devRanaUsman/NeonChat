import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ participants: req.user._id })
      .populate('participants', 'username displayName initials avatarGradient status lastSeen')
      .populate({
        path: 'lastMessage',
        select: 'content senderId createdAt type',
        populate: {
          path: 'senderId',
          select: 'displayName'
        }
      })
      .sort({ lastActivity: -1 });

    res.status(200).json({ success: true, data: conversations });
  } catch (error) {
    next(error);
  }
};

export const createConversation = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'UserId param not sent with request' });
    }

    let isChat = await Conversation.find({
      type: 'direct',
      $and: [
        { participants: { $elemMatch: { $eq: req.user._id } } },
        { participants: { $elemMatch: { $eq: userId } } }
      ]
    })
      .populate('participants', '-password')
      .populate('lastMessage');

    if (isChat.length > 0) {
      res.status(200).json({ success: true, data: isChat[0] });
    } else {
      const chatData = {
        type: 'direct',
        participants: [req.user._id, userId]
      };

      const createdChat = await Conversation.create(chatData);
      const fullChat = await Conversation.findOne({ _id: createdChat._id }).populate(
        'participants',
        '-password'
      );
      res.status(201).json({ success: true, data: fullChat });
    }
  } catch (error) {
    next(error);
  }
};
