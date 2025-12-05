import express from 'express';
import { login, getCurrentAdmin, sendInvite, acceptInvite, verifyInvite } from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Auth routes
router.post('/login', login);
router.get('/me', protect, getCurrentAdmin);
router.post('/send-invite', sendInvite);
router.get('/verify-invite', verifyInvite);
router.post('/accept-invite', acceptInvite);

export default router;
