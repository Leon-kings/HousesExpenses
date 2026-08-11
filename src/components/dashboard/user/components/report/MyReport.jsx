/* eslint-disable react-hooks/exhaustive-deps */
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
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PersonIcon from "@mui/icons-material/Person";

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

// Environment Configuration - Read from .env file
const ENV_CONFIG = {
  groqApiKey: import.meta.env.VITE_GROQ_API_KEY || "",
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || "",
  aiProvider: import.meta.env.VITE_AI_PROVIDER || "groq", // 'groq' or 'gemini' or 'both'
  apiBaseUrl: import.meta.env.VITE_API_URL || API_URL,
};

const AI_PROVIDER = ENV_CONFIG.aiProvider;
const GROQ_API_KEY = ENV_CONFIG.groqApiKey;
const GEMINI_API_KEY = ENV_CONFIG.geminiApiKey;

console.log("🔑 AI Provider:", AI_PROVIDER);
console.log("🔑 Groq API Key configured:", GROQ_API_KEY ? "✅ Yes" : "❌ No");
console.log("🔑 Gemini API Key configured:", GEMINI_API_KEY ? "✅ Yes" : "❌ No");

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

// StatCard component
const StatCard = ({ title, value, icon, color, subtitle }) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -2 }}
    className={`bg-white rounded-2xl shadow-lg p-4 sm:p-6 border-l-4 ${color}`}
  >
    <div className="flex items-center justify-between">
      <div className="min-w-0">
        <p className="text-xs sm:text-sm text-gray-500 font-medium truncate">
          {title}
        </p>
        <p className="text-base sm:text-xs font-bold text-gray-800 mt-1 truncate">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-1 truncate">{subtitle}</p>
        )}
      </div>
      <div
        className={`w-10 h-10 sm:w-12 sm:h-12 bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 ${color.replace("border-", "bg-").replace("-500", "-100")}`}
      >
        {icon}
      </div>
    </div>
  </motion.div>
);

export const MyReport = () => {
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

  // Fetch all data from API using /email/:email endpoints
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

      if (!email) {
        toast.error("User email not found");
        setIsLoading(false);
        return;
      }

      // Fetch expenses using /email/:email endpoint
      const expenseResponse = await api.get(`/expenses/email/${email}`);
      if (expenseResponse.data.success) {
        setExpenses(expenseResponse.data.data || []);
      }

      // Fetch incomes using /email/:email endpoint
      const incomeResponse = await api.get(`/incomes/email/${email}`);
      if (incomeResponse.data.success) {
        setIncomes(incomeResponse.data.data || []);
      }

      // Fetch budgets using /email/:email endpoint with month and year params
      const budgetResponse = await api.get(`/budgets/email/${email}`, {
        params: { month: selectedMonth, year: selectedYear },
      });
      if (budgetResponse.data.success) {
        setBudgets(budgetResponse.data.data || []);
      }

      // Fetch savings using /email/:email endpoint
      const savingsResponse = await api.get(`/savings/email/${email}`);
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

  // Calculate statistics
  const calculateStats = useCallback(() => {
    const allTransactions = getAllTransactions();

    const totalIncome = incomes.reduce((sum, i) => sum + (i.amount || 0), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const savingsAmount = totalIncome - totalExpenses;

    // Budget calculations
    const totalBudgeted = budgets.reduce(
      (sum, b) => sum + (b.allocatedAmount || 0),
      0,
    );
    const totalSpent = budgets.reduce(
      (sum, b) => sum + (b.spentAmount || 0),
      0,
    );
    const budgetRemaining = totalBudgeted - totalSpent;
    const budgetUsed =
      totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

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

    // Savings progress
    const totalSavingsTarget = savings.reduce(
      (sum, s) => sum + (s.targetAmount || 0),
      0,
    );
    const totalSavingsCurrent = savings.reduce(
      (sum, s) => sum + (s.currentAmount || 0),
      0,
    );
    const savingsProgress =
      totalSavingsTarget > 0
        ? (totalSavingsCurrent / totalSavingsTarget) * 100
        : 0;

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

  // Format currency in RWF (Rwandan Franc)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("rw-RW", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Format date
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
        `📊 Your highest expense category is "${topCategory.name}" (${formatCurrency(topCategory.expenses)}). Review if this spending can be optimized.`,
      );
    }

    if (stats.budgetRemaining > 0) {
      recommendations.push(
        `✅ You have ${formatCurrency(stats.budgetRemaining)} remaining in your budget. Consider allocating this to savings or investments.`,
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
      provider: "fallback",
    };
  }, [stats, formatCurrency]);

  // AI Analysis with real API keys
  const analyzeTransactions = useCallback(async () => {
    setIsAnalyzing(true);
    setAiInsights(null);

    try {
      const allTransactions = getAllTransactions();

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
        currency: "RWF",
        totalTransactions: allTransactions.length,
        budgetCount: stats.budgetCount,
        savingsCount: stats.savingsCount,
      };

      console.log("📊 Analyzing financial data:", summaryData);

      let groqResponse = null;
      let geminiResponse = null;
      let provider = "none";

      const systemPrompt = `You are a financial advisor AI for Rwandan users. Provide practical, actionable financial advice in RWF currency. Be concise but comprehensive.`;

      const userPrompt = `Analyze the following financial data (in RWF currency) and provide detailed, actionable insights:

Financial Summary:
- Total Income: ${summaryData.totalIncome.toFixed(0)} RWF
- Total Expenses: ${summaryData.totalExpenses.toFixed(0)} RWF
- Net Savings: ${summaryData.savings.toFixed(0)} RWF
- Budget Used: ${summaryData.budgetUsed.toFixed(1)}%
- Budget Remaining: ${summaryData.budgetRemaining.toFixed(0)} RWF
- Savings Progress: ${summaryData.savingsProgress.toFixed(1)}%
- Total Savings Target: ${summaryData.totalSavingsTarget.toFixed(0)} RWF
- Current Savings: ${summaryData.totalSavingsCurrent.toFixed(0)} RWF
- Total Transactions: ${summaryData.totalTransactions}
- Budget Categories: ${summaryData.budgetCount}
- Savings Goals: ${summaryData.savingsCount}

Top 5 Expense Categories:
${summaryData.topExpenseCategories.map((c, i) => `${i+1}. ${c.category}: ${c.amount.toFixed(0)} RWF`).join("\n")}

Recent Transactions:
${summaryData.recentTransactions.map((t, i) => `${i+1}. ${t.description || 'N/A'} - ${t.category || 'Uncategorized'} (${t.type}): ${t.amount.toFixed(0)} RWF`).join("\n")}

Please provide:
1. SUMMARY: Overall financial health assessment (1-2 sentences)
2. STRENGTHS: What they're doing well (2-3 points)
3. WEAKNESSES: Areas needing improvement (2-3 points)
4. RECOMMENDATIONS: Specific actionable advice (4-5 bullet points)
5. PREDICTIONS: Future outlook based on current trends (1-2 sentences)

Keep the response structured and easy to read.`;

      // Try Groq API first (preferred provider)
      if (AI_PROVIDER === 'groq' || AI_PROVIDER === 'both') {
        if (GROQ_API_KEY) {
          try {
            console.log("🤖 Calling Groq API...");
            const groqResult = await axios.post(
              "https://api.groq.com/openai/v1/chat/completions",
              {
                model: "mixtral-8x7b-32768",
                messages: [
                  {
                    role: "system",
                    content: systemPrompt,
                  },
                  {
                    role: "user",
                    content: userPrompt,
                  },
                ],
                temperature: 0.7,
                max_tokens: 800,
              },
              {
                headers: {
                  Authorization: `Bearer ${GROQ_API_KEY}`,
                  "Content-Type": "application/json",
                },
              }
            );
            
            if (groqResult.data && groqResult.data.choices && groqResult.data.choices[0]) {
              groqResponse = groqResult.data.choices[0].message.content;
              provider = "groq";
              console.log("✅ Groq API response received");
            }
          } catch (error) {
            console.error("❌ Groq API error:", error.response?.data || error.message);
          }
        } else {
          console.warn("⚠️ Groq API key not configured");
        }
      }

      // Try Gemini API if Groq failed or if provider is gemini
      if ((!groqResponse && (AI_PROVIDER === 'gemini' || AI_PROVIDER === 'both')) || 
          (AI_PROVIDER === 'gemini')) {
        if (GEMINI_API_KEY) {
          try {
            console.log("🤖 Calling Gemini API...");
            const geminiResult = await axios.post(
              `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
              {
                contents: [
                  {
                    parts: [
                      {
                        text: `${systemPrompt}\n\n${userPrompt}`,
                      },
                    ],
                  },
                ],
                generationConfig: {
                  temperature: 0.7,
                  maxOutputTokens: 800,
                  topP: 0.95,
                  topK: 40,
                },
              }
            );
            
            if (geminiResult.data && geminiResult.data.candidates && geminiResult.data.candidates[0]) {
              geminiResponse = geminiResult.data.candidates[0].content.parts[0].text;
              if (!groqResponse) {
                provider = "gemini";
              }
              console.log("✅ Gemini API response received");
            }
          } catch (error) {
            console.error("❌ Gemini API error:", error.response?.data || error.message);
          }
        } else {
          console.warn("⚠️ Gemini API key not configured");
        }
      }

      // Use responses or fallback
      if (groqResponse || geminiResponse) {
        const combinedInsights = {
          groq: groqResponse || "Groq analysis not available.",
          gemini: geminiResponse || "Gemini analysis not available.",
          summary: groqResponse ? groqResponse.split('\n')[0] : (geminiResponse ? geminiResponse.split('\n')[0] : generateFallbackInsights().summary),
          recommendations: generateFallbackInsights().recommendations,
          timestamp: new Date().toISOString(),
          isFallback: false,
          provider: provider,
        };
        
        // Try to extract recommendations from AI response
        try {
          const responseText = groqResponse || geminiResponse || "";
          const recMatch = responseText.match(/RECOMMENDATIONS?:?\s*\n?([\s\S]*?)(?=\n\s*(?:PREDICTIONS?|$))/i);
          if (recMatch && recMatch[1]) {
            const recLines = recMatch[1].split('\n').filter(line => line.trim().length > 0);
            if (recLines.length > 0) {
              combinedInsights.recommendations = recLines.map(line => 
                line.replace(/^[•\-*\d.]\s*/, '').trim()
              ).filter(r => r.length > 0);
            }
          }
        } catch (e) {
          console.warn("Could not parse recommendations from AI response:", e);
        }
        
        setAiInsights(combinedInsights);
        toast.success(`✅ AI Analysis completed using ${provider.toUpperCase()}!`);
      } else {
        const fallbackInsights = generateFallbackInsights();
        fallbackInsights.provider = "fallback";
        setAiInsights(fallbackInsights);
        toast.warning("⚠️ Using fallback insights - API calls failed");
      }
    } catch (error) {
      console.error("❌ Error during AI analysis:", error);
      const fallbackInsights = generateFallbackInsights();
      fallbackInsights.provider = "fallback";
      setAiInsights(fallbackInsights);
      toast.error("Using fallback insights due to error");
    } finally {
      setIsAnalyzing(false);
    }
  }, [
    stats,
    getAllTransactions,
    generateFallbackInsights,
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
    a.download = `my_financial_report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Report exported successfully!");
  }, [getAllTransactions]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const allTransactions = getAllTransactions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <BarChartIcon className="text-blue-600" />
              My Reports
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Analyze your income, expenses, and get AI-powered insights (RWF)
            </p>
            {user?.email && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs sm:text-sm text-gray-500">
                  <PersonIcon className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                  {user.email}
                </span>
                <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  User
                </span>
              </div>
            )}
       
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm sm:text-base"
            >
              <RefreshIcon className="w-4 h-4" />
              <span className="hidden xs:inline">Refresh</span>
            </button>
            <button
              onClick={exportReport}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm sm:text-base"
            >
              <DownloadIcon className="w-4 h-4" />
              <span className="hidden xs:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <StatCard
          title="Total Income"
          value={formatCurrency(stats.totalIncome)}
          icon={<TrendingUpIcon className="text-blue-600" />}
          color="border-blue-500"
          subtitle={`${incomes.length} income entries`}
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(stats.totalExpenses)}
          icon={<TrendingDownIcon className="text-red-600" />}
          color="border-red-500"
          subtitle={`${expenses.length} expense entries`}
        />
        <StatCard
          title="Net Savings"
          value={formatCurrency(stats.savings)}
          icon={<SavingsIcon className="text-green-600" />}
          color="border-green-500"
          subtitle={`${stats.savingsCount} savings goals`}
        />
        <StatCard
          title="Budget Usage"
          value={`${Math.round(stats.budgetUsed)}%`}
          icon={<AccountBalanceIcon className="text-purple-600" />}
          color="border-purple-500"
          subtitle={`${stats.budgetCount} budget categories`}
        />
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-gray-500">Budget Remaining</p>
          <p className="text-base sm:text-xl font-bold text-blue-600 truncate">
            {formatCurrency(stats.budgetRemaining)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-gray-500">Savings Progress</p>
          <p className="text-base sm:text-xl font-bold text-green-600">
            {stats.savingsProgress.toFixed(1)}%
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(stats.savingsProgress, 100)}%` }}
            />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-gray-500">Total Transactions</p>
          <p className="text-base sm:text-xl font-bold text-purple-600">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Bar Chart - Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-4 sm:p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
              <BarChartIcon className="text-blue-600" />
              Category Breakdown (RWF)
            </h3>
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setSelectedChart("bar")}
                className={`p-1.5 rounded ${selectedChart === "bar" ? "bg-blue-100 text-blue-600" : "text-gray-400 hover:bg-gray-100"}`}
              >
                <BarChartIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => setSelectedChart("pie")}
                className={`p-1.5 rounded ${selectedChart === "pie" ? "bg-blue-100 text-blue-600" : "text-gray-400 hover:bg-gray-100"}`}
              >
                <PieChartIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => setSelectedChart("line")}
                className={`p-1.5 rounded ${selectedChart === "line" ? "bg-blue-100 text-blue-600" : "text-gray-400 hover:bg-gray-100"}`}
              >
                <ShowChartIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
          <div className="h-56 sm:h-64 md:h-80">
            {stats.categoryChartData.length > 0 ? (
              selectedChart === "bar" && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.categoryChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
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
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            ) : selectedChart === "line" &&
              stats.monthlyChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
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
          className="bg-white rounded-2xl shadow-lg p-4 sm:p-6"
        >
          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <ShowChartIcon className="text-green-600" />
            Monthly Trends (RWF)
          </h3>
          <div className="h-56 sm:h-64 md:h-80">
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
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
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
          className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border-l-4 border-blue-500"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
              <PsychologyIcon className="text-blue-600" />
              AI-Powered Financial Insights
              {aiInsights.isFallback ? (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                  Fallback Mode
                </span>
              ) : (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <AutoAwesomeIcon className="w-3 h-3" />
                  {aiInsights.provider?.toUpperCase() || 'AI'} Powered
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Groq Insights */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">G</span>
                </div>
                <h4 className="font-semibold text-gray-800">
                  {aiInsights.provider === 'groq' ? 'Groq AI Analysis' : 'Groq Analysis'}
                  {aiInsights.provider === 'groq' && (
                    <span className="ml-2 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">Primary</span>
                  )}
                </h4>
              </div>
              <div className="prose prose-sm max-w-none">
                {aiInsights.groq && !aiInsights.isFallback ? (
                  <div className="text-gray-700 whitespace-pre-wrap text-xs sm:text-sm">
                    {aiInsights.groq.split('\n').map((line, i) => {
                      if (line.trim().startsWith('SUMMARY:')) {
                        return <p key={i} className="font-semibold text-blue-700">{line}</p>;
                      } else if (line.trim().startsWith('STRENGTHS:')) {
                        return <p key={i} className="font-semibold text-green-700">{line}</p>;
                      } else if (line.trim().startsWith('WEAKNESSES:')) {
                        return <p key={i} className="font-semibold text-red-700">{line}</p>;
                      } else if (line.trim().startsWith('RECOMMENDATIONS:')) {
                        return <p key={i} className="font-semibold text-purple-700">{line}</p>;
                      } else if (line.trim().startsWith('PREDICTIONS:')) {
                        return <p key={i} className="font-semibold text-orange-700">{line}</p>;
                      } else if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
                        return <p key={i} className="ml-2 text-gray-700">{line}</p>;
                      } else if (line.trim().length > 0) {
                        return <p key={i} className="text-gray-700">{line}</p>;
                      }
                      return null;
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 italic text-xs sm:text-sm">
                    {aiInsights.summary}
                  </p>
                )}
              </div>
            </div>

            {/* Gemini Insights */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">G</span>
                </div>
                <h4 className="font-semibold text-gray-800">
                  {aiInsights.provider === 'gemini' ? 'Gemini AI Analysis' : 'Gemini Analysis'}
                  {aiInsights.provider === 'gemini' && (
                    <span className="ml-2 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">Primary</span>
                  )}
                </h4>
              </div>
              <div className="prose prose-sm max-w-none">
                {aiInsights.gemini && !aiInsights.isFallback ? (
                  <div className="text-gray-700 whitespace-pre-wrap text-xs sm:text-sm">
                    {aiInsights.gemini.split('\n').map((line, i) => {
                      if (line.trim().startsWith('1.') || line.trim().startsWith('2.') || 
                          line.trim().startsWith('3.') || line.trim().startsWith('4.') ||
                          line.trim().startsWith('5.') || line.trim().startsWith('6.')) {
                        return <p key={i} className="font-semibold text-purple-700">{line}</p>;
                      } else if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
                        return <p key={i} className="ml-2 text-gray-700">{line}</p>;
                      } else if (line.trim().length > 0) {
                        return <p key={i} className="text-gray-700">{line}</p>;
                      }
                      return null;
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 italic text-xs sm:text-sm">
                    {aiInsights.summary}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {aiInsights.recommendations &&
            aiInsights.recommendations.length > 0 && (
              <div className="mt-4 p-3 sm:p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-2 text-sm sm:text-base">
                  <LightbulbIcon className="text-yellow-600" />
                  Key Recommendations
                </h4>
                <ul className="space-y-1">
                  {aiInsights.recommendations.map((rec, index) => (
                    <li
                      key={index}
                      className="text-xs sm:text-sm text-gray-700 flex items-start gap-2"
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
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={analyzeTransactions}
          disabled={isAnalyzing}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl shadow-lg p-4 sm:p-6 text-left hover:shadow-xl transition-all disabled:opacity-50"
        >
          <PsychologyIcon className="w-6 h-6 sm:w-8 sm:h-8 mb-2" />
          <h4 className="font-semibold text-sm sm:text-base">AI Analysis</h4>
          <p className="text-xs sm:text-sm opacity-90 mt-1">
            Get smart financial insights
          </p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={exportReport}
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl shadow-lg p-4 sm:p-6 text-left hover:shadow-xl transition-all"
        >
          <DownloadIcon className="w-6 h-6 sm:w-8 sm:h-8 mb-2" />
          <h4 className="font-semibold text-sm sm:text-base">Export Report</h4>
          <p className="text-xs sm:text-sm opacity-90 mt-1">Download as CSV</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={fetchAllData}
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl shadow-lg p-4 sm:p-6 text-left hover:shadow-xl transition-all"
        >
          <RefreshIcon className="w-6 h-6 sm:w-8 sm:h-8 mb-2" />
          <h4 className="font-semibold text-sm sm:text-base">Refresh Data</h4>
          <p className="text-xs sm:text-sm opacity-90 mt-1">
            Update your transactions
          </p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl shadow-lg p-4 sm:p-6 text-left hover:shadow-xl transition-all"
          onClick={() => window.print()}
        >
          <CalendarTodayIcon className="w-6 h-6 sm:w-8 sm:h-8 mb-2" />
          <h4 className="font-semibold text-sm sm:text-base">Print Report</h4>
          <p className="text-xs sm:text-sm opacity-90 mt-1">
            Generate printable version
          </p>
        </motion.button>
      </div>
    </div>
  );
};