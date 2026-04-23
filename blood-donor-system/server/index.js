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
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

const server = http.createServer(app);
const io = initSocket(server);

// Middleware

// 1. Detailed Request Logging (Top priority for debugging)
app.use((req, res, next) => {
  const origin = req.headers.origin || 'No Origin';
  const userAgent = req.headers['user-agent'] || 'No User Agent';
  const referer = req.headers.referer || 'No Referer';
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - Origin: ${origin} - Referer: ${referer} - UA: ${userAgent}`);
  next();
});

// 2. Optimized CORS for Mobile (Capacitor) and Web
app.use(cors({
  origin: (origin, callback) => {
    // In Capacitor/Mobile, origin can be missing, http://localhost, or capacitor://localhost
    // We allow all origins but must reflect the exact origin for credentials to work
    if (!origin) return callback(null, true);
    
    // Always allow localhost and Render domains
    callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Access-Control-Allow-Origin'],
  credentials: true,
  optionsSuccessStatus: 204
}));
app.options("*", cors());

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
  res.json({ status: "ok" });
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
