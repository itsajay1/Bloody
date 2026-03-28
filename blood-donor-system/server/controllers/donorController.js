import Donor from '../models/Donor.js';

// @desc    Get all donors
// @route   GET /api/donor
// @access  Public
const getDonors = async (req, res) => {
  try {
    const donors = await Donor.find({});
    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Register a donor
// @route   POST /api/donor/register
// @access  Public
const registerDonor = async (req, res) => {
  try {
    const { name, bloodGroup, age, phone, location, lastDonationDate, available } = req.body;

    // Validate required fields
    if (!name || !bloodGroup || !age || !phone || !location || location.lat === undefined || location.lng === undefined) {
      return res.status(400).json({ message: 'Please provide all required fields including location properties (lat, lng)' });
    }

    if (age < 18 || age > 60) {
      return res.status(400).json({ message: 'Donor must be between 18 and 60 years of age to register.' });
    }

    const donor = await Donor.create({
      name,
      bloodGroup,
      age,
      phone,
      location,
      lastDonationDate,
      available
    });

    res.status(201).json(donor);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export { getDonors, registerDonor };
