import Expense from '../models/expense.js';

export const listExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch expenses', error: error.message });
  }
};

export const createExpense = async (req, res) => {
  try {
    const { description, amount, category, vendor } = req.body;
    const expense = new Expense({
      description,
      amount,
      category,
      vendor,
      receiptFilename: req.file?.filename || '',
      receiptOriginalName: req.file?.originalname || ''
    });
    const saved = await expense.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create expense', error: error.message });
  }
};

export const getExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json(expense);
  } catch (error) {
    res.status(400).json({ message: 'Failed to get expense', error: error.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { description, amount, category, vendor, status } = req.body;
    const updates = { description, amount, category, vendor, status };
    if (req.file) {
      updates.receiptFilename = req.file.filename;
      updates.receiptOriginalName = req.file.originalname;
    }
    const expense = await Expense.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json(expense);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update expense', error: error.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete expense', error: error.message });
  }
};

export const approveExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { status: 'Approved' },
      { new: true }
    );
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json(expense);
  } catch (error) {
    res.status(400).json({ message: 'Failed to approve expense', error: error.message });
  }
};


