import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import expenseRoutes from './routes/expenseRoutes.js';
import revenueRoutes from './routes/revenueRoutes.js';
import predictionRoutes from './routes/predictionRoutes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const uploadsPath = path.join(process.cwd(), 'backend', 'uploads');
app.use('/uploads', express.static(uploadsPath));

app.use('/api/expenses', expenseRoutes);
app.use('/api/revenue', revenueRoutes);
app.use('/api/predict', predictionRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.listen(5000, () => console.log('Server running on port 5000'));
