import express from 'express';
import { getMessages, sendMessage, editMessage, deleteMessage, toggleReaction } from '../controllers/messageController.js';
import { authGuard } from '../middleware/authGuard.js';

const router = express.Router();

router.route('/')
  .post(authGuard, sendMessage);

router.route('/:conversationId')
  .get(authGuard, getMessages);

router.route('/:id')
  .patch(authGuard, editMessage)
  .delete(authGuard, deleteMessage);

router.post('/:id/react', authGuard, toggleReaction);

export default router;
