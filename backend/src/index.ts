import express from 'express';
import cors from 'cors';
import { urlRoutes, redirectRoutes } from './routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/urls', urlRoutes);

// Redirect routes (must be last to avoid conflicts)
app.use('/', redirectRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
