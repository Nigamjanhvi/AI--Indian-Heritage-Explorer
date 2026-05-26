import mongoose from 'mongoose';

const itineraryDaySchema = new mongoose.Schema(
  {
    day: Number,
    title: String,
    notes: String,
    locations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Site' }]
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    startDate: Date,
    endDate: Date,
    locations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Site' }],
    itinerary: [itineraryDaySchema],
    notes: String
  },
  { timestamps: true }
);

export default mongoose.model('Trip', tripSchema);
