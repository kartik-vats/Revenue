// Simple Data Seeder - Works without MongoDB
// This creates sample data that the ML service can use immediately

import fs from 'fs';
import path from 'path';

// Sample data that mimics what would come from MongoDB
const sampleRevenueData = [
  { amount: 350000, source: 'Client A', category: 'Recurring', date: '2024-01-15', status: 'Confirmed' },
  { amount: 420000, source: 'Product Sales', category: 'One-time', date: '2024-01-20', status: 'Confirmed' },
  { amount: 380000, source: 'Client B', category: 'Consulting', date: '2024-02-10', status: 'Confirmed' },
  { amount: 450000, source: 'Subscription', category: 'Recurring', date: '2024-02-25', status: 'Confirmed' },
  { amount: 410000, source: 'Client C', category: 'Service', date: '2024-03-05', status: 'Confirmed' },
  { amount: 480000, source: 'License Sales', category: 'One-time', date: '2024-03-18', status: 'Confirmed' },
  { amount: 440000, source: 'Client A', category: 'Recurring', date: '2024-04-12', status: 'Confirmed' },
  { amount: 520000, source: 'Product Sales', category: 'One-time', date: '2024-04-28', status: 'Confirmed' },
  { amount: 470000, source: 'Client B', category: 'Consulting', date: '2024-05-15', status: 'Confirmed' },
  { amount: 550000, source: 'Subscription', category: 'Recurring', date: '2024-05-30', status: 'Confirmed' },
  { amount: 510000, source: 'Client C', category: 'Service', date: '2024-06-10', status: 'Confirmed' },
  { amount: 580000, source: 'License Sales', category: 'One-time', date: '2024-06-25', status: 'Confirmed' },
  { amount: 540000, source: 'Client A', category: 'Recurring', date: '2024-07-08', status: 'Confirmed' },
  { amount: 610000, source: 'Product Sales', category: 'One-time', date: '2024-07-22', status: 'Confirmed' },
  { amount: 570000, source: 'Client B', category: 'Consulting', date: '2024-08-05', status: 'Confirmed' },
  { amount: 640000, source: 'Subscription', category: 'Recurring', date: '2024-08-18', status: 'Confirmed' },
  { amount: 600000, source: 'Client C', category: 'Service', date: '2024-09-02', status: 'Confirmed' },
  { amount: 670000, source: 'License Sales', category: 'One-time', date: '2024-09-15', status: 'Confirmed' },
  { amount: 630000, source: 'Client A', category: 'Recurring', date: '2024-10-01', status: 'Confirmed' },
  { amount: 700000, source: 'Product Sales', category: 'One-time', date: '2024-10-15', status: 'Confirmed' },
  { amount: 660000, source: 'Client B', category: 'Consulting', date: '2024-11-01', status: 'Confirmed' },
  { amount: 730000, source: 'Subscription', category: 'Recurring', date: '2024-11-15', status: 'Confirmed' },
  { amount: 690000, source: 'Client C', category: 'Service', date: '2024-12-01', status: 'Confirmed' },
  { amount: 760000, source: 'License Sales', category: 'One-time', date: '2024-12-15', status: 'Confirmed' }
];

const sampleExpenseData = [
  { description: 'AWS Cloud Services', amount: 15000, category: 'Cloud & Hosting', vendor: 'Amazon', status: 'Approved' },
  { description: 'Office Rent', amount: 80000, category: 'Rent', vendor: 'Property Management', status: 'Approved' },
  { description: 'Team Lunch', amount: 2500, category: 'Dining', vendor: 'Local Restaurant', status: 'Approved' },
  { description: 'Marketing Tools', amount: 12000, category: 'Marketing', vendor: 'Marketing Platform', status: 'Approved' },
  { description: 'Software Licenses', amount: 8000, category: 'Software', vendor: 'Software Company', status: 'Approved' },
  { description: 'Internet & Phone', amount: 2000, category: 'Utilities', vendor: 'Telecom Provider', status: 'Approved' },
  { description: 'Office Supplies', amount: 1500, category: 'Equipment', vendor: 'Office Supply Store', status: 'Approved' },
  { description: 'Travel Expenses', amount: 25000, category: 'Travel', vendor: 'Travel Agency', status: 'Approved' },
  { description: 'Training Course', amount: 18000, category: 'Training', vendor: 'Training Institute', status: 'Approved' },
  { description: 'Health Insurance', amount: 12000, category: 'Health', vendor: 'Insurance Company', status: 'Approved' }
];

// Create data directory if it doesn't exist
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Save sample data to JSON files
const saveData = () => {
  try {
    // Save revenue data
    fs.writeFileSync(
      path.join(dataDir, 'revenue.json'),
      JSON.stringify(sampleRevenueData, null, 2)
    );
    
    // Save expense data
    fs.writeFileSync(
      path.join(dataDir, 'expenses.json'),
      JSON.stringify(sampleExpenseData, null, 2)
    );
    
    console.log('✅ Sample data saved successfully!');
    console.log(`📁 Data saved to: ${dataDir}`);
    console.log(`📊 Revenue entries: ${sampleRevenueData.length}`);
    console.log(`💰 Expense entries: ${sampleExpenseData.length}`);
    
    // Calculate totals
    const totalRevenue = sampleRevenueData.reduce((sum, r) => sum + r.amount, 0);
    const totalExpenses = sampleExpenseData.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = totalRevenue - totalExpenses;
    
    console.log('\n📈 === Data Summary ===');
    console.log(`Total Revenue: ₹${totalRevenue.toLocaleString('en-IN')}`);
    console.log(`Total Expenses: ₹${totalExpenses.toLocaleString('en-IN')}`);
    console.log(`Net Profit: ₹${netProfit.toLocaleString('en-IN')}`);
    
    console.log('\n🎉 Your ML models now have sample data to work with!');
    console.log('🚀 You can now start the backend server and see predictions!');
    
  } catch (error) {
    console.error('❌ Error saving data:', error.message);
  }
};

// Run the seeder
console.log('🌱 RevenueSense Simple Data Seeder');
console.log('===================================');
console.log('Creating sample data for ML models...\n');

saveData();
