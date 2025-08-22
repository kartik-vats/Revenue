/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Upload, AlertTriangle, DollarSign, UserCheck, CheckCircle, Trash2, Lightbulb
} from 'lucide-react';
import api, { expensesApi, predictionApi } from '../api/api';

// IMPORTANT: For this component to truly cover the full width and avoid a "black margin" on the right,
// ensure your global CSS (e.g., src/index.css) has the following rules:
/*
html, body, #root {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  overflow-x: hidden; // This is crucial for preventing unwanted horizontal scrollbars
}
*/

const App = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: '',
    vendor: '',
    file: null // Stores the File object
  });
  const [approvals, setApprovals] = useState([]);
  const [monthlyLimit] = useState(50000);
  const [uploadedReceiptNames, setUploadedReceiptNames] = useState([]);
  const [message, setMessage] = useState(''); // For user feedback
  const [llmLoading, setLlmLoading] = useState(false); // Loading state for LLM calls
  const [spendingInsight, setSpendingInsight] = useState(''); // LLM-generated spending insight

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const { data } = await expensesApi.list();
        setExpenses(data);
        setApprovals(data.filter((e) => e.status === 'Pending'));
      } catch (err) {
        console.error('Failed to load expenses', err);
        setMessage('Failed to load expenses. Ensure backend is running.');
      }
    };
    loadExpenses();
  }, []);

  const handleAddExpense = () => {
    // Basic validation
    if (!newExpense.description.trim() || !newExpense.amount) {
      setMessage('Please fill in both Description and Amount.');
      return;
    }
    if (isNaN(Number(newExpense.amount)) || Number(newExpense.amount) <= 0) {
      setMessage('Amount must be a positive number.');
      return;
    }
    (async () => {
      try {
        const payload = {
          description: newExpense.description,
          amount: Number(newExpense.amount),
          category: newExpense.category,
          vendor: newExpense.vendor
        };
        const { data } = await expensesApi.create(payload, newExpense.file);
        setExpenses((prev) => [data, ...prev]);
        setApprovals((prev) => [data, ...prev.filter((e) => e.status === 'Pending')]);
        setNewExpense({ description: '', amount: '', category: '', vendor: '', file: null });
        setMessage('Expense added successfully!');
        document.getElementById('file-upload-input').value = '';
      } catch (err) {
        console.error('Failed to add expense', err);
        setMessage('Failed to add expense.');
      }
    })();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewExpense(prev => ({ ...prev, file: file }));
      setUploadedReceiptNames(prev => [...prev, file.name]); // Store name for display
    }
  };

  const approveExpense = (id) => {
    (async () => {
      try {
        const { data } = await expensesApi.approve(id);
        setExpenses((prev) => prev.map((exp) => (exp._id === id ? data : exp)));
        setApprovals((prev) => prev.filter((exp) => exp._id !== id));
        setMessage('Expense approved!');
      } catch (err) {
        console.error('Approve failed', err);
        setMessage('Failed to approve expense.');
      }
    })();
  };

  const removeExpense = (id) => {
    (async () => {
      try {
        await expensesApi.remove(id);
        setExpenses((prev) => prev.filter((exp) => exp._id !== id));
        setApprovals((prev) => prev.filter((exp) => exp._id !== id));
        setMessage('Expense deleted.');
      } catch (err) {
        console.error('Delete failed', err);
        setMessage('Failed to delete expense.');
      }
    })();
  };

  const totalSpent = expenses.reduce((acc, cur) => acc + Number(cur.amount), 0);
  const limitReached = totalSpent > monthlyLimit;

  // ✨ LLM Feature 1: Suggest Expense Category
  const suggestCategory = async () => {
    if (!newExpense.description.trim()) {
      setMessage('Please enter a description to get a category suggestion.');
      return;
    }

    setLlmLoading(true);
    setMessage('Suggesting category...');
    try {
      const { data } = await predictionApi.suggestCategory(newExpense.description);
      const suggestedText = data.category;
      setNewExpense(prev => ({ ...prev, category: suggestedText }));
      setMessage(`Category suggested: ${suggestedText}`);
    } catch (error) {
      console.error('Error suggesting category:', error);
      setMessage('Error suggesting category. Please check console.');
    } finally {
      setLlmLoading(false);
    }
  };

  // ✨ LLM Feature 2: Generate Spending Insight
  const generateSpendingInsight = async () => {
    if (expenses.length === 0) {
      setSpendingInsight('Add some expenses first to get an insight!');
      return;
    }

    setLlmLoading(true);
    setSpendingInsight('Generating spending insight...');
    try {
      const payload = { expenses, monthlyLimit };
      const { data } = await predictionApi.insight(payload);
      setSpendingInsight(data.insight || 'Could not generate insight.');
    } catch (error) {
      console.error('Error generating insight:', error);
      setSpendingInsight('Error generating insight. Please check console.');
    } finally {
      setLlmLoading(false);
    }
  };


  return (
    // Outermost container: Ensures background covers full viewport width and height.
    // No horizontal padding or max-width here.
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Central content wrapper: Applies responsive padding and max-width for content. */}
      {/* This is where all your actual UI elements will live, keeping them centered and readable. */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* User Feedback Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between"
            role="alert"
          >
            <span>{message}</span>
            <button onClick={() => setMessage('')} className="text-blue-700 hover:text-blue-900 font-bold ml-4">
              &times;
            </button>
          </motion.div>
        )}

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white border-b border-gray-200 p-6 mb-6 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between w-full"
        >
          <div className="flex items-center mb-4 md:mb-0">
            <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 mr-4">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Expense Management</h1>
              <p className="text-sm text-gray-600">Track and manage organizational expenses efficiently</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`flex items-center border px-4 py-2 rounded-lg text-sm font-medium ${limitReached ? 'bg-red-50 border-red-200 text-red-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700'}`}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Limit: ₹{monthlyLimit.toLocaleString('en-IN')} / Spent: ₹{totalSpent.toLocaleString('en-IN')}
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generateSpendingInsight}
              disabled={llmLoading}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 text-sm font-semibold flex items-center"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              {llmLoading && spendingInsight.startsWith('Generating') ? 'Generating...' : 'Spending Insight ✨'}
            </motion.button>
          </div>
        </motion.div>

        {/* Spending Insight Display */}
        {spendingInsight && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-indigo-50 border border-indigo-200 text-indigo-700 px-6 py-4 rounded-xl shadow-sm mb-6"
          >
            <h3 className="font-semibold text-indigo-800 mb-2 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2" /> Your Spending Insight
            </h3>
            <p className="text-sm">{spendingInsight}</p>
          </motion.div>
        )}


        {/* New Expense Form */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-sm mb-8 w-full"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Plus className="w-5 h-5 mr-2 text-green-600" /> Add New Expense
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <input type="text" placeholder="Description" value={newExpense.description} onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 outline-none" />
            <input type="number" placeholder="Amount" value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 outline-none" />
            <div className="flex items-center gap-2 col-span-1 sm:col-span-2 lg:col-span-1">
              <input type="text" placeholder="Category" value={newExpense.category} onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 outline-none" />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={suggestCategory}
                disabled={llmLoading}
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 text-sm flex-shrink-0"
                title="Suggest Category"
              >
                {llmLoading && message.includes('Suggesting') ? '...' : '✨'}
              </motion.button>
            </div>
            <input type="text" placeholder="Vendor" value={newExpense.vendor} onChange={(e) => setNewExpense({ ...newExpense, vendor: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 outline-none" />
            <input
              id="file-upload-input" // Added ID to clear input visually
              type="file"
              onChange={handleFileChange}
              className="px-4 py-2 border border-gray-300 rounded-lg w-full col-span-full sm:col-span-1 md:col-span-2 lg:col-span-1
                         file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold
                         file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 cursor-pointer outline-none"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddExpense}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full col-span-full sm:col-span-1 lg:col-span-1 font-semibold"
            >
              Add Expense
            </motion.button>
          </div>
        </motion.div>

        {/* Expense List */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-sm mb-8 overflow-x-auto w-full"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">All Expenses</h2>
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-3 border-b-2 border-gray-200 text-gray-700 uppercase text-sm font-semibold">Description</th>
                <th className="px-4 py-3 border-b-2 border-gray-200 text-gray-700 uppercase text-sm font-semibold">Amount</th>
                <th className="px-4 py-3 border-b-2 border-gray-200 text-gray-700 uppercase text-sm font-semibold">Category</th>
                <th className="px-4 py-3 border-b-2 border-gray-200 text-gray-700 uppercase text-sm font-semibold">Vendor</th>
                <th className="px-4 py-3 border-b-2 border-gray-200 text-gray-700 uppercase text-sm font-semibold">Receipt</th>
                <th className="px-4 py-3 border-b-2 border-gray-200 text-gray-700 uppercase text-sm font-semibold">Status</th>
                <th className="px-4 py-3 border-b-2 border-gray-200 text-gray-700 uppercase text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500 text-base">No expenses added yet.</td>
                </tr>
              ) : (
                expenses.map((expense) => (
                  <tr key={expense._id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-800">{expense.description}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">₹{parseFloat(expense.amount).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{expense.category || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{expense.vendor || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-blue-600 hover:underline cursor-pointer">
                      {expense.receiptFilename ? (
                        <a href={`${api.defaults.baseURL}/uploads/${expense.receiptFilename}`} target="_blank" rel="noopener noreferrer">
                          {expense.receiptOriginalName || 'Receipt'}
                        </a>
                      ) : expense.file ? (
                        <a href={URL.createObjectURL(expense.file)} target="_blank" rel="noopener noreferrer">
                          {expense.file.name}
                        </a>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        expense.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {expense.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 items-center">
                        {expense.status === 'Pending' && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => approveExpense(expense._id)}
                            className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-50 transition-colors"
                            title="Approve Expense"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => removeExpense(expense._id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 transition-colors"
                          title="Delete Expense"
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </motion.div>

        {/* Uploaded Receipts */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-sm mb-8 w-full"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Upload className="w-5 h-5 mr-2 text-indigo-600" /> Uploaded Receipts
          </h2>
          {uploadedReceiptNames.length === 0 ? (
            <p className="text-gray-600 text-sm">No receipts uploaded yet.</p>
          ) : (
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {uploadedReceiptNames.map((name, idx) => <li key={idx} className="text-gray-700">{name}</li>)}
            </ul>
          )}
        </motion.div>

        {/* Approval Workflows */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-sm w-full"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <UserCheck className="w-5 h-5 mr-2 text-teal-600" /> Approval Workflows
          </h2>
          {approvals.length === 0 ? (
            <p className="text-gray-600 text-sm">No expenses awaiting approval.</p>
          ) : (
            <ul className="space-y-3">
              {approvals.map((expense) => (
                <li key={expense._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between border border-gray-200 rounded-lg px-4 py-3 bg-blue-50">
                  <span className="font-medium text-gray-800 mb-2 sm:mb-0">
                    {expense.description} - <span className="text-blue-700">₹{parseFloat(expense.amount).toLocaleString('en-IN')}</span>
                    {expense.category && <span className="text-gray-600 ml-2">({expense.category})</span>}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => approveExpense(expense._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-sm font-semibold"
                  >
                    Approve
                  </motion.button>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div> {/* End of inner content wrapper */}
    </div> // End of outermost background container
  );
};

export default App;
