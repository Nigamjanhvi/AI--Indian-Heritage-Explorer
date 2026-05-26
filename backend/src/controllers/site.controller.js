import Site from '../models/Site.js';
import Review from '../models/Review.js';

function imageUrls(req) {
  return (req.files || []).map(file => `/uploads/${file.filename}`);
}

export async function getAllSites(req, res) {
  const { name, state, category, unescoStatus, q } = req.query;
  const filter = {};

  if (name) filter.name = { $regex: name, $options: 'i' };
  if (state) filter.state = { $regex: state, $options: 'i' };
  if (category) filter.category = { $regex: category, $options: 'i' };
  if (unescoStatus !== undefined && unescoStatus !== '') filter.unescoStatus = unescoStatus === 'true';
  if (q) filter.$text = { $search: q };

  const sites = await Site.find(filter).sort({ createdAt: -1 });
  res.json({ sites });
}

export async function getSiteById(req, res) {
  const site = await Site.findById(req.params.id).populate('createdBy', 'name');
  if (!site) return res.status(404).json({ message: 'Heritage site not found' });

  const reviews = await Review.find({ site: site._id }).populate('user', 'name avatar').sort({ createdAt: -1 });
  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  res.json({ site, reviews, averageRating: Number(averageRating.toFixed(1)) });
}

export async function createSite(req, res) {
  const site = await Site.create({
    ...req.body,
    unescoStatus: req.body.unescoStatus === 'true' || req.body.unescoStatus === true,
    images: imageUrls(req),
    createdBy: req.user._id
  });
  res.status(201).json({ site });
}

export async function updateSite(req, res) {
  const updates = {
    ...req.body,
    unescoStatus: req.body.unescoStatus === 'true' || req.body.unescoStatus === true
  };
  const newImages = imageUrls(req);
  if (newImages.length) updates.$push = { images: { $each: newImages } };

  const site = await Site.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!site) return res.status(404).json({ message: 'Heritage site not found' });
  res.json({ site });
}

export async function deleteSite(req, res) {
  const site = await Site.findByIdAndDelete(req.params.id);
  if (!site) return res.status(404).json({ message: 'Heritage site not found' });
  await Review.deleteMany({ site: site._id });
  res.json({ message: 'Heritage site deleted' });
}

export async function getSuggestions(req, res) {
  const q = req.query.q || '';
  if (!q.trim()) return res.json({ suggestions: [] });
  const suggestions = await Site.find({ name: { $regex: q, $options: 'i' } }).select('name state category').limit(8);
  res.json({ suggestions });
}
