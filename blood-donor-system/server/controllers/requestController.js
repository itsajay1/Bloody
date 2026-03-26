import Request from '../models/Request.js';

// @desc    Get all blood requests
// @route   GET /api/requests
// @access  Public
const getRequests = async (req, res) => {
  try {
    const requests = await Request.find({});
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export { getRequests };
