import User from '../models/User.js';
import Site from '../models/Site.js';
import Review from '../models/Review.js';

export async function getProfile(req, res) {
  res.json({ user: req.user });
}

export async function updateProfile(req, res) {
  const allowed = ['name', 'interests', 'avatar'];
  allowed.forEach(field => {
    if (req.body[field] !== undefined) req.user[field] = req.body[field];
  });
  await req.user.save();
  res.json({ user: req.user });
}

export async function getAdminStats(req, res) {
  const [totalUsers, totalHeritageSites, totalReviews, categories, states] = await Promise.all([
    User.countDocuments(),
    Site.countDocuments(),
    Review.countDocuments(),
    Site.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    Site.aggregate([{ $group: { _id: '$state', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 8 }])
  ]);

  res.json({ totalUsers, totalHeritageSites, totalReviews, categories, states });
}
