import express from 'express';
const router = express.Router();
import { getRequests } from '../controllers/requestController.js';

router.route('/').get(getRequests);

export default router;
