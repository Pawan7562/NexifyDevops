import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import { Server as SocketIOServer } from 'socket.io';
import apiRoutes from './routes/api';
import { db } from './db/database';
import { setSocketIO, startUptimeWorker } from './workers/uptimeWorker';

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5001;

// Socket.IO configuration with CORS enabled for frontend
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

setSocketIO(io);

io.on('connection', (socket) => {
  console.log(`[WebSocket] Client connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`[WebSocket] Client disconnected: ${socket.id}`);
  });
});

// Security & Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    service: 'Nexify DevOps Enterprise Backend',
    version: '1.0.0-PROD',
    timestamp: new Date().toISOString(),
    uptimeSeconds: process.uptime(),
  });
});

// Mount REST API routes
app.use('/api/v1', apiRoutes);
app.use('/api', apiRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Server Error]', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message,
  });
});

import { initPostgresDatabase } from './db/postgres';

// Initialize database and start server
async function bootstrap() {
  try {
    await db.init();
    await initPostgresDatabase();
    
    server.listen(PORT, () => {

      console.log(`=======================================================`);
      console.log(`🚀 Nexify DevOps Enterprise Backend is running!`);
      console.log(`📡 REST API:      http://localhost:${PORT}/api/v1`);
      console.log(`⚡ Health Check:  http://localhost:${PORT}/api/health`);
      console.log(`🔌 WebSockets:    ws://localhost:${PORT}`);
      console.log(`=======================================================`);
    });

    // Start background uptime ping worker
    startUptimeWorker(45000);
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

bootstrap();
