import express from 'express';
import {
  predictRevenue,
  getRevenueAnalytics,
  getExpenseInsights,
  getDashboardData,
  suggestCategory,
  spendingInsight,
  getModelMetrics
} from '../controllers/predictionController.js';

const router = express.Router();

// Revenue prediction endpoints
router.post('/revenue', predictRevenue);
router.get('/revenue/analytics', getRevenueAnalytics);

// Expense insights endpoints
router.get('/expenses/insights', getExpenseInsights);
router.post('/expenses/insight', spendingInsight);

// Dashboard and comprehensive data
router.get('/dashboard', getDashboardData);

// ML utilities
router.post('/category', suggestCategory);
router.get('/model/metrics', getModelMetrics);

export default router;


