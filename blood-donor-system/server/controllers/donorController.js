import Donor from '../models/Donor.js';
import User from '../models/User.js';
import { successResponse } from '../utils/responseWrapper.js';
import { broadcast } from '../utils/socket.js';
import { check90DaysEligibility } from '../services/donorService.js';

// @desc    Get all donors
// @route   GET /api/donor
// @access  Public
const getDonors = async (req, res, next) => {
  try {
    const donors = await Donor.find({}).select('-password');
    successResponse(res, 'Donors fetched successfully', donors);
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update donor profile
// @route   POST /api/donor
// @access  Private
const createDonor = async (req, res, next) => {
  try {
    const { bloodGroup, phone, age, location, lastDonationDate } = req.body;

    // Check if donor profile already exists for this user
    let donor = await Donor.findOne({ user: req.user._id });

    if (donor) {
      // Update existing donor
      donor.bloodGroup = bloodGroup || donor.bloodGroup;
      donor.phone = phone || donor.phone;
      donor.age = age || donor.age;
      donor.location = location || donor.location;
      donor.lastDonationDate = lastDonationDate || donor.lastDonationDate;
      
      await donor.save();
      broadcast('donor_status_updated', { donorId: donor._id, status: 'updated', donor });
      successResponse(res, 'Donor profile updated successfully', donor);
    } else {
      // Create new donor profile
      // We need name and email from the user account if not provided
      const user = await User.findById(req.user._id);
      
      if (!bloodGroup || !phone || !age || !location) {
        res.status(400);
        throw new Error('Please provide bloodGroup, phone, age, and location');
      }

      donor = await Donor.create({
        user: req.user._id,
        name: user.name,
        email: user.email,
        bloodGroup,
        phone,
        age,
        location,
        lastDonationDate
      });

      // Also ensure user role is 'donor'
      if (user.role !== 'donor') {
        user.role = 'donor';
        await user.save();
      }

      broadcast('donor_status_updated', { donorId: donor._id, status: 'created', donor });
      successResponse(res, 'Donor profile created successfully', donor, 201);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get donor profile
// @route   GET /api/donor/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const donor = await Donor.findOne({ user: req.user._id }).select('-password');
    if (donor) {
      successResponse(res, 'Donor profile fetched successfully', donor);
    } else {
      res.status(404);
      throw new Error('Donor not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Add a donation
// @route   POST /api/donor/donate
// @access  Private
const addDonation = async (req, res, next) => {
  try {
    const { hospital } = req.body;
    
    if (!hospital) {
      res.status(400);
      throw new Error('Hospital name is required');
    }

    const donor = await Donor.findOne({ user: req.user._id });

    if (donor) {
      // Check 90-day eligibility
      if (!check90DaysEligibility(donor.lastDonationDate)) {
        res.status(400);
        throw new Error('Medical Safety Alert: You must wait 90 days between donations.');
      }

      const newDonationDate = new Date();
      donor.donationHistory.push({ date: newDonationDate, hospital });
      donor.lastDonationDate = newDonationDate;
      donor.available = false; // Auto-standby after donation
      await donor.save();

      broadcast('donor_status_updated', { donorId: donor._id, status: 'donated', available: false });

      successResponse(res, 'Donation added successfully', donor);
    } else {
      res.status(404);
      throw new Error('Donor not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle donor availability
// @route   PUT /api/donor/availability
// @access  Private
const toggleAvailability = async (req, res, next) => {
  try {
    const donor = await Donor.findOne({ user: req.user._id });

    if (donor) {
      donor.available = !donor.available;
      await donor.save();

      broadcast('donor_status_updated', { donorId: donor._id, status: 'availability_toggle', available: donor.available });
      
      successResponse(res, `Availability updated to ${donor.available ? 'Available' : 'Unavailable'}`, {
        available: donor.available
      });
    } else {
      res.status(404);
      throw new Error('Donor not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Store FCM token for push notifications
// @route   POST /api/donor/fcm-token
// @access  Private
const saveFcmToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      res.status(400);
      throw new Error('FCM token is required');
    }

    const donor = await Donor.findOne({ user: req.user._id });
    
    if (!donor) {
      res.status(404);
      throw new Error('Donor not found');
    }
    
    if (!donor.fcmTokens.includes(token)) {
      donor.fcmTokens.push(token);
      await donor.save();
    }
    
    successResponse(res, 'FCM token saved successfully', null);
  } catch (error) {
    next(error);
  }
};

export { getDonors, createDonor, getProfile, addDonation, toggleAvailability, saveFcmToken };
