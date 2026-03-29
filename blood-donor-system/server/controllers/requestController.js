import Request from '../models/Request.js';
import Donor from '../models/Donor.js';

// Haversine formula to calculate distance between two coordinates in kilometers
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

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

// @desc    Create blood request and find matching donors within 10km
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

    // Find available donors with the same blood group
    const potentialDonors = await Donor.find({
      bloodGroup: bloodGroup,
      available: true
    });

    // Filter donors strictly within a 10 km radius and check 90 days eligibility
    const matchingDonors = potentialDonors.filter(donor => {
      // 1. Check location validity
      if (!donor.location || typeof donor.location.lat !== 'number' || typeof donor.location.lng !== 'number') {
        return false;
      }
      
      // 2. Check 90 days eligibility
      if (donor.lastDonationDate) {
        const ninetyDaysInMillis = 90 * 24 * 60 * 60 * 1000;
        const donationTime = new Date(donor.lastDonationDate).getTime();
        const now = Date.now();
        if (now - donationTime <= ninetyDaysInMillis) {
          return false;
        }
      }

      // 3. Check distance (Haversine formula <= 10km)
      const distance = calculateDistance(
        location.lat,
        location.lng,
        donor.location.lat,
        donor.location.lng
      );
      
      return distance <= 10;
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
