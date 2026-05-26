import mongoose from 'mongoose';

const siteSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    state: { type: String, required: true, trim: true, index: true },
    city: { type: String, trim: true },
    slug: { type: String, trim: true, index: true },
    category: { type: String, required: true, trim: true, index: true },
    type: { type: String, enum: ['heritage', 'temple', 'monument', 'unesco', 'festival', 'culture'], default: 'heritage', index: true },
    unescoStatus: { type: Boolean, default: false, index: true },
    unescoYear: Number,
    description: { type: String, required: true },
    history: String,
    architecture: String,
    festivals: [String],
    food: [String],
    nearbyAttractions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Site' }],
    aiSummary: String,
    virtualTourUrl: String,
    bestTimeToVisit: String,
    entryFee: String,
    timings: String,
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    latitude: Number,
    longitude: Number,
    images: [String],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

siteSchema.index({ name: 'text', state: 'text', category: 'text', description: 'text' });

export default mongoose.model('Site', siteSchema);
