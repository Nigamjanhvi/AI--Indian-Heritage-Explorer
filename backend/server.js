import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import placeRoutes from './routes/placeRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = Number(process.env.PORT) || 5000;
const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

function corsOrigin(origin, callback) {
  if (!origin) return callback(null, true);
  if (allowedOrigins.includes(origin)) return callback(null, true);
  if (/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) return callback(null, true);
  return callback(new Error(`CORS blocked origin: ${origin}`));
}

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    service: 'Indian Heritage Explorer API',
    status: 'healthy',
    database: global.databaseConnected ? 'connected' : 'not configured'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

function startServer(port, hasRetried = false) {
  const server = app.listen(port, () => console.log(`Server running on http://localhost:${port}`));

  server.on('error', error => {
    if (error.code === 'EADDRINUSE') {
      const fallbackPort = port + 1;
      const canFallback = process.env.NODE_ENV !== 'production' && !hasRetried && !process.env.PORT;

      if (canFallback) {
        console.warn(`Port ${port} is already in use. Trying http://localhost:${fallbackPort} instead...`);
        startServer(fallbackPort, true);
        return;
      }

      console.error(`Port ${port} is already in use. Stop the other process or set PORT=${fallbackPort}.`);
      process.exit(1);
    }

    console.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  });
}

connectDB()
  .then(isConnected => {
    global.databaseConnected = isConnected;
    startServer(PORT);
  })
  .catch(error => {
    console.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  });
