import Revenue from '../models/revenue.js';

// ML Prediction using Time Series Analysis
function calculateMovingAverage(data, window = 3) {
  if (data.length < window) return data;
  
  const result = [];
  for (let i = 0; i < data.length; i++) {
    if (i < window - 1) {
      result.push(data[i]);
    } else {
      const sum = data.slice(i - window + 1, i + 1).reduce((a, b) => a + b, 0);
      result.push(sum / window);
    }
  }
  return result;
}

function calculateTrend(data) {
  if (data.length < 2) return 0;
  
  const n = data.length;
  const sumX = (n * (n - 1)) / 2;
  const sumY = data.reduce((sum, val, i) => sum + val, 0);
  const sumXY = data.reduce((sum, val, i) => sum + (i * val), 0);
  const sumX2 = data.reduce((sum, val, i) => sum + (i * i), 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  return slope;
}

function predictRevenue(historicalData, periods = 6) {
  if (historicalData.length < 3) {
    // Not enough data, return simple linear projection
    const avg = historicalData.reduce((sum, val) => sum + val, 0) / historicalData.length;
    return Array(periods).fill(avg);
  }
  
  const trend = calculateTrend(historicalData);
  const lastValue = historicalData[historicalData.length - 1];
  const movingAvg = calculateMovingAverage(historicalData, 3);
  const seasonalFactor = movingAvg[movingAvg.length - 1] / lastValue;
  
  const predictions = [];
  for (let i = 1; i <= periods; i++) {
    // Linear trend + seasonal adjustment + random variation
    let prediction = lastValue + (trend * i);
    prediction *= seasonalFactor;
    
    // Add small random variation (±5%)
    const variation = 0.95 + (Math.random() * 0.1);
    prediction *= variation;
    
    predictions.push(Math.max(0, Math.round(prediction)));
  }
  
  return predictions;
}

export const listRevenue = async (req, res) => {
  try {
    const { startDate, endDate, category, status } = req.query;
    let filter = {};
    
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    if (category) filter.category = category;
    if (status) filter.status = status;
    
    const revenue = await Revenue.find(filter).sort({ date: -1 });
    res.json(revenue);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch revenue', error: error.message });
  }
};

export const createRevenue = async (req, res) => {
  try {
    const { amount, source, category, description, date, clientId, invoiceNumber } = req.body;
    const revenue = new Revenue({
      amount,
      source,
      category,
      description,
      date: date ? new Date(date) : new Date(),
      clientId,
      invoiceNumber
    });
    const saved = await revenue.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create revenue', error: error.message });
  }
};

export const getRevenue = async (req, res) => {
  try {
    const revenue = await Revenue.findById(req.params.id);
    if (!revenue) return res.status(404).json({ message: 'Revenue not found' });
    res.json(revenue);
  } catch (error) {
    res.status(400).json({ message: 'Failed to get revenue', error: error.message });
  }
};

export const updateRevenue = async (req, res) => {
  try {
    const { amount, source, category, description, date, status, clientId, invoiceNumber } = req.body;
    const updates = { amount, source, category, description, date, status, clientId, invoiceNumber };
    if (date) updates.date = new Date(date);
    
    const revenue = await Revenue.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!revenue) return res.status(404).json({ message: 'Revenue not found' });
    res.json(revenue);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update revenue', error: error.message });
  }
};

export const deleteRevenue = async (req, res) => {
  try {
    const revenue = await Revenue.findByIdAndDelete(req.params.id);
    if (!revenue) return res.status(404).json({ message: 'Revenue not found' });
    res.json({ message: 'Revenue deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete revenue', error: error.message });
  }
};

export const getRevenueAnalytics = async (req, res) => {
  try {
    const { period = '6months' } = req.query;
    
    // Get historical revenue data
    const endDate = new Date();
    let startDate;
    
    switch (period) {
      case '3months':
        startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 3, 1);
        break;
      case '6months':
        startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 6, 1);
        break;
      case '12months':
        startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 12, 1);
        break;
      default:
        startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 6, 1);
    }
    
    const revenue = await Revenue.find({
      date: { $gte: startDate, $lte: endDate },
      status: 'Confirmed'
    }).sort({ date: 1 });
    
    // Group by month
    const monthlyData = {};
    revenue.forEach(item => {
      const monthKey = item.date.toISOString().slice(0, 7); // YYYY-MM
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: new Date(item.date.getFullYear(), item.date.getMonth(), 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          revenue: 0,
          count: 0
        };
      }
      monthlyData[monthKey].revenue += item.amount;
      monthlyData[monthKey].count += 1;
    });
    
    const chartData = Object.values(monthlyData);
    
    // Calculate ML predictions
    const historicalValues = chartData.map(item => item.revenue);
    const predictions = predictRevenue(historicalValues, 6);
    
    // Generate future months
    const futureMonths = [];
    const lastMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
    for (let i = 1; i <= 6; i++) {
      const futureDate = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + i, 1);
      futureMonths.push({
        month: futureDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        revenue: predictions[i - 1],
        predicted: true
      });
    }
    
    // Category breakdown
    const categoryBreakdown = {};
    revenue.forEach(item => {
      const cat = item.category || 'General';
      categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + item.amount;
    });
    
    const pieData = Object.entries(categoryBreakdown).map(([name, value]) => ({
      name,
      value
    }));
    
    // Calculate KPIs
    const totalRevenue = revenue.reduce((sum, item) => sum + item.amount, 0);
    const avgMonthlyRevenue = totalRevenue / Math.max(1, chartData.length);
    const growthRate = chartData.length >= 2 ? 
      ((chartData[chartData.length - 1].revenue - chartData[0].revenue) / chartData[0].revenue) * 100 : 0;
    
    res.json({
      historical: chartData,
      predictions: futureMonths,
      categoryBreakdown: pieData,
      kpis: {
        totalRevenue,
        avgMonthlyRevenue: Math.round(avgMonthlyRevenue),
        growthRate: Math.round(growthRate * 100) / 100,
        totalTransactions: revenue.length
      }
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Failed to get revenue analytics', error: error.message });
  }
};
