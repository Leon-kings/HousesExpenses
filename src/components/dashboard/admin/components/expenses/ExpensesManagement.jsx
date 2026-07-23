/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/static-components */
/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Material Icons
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ReceiptIcon from "@mui/icons-material/Receipt";
import WarningIcon from "@mui/icons-material/Warning";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

export const ExpensesDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("userData") || "null");
    } catch {
      return null;
    }
  });

  // State for expenses
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    description: "",
    category: "",
    type: "expense",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    user: "",
  });

  // Categories for dropdown
  const categories = [
    "Food",
    "Utilities",
    "Transport",
    "Entertainment",
    "Shopping",
    "Healthcare",
    "Education",
    "Salary",
    "Freelance",
    "Investment",
    "Rent",
    "Insurance",
    "Other",
  ];

  // Static users for demo
  const users = ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson"];

  // Stats summary
  const [stats, setStats] = useState({
    totalExpenses: 0,
    totalIncome: 0,
    netBalance: 0,
    expenseCount: 0,
    incomeCount: 0,
  });

  // Redirect if no valid session
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = JSON.parse(localStorage.getItem("userData") || "null");

    if (!token || !userData) {
      navigate("/");
      return;
    }

    if (!user) setUser(userData);
    loadExpenses();
  }, [navigate]);

  // Load expenses (static demo data)
  const loadExpenses = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const demoExpenses = [
        {
          id: 1,
          description: "Grocery Shopping",
          category: "Food",
          type: "expense",
          amount: 120.5,
          date: "2026-07-22",
          user: "John Doe",
        },
        {
          id: 2,
          description: "Electricity Bill",
          category: "Utilities",
          type: "expense",
          amount: 85.0,
          date: "2026-07-21",
          user: "Jane Smith",
        },
        {
          id: 3,
          description: "Salary Deposit",
          category: "Salary",
          type: "income",
          amount: 2800.0,
          date: "2026-07-20",
          user: "John Doe",
        },
        {
          id: 4,
          description: "Internet Subscription",
          category: "Utilities",
          type: "expense",
          amount: 45.0,
          date: "2026-07-19",
          user: "Mike Johnson",
        },
        {
          id: 5,
          description: "Freelance Payment",
          category: "Freelance",
          type: "income",
          amount: 400.0,
          date: "2026-07-18",
          user: "Jane Smith",
        },
        {
          id: 6,
          description: "Restaurant Dinner",
          category: "Food",
          type: "expense",
          amount: 65.75,
          date: "2026-07-17",
          user: "John Doe",
        },
        {
          id: 7,
          description: "New Laptop",
          category: "Shopping",
          type: "expense",
          amount: 899.99,
          date: "2026-07-15",
          user: "Sarah Wilson",
        },
        {
          id: 8,
          description: "Rent Payment",
          category: "Rent",
          type: "expense",
          amount: 1200.0,
          date: "2026-07-01",
          user: "John Doe",
        },
        {
          id: 9,
          description: "Stock Dividend",
          category: "Investment",
          type: "income",
          amount: 150.0,
          date: "2026-07-10",
          user: "Mike Johnson",
        },
        {
          id: 10,
          description: "Doctor Visit",
          category: "Healthcare",
          type: "expense",
          amount: 200.0,
          date: "2026-07-08",
          user: "Sarah Wilson",
        },
      ];

      setExpenses(demoExpenses);
      setFilteredExpenses(demoExpenses);
      calculateStats(demoExpenses);
      setIsLoading(false);
    }, 500);
  };

  // Calculate statistics
  const calculateStats = (data) => {
    const totalExpenses = data
      .filter((e) => e.type === "expense")
      .reduce((sum, e) => sum + e.amount, 0);
    const totalIncome = data
      .filter((e) => e.type === "income")
      .reduce((sum, e) => sum + e.amount, 0);
    const expenseCount = data.filter((e) => e.type === "expense").length;
    const incomeCount = data.filter((e) => e.type === "income").length;

    setStats({
      totalExpenses,
      totalIncome,
      netBalance: totalIncome - totalExpenses,
      expenseCount,
      incomeCount,
    });
  };

  // Handle search and filter
  useEffect(() => {
    let result = expenses;

    // Search filter
    if (searchTerm) {
      result = result.filter(
        (e) =>
          e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.user.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Category filter
    if (filterCategory !== "all") {
      result = result.filter((e) => e.category === filterCategory);
    }

    // Type filter
    if (filterType !== "all") {
      result = result.filter((e) => e.type === filterType);
    }

    setFilteredExpenses(result);
  }, [searchTerm, filterCategory, filterType, expenses]);

  // Handle add expense
  const handleAddExpense = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newExpense = {
      id: Math.max(...expenses.map((e) => e.id), 0) + 1,
      ...formData,
      amount: parseFloat(formData.amount),
    };

    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    calculateStats(updatedExpenses);
    toast.success("Expense added successfully!");
    setIsAddModalOpen(false);
    resetForm();
    setIsSubmitting(false);
  };

  // Handle edit expense
  const handleEditExpense = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const updatedExpenses = expenses.map((e) =>
      e.id === selectedExpense.id
        ? { ...formData, id: e.id, amount: parseFloat(formData.amount) }
        : e,
    );

    setExpenses(updatedExpenses);
    calculateStats(updatedExpenses);
    toast.success("Expense updated successfully!");
    setIsEditModalOpen(false);
    resetForm();
    setIsSubmitting(false);
  };

  // Handle delete expense
  const handleDeleteExpense = async () => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const updatedExpenses = expenses.filter((e) => e.id !== selectedExpense.id);
    setExpenses(updatedExpenses);
    calculateStats(updatedExpenses);
    toast.success("Expense deleted successfully!");
    setIsDeleteModalOpen(false);
    setSelectedExpense(null);
    setIsSubmitting(false);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      description: "",
      category: "",
      type: "expense",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      user: "",
    });
    setSelectedExpense(null);
  };

  // Open edit modal
  const openEditModal = (expense) => {
    setSelectedExpense(expense);
    setFormData({
      description: expense.description,
      category: expense.category,
      type: expense.type,
      amount: expense.amount.toString(),
      date: expense.date,
      user: expense.user,
    });
    setIsEditModalOpen(true);
  };

  // Open delete modal
  const openDeleteModal = (expense) => {
    setSelectedExpense(expense);
    setIsDeleteModalOpen(true);
  };

  // Generate PDF Report
  const generatePDFReport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, pageWidth, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("HEMS - Expenses Report", 14, 25);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    // Report info
    const today = new Date();
    doc.text(
      `Generated: ${today.toLocaleDateString()} ${today.toLocaleTimeString()}`,
      14,
      50,
    );

    // Summary section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Summary", 14, 65);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const summaryData = [
      ["Total Income", `$${stats.totalIncome.toFixed(2)}`],
      ["Total Expenses", `$${stats.totalExpenses.toFixed(2)}`],
      ["Net Balance", `$${stats.netBalance.toFixed(2)}`],
      ["Total Transactions", `${filteredExpenses.length}`],
    ];

    let yPos = 75;
    summaryData.forEach(([label, value]) => {
      doc.text(`${label}:`, 20, yPos);
      doc.text(value, 80, yPos);
      yPos += 8;
    });

    // Transactions table
    yPos += 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Transaction Details", 14, yPos);

    yPos += 10;
    const tableData = filteredExpenses.map((e) => [
      e.date,
      e.description,
      e.category,
      e.type.charAt(0).toUpperCase() + e.type.slice(1),
      e.user,
      `$${e.amount.toFixed(2)}`,
    ]);

    doc.autoTable({
      startY: yPos,
      head: [["Date", "Description", "Category", "Type", "User", "Amount"]],
      body: tableData,
      theme: "striped",
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 9,
      },
      columnStyles: {
        5: { halign: "right" },
      },
    });

    // Footer
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Generated by HEMS - Household Expense Management System`,
      14,
      finalY,
    );
    doc.text(
      `Page ${doc.internal.getCurrentPageInfo().pageNumber}`,
      pageWidth - 30,
      finalY,
    );

    // Save PDF
    doc.save(`hems-expenses-report-${today.toISOString().split("T")[0]}.pdf`);
    toast.success("PDF Report downloaded successfully!");
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Modal component
  const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
    if (!isOpen) return null;

    const sizes = {
      sm: "max-w-md",
      md: "max-w-2xl",
      lg: "max-w-4xl",
    };

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`bg-white rounded-3xl shadow-2xl ${sizes[size]} w-full max-h-[90vh] overflow-y-auto relative`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-200 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <CloseIcon className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  // Expense Form Component
  const ExpenseForm = ({ onSubmit, submitLabel, isLoading }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          placeholder="Enter description"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type *
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            required
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount ($) *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date *
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          User *
        </label>
        <select
          value={formData.user}
          onChange={(e) => setFormData({ ...formData, user: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          required
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user} value={user}>
              {user}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={() => {
            setIsAddModalOpen(false);
            setIsEditModalOpen(false);
            resetForm();
          }}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : (
            <span>{submitLabel}</span>
          )}
        </button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Expenses Management
            </h2>
            <p className="text-gray-600 mt-1">
              Manage and track all household transactions
            </p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <button
              onClick={generatePDFReport}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <PictureAsPdfIcon className="w-5 h-5" />
              <span>Export PDF</span>
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              <AddIcon className="w-5 h-5" />
              <span>Add Transaction</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Income</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.totalIncome)}
                </p>
              </div>
              <TrendingUpIcon className="w-10 h-10 text-green-500 bg-green-100 p-2 rounded-full" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(stats.totalExpenses)}
                </p>
              </div>
              <TrendingDownIcon className="w-10 h-10 text-red-500 bg-red-100 p-2 rounded-full" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Net Balance</p>
                <p
                  className={`text-2xl font-bold ${stats.netBalance >= 0 ? "text-blue-600" : "text-red-600"}`}
                >
                  {formatCurrency(stats.netBalance)}
                </p>
              </div>
              <AttachMoneyIcon className="w-10 h-10 text-blue-500 bg-blue-100 p-2 rounded-full" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Transactions</p>
                <p className="text-2xl font-bold text-purple-600">
                  {filteredExpenses.length}
                </p>
              </div>
              <ReceiptIcon className="w-10 h-10 text-purple-500 bg-purple-100 p-2 rounded-full" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex space-x-3">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterCategory("all");
                  setFilterType("all");
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading transactions...</p>
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="p-12 text-center">
              <ReceiptIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No transactions found</p>
              <p className="text-gray-400 text-sm mt-1">
                Try adjusting your filters or add a new transaction
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    <th className="text-left py-3 px-4 text-sm font-semibold">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">
                      Description
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">
                      User
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold">
                      Amount
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((expense, index) => (
                    <motion.tr
                      key={expense.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        {formatDate(expense.date)}
                      </td>
                      <td className="py-3 px-4 text-gray-800 font-medium">
                        {expense.description}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                          {expense.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            expense.type === "income"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {expense.type.charAt(0).toUpperCase() +
                            expense.type.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        {expense.user}
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-semibold ${
                          expense.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {expense.type === "income" ? "+" : "-"}
                        {formatCurrency(expense.amount)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => openEditModal(expense)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <EditIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(expense)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <DeleteIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Expense Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetForm();
        }}
        title="Add New Transaction"
      >
        <ExpenseForm
          onSubmit={handleAddExpense}
          submitLabel="Add Transaction"
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Edit Expense Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          resetForm();
        }}
        title="Edit Transaction"
      >
        <ExpenseForm
          onSubmit={handleEditExpense}
          submitLabel="Update Transaction"
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedExpense(null);
        }}
        title="Confirm Delete"
        size="sm"
      >
        <div className="text-center py-4">
          <WarningIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Are you sure?
          </h3>
          <p className="text-gray-600">
            This action cannot be undone. This will permanently delete the
            transaction:
          </p>
          <div className="mt-4 p-4 bg-gray-50 rounded-xl">
            <p className="font-semibold text-gray-800">
              {selectedExpense?.description}
            </p>
            <p className="text-sm text-gray-600">
              {formatCurrency(selectedExpense?.amount || 0)} -{" "}
              {selectedExpense?.category}
            </p>
          </div>

          <div className="flex justify-center space-x-3 mt-6">
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedExpense(null);
              }}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteExpense}
              disabled={isSubmitting}
              className="px-6 py-2 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <DeleteIcon className="w-5 h-5" />
                  <span>Delete</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
