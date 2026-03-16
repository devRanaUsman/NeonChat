import express from 'express';
import { signup, login, logout, refresh, getMe, searchUsers } from '../controllers/authController.js';
import { authGuard } from '../middleware/authGuard.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/signup', authLimiter, signup);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.get('/refresh', refresh);
router.get('/me', authGuard, getMe);
router.get('/users/search', authGuard, searchUsers);

export default router;
