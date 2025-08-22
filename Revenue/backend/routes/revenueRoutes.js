import express from 'express';
import {
  listRevenue,
  createRevenue,
  getRevenue,
  updateRevenue,
  deleteRevenue,
  getRevenueAnalytics
} from '../controllers/revenueController.js';

const router = express.Router();

router.get('/', listRevenue);
router.post('/', createRevenue);
router.get('/analytics', getRevenueAnalytics);
router.get('/:id', getRevenue);
router.put('/:id', updateRevenue);
router.delete('/:id', deleteRevenue);

export default router;
