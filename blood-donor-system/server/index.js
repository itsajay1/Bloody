import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Import routes
import donorRoutes from './routes/donorRoutes.js';
import requestRoutes from './routes/requestRoutes.js';

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/donor', donorRoutes);
app.use('/api/request', requestRoutes);

app.get('/api/test', (req, res) => {
  res.json({ message: 'API working' });
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
