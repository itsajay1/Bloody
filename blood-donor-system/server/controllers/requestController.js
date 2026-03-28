import Request from '../models/Request.js';
import Donor from '../models/Donor.js';

// @desc    Get all blood requests
// @route   GET /api/request
// @access  Public
const getRequests = async (req, res) => {
  try {
    const requests = await Request.find({});
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create blood request and find matching donors
// @route   POST /api/request
// @access  Public
const createRequest = async (req, res) => {
  try {
    const { bloodGroup, location } = req.body;

    if (!bloodGroup || !location || location.lat === undefined || location.lng === undefined) {
      return res.status(400).json({ message: 'Please provide bloodGroup and location (lat, lng)' });
    }

    // Save the request
    const request = await Request.create({
      bloodGroup,
      location
    });

    // Find matching donors (ignoring distance for now)
    const matchingDonors = await Donor.find({
      bloodGroup: bloodGroup,
      available: true
    });

    res.status(201).json({
      request,
      matchingDonors
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export { getRequests, createRequest };
