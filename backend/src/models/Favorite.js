import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    site: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true }
  },
  { timestamps: true }
);

favoriteSchema.index({ user: 1, site: 1 }, { unique: true });

export default mongoose.model('Favorite', favoriteSchema);
