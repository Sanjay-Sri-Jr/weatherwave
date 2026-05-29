import './config/env.js';           
import express    from 'express';
import cors       from 'cors';
import connectDB  from './config/db.js';
import authRoutes    from './routes/authRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import errorMiddleware  from './middleware/errorMiddleware.js';
import { generalLimiter } from './middleware/rateLimitMiddleware.js';
import logger from './utils/logger.js';

// Connect to MongoDB
connectDB();

const app = express();

// Trust reverse proxy (required for Vercel + rate limiting)
app.set('trust proxy', 1);

// Global Middleware 
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(generalLimiter);

// Routes 
app.use('/api/auth',    authRoutes);
app.use('/api/weather', weatherRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running.', timestamp: new Date() });
});

// Global Error Handler — MUST be last
app.use(errorMiddleware);

// Vercel calls this export as a serverless function
export default app;

//  Keeping listen() for local development only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
  });
}