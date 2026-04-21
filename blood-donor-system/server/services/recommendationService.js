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

export const calculateScore = (donor, radiusKm = 10) => {
  // Ensure we have a valid numeric distance, default to max radius if missing or invalid
  const distance = (typeof donor.distance === 'number' && !isNaN(donor.distance)) 
    ? donor.distance 
    : radiusKm;
  
  // 1. Normalized Distance Score (closer is better, range 0 to 1)
  // Example: 2km away with 10km radius = 0.8 score.
  let normalizedDistanceScore = 1 - (distance / radiusKm);
  normalizedDistanceScore = Math.max(0, Math.min(1, normalizedDistanceScore));

  // 2. Response Rate Score (default to 0.5 for new/neutral donors)
  const responseRateScore = (donor.responseRate != null && !isNaN(donor.responseRate)) 
    ? donor.responseRate 
    : 0.5;

  // 3. Availability Score (isEligible considers if they donated in the last 90 days)
  const availabilityScore = donor.isEligible === false ? 0 : 1.0; 

  // Combined score with requested weights: 
  // 40% Distance + 40% Response Rate + 20% Availability/Eligibility
  const recommendationScore = (0.4 * normalizedDistanceScore) + (0.4 * responseRateScore) + (0.2 * availabilityScore);
  
  return recommendationScore;
};

export const rankDonors = (donors, radiusKm = 10, limit = 5) => {
  // Calculate score for each donor
  const scoredDonors = donors.map(donor => {
    const score = calculateScore(donor, radiusKm);
    
    // Generate Reason
    let reason = "Selected due to ";
    const reasons = [];
    if (donor.distance <= 3) {
      reasons.push("close proximity");
    }
    if ((donor.responseRate != null ? donor.responseRate : 0.5) >= 0.7) {
      reasons.push("high response rate");
    }
    if (donor.isEligible !== false) {
      reasons.push("ideal availability");
    }
    
    if (reasons.length === 0) {
      reason += "overall suitability";
    } else {
      reason += reasons.join(" and ");
    }

    return {
      ...donor,
      recommendationScore: score,
      reason
    };
  });

  // Sort by score descending
  scoredDonors.sort((a, b) => b.recommendationScore - a.recommendationScore);

  // Return top 5
  return scoredDonors.slice(0, limit);
};
