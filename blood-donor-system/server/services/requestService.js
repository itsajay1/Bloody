import Request from '../models/Request.js';
import Notification from '../models/Notification.js';
import { findEligibleNearbyDonors } from './donorService.js';
import { sendPushNotification } from './firebaseService.js';

export const createBloodRequestWithNotifications = async ({ bloodGroup, location }) => {
  // Save the request
  const request = await Request.create({
    bloodGroup,
    location
  });

  // Find available matching donors within 10km
  const matchingDonors = await findEligibleNearbyDonors({ bloodGroup, location, radiusKm: 10, limit: 5 });

  // Create notifications for matched donors
  if (matchingDonors.length > 0) {
    const notifications = matchingDonors.map((donor) => ({
      donor: donor._id,
      request: request._id,
      bloodGroup,
      message: `Urgent: Someone nearby needs ${bloodGroup} blood. You are one of the closest available donors (${donor.distance.toFixed(1)}km away).`,
    }));
    await Notification.insertMany(notifications);

    // Dispatch FCM Push Notification to all extracted tokens
    const fcmTokens = matchingDonors
      .map(donor => donor.fcmTokens)
      .flat()
      .filter(token => token); // Ensure it's not empty

    if (fcmTokens.length > 0) {
      await sendPushNotification(fcmTokens, {
        title: 'Urgent Blood Request Nearby',
        body: `Someone nearby needs ${bloodGroup} blood. Please check your app to respond.`
      });
    }
  }

  return { request, matchingDonors, notified: matchingDonors.length };
};
