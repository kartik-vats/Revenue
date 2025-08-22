/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  TrendingUp, TrendingDown, DollarSign, Receipt, 
  BarChart3, PieChart, Activity, Users, 
  Calendar, Clock, ArrowUpRight, RefreshCw,
  Brain, Zap, AlertTriangle, CheckCircle
} from 'lucide-react';
import { predictionApi, revenueApi, expensesApi } from '../api/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line } from 'recharts';

// KPI Card Component
const KPICard = ({ title, value, change, trend, icon: Icon, loading = false }) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.02 }}
    className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 rounded-lg bg-blue-50">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      {trend && (
        <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
          {change}
        </div>
      )}
    </div>
    
    <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
    {loading ? (
      <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
    ) : (
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    )}
  </motion.div>
);

// ML Insight Card
const MLInsightCard = ({ insight, loading = false }) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white"
  >
    <div className="flex items-center mb-4">
      <div className="p-3 rounded-lg bg-white bg-opacity-20 mr-4">
        <Brain className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-1">AI Insight</h3>
        <p className="text-blue-100 text-sm">Powered by ML algorithms</p>
      </div>
    </div>
    
    {loading ? (
      <div className="space-y-2">
        <div className="h-4 bg-blue-200 rounded animate-pulse"></div>
        <div className="h-4 bg-blue-200 rounded animate-pulse w-3/4"></div>
      </div>
    ) : (
      <p className="text-blue-100">{insight}</p>
    )}
  </motion.div>
);

// Revenue Trend Chart Component
const RevenueTrendChart = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading chart data...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-gray-600 text-sm">No revenue data available</p>
          <p className="text-xs text-gray-500 mt-2">Run the seeder to populate data</p>
        </div>
      </div>
    );
  }

  // Create chart data from revenue data
  const chartData = data.slice(-12).map((item, index) => ({
    month: new Date(item.date).toLocaleDateString('en-US', { month: 'short' }),
    revenue: item.amount,
    period: index + 1
  }));

  const maxRevenue = Math.max(...chartData.map(d => d.revenue));
  const minRevenue = Math.min(...chartData.map(d => d.revenue));
  const range = maxRevenue - minRevenue;

  return (
    <div className="h-64 bg-gray-50 rounded-lg border border-gray-100 p-4">
      <div className="h-full flex items-end justify-between space-x-1">
        {chartData.map((item, index) => {
          const height = range > 0 ? ((item.revenue - minRevenue) / range) * 100 : 50;
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="relative group">
                <div 
                  className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t w-full transition-all duration-300 hover:from-blue-700 hover:to-blue-500"
                  style={{ height: `${Math.max(height, 10)}%` }}
                ></div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  ₹{item.revenue.toLocaleString('en-IN')}
                </div>
              </div>
              <span className="text-xs text-gray-600 mt-2 text-center">{item.month}</span>
            </div>
          );
        })}
      </div>
      <div className="text-center mt-4">
        <p className="text-sm font-medium text-gray-700">Revenue Trend (Last 12 Months)</p>
        <p className="text-xs text-gray-500">Hover over bars to see amounts</p>
      </div>
    </div>
  );
};

// Recent Activity Item
const ActivityItem = ({ type, description, amount, date, status }) => (
  <motion.div
    whileHover={{ x: 4 }}
    className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-all duration-200"
  >
    <div className="flex items-center">
      <div className={`p-2 rounded-lg mr-3 ${
        type === 'revenue' ? 'bg-green-50' : 'bg-red-50'
      }`}>
        {type === 'revenue' ? (
          <DollarSign className="w-4 h-4 text-green-600" />
        ) : (
          <Receipt className="w-4 h-4 text-red-600" />
        )}
      </div>
      <div>
        <p className="font-medium text-gray-900">{description}</p>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
    </div>
    
    <div className="text-right">
      <p className={`font-semibold ${
        type === 'revenue' ? 'text-green-600' : 'text-red-600'
      }`}>
        {type === 'revenue' ? '+' : '-'}{amount}
      </p>
      <span className={`text-xs px-2 py-1 rounded-full ${
        status === 'Confirmed' || status === 'Approved' 
          ? 'bg-green-100 text-green-700' 
          : 'bg-yellow-100 text-yellow-700'
      }`}>
        {status}
      </span>
    </div>
  </motion.div>
);

// Main Dashboard Component
const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [recentRevenue, setRecentRevenue] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    fetchRecentData();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardData();
      fetchRecentData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { data } = await predictionApi.dashboard();
      setDashboardData(data);
      setLastUpdate(new Date().toISOString());
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentData = async () => {
    try {
      // Fetch recent revenue and expenses
      const [revenueRes, expensesRes] = await Promise.all([
        revenueApi.list({ limit: 5 }),
        expensesApi.list()
      ]);
      
      setRecentRevenue(revenueRes.data || []);
      setRecentExpenses(expensesRes.data || []);
    } catch (err) {
      console.error('Failed to fetch recent data:', err);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData();
    fetchRecentData();
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Generate AI insight based on data
  const generateAIInsight = () => {
    if (!dashboardData) return 'Analyzing your financial data...';
    
    const { monthOverMonthGrowth, totalRevenue, totalExpenses } = dashboardData.kpis;
    const netProfit = parseFloat(totalRevenue.replace(/[^\d]/g, '')) - parseFloat(totalExpenses.replace(/[^\d]/g, ''));
    
    if (monthOverMonthGrowth > 10) {
      return `Excellent growth! Your revenue increased by ${monthOverMonthGrowth}% month-over-month. Consider reinvesting in growth initiatives.`;
    } else if (monthOverMonthGrowth > 0) {
      return `Steady growth of ${monthOverMonthGrowth}% this month. Focus on customer retention and upselling opportunities.`;
    } else if (monthOverMonthGrowth < -5) {
      return `Revenue declined by ${Math.abs(monthOverMonthGrowth)}%. Review pricing strategy and customer acquisition costs.`;
    } else {
      return 'Revenue is stable. Look for opportunities to optimize expenses and increase efficiency.';
    }
  };

  if (error) {
    return (
      <div className="min-h-screen w-screen bg-gray-50 fixed inset-0 overflow-hidden">
        <div className="h-full w-full overflow-y-auto flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gray-50 fixed inset-0 overflow-hidden">
      <div className="h-full w-full overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 mr-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
                <p className="text-gray-600">
                  Real-time insights powered by AI and ML algorithms
                  {lastUpdate && (
                    <span className="ml-2 text-sm text-gray-500">
                      • Last updated: {new Date(lastUpdate).toLocaleTimeString()}
                    </span>
                  )}
                </p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-blue-600 mr-2 ${loading ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium text-blue-700">
                {loading ? 'Updating...' : 'Refresh'}
              </span>
            </motion.button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {/* AI Insights Banner */}
          <div className="mb-8">
            <MLInsightCard insight={generateAIInsight()} loading={loading} />
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KPICard
              title="Total Revenue"
              value={dashboardData?.kpis?.totalRevenue || '₹0'}
              change={dashboardData?.kpis?.monthOverMonthGrowth ? `${dashboardData.kpis.monthOverMonthGrowth}%` : '0%'}
              trend={dashboardData?.kpis?.monthOverMonthGrowth > 0 ? 'up' : 'down'}
              icon={DollarSign}
              loading={loading}
            />
            <KPICard
              title="Total Expenses"
              value={dashboardData?.kpis?.totalExpenses || '₹0'}
              icon={Receipt}
              loading={loading}
            />
            <KPICard
              title="Net Profit"
              value={dashboardData?.kpis?.netProfit || '₹0'}
              icon={TrendingUp}
              loading={loading}
            />
            <KPICard
              title="Avg Monthly Revenue"
              value={dashboardData?.kpis?.avgMonthlyRevenue || '₹0'}
              icon={BarChart3}
              loading={loading}
            />
          </div>

          {/* Charts and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Revenue Trend Chart */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-green-50 mr-3">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
                    <p className="text-sm text-gray-500">Monthly revenue analysis</p>
                  </div>
                </div>
              </div>
              <RevenueTrendChart data={recentRevenue} loading={loading} />
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-blue-50 mr-3">
                    <Activity className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                    <p className="text-sm text-gray-500">Latest transactions</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {loading ? (
                  // Loading skeleton
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg animate-pulse">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded mr-3"></div>
                        <div>
                          <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-24"></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  // Combine and sort recent revenue and expenses
                  [...recentRevenue, ...recentExpenses]
                    .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
                    .slice(0, 5)
                    .map((item, index) => (
                      <ActivityItem
                        key={index}
                        type={item.amount ? 'revenue' : 'expense'}
                        description={item.description || item.source || 'Transaction'}
                        amount={item.amount ? `₹${item.amount.toLocaleString('en-IN')}` : `₹${item.amount?.toLocaleString('en-IN') || '0'}`}
                        date={new Date(item.createdAt || item.date).toLocaleDateString()}
                        status={item.status}
                      />
                    ))
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleNavigation('/revenue')}
                  className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  <DollarSign className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="font-medium text-blue-700">Add Revenue</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleNavigation('/expense')}
                  className="flex items-center p-4 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
                >
                  <Receipt className="w-5 h-5 text-red-600 mr-3" />
                  <span className="font-medium text-red-700">Add Expense</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleNavigation('/revpredict')}
                  className="flex items-center p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
                >
                  <Brain className="w-5 h-5 text-green-600 mr-3" />
                  <span className="font-medium text-green-700">View Predictions</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;