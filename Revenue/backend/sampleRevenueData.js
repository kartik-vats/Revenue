import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Revenue from './models/revenue.js';

dotenv.config();

const sampleRevenue = [
  {
    amount: 50000,
    source: "Client A - Monthly Retainer",
    category: "Recurring",
    description: "Monthly consulting services",
    date: new Date(2024, 0, 15), // Jan 15, 2024
    status: "Confirmed"
  },
  {
    amount: 75000,
    source: "Product Sales",
    category: "One-time",
    description: "Software license sales",
    date: new Date(2024, 0, 20),
    status: "Confirmed"
  },
  {
    amount: 45000,
    source: "Client B - Project",
    category: "Consulting",
    description: "Website development project",
    date: new Date(2024, 1, 10), // Feb 10, 2024
    status: "Confirmed"
  },
  {
    amount: 60000,
    source: "Client A - Monthly Retainer",
    category: "Recurring",
    description: "Monthly consulting services",
    date: new Date(2024, 1, 15),
    status: "Confirmed"
  },
  {
    amount: 80000,
    source: "Client C - Training",
    category: "Services",
    description: "Team training workshop",
    date: new Date(2024, 2, 5), // Mar 5, 2024
    status: "Confirmed"
  },
  {
    amount: 55000,
    source: "Client A - Monthly Retainer",
    category: "Recurring",
    description: "Monthly consulting services",
    date: new Date(2024, 2, 15),
    status: "Confirmed"
  },
  {
    amount: 90000,
    source: "Client D - Implementation",
    category: "One-time",
    description: "System implementation project",
    date: new Date(2024, 3, 1), // Apr 1, 2024
    status: "Confirmed"
  },
  {
    amount: 65000,
    source: "Client A - Monthly Retainer",
    category: "Recurring",
    description: "Monthly consulting services",
    date: new Date(2024, 3, 15),
    status: "Confirmed"
  },
  {
    amount: 70000,
    source: "Client E - Support",
    category: "Recurring",
    description: "Annual support contract",
    date: new Date(2024, 4, 1), // May 1, 2024
    status: "Confirmed"
  },
  {
    amount: 70000,
    source: "Client A - Monthly Retainer",
    category: "Recurring",
    description: "Monthly consulting services",
    date: new Date(2024, 4, 15),
    status: "Confirmed"
  },
  {
    amount: 85000,
    source: "Client F - Consulting",
    category: "Consulting",
    description: "Strategic planning consultation",
    date: new Date(2024, 5, 1), // Jun 1, 2024
    status: "Confirmed"
  },
  {
    amount: 75000,
    source: "Client A - Monthly Retainer",
    category: "Recurring",
    description: "Monthly consulting services",
    date: new Date(2024, 5, 15),
    status: "Confirmed"
  }
];

async function populateRevenueDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing revenue data
    await Revenue.deleteMany({});
    console.log('Cleared existing revenue data');

    // Insert sample revenue data
    const revenue = await Revenue.insertMany(sampleRevenue);
    console.log(`Inserted ${revenue.length} sample revenue entries`);

    // Display summary
    const totalRevenue = revenue.reduce((sum, rev) => sum + rev.amount, 0);
    const byCategory = revenue.reduce((acc, rev) => {
      acc[rev.category] = (acc[rev.category] || 0) + rev.amount;
      return acc;
    }, {});

    console.log('\n=== Revenue Data Summary ===');
    console.log(`Total Revenue: ₹${totalRevenue.toLocaleString('en-IN')}`);
    console.log(`Total Entries: ${revenue.length}`);
    
    console.log('\n=== Revenue by Category ===');
    Object.entries(byCategory).forEach(([category, amount]) => {
      console.log(`${category}: ₹${amount.toLocaleString('en-IN')}`);
    });

    console.log('\n✅ Revenue database populated successfully!');
    console.log('You can now test the ML revenue predictions and charts.');

  } catch (error) {
    console.error('Error populating revenue database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
populateRevenueDatabase();
