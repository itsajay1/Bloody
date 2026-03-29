import express from 'express';
const router = express.Router();
import { 
  getDonors, 
  registerDonor, 
  loginDonor, 
  getProfile, 
  addDonation,
  toggleAvailability 
} from '../controllers/donorController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').get(getDonors);
router.route('/register').post(registerDonor);
router.route('/login').post(loginDonor);

router.route('/profile').get(protect, getProfile);
router.route('/donate').post(protect, addDonation);
router.route('/availability').put(protect, toggleAvailability);

export default router;
