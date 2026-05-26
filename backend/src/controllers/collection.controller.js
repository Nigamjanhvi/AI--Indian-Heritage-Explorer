import Collection from '../models/Collection.js';

export async function getCollections(req, res) {
  const collections = await Collection.find({ user: req.user._id }).populate('sites').sort({ createdAt: -1 });
  res.json({ collections });
}

export async function createCollection(req, res) {
  const collection = await Collection.create({ ...req.body, user: req.user._id });
  res.status(201).json({ collection });
}

export async function updateCollection(req, res) {
  const collection = await Collection.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, {
    new: true,
    runValidators: true
  }).populate('sites');
  if (!collection) return res.status(404).json({ message: 'Collection not found' });
  res.json({ collection });
}

export async function deleteCollection(req, res) {
  const collection = await Collection.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!collection) return res.status(404).json({ message: 'Collection not found' });
  res.json({ message: 'Collection deleted' });
}
