import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  listExpenses,
  createExpense,
  getExpense,
  updateExpense,
  deleteExpense,
  approveExpense
} from '../controllers/expenseController.js';

const router = express.Router();

const uploadsDir = path.join(process.cwd(), 'backend', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const upload = multer({ storage });

router.get('/', listExpenses);
router.post('/', upload.single('receipt'), createExpense);
router.get('/:id', getExpense);
router.put('/:id', upload.single('receipt'), updateExpense);
router.delete('/:id', deleteExpense);
router.post('/:id/approve', approveExpense);

export default router;


