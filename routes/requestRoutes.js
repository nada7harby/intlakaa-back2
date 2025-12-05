import express from 'express';
import {
  createRequest,
  getRequests,
  getRequest,
  deleteRequest,
} from '../controllers/requestController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public route
router.post('/', createRequest);

// Protected routes (admin only)
router.get('/', protect, getRequests);
router.get('/:id', protect, getRequest);
router.delete('/:id', protect, deleteRequest);

export default router;
