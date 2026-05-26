import Place from '../models/Place.js';
import Review from '../models/Review.js';
import asyncHandler from '../middleware/asyncHandler.js';

function imageFromRequest(req) {
  if (req.file) return `/uploads/${req.file.filename}`;
  return req.body.image || '';
}

export const getPlaces = asyncHandler(async (req, res) => {
  const { state, city, category, UNESCO } = req.query;
  const filter = {};
  if (state) filter.state = { $regex: state, $options: 'i' };
  if (city) filter.city = { $regex: city, $options: 'i' };
  if (category) filter.category = { $regex: category, $options: 'i' };
  if (UNESCO !== undefined && UNESCO !== '') filter.UNESCO = UNESCO === 'true';

  const places = await Place.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: places.length, places });
});

export const getPlaceById = asyncHandler(async (req, res) => {
  const place = await Place.findById(req.params.id);
  if (!place) return res.status(404).json({ success: false, message: 'Place not found' });

  const reviews = await Review.find({ place: place._id }).populate('user', 'name profilePicture').sort({ createdAt: -1 });
  res.json({ success: true, place, reviews });
});

export const createPlace = asyncHandler(async (req, res) => {
  const place = await Place.create({ ...req.body, image: imageFromRequest(req), createdBy: req.user?._id });
  res.status(201).json({ success: true, place });
});

export const updatePlace = asyncHandler(async (req, res) => {
  const updates = { ...req.body };
  const image = imageFromRequest(req);
  if (image) updates.image = image;

  const place = await Place.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!place) return res.status(404).json({ success: false, message: 'Place not found' });
  res.json({ success: true, place });
});

export const deletePlace = asyncHandler(async (req, res) => {
  const place = await Place.findByIdAndDelete(req.params.id);
  if (!place) return res.status(404).json({ success: false, message: 'Place not found' });
  await Review.deleteMany({ place: place._id });
  res.json({ success: true, message: 'Place deleted successfully' });
});

export const searchPlaces = asyncHandler(async (req, res) => {
  const q = req.query.q || '';
  const normalized = q.trim();

  if (!normalized) return res.json({ success: true, count: 0, places: [] });

  const regex = { $regex: normalized, $options: 'i' };
  const places = await Place.find({
    $or: [
      { name: regex },
      { state: regex },
      { city: regex },
      { category: regex },
      { description: regex },
      { history: regex }
    ]
  }).limit(30);

  res.json({ success: true, count: places.length, places });
});
