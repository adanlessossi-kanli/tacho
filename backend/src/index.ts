import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { initializeDatabase } from './database';
import { setupWebSocket } from './websocket';
import { scheduleJobs } from './jobs';
import apiRoutes from './routes';

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

setupWebSocket(server);
scheduleJobs();

initializeDatabase().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Database initialization failed:', err);
  process.exit(1);
});
