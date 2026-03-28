import express from 'express';
const router = express.Router();
import { getRequests, createRequest } from '../controllers/requestController.js';

router.route('/')
  .get(getRequests)
  .post(createRequest);

export default router;
