import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB, getDBStatus } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import mockTestRoutes from './routes/mockTestRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

dotenv.config();

const app = express();

// CORS configuration: support local development, custom FRONTEND_URL, and any Vercel domain
const customOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map(url => url.trim().replace(/\/$/, ''))
  .filter(Boolean);

const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:4173',
  'http://127.0.0.1:3000',
  ...customOrigins
];

const isAllowedOrigin = (origin) => {
  if (!origin) return true; // Allow tools, curls, postman, and server-to-server requests
  if (defaultOrigins.includes(origin)) return true;
  // Allow all preview and production *.vercel.app origins
  if (/\.vercel\.app$/.test(origin)) return true;
  return false;
};

app.use(cors({
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }
    // Return callback with false rather than throwing error to prevent 500 crash
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle preflight OPTIONS requests across all routes
app.options('*', cors());

app.use(express.json());
app.use(morgan('dev'));

// Ensure database connection is ready for each request
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    // connectDB already falls back to resilient in-memory store
  }
  next();
});

// Root friendly API info endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    name: 'Exam Preparation Tracker API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      subjects: '/api/subjects',
      sessions: '/api/sessions',
      mockTests: '/api/mock-tests',
      analytics: '/api/analytics'
    },
    database: getDBStatus(),
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: getDBStatus()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/mock-tests', mockTestRoutes);
app.use('/api/analytics', analyticsRoutes);

// Fallback 404
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Export the app for Vercel serverless (api/index.js imports this)
export default app;

// Only bind to a port when running standalone (not on Vercel serverless)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Exam Preparation Tracker Backend running on port ${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`======================================================\n`);
  });
}
