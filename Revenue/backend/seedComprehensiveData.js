import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Revenue from './models/revenue.js';
import Expense from './models/expense.js';

dotenv.config();

// MongoDB connection configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/revenuesense';

// Connect to MongoDB with better error handling
const connectToMongoDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log(`Connection URI: ${MONGODB_URI}`);
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      socketTimeoutMS: 45000, // 45 second timeout
    });
    
    console.log('✅ Successfully connected to MongoDB!');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error details:', error.message);
    
    if (error.name === 'MongoNetworkError') {
      console.error('\n🔧 Troubleshooting steps:');
      console.error('1. Make sure MongoDB is running on your system');
      console.error('2. Check if MongoDB service is started');
      console.error('3. Verify the connection URI is correct');
      console.error('4. Try using "mongodb://127.0.0.1:27017" instead of "localhost"');
    }
    
    if (error.name === 'MongoServerSelectionError') {
      console.error('\n🔧 MongoDB server selection failed:');
      console.error('1. MongoDB might not be running');
      console.error('2. Check if the port 27017 is available');
      console.error('3. Try restarting MongoDB service');
    }
    
    return false;
  }
};

// Generate realistic revenue data with trends and seasonality
const generateRevenueData = () => {
  const revenueData = [];
  const baseAmount = 300000; // Base monthly revenue
  const growthRate = 0.08; // 8% monthly growth
  const seasonality = [0.1, 0.05, 0.02, 0.08, 0.12, 0.15, 0.18, 0.14, 0.10, 0.06, 0.03, 0.07]; // Monthly seasonality
  
  // Generate 36 months of data (3 years)
  for (let month = 0; month < 36; month++) {
    const date = new Date();
    date.setMonth(date.getMonth() - (35 - month));
    
    // Calculate base revenue with growth
    let amount = baseAmount * Math.pow(1 + growthRate, month);
    
    // Add seasonality
    const monthIndex = date.getMonth();
    amount += amount * seasonality[monthIndex];
    
    // Add some random variation (±10%)
    const variation = (Math.random() - 0.5) * 0.2;
    amount += amount * variation;
    
    // Ensure non-negative
    amount = Math.max(0, amount);
    
    // Generate multiple revenue entries per month
    const entriesPerMonth = Math.floor(Math.random() * 3) + 2; // 2-4 entries per month
    
    for (let entry = 0; entry < entriesPerMonth; entry++) {
      const entryAmount = amount / entriesPerMonth;
      const entryDate = new Date(date);
      entryDate.setDate(entryDate.getDate() + Math.floor(Math.random() * 28));
      
      const sources = ['Client A', 'Client B', 'Client C', 'Product Sales', 'Consulting', 'Subscription', 'License'];
      const categories = ['Recurring', 'One-time', 'Consulting', 'Product', 'Service'];
      const statuses = ['Confirmed', 'Pending', 'Cancelled'];
      
      revenueData.push({
        amount: Math.round(entryAmount),
        source: sources[Math.floor(Math.random() * sources.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        description: `Revenue from ${sources[Math.floor(Math.random() * sources.length)]}`,
        date: entryDate,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        clientId: `CLIENT_${Math.floor(Math.random() * 1000)}`,
        invoiceNumber: `INV_${Math.floor(Math.random() * 10000)}`
      });
    }
  }
  
  return revenueData;
};

// Generate realistic expense data
const generateExpenseData = () => {
  const expenseData = [];
  const categories = [
    'Transport', 'Travel', 'Dining', 'Groceries', 'Cloud & Hosting', 
    'Utilities', 'Equipment', 'Health', 'Rent', 'Marketing', 'Software', 'Training'
  ];
  
  const descriptions = {
    'Transport': ['Uber ride', 'Fuel', 'Metro pass', 'Parking', 'Taxi'],
    'Travel': ['Hotel booking', 'Flight tickets', 'Airbnb', 'Travel insurance'],
    'Dining': ['Restaurant', 'Food delivery', 'Coffee', 'Lunch meeting'],
    'Groceries': ['Supermarket', 'Online grocery', 'Local store'],
    'Cloud & Hosting': ['AWS services', 'Azure subscription', 'Domain renewal', 'Server hosting'],
    'Utilities': ['Internet bill', 'Phone bill', 'Electricity', 'Water'],
    'Equipment': ['Laptop', 'Monitor', 'Keyboard', 'Mouse', 'Headphones'],
    'Health': ['Doctor consultation', 'Pharmacy', 'Health insurance'],
    'Rent': ['Office rent', 'Equipment lease', 'Storage rental'],
    'Marketing': ['Google Ads', 'Facebook Ads', 'Social media tools', 'Print materials'],
    'Software': ['Software license', 'SaaS subscription', 'App purchase'],
    'Training': ['Online course', 'Workshop', 'Conference', 'Certification']
  };
  
  const vendors = [
    'Uber', 'Ola', 'Swiggy', 'Zomato', 'Amazon', 'Flipkart', 'AWS', 'Azure', 
    'Google', 'Microsoft', 'Local vendors', 'Online platforms'
  ];
  
  // Generate 24 months of expense data
  for (let month = 0; month < 24; month++) {
    const date = new Date();
    date.setMonth(date.getMonth() - (23 - month));
    
    // Generate 5-15 expenses per month
    const expensesPerMonth = Math.floor(Math.random() * 11) + 5;
    
    for (let expense = 0; expense < expensesPerMonth; expense++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const categoryDescriptions = descriptions[category];
      const description = categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)];
      
      // Generate realistic amounts based on category
      let amount;
      switch (category) {
        case 'Transport':
          amount = Math.floor(Math.random() * 2000) + 100; // 100-2100
          break;
        case 'Travel':
          amount = Math.floor(Math.random() * 50000) + 5000; // 5000-55000
          break;
        case 'Dining':
          amount = Math.floor(Math.random() * 3000) + 200; // 200-3200
          break;
        case 'Groceries':
          amount = Math.floor(Math.random() * 5000) + 1000; // 1000-6000
          break;
        case 'Cloud & Hosting':
          amount = Math.floor(Math.random() * 10000) + 1000; // 1000-11000
          break;
        case 'Utilities':
          amount = Math.floor(Math.random() * 3000) + 500; // 500-3500
          break;
        case 'Equipment':
          amount = Math.floor(Math.random() * 50000) + 5000; // 5000-55000
          break;
        case 'Health':
          amount = Math.floor(Math.random() * 5000) + 500; // 500-5500
          break;
        case 'Rent':
          amount = Math.floor(Math.random() * 100000) + 50000; // 50000-150000
          break;
        case 'Marketing':
          amount = Math.floor(Math.random() * 20000) + 2000; // 2000-22000
          break;
        case 'Software':
          amount = Math.floor(Math.random() * 15000) + 1000; // 1000-16000
          break;
        case 'Training':
          amount = Math.floor(Math.random() * 25000) + 5000; // 5000-30000
          break;
        default:
          amount = Math.floor(Math.random() * 5000) + 500; // 500-5500
      }
      
      const entryDate = new Date(date);
      entryDate.setDate(entryDate.getDate() + Math.floor(Math.random() * 28));
      
      expenseData.push({
        description: description,
        amount: amount,
        category: category,
        vendor: vendors[Math.floor(Math.random() * vendors.length)],
        status: Math.random() > 0.2 ? 'Approved' : 'Pending',
        createdAt: entryDate
      });
    }
  }
  
  return expenseData;
};

// Seed the database
const seedDatabase = async () => {
  try {
    console.log('🚀 Starting database seeding...');
    
    // Connect to MongoDB
    const connected = await connectToMongoDB();
    if (!connected) {
      console.error('❌ Cannot proceed without database connection');
      process.exit(1);
    }
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Revenue.deleteMany({});
    await Expense.deleteMany({});
    console.log('✅ Existing data cleared');
    
    // Generate new data
    console.log('📊 Generating sample data...');
    const revenueData = generateRevenueData();
    const expenseData = generateExpenseData();
    
    console.log(`📈 Generated ${revenueData.length} revenue entries`);
    console.log(`💰 Generated ${expenseData.length} expense entries`);
    
    // Insert revenue data
    console.log('💾 Inserting revenue data...');
    const revenueResult = await Revenue.insertMany(revenueData);
    console.log(`✅ Inserted ${revenueResult.length} revenue entries`);
    
    // Insert expense data
    console.log('💾 Inserting expense data...');
    const expenseResult = await Expense.insertMany(expenseData);
    console.log(`✅ Inserted ${expenseResult.length} expense entries`);
    
    // Calculate some statistics
    const totalRevenue = revenueData.reduce((sum, r) => sum + r.amount, 0);
    const totalExpenses = expenseData.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = totalRevenue - totalExpenses;
    
    console.log('\n📊 === Data Summary ===');
    console.log(`Total Revenue: ₹${totalRevenue.toLocaleString('en-IN')}`);
    console.log(`Total Expenses: ₹${totalExpenses.toLocaleString('en-IN')}`);
    console.log(`Net Profit: ₹${netProfit.toLocaleString('en-IN')}`);
    console.log(`Revenue Entries: ${revenueData.length}`);
    console.log(`Expense Entries: ${expenseData.length}`);
    console.log(`Data Period: 36 months (revenue), 24 months (expenses)`);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('✨ Your ML models now have real data to work with!');
    
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    console.error('Stack trace:', error.stack);
  } finally {
    // Close the connection
    try {
      await mongoose.connection.close();
      console.log('🔌 Database connection closed');
    } catch (closeError) {
      console.error('Warning: Error closing database connection:', closeError.message);
    }
    process.exit(0);
  }
};

// Run the seeding
console.log('🌱 RevenueSense Database Seeder');
console.log('================================');
seedDatabase(); 