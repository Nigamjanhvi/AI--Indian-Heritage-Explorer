import User from '../models/User.js';
import Place from '../models/Place.js';
import Review from '../models/Review.js';
import Trip from '../models/Trip.js';
import asyncHandler from '../middleware/asyncHandler.js';

export const dashboardAnalytics = asyncHandler(async (req, res) => {
  const [totalUsers, totalPlaces, totalReviews, totalTrips, placesByState, placesByCategory] = await Promise.all([
    User.countDocuments(),
    Place.countDocuments(),
    Review.countDocuments(),
    Trip.countDocuments(),
    Place.aggregate([{ $group: { _id: '$state', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }]),
    Place.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count: -1 } }])
  ]);

  res.json({
    success: true,
    analytics: { totalUsers, totalPlaces, totalReviews, totalTrips, placesByState, placesByCategory }
  });
});
