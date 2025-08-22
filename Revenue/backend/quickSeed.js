import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Revenue from './models/revenue.js';
import Expense from './models/expense.js';

dotenv.config();

// Use the same connection string as your working server
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/revenuesense';

console.log('🌱 RevenueSense Quick Seeder');
console.log('=============================');
console.log(`Connecting to: ${MONGODB_URI}`);
console.log('');

// Simple connection without complex options
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Revenue.deleteMany({});
    await Expense.deleteMany({});
    console.log('✅ Existing data cleared');
    
    // Generate sample revenue data (24 months)
    console.log('📊 Generating revenue data...');
    const revenueData = [];
    const baseAmount = 300000;
    const growthRate = 0.05; // 5% monthly growth
    
    for (let month = 0; month < 24; month++) {
      const date = new Date();
      date.setMonth(date.getMonth() - (23 - month));
      
      // Calculate amount with growth
      let amount = baseAmount * Math.pow(1 + growthRate, month);
      
      // Add some variation
      const variation = (Math.random() - 0.5) * 0.15;
      amount += amount * variation;
      amount = Math.max(0, Math.round(amount));
      
      // Create 2-3 revenue entries per month
      const entriesPerMonth = Math.floor(Math.random() * 2) + 2;
      
      for (let entry = 0; entry < entriesPerMonth; entry++) {
        const entryAmount = Math.round(amount / entriesPerMonth);
        const entryDate = new Date(date);
        entryDate.setDate(entryDate.getDate() + Math.floor(Math.random() * 28));
        
        const sources = ['Client A', 'Client B', 'Client C', 'Product Sales', 'Consulting', 'Subscription'];
        const categories = ['Recurring', 'One-time', 'Consulting', 'Product', 'Service'];
        
        revenueData.push({
          amount: entryAmount,
          source: sources[Math.floor(Math.random() * sources.length)],
          category: categories[Math.floor(Math.random() * categories.length)],
          description: `Revenue from ${sources[Math.floor(Math.random() * sources.length)]}`,
          date: entryDate,
          status: 'Confirmed',
          clientId: `CLIENT_${Math.floor(Math.random() * 1000)}`,
          invoiceNumber: `INV_${Math.floor(Math.random() * 10000)}`
        });
      }
    }
    
    // Generate sample expense data
    console.log('💰 Generating expense data...');
    const expenseData = [
      { description: 'AWS Cloud Services', amount: 15000, category: 'Cloud & Hosting', vendor: 'Amazon', status: 'Approved' },
      { description: 'Office Rent', amount: 80000, category: 'Rent', vendor: 'Property Management', status: 'Approved' },
      { description: 'Team Lunch', amount: 2500, category: 'Dining', vendor: 'Local Restaurant', status: 'Approved' },
      { description: 'Marketing Tools', amount: 12000, category: 'Marketing', vendor: 'Marketing Platform', status: 'Approved' },
      { description: 'Software Licenses', amount: 8000, category: 'Software', vendor: 'Software Company', status: 'Approved' },
      { description: 'Internet & Phone', amount: 2000, category: 'Utilities', vendor: 'Telecom Provider', status: 'Approved' },
      { description: 'Office Supplies', amount: 1500, category: 'Equipment', vendor: 'Office Supply Store', status: 'Approved' },
      { description: 'Travel Expenses', amount: 25000, category: 'Travel', vendor: 'Travel Agency', status: 'Approved' },
      { description: 'Training Course', amount: 18000, category: 'Training', vendor: 'Training Institute', status: 'Approved' },
      { description: 'Health Insurance', amount: 12000, category: 'Health', vendor: 'Insurance Company', status: 'Approved' },
      { description: 'Google Ads', amount: 15000, category: 'Marketing', vendor: 'Google', status: 'Approved' },
      { description: 'Domain Renewal', amount: 2000, category: 'Cloud & Hosting', vendor: 'Domain Registrar', status: 'Approved' }
    ];
    
    // Insert revenue data
    console.log('💾 Inserting revenue data...');
    const revenueResult = await Revenue.insertMany(revenueData);
    console.log(`✅ Inserted ${revenueResult.length} revenue entries`);
    
    // Insert expense data
    console.log('💾 Inserting expense data...');
    const expenseResult = await Expense.insertMany(expenseData);
    console.log(`✅ Inserted ${expenseResult.length} expense entries`);
    
    // Calculate statistics
    const totalRevenue = revenueData.reduce((sum, r) => sum + r.amount, 0);
    const totalExpenses = expenseData.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = totalRevenue - totalExpenses;
    
    console.log('\n📊 === Data Summary ===');
    console.log(`Total Revenue: ₹${totalRevenue.toLocaleString('en-IN')}`);
    console.log(`Total Expenses: ₹${totalExpenses.toLocaleString('en-IN')}`);
    console.log(`Net Profit: ₹${netProfit.toLocaleString('en-IN')}`);
    console.log(`Revenue Entries: ${revenueData.length}`);
    console.log(`Expense Entries: ${expenseData.length}`);
    console.log(`Data Period: 24 months`);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('✨ Your ML models now have real data to work with!');
    console.log('🚀 You can now start your server with: npm run dev');
    
  } catch (error) {
    console.error('❌ Error during database seeding:', error.message);
    
    if (error.name === 'MongoNetworkError') {
      console.error('\n🔧 Make sure MongoDB is running and accessible');
      console.error('Try: npm run dev (to test connection)');
    }
    
    if (error.name === 'MongoServerSelectionError') {
      console.error('\n🔧 MongoDB connection issue');
      console.error('Check if MongoDB service is running');
    }
    
    console.error('\nFull error:', error);
  } finally {
    // Close connection
    try {
      await mongoose.connection.close();
      console.log('🔌 Database connection closed');
    } catch (closeError) {
      console.error('Warning: Error closing connection:', closeError.message);
    }
    process.exit(0);
  }
};

// Run the seeder
seedDatabase();
