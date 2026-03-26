import Donor from '../models/Donor.js';

// @desc    Get all donors
// @route   GET /api/donors
// @access  Public
const getDonors = async (req, res) => {
  try {
    const donors = await Donor.find({});
    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export { getDonors };
