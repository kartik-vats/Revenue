import mongoose from 'mongoose';

const RevenueSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true, min: 0 },
    source: { type: String, required: true, trim: true }, // e.g., "Client A", "Product Sales", "Subscription"
    category: { type: String, default: 'General' }, // e.g., "Recurring", "One-time", "Consulting"
    description: { type: String, trim: true },
    date: { type: Date, required: true, default: Date.now },
    status: { type: String, enum: ['Confirmed', 'Pending', 'Cancelled'], default: 'Confirmed' },
    clientId: { type: String, default: '' },
    invoiceNumber: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model('Revenue', RevenueSchema);
