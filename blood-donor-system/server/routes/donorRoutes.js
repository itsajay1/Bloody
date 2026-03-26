import express from 'express';
const router = express.Router();
import { getDonors } from '../controllers/donorController.js';

router.route('/').get(getDonors);

export default router;
