
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, useRef } from "react";
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
import jsPDF from "jspdf";
import "jspdf-autotable";

// Material Icons
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SavingsIcon from "@mui/icons-material/Savings";
import BarChartIcon from "@mui/icons-material/BarChart";
import PieChartIcon from "@mui/icons-material/PieChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PersonIcon from "@mui/icons-material/Person";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { Close, CloseFullscreenOutlined } from "@mui/icons-material";

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

// Month names constant
const MONTH_NAMES = [
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
];

// API Base URL
const API_URL = "https://household-expenses-management-system.onrender.com/api";

// Axios instance with auth token
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Format currency in RWF
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

// Filter transactions by month and year
const filterByMonth = (items, month, year) => {
  if (!items || items.length === 0) return [];
  return items.filter((item) => {
    if (!item.date) return false;
    const date = new Date(item.date);
    return date.getMonth() === month && date.getFullYear() === year;
  });
};

// Filter budgets by month and year
const filterBudgetsByMonth = (budgets, month, year) => {
  if (!budgets || budgets.length === 0) return [];
  return budgets.filter((budget) => {
    return budget.month === month && budget.year === year;
  });
};

// StatCard component
const StatCard = ({ title, value, color, subtitle, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -2 }}
    onClick={onClick}
    className={`bg-white rounded-2xl shadow-lg p-4 sm:p-6 border-l-4 ${color} cursor-pointer transition-all hover:shadow-xl`}
  >
    <div className="flex items-center justify-between">
      <div className="min-w-0">
        <p className="text-xs sm:text-sm text-gray-500 font-medium truncate">
          {title}
        </p>
        <p className="text-base text-xs font-bold text-gray-800 mt-1 truncate">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-1 truncate">{subtitle}</p>
        )}
      </div>
    </div>
  </motion.div>
);

const PDFReportGenerator = ({
  expenses,
  incomes,
  savings,
  budgets,
  stats,
  allTransactions,
  user,
  selectedMonth,
  selectedYear,
  onClose,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const generatePDF = useCallback(async () => {
    setIsGenerating(true);
    setProgress(10);

    try {
      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      const headerHeight = 35;
      let currentPage = 1;
      let yPosition = headerHeight + 8;

      // Filter data by selected month
      const monthlyExpenses = filterByMonth(
        expenses,
        selectedMonth,
        selectedYear,
      );
      const monthlyIncomes = filterByMonth(
        incomes,
        selectedMonth,
        selectedYear,
      );
      const monthlyTransactions = filterByMonth(
        allTransactions,
        selectedMonth,
        selectedYear,
      );
      const monthlyBudgets = filterBudgetsByMonth(
        budgets,
        selectedMonth,
        selectedYear,
      );

      // Calculate monthly stats
      const monthlyTotalIncome = monthlyIncomes.reduce(
        (sum, i) => sum + (i.amount || 0),
        0,
      );
      const monthlyTotalExpenses = monthlyExpenses.reduce(
        (sum, e) => sum + (e.amount || 0),
        0,
      );
      const monthlySavings = monthlyTotalIncome - monthlyTotalExpenses;

      const totalBudgetAllocated = monthlyBudgets.reduce(
        (sum, b) => sum + (b.allocatedAmount || 0),
        0,
      );
      const totalBudgetSpent = monthlyBudgets.reduce(
        (sum, b) => sum + (b.spentAmount || 0),
        0,
      );
      const totalBudgetRemaining = monthlyBudgets.reduce(
        (sum, b) => sum + (b.remainingAmount || 0),
        0,
      );

      // ===== DRAW HEADER =====
      const drawHeader = () => {
        // Clear and draw header
        doc.setFillColor(44, 62, 80);
        doc.rect(0, 0, pageWidth, headerHeight, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("FINANCIAL REPORT", pageWidth / 2, 14, { align: "center" });

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text(
          `${MONTH_NAMES[selectedMonth]} ${selectedYear}`,
          pageWidth / 2,
          23,
          { align: "center" },
        );

        const dateStr = new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        doc.text(`Generated: ${dateStr}`, pageWidth / 2, 31, {
          align: "center",
        });

        yPosition = headerHeight + 6;
      };

      // ===== ADD SECTION =====
      const addSection = (title, callback) => {
        // Check if we need a new page
        if (yPosition + 30 > pageHeight - margin) {
          doc.addPage();
          currentPage++;
          drawHeader();
          yPosition = headerHeight + 6;
        }

        // Section title
        doc.setFillColor(240, 245, 250);
        doc.rect(margin - 2, yPosition - 1, pageWidth - margin * 2 + 4, 8, "F");

        doc.setTextColor(44, 62, 80);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(title, margin, yPosition + 5);
        yPosition += 10;

        // Underline
        doc.setDrawColor(180, 190, 200);
        doc.setLineWidth(0.3);
        doc.line(margin, yPosition - 1, pageWidth - margin, yPosition - 1);
        yPosition += 4;

        callback();
        yPosition += 3;
      };

      // ===== RENDER TABLE =====
      const renderTable = (headers, rows, colWidths, maxRows = 12) => {
        const rowHeight = 5.5;
        const fontSize = 6;
        const headerHeight = 6.5;
        const totalRows = Math.min(rows.length, maxRows);
        const tableHeight = headerHeight + totalRows * rowHeight + 4;

        if (yPosition + tableHeight > pageHeight - margin) {
          doc.addPage();
          currentPage++;
          drawHeader();
          yPosition = headerHeight + 6;
        }

        doc.setFontSize(fontSize);

        // Header
        doc.setFont("helvetica", "bold");
        doc.setFillColor(52, 73, 94);
        doc.rect(
          margin,
          yPosition - 0.5,
          pageWidth - margin * 2,
          headerHeight,
          "F",
        );
        doc.setTextColor(255, 255, 255);

        let xPos = margin + 2;
        headers.forEach((header, i) => {
          doc.text(header, xPos, yPosition + 4);
          xPos += colWidths[i];
        });
        yPosition += headerHeight;
        doc.setTextColor(50, 50, 50);

        // Rows
        const rowsToShow = rows.slice(0, maxRows);
        rowsToShow.forEach((row, index) => {
          if (yPosition + rowHeight > pageHeight - margin) {
            doc.addPage();
            currentPage++;
            drawHeader();
            yPosition = headerHeight + 6;

            doc.setFontSize(fontSize);
            doc.setFont("helvetica", "bold");
            doc.setFillColor(52, 73, 94);
            doc.rect(
              margin,
              yPosition - 0.5,
              pageWidth - margin * 2,
              headerHeight,
              "F",
            );
            doc.setTextColor(255, 255, 255);
            let xPosNew = margin + 2;
            headers.forEach((header, i) => {
              doc.text(header, xPosNew, yPosition + 4);
              xPosNew += colWidths[i];
            });
            yPosition += headerHeight;
            doc.setTextColor(50, 50, 50);
          }

          if (index % 2 === 0) {
            doc.setFillColor(248, 249, 250);
            doc.rect(
              margin,
              yPosition - 0.5,
              pageWidth - margin * 2,
              rowHeight,
              "F",
            );
          }

          doc.setFont("helvetica", "normal");
          let xPosRow = margin + 2;
          row.forEach((cell, i) => {
            const text = String(cell);
            const displayText =
              text.length > 22 ? text.substring(0, 20) + ".." : text;
            doc.text(displayText, xPosRow, yPosition + 3.5);
            xPosRow += colWidths[i];
          });
          yPosition += rowHeight;
        });

        yPosition += 2;
      };

      // ===== PAGE 1: Header + Executive Summary + Financial Health + Budget Details =====
      drawHeader();

      // Executive Summary
      addSection("Executive Summary", () => {
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(60, 60, 60);

        const summaryItems = [
          `Total Income: ${formatCurrencyRWF(monthlyTotalIncome)} (${monthlyIncomes.length} entries)`,
          `Total Expenses: ${formatCurrencyRWF(monthlyTotalExpenses)} (${monthlyExpenses.length} entries)`,
          `Net Savings: ${formatCurrencyRWF(monthlySavings)} (${monthlySavings >= 0 ? "Surplus" : "Deficit"})`,
          `Total Transactions: ${monthlyTransactions.length}`,
          `Budget Allocated: ${formatCurrencyRWF(totalBudgetAllocated)} (${monthlyBudgets.length} categories)`,
          `Budget Spent: ${formatCurrencyRWF(totalBudgetSpent)} (${totalBudgetAllocated > 0 ? ((totalBudgetSpent / totalBudgetAllocated) * 100).toFixed(0) : 0}% used)`,
          `Budget Remaining: ${formatCurrencyRWF(totalBudgetRemaining)} (${totalBudgetRemaining >= 0 ? "Available" : "Over budget"})`,
        ];

        summaryItems.forEach((item) => {
          if (yPosition + 6 > pageHeight - margin) {
            doc.addPage();
            currentPage++;
            drawHeader();
            yPosition = headerHeight + 6;
          }
          doc.text(`• ${item}`, margin + 3, yPosition);
          yPosition += 5.5;
        });
      });

      // Financial Health
      addSection("Financial Health", () => {
        let healthScore = 0;
        if (monthlySavings > 0) healthScore += 25;
        if (stats.savingsProgress > 50) healthScore += 25;
        if (monthlyTotalIncome > monthlyTotalExpenses) healthScore += 20;
        if (savings.length > 0) healthScore += 15;
        if (totalBudgetRemaining > 0) healthScore += 15;

        const healthLevel =
          healthScore >= 80
            ? "Excellent"
            : healthScore >= 60
              ? "Good"
              : healthScore >= 40
                ? "Fair"
                : "Needs Attention";

        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(44, 62, 80);
        doc.text(
          `Score: ${healthScore}% - ${healthLevel}`,
          margin + 3,
          yPosition,
        );
        yPosition += 8;

        doc.setFillColor(230, 230, 230);
        doc.rect(margin + 3, yPosition - 1, 120, 5, "F");

        const barColor =
          healthScore >= 80
            ? [46, 204, 113]
            : healthScore >= 60
              ? [52, 152, 219]
              : healthScore >= 40
                ? [241, 196, 15]
                : [231, 76, 60];
        doc.setFillColor(barColor[0], barColor[1], barColor[2]);
        doc.rect(margin + 3, yPosition - 1, (healthScore / 100) * 120, 5, "F");

        yPosition += 9;
      });

      // Budget Details
      if (monthlyBudgets.length > 0) {
        addSection("Budget Details", () => {
          const headers = [
            "#",
            "Category",
            "Allocated",
            "Spent",
            "Remaining",
            "Used %",
            "Status",
          ];
          const colWidths = [7, 32, 28, 28, 28, 20, 25];
          const rows = monthlyBudgets.slice(0, 12).map((budget, i) => {
            const status = budget.status || "on-track";
            const statusDisplay =
              status === "over-budget"
                ? "⚠ Over"
                : status === "approaching-limit"
                  ? "⚠ Near"
                  : "✓ On Track";
            return [
              i + 1,
              budget.category || "N/A",
              formatCurrencyRWF(budget.allocatedAmount || 0),
              formatCurrencyRWF(budget.spentAmount || 0),
              formatCurrencyRWF(budget.remainingAmount || 0),
              `${(budget.percentageUsed || 0).toFixed(1)}%`,
              statusDisplay,
            ];
          });
          renderTable(headers, rows, colWidths, 10);

          const overBudget = monthlyBudgets.filter(
            (b) => b.status === "over-budget",
          ).length;
          const approaching = monthlyBudgets.filter(
            (b) => b.status === "approaching-limit",
          ).length;
          const onTrack = monthlyBudgets.filter(
            (b) => b.status === "on-track",
          ).length;

          doc.setFontSize(6);
          doc.setFont("helvetica", "italic");
          doc.setTextColor(100, 100, 100);
          doc.text(
            `Total: ${formatCurrencyRWF(totalBudgetAllocated)} | Spent: ${formatCurrencyRWF(totalBudgetSpent)} | Remaining: ${formatCurrencyRWF(totalBudgetRemaining)} | Over: ${overBudget} | Approaching: ${approaching} | On Track: ${onTrack}`,
            margin + 3,
            yPosition,
          );
          yPosition += 5;
        });
      }

      // ===== PAGE 2: Income Details + Expense Details + Top Categories =====
      // Check if we need a new page for Income Details
      if (yPosition + 40 > pageHeight - margin) {
        doc.addPage();
        currentPage++;
        drawHeader();
        yPosition = headerHeight + 6;
      }

      // Income Details
      if (monthlyIncomes.length > 0) {
        addSection("Income Details", () => {
          const headers = ["#", "Description", "Category", "Amount", "User"];
          const colWidths = [7, 45, 32, 35, 32];
          const rows = monthlyIncomes
            .slice(0, 10)
            .map((income, i) => [
              i + 1,
              income.description || "N/A",
              income.category || "N/A",
              formatCurrencyRWF(income.amount),
              income.user || "N/A",
            ]);
          renderTable(headers, rows, colWidths, 8);

          const users = [
            ...new Set(monthlyIncomes.map((i) => i.user).filter(Boolean)),
          ].join(", ");
          doc.setFontSize(6);
          doc.setFont("helvetica", "italic");
          doc.setTextColor(100, 100, 100);
          doc.text(
            `Total: ${formatCurrencyRWF(monthlyTotalIncome)} | Users: ${users || "N/A"}`,
            margin + 3,
            yPosition,
          );
          yPosition += 5;
        });
      }

      // Expense Details
      if (monthlyExpenses.length > 0) {
        addSection("Expense Details", () => {
          const headers = ["#", "Description", "Category", "Amount", "User"];
          const colWidths = [7, 45, 32, 35, 32];
          const rows = monthlyExpenses
            .slice(0, 10)
            .map((expense, i) => [
              i + 1,
              expense.description || "N/A",
              expense.category || "N/A",
              formatCurrencyRWF(expense.amount),
              expense.user || "N/A",
            ]);
          renderTable(headers, rows, colWidths, 8);

          const users = [
            ...new Set(monthlyExpenses.map((e) => e.user).filter(Boolean)),
          ].join(", ");
          doc.setFontSize(6);
          doc.setFont("helvetica", "italic");
          doc.setTextColor(100, 100, 100);
          doc.text(
            `Total: ${formatCurrencyRWF(monthlyTotalExpenses)} | Users: ${users || "N/A"}`,
            margin + 3,
            yPosition,
          );
          yPosition += 5;
        });
      }

      // Top Categories
      const topCategories = stats.categoryChartData
        .filter((c) => c.expenses > 0)
        .sort((a, b) => b.expenses - a.expenses)
        .slice(0, 6);

      if (topCategories.length > 0) {
        addSection("Top Expense Categories", () => {
          const totalExpenses = monthlyTotalExpenses || 1;
          const headers = ["#", "Category", "Amount", "% of Total"];
          const colWidths = [8, 80, 50, 40];
          const rows = topCategories.map((cat, i) => [
            i + 1,
            cat.name,
            formatCurrencyRWF(cat.expenses),
            `${((cat.expenses / totalExpenses) * 100).toFixed(1)}%`,
          ]);
          renderTable(headers, rows, colWidths, 6);
        });
      }

      // ===== PAGE 3: Savings Goals + Insights + Recommendations + Summary =====
      if (yPosition + 40 > pageHeight - margin) {
        doc.addPage();
        currentPage++;
        drawHeader();
        yPosition = headerHeight + 6;
      }

      // Savings Goals
      if (savings.length > 0) {
        addSection("Savings Goals", () => {
          const savingsItems =
            savings.length > 0 && savings[0].summary
              ? savings[0].data || savings
              : savings;

          const headers = ["#", "Goal", "Target", "Current", "Progress"];
          const colWidths = [8, 45, 40, 40, 25];
          const rows = savingsItems
            .slice(0, 6)
            .map((item, i) => [
              i + 1,
              item.category || "Goal",
              formatCurrencyRWF(item.targetAmount || 0),
              formatCurrencyRWF(item.currentAmount || 0),
              `${(item.progress || 0).toFixed(1)}%`,
            ]);
          renderTable(headers, rows, colWidths, 6);

          const completed = savingsItems.filter((s) => s.isCompleted).length;
          doc.setFontSize(6);
          doc.setFont("helvetica", "italic");
          doc.setTextColor(100, 100, 100);
          doc.text(
            `Total: ${savingsItems.length} goals (${completed} completed)`,
            margin + 3,
            yPosition,
          );
          yPosition += 5;
        });
      }

      // Key Insights
      const insights = [];
      if (monthlySavings > 0) {
        insights.push(
          `✓ Net savings of ${formatCurrencyRWF(monthlySavings)} - keep up the good work!`,
        );
      } else {
        insights.push(
          `⚠ Expenses exceed income by ${formatCurrencyRWF(Math.abs(monthlySavings))}. Review spending.`,
        );
      }
      if (stats.savingsProgress > 50) {
        insights.push(
          `✓ ${stats.savingsProgress.toFixed(0)}% towards savings goals - great progress!`,
        );
      }
      if (monthlyTotalIncome > 0 && monthlyTotalExpenses > 0) {
        const ratio = monthlyTotalExpenses / monthlyTotalIncome;
        if (ratio < 0.5) {
          insights.push(
            `✓ Expense-to-income ratio: ${(ratio * 100).toFixed(0)}% - Excellent`,
          );
        } else if (ratio < 0.7) {
          insights.push(
            `✓ Expense-to-income ratio: ${(ratio * 100).toFixed(0)}% - Healthy`,
          );
        } else {
          insights.push(
            `⚠ Expense-to-income ratio: ${(ratio * 100).toFixed(0)}% - Consider reducing`,
          );
        }
      }
      const overBudgetCount = monthlyBudgets.filter(
        (b) => b.status === "over-budget",
      ).length;
      if (overBudgetCount > 0) {
        insights.push(
          `⚠ ${overBudgetCount} budget(s) are over budget - review spending.`,
        );
      }

      if (insights.length > 0) {
        addSection("Key Insights", () => {
          doc.setFontSize(7.5);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(60, 60, 60);
          insights.forEach((insight, index) => {
            if (index > 0 && yPosition + 6 > pageHeight - margin) {
              doc.addPage();
              currentPage++;
              drawHeader();
              yPosition = headerHeight + 6;
            }
            doc.text(insight, margin + 3, yPosition);
            yPosition += 5.5;
          });
        });
      }

      // Recommendations
      const recommendations = [];
      if (monthlySavings < 0) {
        recommendations.push(
          "Reduce unnecessary expenses to bring spending below income.",
        );
        recommendations.push(
          "Review monthly subscriptions and cancel unused ones.",
        );
      }
      if (stats.savingsProgress < 50 && stats.totalSavingsTarget > 0) {
        recommendations.push(
          "Increase monthly savings contribution to reach goals faster.",
        );
        recommendations.push("Set up automatic transfers to savings account.");
      }
      if (
        monthlyTotalIncome > 0 &&
        monthlyTotalExpenses / monthlyTotalIncome > 0.7
      ) {
        recommendations.push("Consider finding additional income sources.");
        recommendations.push(
          "Track daily expenses to identify spending patterns.",
        );
      }
      if (overBudgetCount > 0) {
        recommendations.push(
          `Review ${overBudgetCount} over-budget category(ies) and adjust spending.`,
        );
        recommendations.push(
          "Reallocate funds from under-utilized budget categories.",
        );
      }
      if (recommendations.length === 0) {
        recommendations.push(
          "Continue tracking finances and reviewing goals regularly.",
        );
        recommendations.push(
          "Consider investing surplus savings for long-term growth.",
        );
        recommendations.push(
          "Build an emergency fund covering 3-6 months of expenses.",
        );
      }

      if (recommendations.length > 0) {
        addSection("Recommendations", () => {
          doc.setFontSize(7.5);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(60, 60, 60);

          recommendations.slice(0, 4).forEach((rec, index) => {
            if (index > 0 && yPosition + 6 > pageHeight - margin) {
              doc.addPage();
              currentPage++;
              drawHeader();
              yPosition = headerHeight + 6;
            }
            doc.text(`• ${rec}`, margin + 3, yPosition);
            yPosition += 5.5;
          });
        });
      }

      // ===== SUMMARY CARDS (bottom of page 3) =====
      if (yPosition + 50 > pageHeight - margin) {
        doc.addPage();
        currentPage++;
        drawHeader();
        yPosition = headerHeight + 6;
      }

      // Only add summary if we have space
      if (yPosition + 45 < pageHeight - margin) {
        doc.setFillColor(240, 245, 250);
        doc.rect(margin - 2, yPosition - 1, pageWidth - margin * 2 + 4, 8, "F");
        doc.setTextColor(44, 62, 80);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Monthly Summary", margin, yPosition + 5);
        yPosition += 12;

        const summaryData = [
          ["Income", formatCurrencyRWF(monthlyTotalIncome)],
          ["Expenses", formatCurrencyRWF(monthlyTotalExpenses)],
          ["Savings", formatCurrencyRWF(monthlySavings)],
          ["Budget", formatCurrencyRWF(totalBudgetAllocated)],
          ["Transactions", monthlyTransactions.length.toString()],
        ];

        const cardWidth = (pageWidth - 50) / 3;
        const cardHeight = 20;

        summaryData.forEach((card, index) => {
          const col = index % 3;
          const row = Math.floor(index / 3);
          const x = margin + col * (cardWidth + 8);
          const y = yPosition + row * (cardHeight + 6);

          doc.setFillColor(255, 255, 255);
          doc.roundedRect(x, y, cardWidth, cardHeight, 2, 2, "F");
          doc.setDrawColor(200, 200, 200);
          doc.setLineWidth(0.3);
          doc.roundedRect(x, y, cardWidth, cardHeight, 2, 2, "S");

          doc.setFontSize(6);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(100, 100, 100);
          doc.text(card[0], x + 4, y + 6);

          doc.setFontSize(8);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(44, 62, 80);
          doc.text(card[1], x + 4, y + 15);
        });
      }

      // Footer
      doc.setFontSize(6);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(150, 150, 150);
      const footerText = `Generated by ${user?.name || "User"}${user?.email ? ` (${user.email})` : ""} • ${MONTH_NAMES[selectedMonth]} ${selectedYear}`;
      doc.text(footerText, pageWidth / 2, pageHeight - 8, { align: "center" });

      setProgress(100);

      const fileName = `Financial_Report_${MONTH_NAMES[selectedMonth]}_${selectedYear}.pdf`;
      doc.save(fileName);

      toast.success("PDF Report downloaded successfully!");
      setIsGenerating(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF report");
      setIsGenerating(false);
    }
  }, [
    expenses,
    incomes,
    savings,
    budgets,
    stats,
    allTransactions,
    user,
    selectedMonth,
    selectedYear,
  ]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-3 md:p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-[95%] sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl my-4 mx-auto overflow-hidden"
      >
        <div className="flex items-start justify-between p-3 sm:p-4 md:p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <PictureAsPdfIcon className="text-red-600 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-8 flex-shrink-0" />
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 truncate">
                Generate PDF Report
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 truncate">
                Monthly financial analysis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 ml-2"
            disabled={isGenerating}
          >
            <CloseFullscreenOutlined className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-3 sm:p-4 md:p-6 overflow-y-auto max-h-[calc(100vh-120px)]">
          <div className="space-y-3 sm:space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-3 sm:p-4 border border-purple-200">
              <h4 className="font-semibold text-gray-700 text-xs sm:text-sm md:text-base mb-1.5 sm:mb-2">
                📄 Monthly Report Features:
              </h4>
              <ul className="text-[10px] sm:text-xs md:text-sm text-gray-600 space-y-0.5 sm:space-y-1">
                <li className="flex items-start gap-1">
                  • Shows only data for the selected month
                </li>
                <li className="flex items-start gap-1">
                  • Budget tracking with allocation & spending
                </li>
                <li className="flex items-start gap-1">
                  • Income & Expense details with user attribution
                </li>
                <li className="flex items-start gap-1">
                  • Top expense categories breakdown
                </li>
                <li className="flex items-start gap-1">
                  • Savings goals with progress tracking
                </li>
                <li className="flex items-start gap-1">
                  • Monthly transactions with user details
                </li>
                <li className="flex items-start gap-1">
                  • Key insights and actionable recommendations
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-700 text-xs sm:text-sm md:text-base mb-1.5 sm:mb-2">
                📋 Report Period:
              </h4>
              <div className="grid grid-cols-2 gap-2 text-[10px] sm:text-xs md:text-sm">
                <div className="bg-white rounded-lg p-2 sm:p-3 text-center">
                  <p className="text-gray-500 text-[8px] sm:text-[10px] uppercase tracking-wider">
                    Month
                  </p>
                  <p className="font-medium text-gray-800">
                    {MONTH_NAMES[selectedMonth]}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-2 sm:p-3 text-center">
                  <p className="text-gray-500 text-[8px] sm:text-[10px] uppercase tracking-wider">
                    Year
                  </p>
                  <p className="font-medium text-gray-800">{selectedYear}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] sm:text-xs md:text-sm">
              <div className="bg-gray-50 rounded-lg p-2 sm:p-3 text-center border border-gray-100">
                <p className="text-gray-500 text-[8px] sm:text-[10px] uppercase tracking-wider">
                  Transactions
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-purple-600">
                  {
                    filterByMonth(allTransactions, selectedMonth, selectedYear)
                      .length
                  }
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 sm:p-3 text-center border border-gray-100">
                <p className="text-gray-500 text-[8px] sm:text-[10px] uppercase tracking-wider">
                  Net Savings
                </p>
                <p
                  className={`text-lg sm:text-xl md:text-2xl font-bold ${
                    filterByMonth(incomes, selectedMonth, selectedYear).reduce(
                      (sum, i) => sum + (i.amount || 0),
                      0,
                    ) -
                      filterByMonth(
                        expenses,
                        selectedMonth,
                        selectedYear,
                      ).reduce((sum, e) => sum + (e.amount || 0), 0) >=
                    0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {formatCurrencyRWF(
                    filterByMonth(incomes, selectedMonth, selectedYear).reduce(
                      (sum, i) => sum + (i.amount || 0),
                      0,
                    ) -
                      filterByMonth(
                        expenses,
                        selectedMonth,
                        selectedYear,
                      ).reduce((sum, e) => sum + (e.amount || 0), 0),
                  )}
                </p>
              </div>
            </div>

            {isGenerating && (
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex justify-between text-[10px] sm:text-xs md:text-sm">
                  <span className="text-gray-600">Generating PDF...</span>
                  <span className="text-purple-600 font-medium">
                    {progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <button
              onClick={generatePDF}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 md:py-3.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm md:text-base sticky bottom-0"
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <PictureAsPdfIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium">Generate & Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const MyReport = () => {
  const reportRef = useRef(null);
  const [user, setUser] = useState(() => {
    try {
      const data = localStorage.getItem("userData");
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  });

  const [pdfModalOpen, setPdfModalOpen] = useState(false);

  // State for data
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [savings, setSavings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedChart, setSelectedChart] = useState("bar");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Fetch all data from API using /email/:email endpoints
  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("userData");
      const parsedUser = userData ? JSON.parse(userData) : null;

      if (!token || !parsedUser) {
        toast.error("Please login to view reports");
        setIsLoading(false);
        return;
      }

      const email = parsedUser.email;

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

  // Format currency in RWF (Rwandan Franc)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("rw-RW", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

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

    // Monthly data for trend - filtered by selected month/year
    const monthlyData = {};
    const filteredTransactions = allTransactions.filter((t) => {
      const date = t.date ? new Date(t.date) : new Date();
      return (
        date.getMonth() === selectedMonth && date.getFullYear() === selectedYear
      );
    });

    filteredTransactions.forEach((t) => {
      const date = t.date ? new Date(t.date) : new Date();
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expenses: 0 };
      }
      if (t.type === "income") {
        monthlyData[monthKey].income += t.amount || 0;
      } else {
        monthlyData[monthKey].expenses += t.amount || 0;
      }
    });

    const monthlyChartData = Object.keys(monthlyData)
      .sort()
      .map((month) => ({
        month: month,
        income: Math.round(monthlyData[month].income * 100) / 100,
        expenses: Math.round(monthlyData[month].expenses * 100) / 100,
      }));

    // All months data for trend
    const allMonthlyData = {};
    allTransactions.forEach((t) => {
      const date = t.date ? new Date(t.date) : new Date();
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!allMonthlyData[monthKey]) {
        allMonthlyData[monthKey] = { income: 0, expenses: 0 };
      }
      if (t.type === "income") {
        allMonthlyData[monthKey].income += t.amount || 0;
      } else {
        allMonthlyData[monthKey].expenses += t.amount || 0;
      }
    });

    const allMonthlyChartData = Object.keys(allMonthlyData)
      .sort()
      .map((month) => ({
        month,
        income: Math.round(allMonthlyData[month].income * 100) / 100,
        expenses: Math.round(allMonthlyData[month].expenses * 100) / 100,
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
      monthlyChartData:
        monthlyChartData.length > 0 ? monthlyChartData : allMonthlyChartData,
      allMonthlyChartData,
      transactionCount: allTransactions.length,
      savingsProgress,
      totalSavingsTarget,
      totalSavingsCurrent,
      budgetCount: budgets.length,
      savingsCount: savings.length,
    };
  }, [
    expenses,
    incomes,
    budgets,
    savings,
    getAllTransactions,
    selectedMonth,
    selectedYear,
  ]);

  const stats = calculateStats();

  // Export CSV
  const handleCSVExport = useCallback(() => {
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
    toast.success("CSV exported successfully!");
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
    <div
      id="report-content"
      ref={reportRef}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-3 sm:p-4 md:p-6 lg:p-8"
    >
      {/* PDF Modal */}
      {pdfModalOpen && (
        <PDFReportGenerator
          expenses={expenses}
          incomes={incomes}
          savings={savings}
          budgets={budgets}
          stats={stats}
          allTransactions={allTransactions}
          user={user}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onClose={() => setPdfModalOpen(false)}
        />
      )}

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <BarChartIcon className="text-blue-600" />
              My Reports
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Analyze your income, expenses, and get insights (RWF)
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
              onClick={() => setPdfModalOpen(true)}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm sm:text-base"
            >
              <PictureAsPdfIcon className="w-4 h-4" />
              <span className="hidden xs:inline">PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <StatCard
          title="Total Income"
          value={formatCurrency(stats.totalIncome)}
          color="border-blue-500"
          subtitle={`${incomes.length} income entries`}
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(stats.totalExpenses)}
          color="border-red-500"
          subtitle={`${expenses.length} expense entries`}
        />
        <StatCard
          title="Net Savings"
          value={formatCurrency(stats.savings)}
          color="border-green-500"
          subtitle={`${stats.savingsCount} savings goals`}
        />
        <StatCard
          title="Budget Usage"
          value={`${Math.round(stats.budgetUsed)}%`}
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
        {/* Category Breakdown Chart */}
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
                title="Bar Chart"
              >
                <BarChartIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => setSelectedChart("pie")}
                className={`p-1.5 rounded ${selectedChart === "pie" ? "bg-blue-100 text-blue-600" : "text-gray-400 hover:bg-gray-100"}`}
                title="Pie Chart"
              >
                <PieChartIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => setSelectedChart("line")}
                className={`p-1.5 rounded ${selectedChart === "line" ? "bg-blue-100 text-blue-600" : "text-gray-400 hover:bg-gray-100"}`}
                title="Line Chart"
              >
                <ShowChartIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
          <div className="h-56 sm:h-64 md:h-80">
            {stats.categoryChartData.length > 0 ? (
              <>
                {selectedChart === "bar" && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.categoryChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis
                        tickFormatter={(value) =>
                          `${(value / 1000).toFixed(0)}k`
                        }
                      />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                      <Bar dataKey="expenses" fill="#FF8042" name="Expenses" />
                      <Bar dataKey="income" fill="#00C49F" name="Income" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
                {selectedChart === "pie" && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.categoryChartData.filter(
                          (d) => d.expenses > 0 || d.income > 0,
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
                          .filter((d) => d.expenses > 0 || d.income > 0)
                          .map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
                {selectedChart === "line" && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.categoryChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis
                        tickFormatter={(value) =>
                          `${(value / 1000).toFixed(0)}k`
                        }
                      />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="expenses"
                        stroke="#FF8042"
                        strokeWidth={2}
                        name="Expenses"
                      />
                      <Line
                        type="monotone"
                        dataKey="income"
                        stroke="#00C49F"
                        strokeWidth={2}
                        name="Income"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No data available for charts</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Monthly Trends Chart */}
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
                  <YAxis
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={fetchAllData}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl shadow-lg p-4 sm:p-6 text-left hover:shadow-xl transition-all"
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
          onClick={() => setPdfModalOpen(true)}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl shadow-lg p-4 sm:p-6 text-left hover:shadow-xl transition-all"
        >
          <PictureAsPdfIcon className="w-6 h-6 sm:w-8 sm:h-8 mb-2" />
          <h4 className="font-semibold text-sm sm:text-base">Export PDF</h4>
          <p className="text-xs sm:text-sm opacity-90 mt-1">
            Professional document format
          </p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl shadow-lg p-4 sm:p-6 text-left hover:shadow-xl transition-all"
          onClick={handleCSVExport}
        >
          <DownloadIcon className="w-6 h-6 sm:w-8 sm:h-8 mb-2" />
          <h4 className="font-semibold text-sm sm:text-base">Export CSV</h4>
          <p className="text-xs sm:text-sm opacity-90 mt-1">
            Download as CSV file
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
