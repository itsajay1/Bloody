import Donor from '../models/Donor.js';
import { calculateDistance, rankDonors } from './recommendationService.js';

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

  // Calculate distance, filter by distance initially
  const nearbyDonors = potentialDonors
    .map(donor => {
      const distance = calculateDistance(
        location.lat,
        location.lng,
        donor.location.lat,
        donor.location.lng
      );
      return { 
        ...donor.toObject(), 
        distance,
        isEligible: check90DaysEligibility(donor.lastDonationDate)
      };
    })
    .filter(donor => donor.distance <= radiusKm); // Filter by distance

  // Use Recommendation System to score and rank donors
  const matchingDonors = rankDonors(nearbyDonors, radiusKm, limit);

  return matchingDonors;
};
