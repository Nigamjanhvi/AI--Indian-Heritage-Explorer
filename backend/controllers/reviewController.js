import Review from '../models/Review.js';
import Place from '../models/Place.js';
import asyncHandler from '../middleware/asyncHandler.js';

export const addReview = asyncHandler(async (req, res) => {
  const { place, rating, comment } = req.body;
  const exists = await Place.findById(place);
  if (!exists) return res.status(404).json({ success: false, message: 'Place not found' });

  const review = await Review.findOneAndUpdate(
    { user: req.user._id, place },
    { user: req.user._id, place, rating, comment },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  ).populate('user', 'name profilePicture');

  res.status(201).json({ success: true, review });
});

export const getReviewsByPlace = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ place: req.params.placeId }).populate('user', 'name profilePicture').sort({ createdAt: -1 });
  res.json({ success: true, count: reviews.length, reviews });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const query = req.user.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, user: req.user._id };
  const review = await Review.findOneAndDelete(query);
  if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
  res.json({ success: true, message: 'Review deleted successfully' });
});
