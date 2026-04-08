import express from 'express';
const router = express.Router();
import { getRequests, createRequest, getRequestById } from '../controllers/requestController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

router.route('/')
  .get(getRequests)
  .post(protect, authorize('hospital', 'donor'), createRequest);

router.route('/:id')
  .get(getRequestById);

export default router;
