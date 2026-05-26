import User from '../models/User.js';
import Place from '../models/Place.js';
import asyncHandler from '../middleware/asyncHandler.js';

export const addFavorite = asyncHandler(async (req, res) => {
  const place = await Place.findById(req.params.placeId);
  if (!place) return res.status(404).json({ success: false, message: 'Place not found' });

  await User.findByIdAndUpdate(req.user._id, { $addToSet: { savedPlaces: place._id } });
  const user = await User.findById(req.user._id).populate('savedPlaces');
  res.status(201).json({ success: true, savedPlaces: user.savedPlaces });
});

export const removeFavorite = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $pull: { savedPlaces: req.params.placeId } });
  const user = await User.findById(req.user._id).populate('savedPlaces');
  res.json({ success: true, savedPlaces: user.savedPlaces });
});

export const getFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('savedPlaces');
  res.json({ success: true, savedPlaces: user.savedPlaces });
});
