/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Brain, Target, Calendar, 
  ArrowRight, AlertTriangle, CheckCircle, Info,
  BarChart3, LineChart, Zap, Clock, Lightbulb,
  ChevronRight, Star, Shield, Activity, Settings,
  Bell, Search, ArrowUpRight, RefreshCw
} from 'lucide-react';
import { predictionApi } from '../api/api';

// AI Prediction Card Component
const PredictionCard = ({ period, amount, confidence, change, trend, isHighlighted }) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.02 }}
    className={`rounded-xl p-6 border shadow-sm hover:shadow-md transition-all duration-300 ${
      isHighlighted 
        ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200' 
        : 'bg-white border-gray-200'
    }`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${isHighlighted ? 'bg-blue-100' : 'bg-gray-100'}`}>
          <Calendar className={`w-5 h-5 ${isHighlighted ? 'text-blue-600' : 'text-gray-600'}`} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 ml-3">{period}</h3>
      </div>
      <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}>
        {trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
        {change}
      </div>
    </div>
    
    <div className="mb-4">
      <p className="text-3xl font-bold text-gray-900 mb-2">{amount}</p>
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full mr-2 ${
          confidence >= 85 ? 'bg-green-500' : confidence >= 70 ? 'bg-yellow-500' : 'bg-red-500'
        }`}></div>
        <span className="text-sm text-gray-600">{confidence}% confidence</span>
      </div>
    </div>
    
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className={`h-2 rounded-full transition-all duration-1000 ${
          confidence >= 85 ? 'bg-green-500' : confidence >= 70 ? 'bg-yellow-500' : 'bg-red-500'
        }`}
        style={{ width: `${confidence}%` }}
      />
    </div>
  </motion.div>
);

// Scenario Card Component
const ScenarioCard = ({ title, amount, description, probability, color, factors = [] }) => (
  <motion.div
    whileHover={{ x: 4 }}
    className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-sm transition-all duration-200"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center mb-2">
          <div className={`w-3 h-3 rounded-full mr-2 ${color}`}></div>
          <h4 className="font-semibold text-gray-900">{title}</h4>
        </div>
        <p className="text-2xl font-bold text-gray-900 mb-2">{amount}</p>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Target className="w-4 h-4 mr-1" />
          <span>{probability}% probability</span>
        </div>
        {factors.length > 0 && (
          <div className="text-xs text-gray-500">
            <p className="font-medium mb-1">Key Factors:</p>
            <ul className="list-disc list-inside space-y-1">
              {factors.map((factor, idx) => (
                <li key={idx}>{factor}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </div>
  </motion.div>
);

// Key Driver Component
const KeyDriver = ({ icon: Icon, factor, impact, description, confidence }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-sm transition-all duration-200"
  >
    <div className="flex items-start">
      <div className="p-2 rounded-lg bg-blue-50 mr-3">
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-gray-900">{factor}</h4>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            impact === 'High' ? 'bg-red-100 text-red-700' : 
            impact === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 
            'bg-green-100 text-green-700'
          }`}>
            {impact} Impact
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-2">{description}</p>
        {confidence && (
          <div className="flex items-center text-xs text-gray-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            <span>{confidence} confidence</span>
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

// Model Status Component
const ModelStatus = ({ modelStatus, lastUpdate }) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
  >
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center">
        <div className="p-2 rounded-lg bg-green-50 mr-3">
          <Brain className="w-5 h-5 text-green-600" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900">ML Model Status</h3>
      </div>
      <div className={`w-2 h-2 rounded-full ${modelStatus?.status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
    </div>
    <div className="space-y-2 text-xs text-gray-600">
      <div className="flex justify-between">
        <span>Version:</span>
        <span className="font-medium">{modelStatus?.version || 'N/A'}</span>
      </div>
      <div className="flex justify-between">
        <span>Accuracy:</span>
        <span className="font-medium">{modelStatus?.accuracy || 'N/A'}</span>
      </div>
      <div className="flex justify-between">
        <span>Data Points:</span>
        <span className="font-medium">{modelStatus?.dataPoints || 'N/A'}</span>
      </div>
      <div className="flex justify-between">
        <span>Last Update:</span>
        <span className="font-medium">
          {lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : 'N/A'}
        </span>
      </div>
    </div>
  </motion.div>
);

// Main Revenue Predictions Page
const RevenuePredictionsPage = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('3months');
  const [showScenarios, setShowScenarios] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);
  const [predictions, setPredictions] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [keyDrivers, setKeyDrivers] = useState([]);
  const [modelStatus, setModelStatus] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [dataPoints, setDataPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch predictions from backend when timeframe changes
  useEffect(() => {
    fetchPredictions();
  }, [selectedTimeframe]);

  // Fetch model metrics on component mount
  useEffect(() => {
    fetchModelMetrics();
  }, []);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      setError(null);
      setAnimationKey(prev => prev + 1);
      
      const horizonMap = { '3months': 3, '6months': 6, '12months': 12 };
      const { data } = await predictionApi.revenue({ 
        history: [], 
        horizon: horizonMap[selectedTimeframe] 
      });
      
      setPredictions(data.predictions || []);
      setScenarios(data.scenarios || []);
      setKeyDrivers(data.keyDrivers || []);
      setModelStatus(data.modelStatus || null);
      setLastUpdate(data.lastUpdate || null);
      setDataPoints(data.dataPoints || 0);
    } catch (err) {
      console.error('Failed to fetch predictions', err);
      setError('Failed to fetch predictions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchModelMetrics = async () => {
    try {
      const { data } = await predictionApi.modelMetrics();
      setModelStatus(data);
    } catch (err) {
      console.error('Failed to fetch model metrics', err);
    }
  };

  const handleRefresh = () => {
    fetchPredictions();
    fetchModelMetrics();
  };

  const iconMap = { 
    Activity, 
    TrendingUp, 
    Star, 
    Shield, 
    Calendar,
    AlertTriangle,
    CheckCircle
  };

  const mappedKeyDrivers = keyDrivers.map((d) => ({ 
    ...d, 
    icon: iconMap[d.icon] || Activity 
  }));

  if (error) {
    return (
      <div className="min-h-screen w-screen bg-gray-50 fixed inset-0 overflow-hidden">
        <div className="h-full w-full overflow-y-auto flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Predictions</h2>
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
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Revenue Predictions</h1>
                <p className="text-gray-600">
                  AI-powered revenue forecasting using {dataPoints} real-time data points
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Timeframe:</span>
                <select 
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  <option value="3months">Next 3 Months</option>
                  <option value="6months">Next 6 Months</option>
                  <option value="12months">Next 12 Months</option>
                </select>
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
              
              {modelStatus && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center px-4 py-2 bg-green-50 rounded-lg border border-green-200"
                >
                  <Zap className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-700">
                    Model: {modelStatus.status}
                  </span>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {/* AI Insights Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 mb-8 text-white"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-white bg-opacity-20 mr-4">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">AI Insight</h3>
                  <p className="text-blue-100">
                    {predictions.length > 0 ? (
                      <>
                        Your revenue is predicted to grow by <strong>{predictions[0]?.change}</strong> next month 
                        based on {dataPoints} data points and {modelStatus?.algorithms?.length || 0} ML algorithms. 
                        Model accuracy: <strong>{modelStatus?.accuracy || 'N/A'}</strong>
                      </>
                    ) : (
                      'Loading AI insights...'
                    )}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-blue-200" />
            </div>
          </motion.div>

          {/* Predictions Cards */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Revenue Forecasts</h2>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded mb-4"></div>
                    <div className="h-2 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.div 
                key={animationKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ staggerChildren: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {predictions.map((prediction, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <PredictionCard {...prediction} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Scenarios and Key Drivers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Scenario Analysis */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Scenario Analysis</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowScenarios(!showScenarios)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  {showScenarios ? 'Hide' : 'Show'} Scenarios
                </motion.button>
              </div>
              
              {showScenarios && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  {scenarios.map((scenario, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ScenarioCard {...scenario} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Key Drivers */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Key Revenue Drivers</h2>
              <div className="space-y-4">
                {mappedKeyDrivers.map((driver, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <KeyDriver {...driver} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Model Status and Chart */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Model Status */}
            <div className="lg:col-span-1">
              <ModelStatus modelStatus={modelStatus} lastUpdate={lastUpdate} />
            </div>

            {/* Chart Placeholder */}
            <div className="lg:col-span-2">
              <motion.div
                whileHover={{ y: -2 }}
                className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-blue-50 mr-3">
                      <LineChart className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Revenue Trend Analysis</h3>
                      <p className="text-sm text-gray-500">
                        {dataPoints} data points with ML predictions overlay
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-gray-600" />
                    </motion.button>
                  </div>
                </div>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-gray-600 text-sm">Interactive Revenue Prediction Chart</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Real-time data with {modelStatus?.algorithms?.length || 0} ML algorithms
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenuePredictionsPage;