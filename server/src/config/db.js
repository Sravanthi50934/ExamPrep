import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

let isConnected = false;
let isInMemoryFallback = false;
let cachedPromise = null;

export const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cachedPromise) {
    return cachedPromise;
  }

  const uri = process.env.MONGODB_URI;
  const isVercelOrProd = process.env.VERCEL || process.env.NODE_ENV === 'production';
  const isLocalUri = uri && (uri.includes('127.0.0.1') || uri.includes('localhost'));

  if (!uri || uri.includes('<username>') || uri.includes('user:password') || (isVercelOrProd && isLocalUri)) {
    console.warn('\n⚠️ [Database Notice]: MongoDB Atlas URI not configured or contains local/placeholder credentials in cloud environment.');
    console.warn('👉 To persist data across all serverless invocations, set MONGODB_URI in Vercel project environment variables.');
    console.warn('⚡ Initializing resilient in-memory local fallback store so you can immediately explore and test all features without interruption!\n');
    isInMemoryFallback = true;
    return null;
  }

  try {
    mongoose.set('strictQuery', false);
    cachedPromise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      bufferCommands: false
    });
    const conn = await cachedPromise;
    isConnected = true;
    console.log(`\n✅ [MongoDB Atlas Connected]: ${conn.connection.host} / ${conn.connection.name}`);
    return conn;
  } catch (error) {
    cachedPromise = null;
    console.warn('\n⚠️ [MongoDB Atlas Connection Warning]:', error.message);
    console.warn('👉 Could not connect to the remote MongoDB cluster (check your network / IP whitelist in MongoDB Atlas).');
    console.warn('⚡ Seamlessly activating resilient fallback data store so the application runs without crashing!\n');
    isInMemoryFallback = true;
    return null;
  }
};

export const getDBStatus = () => ({
  isConnected: mongoose.connection.readyState === 1,
  isInMemoryFallback,
  type: mongoose.connection.readyState === 1 ? 'MongoDB Atlas (Live)' : 'Resilient In-Memory Fallback'
});
