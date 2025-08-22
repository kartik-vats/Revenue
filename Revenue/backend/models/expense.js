import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    category: { type: String, default: '' },
    vendor: { type: String, default: '' },
    status: { type: String, enum: ['Pending', 'Approved'], default: 'Pending' },
    receiptFilename: { type: String, default: '' },
    receiptOriginalName: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model('Expense', ExpenseSchema);


