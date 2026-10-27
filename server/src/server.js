import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import farmRoutes from './routes/farms.js';
import cropRoutes from './routes/crops.js';
import soilRoutes from './routes/soil.js';
import weatherRoutes from './routes/weather.js';

dotenv.config();
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }), authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/soil', soilRoutes);
app.use('/api/weather', weatherRoutes);
app.get('/api/health', (_req, res) => res.json({ status: 'ok', app: 'AgriTech API' }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});
const port = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agritech')
  .then(() => app.listen(port, () => console.log(`AgriTech API running on port ${port}`)))
  .catch((err) => { console.error('MongoDB connection failed:', err.message); process.exit(1); });
