import express from 'express';
const router = express.Router();
import { getDonors, registerDonor } from '../controllers/donorController.js';

router.route('/').get(getDonors);
router.route('/register').post(registerDonor);

export default router;
