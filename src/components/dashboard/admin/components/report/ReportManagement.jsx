/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
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

// Fallback data
const FALLBACK_TRANSACTIONS = [
  {
    id: 1,
    description: "Grocery Shopping",
    category: "Food",
    type: "expense",
    amount: 120.5,
    date: "2026-07-22",
  },
  {
    id: 2,
    description: "Electricity Bill",
    category: "Utilities",
    type: "expense",
    amount: 85.0,
    date: "2026-07-21",
  },
  {
    id: 3,
    description: "Salary Deposit",
    category: "Salary",
    type: "income",
    amount: 2800.0,
    date: "2026-07-20",
  },
  {
    id: 4,
    description: "Internet Subscription",
    category: "Utilities",
    type: "expense",
    amount: 45.0,
    date: "2026-07-19",
  },
  {
    id: 5,
    description: "Freelance Payment",
    category: "Freelance",
    type: "income",
    amount: 400.0,
    date: "2026-07-18",
  },
  {
    id: 6,
    description: "Restaurant Dinner",
    category: "Food",
    type: "expense",
    amount: 65.75,
    date: "2026-07-17",
  },
  {
    id: 7,
    description: "Gym Membership",
    category: "Health",
    type: "expense",
    amount: 50.0,
    date: "2026-07-16",
  },
  {
    id: 8,
    description: "Dividend Payment",
    category: "Investment",
    type: "income",
    amount: 150.0,
    date: "2026-07-15",
  },
  {
    id: 9,
    description: "Netflix Subscription",
    category: "Entertainment",
    type: "expense",
    amount: 15.99,
    date: "2026-07-14",
  },
  {
    id: 10,
    description: "Gasoline",
    category: "Transportation",
    type: "expense",
    amount: 35.5,
    date: "2026-07-13",
  },
];

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

// StatCard component - moved outside of main component
const StatCard = ({ title, value, icon, color, subtitle }) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -2 }}
    className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${color}`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
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

// API Configuration
const getApiConfig = () => {
  // For browser environment, use window._env_ or fallback values
  const env = typeof window !== "undefined" ? window._env_ || {} : {};

  return {
    groqApiKey: env.REACT_APP_GROQ_API_KEY || "",
    geminiApiKey: env.REACT_APP_GEMINI_API_KEY || "",
    apiBaseUrl: env.REACT_APP_API_URL || "http://localhost:5000/api",
  };
};

export const ReportDashboard = () => {
  const [transactions, setTransactions] = useState(FALLBACK_TRANSACTIONS);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const [selectedChart, setSelectedChart] = useState("bar");
  const [apiKeysConfigured, setApiKeysConfigured] = useState(false);

  // API Config
  const apiConfig = getApiConfig();
  const { groqApiKey, geminiApiKey, apiBaseUrl } = apiConfig;

  // Check if API keys are configured
  useEffect(() => {
    const hasKeys = groqApiKey.length > 0 || geminiApiKey.length > 0;
    setApiKeysConfigured(hasKeys);
    if (!hasKeys) {
      console.warn("AI API keys not configured. Using fallback insights.");
    }
  }, [groqApiKey, geminiApiKey]);

  // Fetch transactions - defined with useCallback
  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setTransactions(FALLBACK_TRANSACTIONS);
        toast.warning("Using fallback transaction data");
        return;
      }

      const response = await axios.get(`${apiBaseUrl}/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.length > 0) {
        setTransactions(response.data);
      } else {
        setTransactions(FALLBACK_TRANSACTIONS);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions(FALLBACK_TRANSACTIONS);
      toast.warning("Using fallback transaction data");
    } finally {
      setIsLoading(false);
    }
  }, [apiBaseUrl]);

  // Fetch transactions on mount
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Calculate statistics
  const calculateStats = () => {
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const savings = totalIncome - totalExpenses;
    const monthlyBudget = 2800; // Example monthly budget
    const budgetUsed =
      totalExpenses > 0
        ? Math.min((totalExpenses / monthlyBudget) * 100, 100)
        : 0;
    const budgetRemaining = Math.max(monthlyBudget - totalExpenses, 0);

    // Category breakdown
    const categoryData = {};
    transactions.forEach((t) => {
      if (!categoryData[t.category]) {
        categoryData[t.category] = { expense: 0, income: 0 };
      }
      if (t.type === "expense") {
        categoryData[t.category].expense += t.amount;
      } else {
        categoryData[t.category].income += t.amount;
      }
    });

    const categoryChartData = Object.keys(categoryData).map((cat) => ({
      name: cat,
      expenses: Math.round(categoryData[cat].expense * 100) / 100,
      income: Math.round(categoryData[cat].income * 100) / 100,
    }));

    // Monthly data for trend
    const monthlyData = {};
    transactions.forEach((t) => {
      const month = t.date ? t.date.substring(0, 7) : "2026-07";
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expenses: 0 };
      }
      if (t.type === "income") {
        monthlyData[month].income += t.amount;
      } else {
        monthlyData[month].expenses += t.amount;
      }
    });

    const monthlyChartData = Object.keys(monthlyData).map((month) => ({
      month,
      income: Math.round(monthlyData[month].income * 100) / 100,
      expenses: Math.round(monthlyData[month].expenses * 100) / 100,
    }));

    return {
      totalIncome,
      totalExpenses,
      savings,
      monthlyBudget,
      budgetUsed,
      budgetRemaining,
      categoryChartData,
      monthlyChartData,
      transactionCount: transactions.length,
    };
  };

  const stats = calculateStats();

  // Generate fallback insights without API calls
  const generateFallbackInsights = useCallback(() => {
    const recommendations = [];

    if (stats.budgetUsed > 80) {
      recommendations.push(
        "⚠️ Your spending is at " +
          Math.round(stats.budgetUsed) +
          "% of budget. Consider reducing expenses in top categories.",
      );
    }

    if (stats.savings < stats.totalIncome * 0.2) {
      recommendations.push(
        "💰 Aim to save at least 20% of your income. Consider setting up automatic transfers to savings.",
      );
    }

    const topCategory = stats.categoryChartData
      .sort((a, b) => b.expenses - a.expenses)
      .slice(0, 1)[0];

    if (topCategory && topCategory.expenses > 0) {
      recommendations.push(
        `📊 Your highest expense category is "${topCategory.name}" (${formatCurrency(topCategory.expenses)}). Review if this spending can be optimized.`,
      );
    }

    if (stats.budgetRemaining > 0) {
      recommendations.push(
        `✅ You have ${formatCurrency(stats.budgetRemaining)} remaining in your budget. Consider allocating this to savings or investments.`,
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        "🌟 You're doing well! Continue tracking your expenses and review your financial goals regularly.",
      );
    }

    const health = stats.savings > 0 ? "Good" : "Needs Attention";
    const spendingLevel =
      stats.budgetUsed > 80
        ? "High"
        : stats.budgetUsed > 50
          ? "Moderate"
          : "Low";

    const summaryText = `Financial Health: ${health}. Spending level: ${spendingLevel}. Budget used: ${Math.round(stats.budgetUsed)}%. Total savings: ${formatCurrency(stats.savings)}.`;

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

  // AI Analysis using Groq and Gemini (with fallback)
  const analyzeTransactions = useCallback(async () => {
    setIsAnalyzing(true);
    setAiInsights(null);

    try {
      // Prepare transaction summary for AI
      const summaryData = {
        totalIncome: stats.totalIncome,
        totalExpenses: stats.totalExpenses,
        savings: stats.savings,
        budgetUsed: stats.budgetUsed,
        budgetRemaining: stats.budgetRemaining,
        topExpenseCategories: stats.categoryChartData
          .sort((a, b) => b.expenses - a.expenses)
          .slice(0, 5)
          .map((c) => ({ category: c.name, amount: c.expenses })),
        recentTransactions: transactions.slice(0, 10).map((t) => ({
          description: t.description,
          category: t.category,
          type: t.type,
          amount: t.amount,
          date: t.date,
        })),
      };

      // Check if API keys are configured
      if (!apiKeysConfigured) {
        const fallbackInsights = generateFallbackInsights();
        setAiInsights(fallbackInsights);
        toast.info("Using fallback insights - API keys not configured");
        setIsAnalyzing(false);
        return;
      }

      let groqResponse = null;
      let geminiResponse = null;

      // Try Groq API
      try {
        const groqPrompt = `Analyze the following financial data and provide concise, actionable insights:
Total Income: $${summaryData.totalIncome.toFixed(2)}
Total Expenses: $${summaryData.totalExpenses.toFixed(2)}
Savings: $${summaryData.savings.toFixed(2)}
Budget Used: ${summaryData.budgetUsed.toFixed(1)}%
Budget Remaining: $${summaryData.budgetRemaining.toFixed(2)}
Top 5 Expense Categories: ${summaryData.topExpenseCategories.map((c) => `${c.category}: $${c.amount.toFixed(2)}`).join(", ")}

Provide advice in the following format:
SUMMARY: (Brief summary of financial health)
STRENGTHS: (What they're doing well)
WEAKNESSES: (Areas needing improvement)
RECOMMENDATIONS: (Specific actionable advice, 3-4 bullet points)
PREDICTIONS: (Future outlook based on current trends)`;

        if (groqApiKey) {
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
              max_tokens: 500,
            },
            {
              headers: {
                Authorization: `Bearer ${groqApiKey}`,
                "Content-Type": "application/json",
              },
            },
          );
          groqResponse = groqResult.data.choices[0].message.content;
        }
      } catch (error) {
        console.error("Groq API error:", error);
        if (error.response) {
          console.error("Groq error response:", error.response.data);
        }
      }

      // Try Gemini API
      try {
        const geminiPrompt = `As a financial advisor, analyze this financial data and provide detailed advice:
${JSON.stringify(summaryData, null, 2)}

Provide insights on:
1. Overall financial health assessment
2. Budget management evaluation
3. Spending patterns and trends
4. Savings recommendations
5. Risk factors
6. Future financial planning suggestions

Format the response as a structured analysis with clear sections.`;

        if (geminiApiKey) {
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
        }
      } catch (error) {
        console.error("Gemini API error:", error);
        if (error.response) {
          console.error("Gemini error response:", error.response.data);
        }
      }

      // Use responses or fallback
      if (groqResponse || geminiResponse) {
        const combinedInsights = {
          groq: groqResponse || "Groq analysis not available.",
          gemini: geminiResponse || "Gemini analysis not available.",
          summary: generateFallbackInsights().summary,
          recommendations: generateFallbackInsights().recommendations,
          timestamp: new Date().toISOString(),
        };
        setAiInsights(combinedInsights);
        toast.success("AI Analysis completed successfully!");
      } else {
        // Use fallback if both APIs failed
        const fallbackInsights = generateFallbackInsights();
        setAiInsights(fallbackInsights);
        toast.warning("Using fallback insights - API calls failed");
      }
    } catch (error) {
      console.error("Error during AI analysis:", error);
      const fallbackInsights = generateFallbackInsights();
      setAiInsights(fallbackInsights);
      toast.error("Using fallback insights due to error");
    } finally {
      setIsAnalyzing(false);
    }
  }, [
    stats,
    transactions,
    apiKeysConfigured,
    groqApiKey,
    geminiApiKey,
    generateFallbackInsights,
  ]);

  // Export report as CSV
  const exportReport = useCallback(() => {
    if (transactions.length === 0) {
      toast.warning("No transactions to export");
      return;
    }

    const headers = ["Date", "Description", "Category", "Type", "Amount"];
    const rows = transactions.map((t) => [
      t.date || "N/A",
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
  }, [transactions]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6 lg:p-8">
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
            {!apiKeysConfigured && (
              <p className="text-xs text-yellow-600 mt-1">
                ⚠️ AI insights are in fallback mode. Add API keys for full AI
                analysis.
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={fetchTransactions}
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <StatCard
          title="Total Income"
          value={formatCurrency(stats.totalIncome)}
          icon={<TrendingUpIcon className="text-blue-600" />}
          color="border-blue-500"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(stats.totalExpenses)}
          icon={<TrendingDownIcon className="text-red-600" />}
          color="border-red-500"
        />
        <StatCard
          title="Savings"
          value={formatCurrency(stats.savings)}
          icon={<SavingsIcon className="text-green-600" />}
          color="border-green-500"
          subtitle={`${stats.transactionCount} transactions`}
        />
        <StatCard
          title="Budget Used"
          value={`${Math.round(stats.budgetUsed)}%`}
          icon={<AttachMoneyIcon className="text-purple-600" />}
          color="border-purple-500"
          subtitle={`Remaining: ${formatCurrency(stats.budgetRemaining)}`}
        />
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
            {selectedChart === "bar" && stats.categoryChartData.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.categoryChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="expenses" fill="#FF8042" name="Expenses" />
                  <Bar dataKey="income" fill="#00C49F" name="Income" />
                </BarChart>
              </ResponsiveContainer>
            )}
            {selectedChart === "pie" &&
              stats.categoryChartData.filter((d) => d.expenses > 0).length >
                0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.categoryChartData.filter(
                        (d) => d.expenses > 0,
                      )}
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
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            {selectedChart === "line" && stats.monthlyChartData.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
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
            )}
            {selectedChart === "bar" &&
              stats.categoryChartData.length === 0 && (
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
                  <Tooltip formatter={(value) => formatCurrency(value)} />
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

      {/* AI Insights Section */}
      {aiInsights && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-l-4 border-purple-500"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <PsychologyIcon className="text-purple-600" />
              AI-Powered Financial Insights
              {aiInsights.isFallback && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                  Fallback Mode
                </span>
              )}
              {!aiInsights.isFallback && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                  AI Powered
                </span>
              )}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <AutoAwesomeIcon className="w-4 h-4" />
              <span>
                Analyzed {new Date(aiInsights.timestamp).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Groq Insights */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">G</span>
                </div>
                <h4 className="font-semibold text-gray-800">Groq Analysis</h4>
              </div>
              <div className="prose prose-sm max-w-none">
                {aiInsights.groq ? (
                  <p className="text-gray-700 whitespace-pre-wrap text-sm">
                    {aiInsights.groq}
                  </p>
                ) : (
                  <p className="text-gray-500 italic">{aiInsights.summary}</p>
                )}
              </div>
            </div>

            {/* Gemini Insights */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">G</span>
                </div>
                <h4 className="font-semibold text-gray-800">Gemini Analysis</h4>
              </div>
              <div className="prose prose-sm max-w-none">
                {aiInsights.gemini ? (
                  <p className="text-gray-700 whitespace-pre-wrap text-sm">
                    {aiInsights.gemini}
                  </p>
                ) : (
                  <p className="text-gray-500 italic">{aiInsights.summary}</p>
                )}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {aiInsights.recommendations &&
            aiInsights.recommendations.length > 0 && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
                  <LightbulbIcon className="text-yellow-600" />
                  Key Recommendations
                </h4>
                <ul className="space-y-1">
                  {aiInsights.recommendations.map((rec, index) => (
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
        </motion.div>
      )}

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
          onClick={fetchTransactions}
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
