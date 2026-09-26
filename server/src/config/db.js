import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

let isConnected = false;
let isInMemoryFallback = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<username>') || uri.includes('user:password')) {
    console.warn('\n⚠️ [Database Notice]: MongoDB Atlas URI not configured or contains placeholder credentials.');
    console.warn('👉 Please update MONGODB_URI in `server/.env` with your real MongoDB Atlas connection string.');
    console.warn('⚡ Initializing resilient in-memory local fallback store so you can immediately explore and test all features without interruption!\n');
    isInMemoryFallback = true;
    return;
  }

  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });
    isConnected = true;
    console.log(`\n✅ [MongoDB Atlas Connected]: ${conn.connection.host} / ${conn.connection.name}`);
  } catch (error) {
    console.warn('\n⚠️ [MongoDB Atlas Connection Warning]:', error.message);
    console.warn('👉 Could not connect to the remote MongoDB cluster (check your network / IP whitelist in MongoDB Atlas).');
    console.warn('⚡ Seamlessly activating resilient fallback data store so the application runs without crashing!\n');
    isInMemoryFallback = true;
  }
};

export const getDBStatus = () => ({
  isConnected,
  isInMemoryFallback,
  type: isConnected ? 'MongoDB Atlas (Live)' : 'Resilient In-Memory Fallback'
});
