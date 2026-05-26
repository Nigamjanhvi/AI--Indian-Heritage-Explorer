import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: String,
    coverImage: String,
    sites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Site' }],
    isPublic: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model('Collection', collectionSchema);
