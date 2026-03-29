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

// @desc    Register a donor
// @route   POST /api/donor/register
// @access  Public
const registerDonor = async (req, res, next) => {
  try {
    const { name, email, password, bloodGroup, age, phone, location, lastDonationDate, available } = req.body;

    if (!name || !email || !password || !bloodGroup || !age || !phone || !location || location.lat === undefined || location.lng === undefined) {
      res.status(400);
      throw new Error('Please provide all required fields');
    }

    if (age < 18 || age > 60) {
      res.status(400);
      throw new Error('Donor must be between 18 and 60 years of age to register.');
    }

    const donorExists = await Donor.findOne({ email });
    if (donorExists) {
      res.status(400);
      throw new Error('Donor already exists with this email');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const donor = await Donor.create({
      name,
      email,
      password: hashedPassword,
      bloodGroup,
      age,
      phone,
      location,
      lastDonationDate,
      available
    });

    res.status(201).json({
      _id: donor._id,
      name: donor.name,
      email: donor.email,
      token: generateToken(donor._id)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Auth donor & get token
// @route   POST /api/donor/login
// @access  Public
const loginDonor = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const donor = await Donor.findOne({ email });

    if (donor && (await bcrypt.compare(password, donor.password))) {
      res.json({
        _id: donor._id,
        name: donor.name,
        email: donor.email,
        token: generateToken(donor._id)
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
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
    const donor = await Donor.findById(req.donor._id).select('-password');
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

    const donor = await Donor.findById(req.donor._id);

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
    const donor = await Donor.findById(req.donor._id);

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

export { getDonors, registerDonor, loginDonor, getProfile, addDonation, toggleAvailability };
