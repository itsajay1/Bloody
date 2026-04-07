import express from 'express';
const router = express.Router();
import { 
  getDonors, 
  createDonor,
  getProfile, 
  addDonation,
  toggleAvailability,
  saveFcmToken
} from '../controllers/donorController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

router.route('/')
  .get(getDonors)
  .post(protect, createDonor);

router.route('/profile').get(protect, getProfile);
router.route('/donate').post(protect, addDonation);
router.route('/availability').put(protect, authorize('donor'), toggleAvailability);
router.route('/fcm-token').post(protect, authorize('donor'), saveFcmToken);

export default router;
