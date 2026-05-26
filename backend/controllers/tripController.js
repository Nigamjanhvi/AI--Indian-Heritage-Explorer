import Trip from '../models/Trip.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { generateItinerary } from '../services/geminiService.js';

export const createTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.create({ ...req.body, user: req.user._id });
  res.status(201).json({ success: true, trip });
});

export const getTrips = asyncHandler(async (req, res) => {
  const trips = await Trip.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, trips });
});

export const generateTripItinerary = asyncHandler(async (req, res) => {
  const { state, days = 3, budget = 'medium', interests = [] } = req.body;
  const itineraryText = await generateItinerary({ state, days, budget, interests });

  const trip = await Trip.create({
    user: req.user._id,
    days,
    budget,
    interests,
    itinerary: [{ day: 1, title: `AI itinerary for ${state || 'India'}`, notes: itineraryText }]
  });

  res.status(201).json({ success: true, answer: itineraryText, trip });
});
