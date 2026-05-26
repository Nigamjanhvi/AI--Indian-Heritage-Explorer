import Review from '../models/Review.js';

export async function addReview(req, res) {
  const review = await Review.create({ ...req.body, user: req.user._id });
  await review.populate('user', 'name avatar');
  res.status(201).json({ review });
}

export async function updateReview(req, res) {
  const review = await Review.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!review) return res.status(404).json({ message: 'Review not found' });
  res.json({ review });
}

export async function deleteReview(req, res) {
  const review = await Review.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!review) return res.status(404).json({ message: 'Review not found' });
  res.json({ message: 'Review deleted' });
}
