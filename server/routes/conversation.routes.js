import express from 'express';
import { getConversations, createConversation } from '../controllers/conversationController.js';
import { authGuard } from '../middleware/authGuard.js';

const router = express.Router();

router.route('/').get(authGuard, getConversations).post(authGuard, createConversation);

export default router;
