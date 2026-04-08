import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { initSocket } from './utils/socket.js';

// Import routes
import donorRoutes from './routes/donorRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import userRoutes from './routes/userRoutes.js';

// ESM-compatible __dirname (not available natively in ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to database
connectDB();

const server = http.createServer(app);
const io = initSocket(server);

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for development bridge
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Routes
app.use('/api/auth', userRoutes);
app.use('/api/donor', donorRoutes);
app.use('/api/request', requestRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'API working', data: null });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    message: 'Server is healthy',
    data: {
      status: 'healthy', 
      timestamp: new Date(),
      ip: req.ip
    }
  });
});

// --- Serve React frontend in production ---
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');

  // Serve static files from the React/Vite build output
  app.use(express.static(clientBuildPath));

  // Catch-all: any route that is NOT an API route serves index.html
  // This allows React Router to handle client-side navigation
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// Error Handling Middleware (must come after all routes)
app.use(notFound);
app.use(errorHandler);

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server with Socket.io is running on port ${PORT}`);
});
