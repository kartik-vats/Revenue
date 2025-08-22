import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Expense from './models/expense.js';

dotenv.config();

const sampleExpenses = [
  {
    description: "Office Rent",
    amount: 25000,
    category: "Rent",
    vendor: "ABC Properties",
    status: "Approved"
  },
  {
    description: "Laptop Purchase",
    amount: 45000,
    category: "Equipment",
    vendor: "Dell Technologies",
    status: "Approved"
  },
  {
    description: "Internet & Phone",
    amount: 3500,
    category: "Utilities",
    vendor: "Jio Fiber",
    status: "Pending"
  },
  {
    description: "Marketing Campaign",
    amount: 15000,
    category: "Marketing",
    vendor: "Google Ads",
    status: "Approved"
  },
  {
    description: "Team Lunch",
    amount: 2500,
    category: "Dining",
    vendor: "Pizza Hut",
    status: "Pending"
  },
  {
    description: "AWS Cloud Services",
    amount: 8000,
    category: "Cloud & Hosting",
    vendor: "Amazon Web Services",
    status: "Approved"
  },
  {
    description: "Office Supplies",
    amount: 1200,
    category: "Office",
    vendor: "Staples",
    status: "Approved"
  },
  {
    description: "Travel to Conference",
    amount: 18000,
    category: "Travel",
    vendor: "Air India",
    status: "Pending"
  },
  {
    description: "Software Licenses",
    amount: 12000,
    category: "Software",
    vendor: "Microsoft",
    status: "Approved"
  },
  {
    description: "Electricity Bill",
    amount: 2800,
    category: "Utilities",
    vendor: "MSEB",
    status: "Approved"
  }
];

async function populateDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Expense.deleteMany({});
    console.log('Cleared existing expenses');

    // Insert sample data
    const expenses = await Expense.insertMany(sampleExpenses);
    console.log(`Inserted ${expenses.length} sample expenses`);

    // Display summary
    const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const pendingCount = expenses.filter(exp => exp.status === 'Pending').length;
    const approvedCount = expenses.filter(exp => exp.status === 'Approved').length;

    console.log('\n=== Sample Data Summary ===');
    console.log(`Total Expenses: ${expenses.length}`);
    console.log(`Total Amount: ₹${totalAmount.toLocaleString('en-IN')}`);
    console.log(`Pending: ${pendingCount}`);
    console.log(`Approved: ${approvedCount}`);

    console.log('\n=== Categories ===');
    const categories = [...new Set(expenses.map(exp => exp.category))];
    categories.forEach(cat => {
      const catTotal = expenses.filter(exp => exp.category === cat).reduce((sum, exp) => sum + exp.amount, 0);
      console.log(`${cat}: ₹${catTotal.toLocaleString('en-IN')}`);
    });

    console.log('\n✅ Database populated successfully!');
    console.log('You can now test the frontend with this data.');

  } catch (error) {
    console.error('Error populating database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
populateDatabase();
