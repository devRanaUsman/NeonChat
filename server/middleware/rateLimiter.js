import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs for auth routes
  message: { success: false, message: 'Too many requests to authentication endpoint, please try again later' }
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, // 100 requests per 15 minutes for general APIs
  message: { success: false, message: 'Too many requests, please try again later' }
});
