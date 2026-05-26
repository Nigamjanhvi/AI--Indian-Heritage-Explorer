import Favorite from '../models/Favorite.js';

export async function getFavorites(req, res) {
  const favorites = await Favorite.find({ user: req.user._id }).populate('site').sort({ createdAt: -1 });
  res.json({ favorites });
}

export async function addFavorite(req, res) {
  const favorite = await Favorite.findOneAndUpdate(
    { user: req.user._id, site: req.body.site },
    { user: req.user._id, site: req.body.site },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).populate('site');
  res.status(201).json({ favorite });
}

export async function removeFavorite(req, res) {
  await Favorite.findOneAndDelete({ user: req.user._id, site: req.params.siteId });
  res.json({ message: 'Favorite removed' });
}
