import Trip from '../models/Trip.js';

export async function getTrips(req, res) {
  const trips = await Trip.find({ user: req.user._id }).populate('locations itinerary.locations').sort({ createdAt: -1 });
  res.json({ trips });
}

export async function createTrip(req, res) {
  const trip = await Trip.create({ ...req.body, user: req.user._id });
  res.status(201).json({ trip });
}

export async function updateTrip(req, res) {
  const trip = await Trip.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, {
    new: true,
    runValidators: true
  }).populate('locations itinerary.locations');
  if (!trip) return res.status(404).json({ message: 'Trip not found' });
  res.json({ trip });
}

export async function deleteTrip(req, res) {
  const trip = await Trip.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!trip) return res.status(404).json({ message: 'Trip not found' });
  res.json({ message: 'Trip deleted' });
}
