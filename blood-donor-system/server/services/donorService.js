import Donor from '../models/Donor.js';

// Haversine formula to calculate distance between two coordinates in kilometers
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
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

// Check if a donor is eligible based on their last donation date (90 days interval)
export const check90DaysEligibility = (lastDonationDate) => {
  if (!lastDonationDate) return true;
  
  const ninetyDaysInMillis = 90 * 24 * 60 * 60 * 1000;
  const donationTime = new Date(lastDonationDate).getTime();
  const now = Date.now();
  
  return (now - donationTime) > ninetyDaysInMillis;
};

/**
 * Find available eligible nearby donors
 * @param {string} bloodGroup 
 * @param {object} location { lat, lng }
 * @param {number} radiusKm 
 * @param {number} limit 
 * @returns {Array} Array of donor objects with distance attached
 */
export const findEligibleNearbyDonors = async ({ bloodGroup, location, radiusKm = 10, limit = 5 }) => {
  // Find available donors with the same blood group
  const potentialDonors = await Donor.find({
    bloodGroup: bloodGroup,
    available: true
  });

  // Calculate distance, filter eligible, sort and limit
  const matchingDonors = potentialDonors
    .map(donor => {
      const distance = calculateDistance(
        location.lat,
        location.lng,
        donor.location.lat,
        donor.location.lng
      );
      return { ...donor.toObject(), distance };
    })
    .filter(donor => donor.distance <= radiusKm) // Filter by distance
    .filter(donor => check90DaysEligibility(donor.lastDonationDate)) // Filter by eligibility
    .sort((a, b) => a.distance - b.distance) // Sort by nearest
    .slice(0, limit); // Limit

  return matchingDonors;
};
