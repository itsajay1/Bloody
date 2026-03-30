import Donor from '../models/Donor.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

// @desc    Get all donors
// @route   GET /api/donor
// @access  Public
const getDonors = async (req, res, next) => {
  try {
    const donors = await Donor.find({}).select('-password');
    res.json(donors);
  } catch (error) {
    next(error);
  }
};

// Legacy donor registration removed in favor of unified userController.js

// Legacy donor login removed in favor of unified userController.js

// @desc    Get donor profile
// @route   GET /api/donor/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const donor = await Donor.findOne({ user: req.user._id }).select('-password');
    if (donor) {
      res.json(donor);
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
      const newDonationDate = new Date();
      donor.donationHistory.push({ date: newDonationDate, hospital });
      donor.lastDonationDate = newDonationDate;
      await donor.save();

      res.status(200).json({ message: 'Donation added successfully', donor });
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

      res.status(200).json({
        message: `Availability updated to ${donor.available ? 'Available' : 'Unavailable'}`,
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

export { getDonors, getProfile, addDonation, toggleAvailability };
