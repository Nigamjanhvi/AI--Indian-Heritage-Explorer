import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    site: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

reviewSchema.index({ site: 1, user: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);
