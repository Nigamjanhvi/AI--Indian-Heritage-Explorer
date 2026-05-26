import mongoose from 'mongoose';

const itineraryItemSchema = new mongoose.Schema(
  {
    day: Number,
    title: String,
    places: [String],
    food: [String],
    route: String,
    notes: String
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    days: { type: Number, required: true, min: 1 },
    budget: { type: String, enum: ['low', 'medium', 'luxury'], default: 'medium' },
    interests: [{ type: String, trim: true }],
    itinerary: [itineraryItemSchema]
  },
  { timestamps: true }
);

export default mongoose.model('Trip', tripSchema);
