import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Place name is required'], trim: true, index: true },
    state: { type: String, required: [true, 'State is required'], trim: true, index: true },
    city: { type: String, required: [true, 'City is required'], trim: true, index: true },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Temple', 'Monument', 'UNESCO', 'Festival', 'Culture', 'Fort', 'Museum', 'Heritage Site'],
      index: true
    },
    description: { type: String, required: [true, 'Description is required'] },
    history: { type: String, default: '' },
    image: { type: String, default: '' },
    latitude: { type: Number },
    longitude: { type: Number },
    UNESCO: { type: Boolean, default: false, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

placeSchema.index({
  name: 'text',
  state: 'text',
  city: 'text',
  category: 'text',
  description: 'text',
  history: 'text'
});

export default mongoose.model('Place', placeSchema);
