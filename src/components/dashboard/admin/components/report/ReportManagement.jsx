/* eslint-disable no-useless-assignment */

/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

// Material Icons
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SavingsIcon from "@mui/icons-material/Savings";
import BarChartIcon from "@mui/icons-material/BarChart";
import PieChartIcon from "@mui/icons-material/PieChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import PsychologyIcon from "@mui/icons-material/Psychology";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CloseIcon from "@mui/icons-material/Close";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
];

// API Base URL
const API_URL = "https://household-expenses-management-system.onrender.com/api";

// Environment configuration - read from .env file
const ENV_CONFIG = {
  groqApiKey: import.meta.env.VITE_GROQ_API_KEY || "",
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || "",
  apiBaseUrl: import.meta.env.VITE_API_URL || API_URL,
};


// Axios instance with auth token
const api = axios.create({
  baseURL: ENV_CONFIG.apiBaseUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Modal Component
const DataModal = ({ isOpen, onClose, title, data, loading, type }) => {
  if (!isOpen) return null;

  const formatCurrencyRWF = (amount) => {
    return new Intl.NumberFormat("rw-RW", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const getTotalAmount = () => {
    if (!data || !Array.isArray(data)) return 0;
    return data.reduce((sum, item) => sum + (item.amount || 0), 0);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Total: {formatCurrencyRWF(getTotalAmount())} |{" "}
                  {data?.length || 0} entries
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <CloseIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : data && data.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          #
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount (RWF)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {data.map((item, index) => (
                        <motion.tr
                          key={item._id || item.id || index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {index + 1}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800">
                            {item.description || "N/A"}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                              {item.category || "Uncategorized"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {formatDate(item.date)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-medium text-gray-800">
                            {formatCurrencyRWF(item.amount)}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 border-t border-gray-200">
                      <tr>
                        <td
                          colSpan="4"
                          className="px-4 py-3 text-sm font-bold text-gray-700 text-right"
                        >
                          Total:
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-right text-purple-600">
                          {formatCurrencyRWF(getTotalAmount())}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <div className="flex items-center justify-center h-40">
                  <p className="text-gray-500">No data available</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// AI Insights Modal Component
const AIInsightsModal = ({ isOpen, onClose, insights, isLoading }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <PsychologyIcon className="text-purple-600" />
                  AI Financial Insights
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Powered by Groq & Gemini AI
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <CloseIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-600">Analyzing your finances...</p>
                  <p className="text-sm text-gray-400 mt-1">This may take a moment</p>
                </div>
              ) : insights ? (
                <div className="space-y-6">
                  {/* Summary */}
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200">
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
                      <AutoAwesomeIcon className="text-purple-600" />
                      Financial Summary
                    </h4>
                    <p className="text-gray-700">{insights.summary || "Analysis complete"}</p>
                    {insights.timestamp && (
                      <p className="text-xs text-gray-400 mt-2">
                        Analyzed: {new Date(insights.timestamp).toLocaleString()}
                      </p>
                    )}
                    {insights.isFallback && (
                      <p className="text-xs text-yellow-600 mt-2">
                        ⚠️ Using fallback insights (API calls failed)
                      </p>
                    )}
                  </div>

                  {/* Groq Insights */}
                  {insights.groq && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">G</span>
                        </div>
                        <h4 className="font-semibold text-gray-800">Groq AI Analysis</h4>
                      </div>
                      <div className="prose prose-sm max-w-none">
                        <p className="text-gray-700 whitespace-pre-wrap text-sm">
                          {insights.groq}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Gemini Insights */}
                  {insights.gemini && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">G</span>
                        </div>
                        <h4 className="font-semibold text-gray-800">Gemini AI Analysis</h4>
                      </div>
                      <div className="prose prose-sm max-w-none">
                        <p className="text-gray-700 whitespace-pre-wrap text-sm">
                          {insights.gemini}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {insights.recommendations && insights.recommendations.length > 0 && (
                    <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                      <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
                        <LightbulbIcon className="text-yellow-600" />
                        Key Recommendations
                      </h4>
                      <ul className="space-y-2">
                        {insights.recommendations.map((rec, index) => (
                          <li
                            key={index}
                            className="text-sm text-gray-700 flex items-start gap-2"
                          >
                            <span className="text-yellow-600 mt-0.5">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-600">Loading insights...</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// StatCard component
const StatCard = ({ title, value, icon, color, subtitle, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -2 }}
    onClick={onClick}
    className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${color} cursor-pointer transition-all hover:shadow-xl`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-xs font-bold text-gray-800 mt-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
      <div
        className={`w-12 h-12 bg-opacity-20 rounded-full flex items-center justify-center ${color.replace("border-", "bg-").replace("-500", "-100")}`}
      >
        {icon}
      </div>
    </div>
  </motion.div>
);

export const ReportDashboard = () => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("userData") || "null");
    } catch {
      return null;
    }
  });

  // State for data
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [savings, setSavings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const [selectedChart, setSelectedChart] = useState("bar");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [apiKeysConfigured, setApiKeysConfigured] = useState(true);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalType, setModalType] = useState("");

  // AI Insights Modal state
  const [aiModalOpen, setAiModalOpen] = useState(false);

  // API Keys from environment config
  const groqApiKey = ENV_CONFIG.groqApiKey;
  const geminiApiKey = ENV_CONFIG.geminiApiKey;

  // Check if API keys are configured
  useEffect(() => {
    const hasKeys = groqApiKey.length > 0 || geminiApiKey.length > 0;
    setApiKeysConfigured(hasKeys);
  }, [groqApiKey, geminiApiKey]);

  // Fetch all data from API
  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const userData = JSON.parse(localStorage.getItem("userData") || "null");

      if (!token || !userData) {
        toast.error("Please login to view reports");
        setIsLoading(false);
        return;
      }

      const email = userData.email;

      // Fetch expenses
      const expenseParams = { email };
      const expenseResponse = await api.get("/expenses", {
        params: expenseParams,
      });

      if (expenseResponse.data.success) {
        setExpenses(expenseResponse.data.data || []);
      }

      // Fetch incomes
      const incomeParams = { email };
      const incomeResponse = await api.get("/incomes", {
        params: incomeParams,
      });

      if (incomeResponse.data.success) {
        setIncomes(incomeResponse.data.data || []);
      }

      // Fetch budgets
      const budgetParams = {
        email,
        month: selectedMonth,
        year: selectedYear,
      };
      const budgetResponse = await api.get("/budgets", {
        params: budgetParams,
      });

      if (budgetResponse.data.success) {
        const budgetData = budgetResponse.data.data || [];
        setBudgets(budgetData);
      }

      // Fetch savings
      const savingsParams = { email };
      const savingsResponse = await api.get("/savings", {
        params: savingsParams,
      });

      if (savingsResponse.data.success) {
        setSavings(savingsResponse.data.data || []);
      }

      toast.success("Data loaded successfully!");
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(error.response?.data?.message || "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  // Fetch data on mount and when month/year changes
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Open modal with data
  const openModal = async (type) => {
    setModalLoading(true);
    setModalOpen(true);
    setModalType(type);

    try {
      const token = localStorage.getItem("authToken");
      const userData = JSON.parse(localStorage.getItem("userData") || "null");
      const email = userData?.email;

      let response;
      let title = "";
      let data = [];

      switch (type) {
        case "incomes":
          title = "Total Income";
          response = await api.get("/incomes", { params: { email } });
          data = response.data.data || [];
          break;
        case "expenses":
          title = "Total Expenses";
          response = await api.get("/expenses", { params: { email } });
          data = response.data.data || [];
          break;
        case "savings":
          title = "Savings Goals";
          response = await api.get("/savings", { params: { email } });
          data = response.data.data || [];
          break;
        case "budgets":
          title = "Budget Usage";
          response = await api.get("/budgets", {
            params: { email, month: selectedMonth, year: selectedYear },
          });
          data = response.data.data || [];
          break;
        default:
          data = [];
      }

      setModalTitle(title);
      setModalData(data);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      toast.error(`Failed to load ${type} data`);
      setModalData([]);
    } finally {
      setModalLoading(false);
    }
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setModalData([]);
    setModalTitle("");
    setModalType("");
  };

  // Combine transactions from expenses and incomes
  const getAllTransactions = useCallback(() => {
    const expenseTransactions = expenses.map((e) => ({
      ...e,
      type: "expense",
      id: e._id || e.id,
    }));

    const incomeTransactions = incomes.map((i) => ({
      ...i,
      type: "income",
      id: i._id || i.id,
    }));

    return [...expenseTransactions, ...incomeTransactions];
  }, [expenses, incomes]);

  // Calculate statistics using actual budget and savings data
  const calculateStats = useCallback(() => {
    const allTransactions = getAllTransactions();

    const totalIncome = incomes.reduce((sum, i) => sum + (i.amount || 0), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const savingsAmount = totalIncome - totalExpenses;

    // Budget calculations from budget summary
    let totalBudgeted = 0;
    let totalSpent = 0;
    let budgetRemaining = 0;
    let budgetUsed = 0;

    // Check if budgets have the summary structure
    if (budgets.length > 0 && budgets[0].budgetSummary) {
      const summary = budgets[0].budgetSummary;
      totalBudgeted = summary.totalBudgeted || 0;
      totalSpent = summary.totalSpent || 0;
      budgetRemaining = summary.remainingBudget || 0;
      budgetUsed = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;
    } else {
      // Fallback: calculate from individual budget items
      totalBudgeted = budgets.reduce(
        (sum, b) => sum + (b.allocatedAmount || b.amount || 0),
        0,
      );
      totalSpent = budgets.reduce(
        (sum, b) => sum + (b.spentAmount || 0),
        0,
      );
      budgetRemaining = totalBudgeted - totalSpent;
      budgetUsed = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;
    }

    // Category breakdown
    const categoryData = {};
    allTransactions.forEach((t) => {
      const cat = t.category || "Uncategorized";
      if (!categoryData[cat]) {
        categoryData[cat] = { expense: 0, income: 0 };
      }
      if (t.type === "expense") {
        categoryData[cat].expense += t.amount || 0;
      } else {
        categoryData[cat].income += t.amount || 0;
      }
    });

    const categoryChartData = Object.keys(categoryData).map((cat) => ({
      name: cat,
      expenses: Math.round(categoryData[cat].expense * 100) / 100,
      income: Math.round(categoryData[cat].income * 100) / 100,
    }));

    // Monthly data for trend
    const monthlyData = {};
    allTransactions.forEach((t) => {
      const date = t.date ? new Date(t.date) : new Date();
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expenses: 0 };
      }
      if (t.type === "income") {
        monthlyData[month].income += t.amount || 0;
      } else {
        monthlyData[month].expenses += t.amount || 0;
      }
    });

    const monthlyChartData = Object.keys(monthlyData)
      .sort()
      .map((month) => ({
        month,
        income: Math.round(monthlyData[month].income * 100) / 100,
        expenses: Math.round(monthlyData[month].expenses * 100) / 100,
      }));

    // Savings progress from savings data
    let totalSavingsTarget = 0;
    let totalSavingsCurrent = 0;
    let savingsProgress = 0;

    if (savings.length > 0 && savings[0].summary) {
      const summary = savings[0].summary;
      totalSavingsTarget = summary.totalTarget || 0;
      totalSavingsCurrent = summary.totalCurrent || 0;
      savingsProgress = summary.overallProgress || 0;
    } else {
      totalSavingsTarget = savings.reduce(
        (sum, s) => sum + (s.targetAmount || 0),
        0,
      );
      totalSavingsCurrent = savings.reduce(
        (sum, s) => sum + (s.currentAmount || 0),
        0,
      );
      savingsProgress =
        totalSavingsTarget > 0
          ? (totalSavingsCurrent / totalSavingsTarget) * 100
          : 0;
    }

    return {
      totalIncome,
      totalExpenses,
      savings: savingsAmount,
      totalBudgeted,
      totalSpent,
      budgetRemaining,
      budgetUsed,
      categoryChartData,
      monthlyChartData,
      transactionCount: allTransactions.length,
      savingsProgress,
      totalSavingsTarget,
      totalSavingsCurrent,
      budgetCount: budgets.length,
      savingsCount: savings.length,
    };
  }, [expenses, incomes, budgets, savings, getAllTransactions]);

  const stats = calculateStats();

  // Format currency in RWF
  const formatCurrencyRWF = (amount) => {
    return new Intl.NumberFormat("rw-RW", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Generate fallback insights
  const generateFallbackInsights = useCallback(() => {
    const recommendations = [];

    if (stats.budgetUsed > 80) {
      recommendations.push(
        `⚠️ Your spending is at ${Math.round(stats.budgetUsed)}% of budget. Consider reducing expenses in top categories.`,
      );
    }

    if (stats.savings < stats.totalIncome * 0.2 && stats.totalIncome > 0) {
      recommendations.push(
        `💰 Aim to save at least 20% of your income. Consider setting up automatic transfers to savings.`,
      );
    }

    const topCategory = stats.categoryChartData
      .sort((a, b) => b.expenses - a.expenses)
      .slice(0, 1)[0];

    if (topCategory && topCategory.expenses > 0) {
      recommendations.push(
        `📊 Your highest expense category is "${topCategory.name}" (${formatCurrencyRWF(topCategory.expenses)}). Review if this spending can be optimized.`,
      );
    }

    if (stats.budgetRemaining > 0) {
      recommendations.push(
        `✅ You have ${formatCurrencyRWF(stats.budgetRemaining)} remaining in your budget. Consider allocating this to savings or investments.`,
      );
    }

    if (stats.savingsProgress < 50 && stats.totalSavingsTarget > 0) {
      recommendations.push(
        `🎯 You're at ${Math.round(stats.savingsProgress)}% of your savings goal. Increase your monthly savings contribution.`,
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        `🌟 You're doing well! Continue tracking your expenses and review your financial goals regularly.`,
      );
    }

    const health = stats.savings > 0 ? "Good" : "Needs Attention";
    const spendingLevel =
      stats.budgetUsed > 80
        ? "High"
        : stats.budgetUsed > 50
          ? "Moderate"
          : "Low";

    const summaryText = `Financial Health: ${health}. Spending level: ${spendingLevel}. Budget used: ${Math.round(stats.budgetUsed)}%. Total savings: ${formatCurrencyRWF(stats.savings)}.`;

    return {
      groq: summaryText + "\n\n" + recommendations.join("\n"),
      gemini:
        summaryText +
        "\n\nDetailed Analysis:\n" +
        recommendations.map((r, i) => `${i + 1}. ${r}`).join("\n"),
      summary: summaryText,
      recommendations: recommendations,
      timestamp: new Date().toISOString(),
      isFallback: true,
    };
  }, [stats]);

  // AI Analysis with live API calls
  const analyzeTransactions = useCallback(async () => {
    setIsAnalyzing(true);
    setAiModalOpen(true);
    setAiInsights(null);

    try {
      const allTransactions = getAllTransactions();

      // If no transactions, provide helpful insights immediately
      if (allTransactions.length === 0) {
        const noDataInsights = {
          groq: "📊 No transactions found in your account. Start adding your income and expenses to get personalized financial insights.",
          gemini: "📊 No transactions found in your account. Start adding your income and expenses to get personalized financial insights.",
          summary: "No transaction data available. Please add some transactions to get AI-powered insights.",
          recommendations: [
            "💡 Add your first income or expense transaction",
            "💡 Set up a budget to track your spending",
            "💡 Create savings goals to plan for the future"
          ],
          timestamp: new Date().toISOString(),
          isFallback: true,
        };
        setAiInsights(noDataInsights);
        setIsAnalyzing(false);
        toast.info("No transactions found. Add some data to get better insights.");
        return;
      }

      // Prepare transaction summary for AI
      const summaryData = {
        totalIncome: stats.totalIncome,
        totalExpenses: stats.totalExpenses,
        savings: stats.savings,
        budgetUsed: stats.budgetUsed,
        budgetRemaining: stats.budgetRemaining,
        savingsProgress: stats.savingsProgress,
        totalSavingsTarget: stats.totalSavingsTarget,
        totalSavingsCurrent: stats.totalSavingsCurrent,
        topExpenseCategories: stats.categoryChartData
          .sort((a, b) => b.expenses - a.expenses)
          .slice(0, 5)
          .map((c) => ({ category: c.name, amount: c.expenses })),
        recentTransactions: allTransactions.slice(0, 10).map((t) => ({
          description: t.description,
          category: t.category,
          type: t.type,
          amount: t.amount,
          date: t.date,
        })),
        budgetDetails: budgets.length > 0 && budgets[0].budgetSummary 
          ? budgets[0].budgetSummary.categories 
          : budgets.map(b => ({
              category: b.category || b.name,
              allocated: b.allocatedAmount || b.amount || 0,
              spent: b.spentAmount || 0,
            })),
        savingsDetails: savings.length > 0 && savings[0].summary
          ? savings[0].data || savings
          : savings.map(s => ({
              category: s.category,
              target: s.targetAmount,
              current: s.currentAmount,
              progress: s.progress || 0,
            })),
      };

      let groqResponse = null;
      let geminiResponse = null;

      // Try Groq API
      if (groqApiKey) {
        try {
          const groqPrompt = `Analyze the following financial data and provide concise, actionable insights:

INCOME & EXPENSES:
- Total Income: ${formatCurrencyRWF(summaryData.totalIncome)}
- Total Expenses: ${formatCurrencyRWF(summaryData.totalExpenses)}
- Net Savings: ${formatCurrencyRWF(summaryData.savings)}

BUDGET ANALYSIS:
- Budget Used: ${summaryData.budgetUsed.toFixed(1)}%
- Budget Remaining: ${formatCurrencyRWF(summaryData.budgetRemaining)}
- Budget Categories: ${summaryData.budgetDetails.map(d => `${d.category}: ${formatCurrencyRWF(d.allocated)} (${formatCurrencyRWF(d.spent)} spent, ${d.percentageUsed || 0}%)`).join('; ')}

SAVINGS GOALS:
- Total Target: ${formatCurrencyRWF(summaryData.totalSavingsTarget)}
- Current Savings: ${formatCurrencyRWF(summaryData.totalSavingsCurrent)}
- Progress: ${summaryData.savingsProgress.toFixed(1)}%
- Savings Details: ${summaryData.savingsDetails.map(s => `${s.category}: ${formatCurrencyRWF(s.current)}/${formatCurrencyRWF(s.target)} (${s.progress || 0}%)`).join('; ')}

TOP EXPENSE CATEGORIES:
${summaryData.topExpenseCategories.map((c, i) => `${i+1}. ${c.category}: ${formatCurrencyRWF(c.amount)}`).join('\n')}

Provide advice in the following format:
SUMMARY: (Brief summary of financial health)
STRENGTHS: (What they're doing well)
WEAKNESSES: (Areas needing improvement)
RECOMMENDATIONS: (Specific actionable advice, 3-4 bullet points)
PREDICTIONS: (Future outlook based on current trends)`;

          const groqResult = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
              model: "mixtral-8x7b-32768",
              messages: [
                {
                  role: "system",
                  content:
                    "You are a financial advisor AI. Provide concise, practical financial advice.",
                },
                {
                  role: "user",
                  content: groqPrompt,
                },
              ],
              temperature: 0.7,
              max_tokens: 600,
            },
            {
              headers: {
                Authorization: `Bearer ${groqApiKey}`,
                "Content-Type": "application/json",
              },
            },
          );
          groqResponse = groqResult.data.choices[0].message.content;
        } catch (error) {
          console.error("Groq API error:", error);
        }
      }

      // Try Gemini API
      if (geminiApiKey) {
        try {
          const geminiPrompt = `As a financial advisor, analyze this financial data and provide detailed advice:

INCOME & EXPENSES:
- Total Income: ${formatCurrencyRWF(summaryData.totalIncome)}
- Total Expenses: ${formatCurrencyRWF(summaryData.totalExpenses)}
- Net Savings: ${formatCurrencyRWF(summaryData.savings)}

BUDGET ANALYSIS:
- Budget Used: ${summaryData.budgetUsed.toFixed(1)}%
- Budget Remaining: ${formatCurrencyRWF(summaryData.budgetRemaining)}
- Budget Categories: ${summaryData.budgetDetails.map(d => `${d.category}: ${formatCurrencyRWF(d.allocated)} allocated, ${formatCurrencyRWF(d.spent)} spent`).join('; ')}

SAVINGS GOALS:
- Total Target: ${formatCurrencyRWF(summaryData.totalSavingsTarget)}
- Current Savings: ${formatCurrencyRWF(summaryData.totalSavingsCurrent)}
- Progress: ${summaryData.savingsProgress.toFixed(1)}%
- Savings Details: ${summaryData.savingsDetails.map(s => `${s.category}: ${formatCurrencyRWF(s.current)}/${formatCurrencyRWF(s.target)}`).join('; ')}

TOP EXPENSE CATEGORIES:
${summaryData.topExpenseCategories.map((c, i) => `${i+1}. ${c.category}: ${formatCurrencyRWF(c.amount)}`).join('\n')}

Provide insights on:
1. Overall financial health assessment
2. Budget management evaluation
3. Spending patterns and trends4. Savings recommendations
5. Risk factors
6. Future financial planning suggestions

Format the response as a structured analysis with clear sections.`;

          const geminiResult = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
            {
              contents: [
                {
                  parts: [
                    {
                      text: geminiPrompt,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 800,
              },
            },
          );
          geminiResponse =
            geminiResult.data.candidates[0].content.parts[0].text;
        } catch (error) {
          console.error("Gemini API error:", error);
        }
      }

      // Generate fallback insights
      const fallbackInsights = generateFallbackInsights();
      
      // Always set insights (either from APIs or fallback)
      let finalInsights;
      if (groqResponse || geminiResponse) {
        finalInsights = {
          groq: groqResponse || "Groq analysis not available.",
          gemini: geminiResponse || "Gemini analysis not available.",
          summary: fallbackInsights.summary,
          recommendations: fallbackInsights.recommendations,
          timestamp: new Date().toISOString(),
          isFallback: false,
        };
        toast.success("AI Analysis completed successfully!");
      } else {
        // Use fallback insights
        finalInsights = {
          ...fallbackInsights,
          isFallback: true,
        };
        toast.warning("Using fallback insights - API calls failed");
      }
      
      // Set insights and turn off loading
      setAiInsights(finalInsights);
      setIsAnalyzing(false);
      
    } catch (error) {
      console.error("Error during AI analysis:", error);
      // Always provide fallback insights even on error
      const fallbackInsights = generateFallbackInsights();
      setAiInsights({
        ...fallbackInsights,
        isFallback: true,
      });
      setIsAnalyzing(false);
      toast.error("Using fallback insights due to error");
    }
  }, [
    stats,
    getAllTransactions,
    groqApiKey,
    geminiApiKey,
    generateFallbackInsights,
    budgets,
    savings,
  ]);

  // Export report as CSV
  const exportReport = useCallback(() => {
    const allTransactions = getAllTransactions();

    if (allTransactions.length === 0) {
      toast.warning("No transactions to export");
      return;
    }

    const headers = ["Date", "Description", "Category", "Type", "Amount (RWF)"];
    const rows = allTransactions.map((t) => [
      t.date ? new Date(t.date).toLocaleDateString() : "N/A",
      t.description || "N/A",
      t.category || "N/A",
      t.type || "N/A",
      t.amount || 0,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `financial_report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Report exported successfully!");
  }, [getAllTransactions]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const allTransactions = getAllTransactions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6 lg:p-8">
      {/* Data Modal */}
      <DataModal
        isOpen={modalOpen}
        onClose={closeModal}
        title={modalTitle}
        data={modalData}
        loading={modalLoading}
        type={modalType}
      />

      {/* AI Insights Modal */}
      <AIInsightsModal
        isOpen={aiModalOpen}
        onClose={() => {
          setAiModalOpen(false);
          setIsAnalyzing(false);
        }}
        insights={aiInsights}
        isLoading={isAnalyzing}
      />

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <BarChartIcon className="text-purple-600" />
              Financial Reports
            </h2>
            <p className="text-gray-600 mt-1">
              Analyze your income, expenses, and get AI-powered insights
            </p>
            {user?.email && (
              <p className="text-sm text-gray-500 mt-1">User: {user.email}</p>
            )}
            {apiKeysConfigured && (
              <p className="text-xs text-green-600 mt-1">
                ✅ AI insights are enabled with your API keys.
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              >
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((month, index) => (
                  <option key={index} value={index}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              >
                {[2023, 2024, 2025, 2026, 2027].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={fetchAllData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <RefreshIcon className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">
                Refresh
              </span>
            </button>
            <button
              onClick={exportReport}
              className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              <DownloadIcon className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">
                Export
              </span>
            </button>
            <button
              onClick={analyzeTransactions}
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Analyzing...</span>
                </div>
              ) : (
                <>
                  <PsychologyIcon className="w-4 h-4" />
                  <span>AI Insights</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid - Clickable */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <StatCard
          title="Total Income"
          value={formatCurrencyRWF(stats.totalIncome)}
          icon={<TrendingUpIcon className="text-blue-600" />}
          color="border-blue-500"
          subtitle={`${incomes.length} income entries`}
          onClick={() => openModal("incomes")}
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrencyRWF(stats.totalExpenses)}
          icon={<TrendingDownIcon className="text-red-600" />}
          color="border-red-500"
          subtitle={`${expenses.length} expense entries`}
          onClick={() => openModal("expenses")}
        />
        <StatCard
          title="Net Savings"
          value={formatCurrencyRWF(stats.savings)}
          icon={<SavingsIcon className="text-green-600" />}
          color="border-green-500"
          subtitle={`${stats.savingsCount} savings goals`}
          onClick={() => openModal("savings")}
        />
        <StatCard
          title="Budget Usage"
          value={`${Math.round(stats.budgetUsed)}%`}
          icon={<AccountBalanceIcon className="text-purple-600" />}
          color="border-purple-500"
          subtitle={`${stats.budgetCount} budget categories`}
          onClick={() => openModal("budgets")}
        />
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <p className="text-sm text-gray-500">Budget Remaining</p>
          <p className="text-xl font-bold text-blue-600">
            {formatCurrencyRWF(stats.budgetRemaining)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <p className="text-sm text-gray-500">Savings Progress</p>
          <p className="text-xl font-bold text-green-600">
            {stats.savingsProgress.toFixed(1)}%
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(stats.savingsProgress, 100)}%` }}
            />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <p className="text-sm text-gray-500">Total Transactions</p>
          <p className="text-xl font-bold text-purple-600">
            {stats.transactionCount}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {allTransactions.filter((t) => t.type === "income").length} income,{" "}
            {allTransactions.filter((t) => t.type === "expense").length}{" "}
            expenses
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bar Chart - Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <BarChartIcon className="text-blue-600" />
              Category Breakdown
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedChart("bar")}
                className={`p-1.5 rounded ${selectedChart === "bar" ? "bg-blue-100 text-blue-600" : "text-gray-400 hover:bg-gray-100"}`}
              >
                <BarChartIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSelectedChart("pie")}
                className={`p-1.5 rounded ${selectedChart === "pie" ? "bg-blue-100 text-blue-600" : "text-gray-400 hover:bg-gray-100"}`}
              >
                <PieChartIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSelectedChart("line")}
                className={`p-1.5 rounded ${selectedChart === "line" ? "bg-blue-100 text-blue-600" : "text-gray-400 hover:bg-gray-100"}`}
              >
                <ShowChartIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="h-64 sm:h-80">
            {stats.categoryChartData.length > 0 ? (
              selectedChart === "bar" && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.categoryChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrencyRWF(value)} />
                    <Legend />
                    <Bar dataKey="expenses" fill="#FF8042" name="Expenses" />
                    <Bar dataKey="income" fill="#00C49F" name="Income" />
                  </BarChart>
                </ResponsiveContainer>
              )
            ) : selectedChart === "pie" &&
              stats.categoryChartData.filter((d) => d.expenses > 0).length >
                0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.categoryChartData.filter((d) => d.expenses > 0)}
                    dataKey="expenses"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {stats.categoryChartData
                      .filter((d) => d.expenses > 0)
                      .map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrencyRWF(value)} />
                </PieChart>
              </ResponsiveContainer>
            ) : selectedChart === "line" &&
              stats.monthlyChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrencyRWF(value)} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#00C49F"
                    strokeWidth={2}
                    name="Income"
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#FF8042"
                    strokeWidth={2}
                    name="Expenses"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No data available for charts</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <ShowChartIcon className="text-green-600" />
            Monthly Trends
          </h3>
          <div className="h-64 sm:h-80">
            {stats.monthlyChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.monthlyChartData}>
                  <defs>
                    <linearGradient
                      id="colorIncome"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#00C49F" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorExpenses"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#FF8042" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#FF8042" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrencyRWF(value)} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#00C49F"
                    fillOpacity={1}
                    fill="url(#colorIncome)"
                    name="Income"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="#FF8042"
                    fillOpacity={1}
                    fill="url(#colorExpenses)"
                    name="Expenses"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No data available for trends</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={analyzeTransactions}
          disabled={isAnalyzing}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-2xl shadow-lg p-6 text-left hover:shadow-xl transition-all disabled:opacity-50"
        >
          <PsychologyIcon className="w-8 h-8 mb-2" />
          <h4 className="font-semibold">AI Analysis</h4>
          <p className="text-sm opacity-90 mt-1">
            Get smart financial insights
          </p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={exportReport}
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl shadow-lg p-6 text-left hover:shadow-xl transition-all"
        >
          <DownloadIcon className="w-8 h-8 mb-2" />
          <h4 className="font-semibold">Export Report</h4>
          <p className="text-sm opacity-90 mt-1">Download as CSV</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={fetchAllData}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl shadow-lg p-6 text-left hover:shadow-xl transition-all"
        >
          <RefreshIcon className="w-8 h-8 mb-2" />
          <h4 className="font-semibold">Refresh Data</h4>
          <p className="text-sm opacity-90 mt-1">Update your transactions</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl shadow-lg p-6 text-left hover:shadow-xl transition-all"
          onClick={() => window.print()}
        >
          <CalendarTodayIcon className="w-8 h-8 mb-2" />
          <h4 className="font-semibold">Print Report</h4>
          <p className="text-sm opacity-90 mt-1">Generate printable version</p>
        </motion.button>
      </div>
    </div>
  );
};