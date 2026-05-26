import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri || uri.includes('<username>')) {
    console.warn('MongoDB Atlas is not configured. API is running without a database connection.');
    return false;
  }

  await mongoose.connect(uri);
  console.log('MongoDB Atlas connected');
  return true;
}
