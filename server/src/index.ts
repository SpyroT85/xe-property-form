import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import autocompleteRouter from './routes/autocomplete';
import adsRouter from './routes/ads';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/autocomplete', autocompleteRouter);
app.use('/api/ads', adsRouter);

// Quick sanity check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});