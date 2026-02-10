const express = require('express');
const { z } = require('zod');
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');
const { validateBody } = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimit');

const router = express.Router();

const loginSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
});

// Public authentication routes (rate limited)
router.post('/login', authLimiter, validateBody(loginSchema), authController.login);
router.post('/refresh', validateBody(refreshSchema), authController.refreshToken);

// Protected routes (require valid JWT)
router.use(authenticate);
router.get('/me', authController.getProfile);
router.post('/logout', authController.logout);
router.patch('/password', validateBody(updatePasswordSchema), authController.updatePassword);

module.exports = router;
