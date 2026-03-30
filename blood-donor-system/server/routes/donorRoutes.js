import express from 'express';
const router = express.Router();
import { 
  getDonors, 
  getProfile, 
  addDonation,
  toggleAvailability 
} from '../controllers/donorController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').get(getDonors);
// Legacy donor routes removed in favor of unified user routes

router.route('/profile').get(protect, getProfile);
router.route('/donate').post(protect, addDonation);
router.route('/availability').put(protect, toggleAvailability);

export default router;
