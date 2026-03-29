import Request from '../models/Request.js';
import Donor from '../models/Donor.js';
import Notification from '../models/Notification.js';

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
const getRequests = async (req, res, next) => {
  try {
    const requests = await Request.find({});
    res.json(requests);
  } catch (error) {
    next(error);
  }
};

// @desc    Create blood request and find matching donors within 10km
// @route   POST /api/request
// @access  Public
const createRequest = async (req, res, next) => {
  try {
    const { bloodGroup, location } = req.body;

    if (!bloodGroup || !location || location.lat === undefined || location.lng === undefined) {
      res.status(400);
      throw new Error('Please provide bloodGroup and location (lat, lng)');
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

    // 1. Map donors with distance, 2. Filter by 10km and eligibility, 3. Sort by distance, 4. Limit to 5
    const matchingDonors = potentialDonors
      .map(donor => {
        // Calculate distance for all potential donors first
        const distance = calculateDistance(
          location.lat,
          location.lng,
          donor.location.lat,
          donor.location.lng
        );
        return { ...donor.toObject(), distance };
      })
      .filter(donor => {
        // Check 10km radius
        if (donor.distance > 10) return false;

        // Check 90 days eligibility
        if (donor.lastDonationDate) {
          const ninetyDaysInMillis = 90 * 24 * 60 * 60 * 1000;
          const donationTime = new Date(donor.lastDonationDate).getTime();
          const now = Date.now();
          if (now - donationTime <= ninetyDaysInMillis) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => a.distance - b.distance) // Sort by nearest
      .slice(0, 5); // Limit to top 5

    // Create a notification for each matched donor
    if (matchingDonors.length > 0) {
      const notifications = matchingDonors.map((donor) => ({
        donor: donor._id,
        request: request._id,
        bloodGroup,
        message: `Urgent: Someone nearby needs ${bloodGroup} blood. You are one of the closest available donors (${donor.distance.toFixed(1)}km away).`,
      }));
      await Notification.insertMany(notifications);
    }

    res.status(201).json({
      request,
      matchingDonors,
      notified: matchingDonors.length,
    });
  } catch (error) {
    next(error);
  }
};

export { getRequests, createRequest };
