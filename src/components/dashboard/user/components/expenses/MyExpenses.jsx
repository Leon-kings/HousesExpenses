/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/static-components */
/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback, useRef, memo } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";

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
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";

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

// Memoized Expense Form Component
const ExpenseForm = memo(({ formData, setFormData, onSubmit, submitLabel, isLoading, categories, onCancel }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Description *
      </label>
      <input
        type="text"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
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
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          required
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        User Name *
      </label>
      <input
        type="text"
        value={formData.user}
        onChange={(e) => setFormData({ ...formData, user: e.target.value })}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        placeholder="Enter user name"
        required
      />
    </div>

    <input type="hidden" value={formData.email} />

    <div className="flex justify-end space-x-3 pt-4">
      <button
        type="button"
        onClick={onCancel}
        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isLoading}
        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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
));

// Memoized Modal Component
const Modal = memo(({ isOpen, onClose, title, children, size = "md" }) => {
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
          <div className="sticky top-0 bg-white z-10 p-4 sm:p-6 border-b border-gray-200 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">{title}</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <CloseIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
              </button>
            </div>
          </div>
          <div className="p-4 sm:p-6">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

export const MyExpense = () => {
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

  // Refs to track current filter values without causing re-renders
  const searchTermRef = useRef(searchTerm);
  const filterCategoryRef = useRef(filterCategory);
  const filterTypeRef = useRef(filterType);
  const isFirstLoadRef = useRef(true);
  const isLoadingRef = useRef(false);

  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);

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
    email: "",
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

  // Stats summary
  const [stats, setStats] = useState({
    totalExpenses: 0,
    totalIncome: 0,
    netBalance: 0,
    expenseCount: 0,
    incomeCount: 0,
  });

  // User is always a regular user for this component
  const isAdmin = false;

  // Redirect if no valid session
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = JSON.parse(localStorage.getItem("userData") || "null");

    if (!token || !userData) {
      navigate("/");
      return;
    }

    if (!user) setUser(userData);
    
    // Set user email in form data
    if (userData?.email) {
      setFormData(prev => ({ ...prev, email: userData.email, user: userData.name || "" }));
    }
    
    // Load expenses only on initial mount
    if (isFirstLoadRef.current) {
      isFirstLoadRef.current = false;
      loadExpenses();
    }
    
    loadNotifications();
  }, [navigate]);

  // Load expenses from API using /email/:email endpoint
  const loadExpenses = useCallback(async () => {
    // Prevent concurrent loads
    if (isLoadingRef.current) return;
    
    // If no user email, show warning
    if (!user?.email) {
      toast.warning("User email not found");
      return;
    }

    isLoadingRef.current = true;
    setIsLoading(true);
    
    try {
      // Use refs to get current filter values
      const search = searchTermRef.current;
      const category = filterCategoryRef.current;
      const type = filterTypeRef.current;

      // Regular user - use /email/:email endpoint
      const url = `/expenses/email/${user.email}`;
      const params = {};
      
      if (search) params.search = search;
      if (category && category !== "all") params.category = category;
      if (type && type !== "all") params.type = type;

      const response = await api.get(url, { params });
      
      // Handle response
      if (response.data.success) {
        const expenseData = response.data.data || [];
        setExpenses(expenseData);
        setFilteredExpenses(expenseData);
        calculateStats(expenseData);
      } else {
        // If response doesn't have success property, try to use data directly
        if (Array.isArray(response.data)) {
          setExpenses(response.data);
          setFilteredExpenses(response.data);
          calculateStats(response.data);
        } else if (response.data.data && Array.isArray(response.data.data)) {
          setExpenses(response.data.data);
          setFilteredExpenses(response.data.data);
          calculateStats(response.data.data);
        } else {
          toast.warning("Unexpected response format");
        }
      }
    } catch (error) {
      console.error("Load expenses error:", error);
      toast.error(error.response?.data?.message || "Failed to load expenses");
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, [user?.email]);

  // Calculate stats from expenses
  const calculateStats = useCallback((expensesData) => {
    let totalIncome = 0;
    let totalExpenses = 0;
    let expenseCount = 0;
    let incomeCount = 0;

    expensesData.forEach(exp => {
      if (exp.type === 'income') {
        totalIncome += exp.amount;
        incomeCount++;
      } else {
        totalExpenses += exp.amount;
        expenseCount++;
      }
    });

    setStats({
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      expenseCount,
      incomeCount,
    });
  }, []);

  // Load notifications
  const loadNotifications = async () => {
    if (!user?.email) return;
    
    setNotificationLoading(true);
    try {
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error("Load notifications error:", error);
    } finally {
      setNotificationLoading(false);
    }
  };

  // Handle search and filter - update refs and trigger load
  useEffect(() => {
    // Update refs with current values
    searchTermRef.current = searchTerm;
    filterCategoryRef.current = filterCategory;
    filterTypeRef.current = filterType;

    // Debounce the load
    const timer = setTimeout(() => {
      // Skip if this is the initial load
      if (!isFirstLoadRef.current) {
        loadExpenses();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, filterCategory, filterType, loadExpenses]);

  // Handle add expense
  const handleAddExpense = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const expenseData = {
        description: formData.description,
        category: formData.category,
        type: formData.type,
        amount: parseFloat(formData.amount),
        date: formData.date,
        user: formData.user || user?.name || "Unknown",
        email: formData.email || user?.email,
      };

      const response = await api.post("/expenses", expenseData);
      
      if (response.data.success) {
        toast.success("Expense added successfully!");
        setIsAddModalOpen(false);
        resetForm();
        // Reload expenses after adding
        setTimeout(() => loadExpenses(), 100);
      } else {
        toast.error(response.data.message || "Failed to add expense");
      }
    } catch (error) {
      console.error("Add expense error:", error);
      toast.error(error.response?.data?.message || "Failed to add expense");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit expense
  const handleEditExpense = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const expenseData = {
        description: formData.description,
        category: formData.category,
        type: formData.type,
        amount: parseFloat(formData.amount),
        date: formData.date,
        user: formData.user || user?.name || "Unknown",
        email: formData.email || user?.email,
      };

      const response = await api.put(`/expenses/${selectedExpense._id}`, expenseData);
      
      if (response.data.success) {
        toast.success("Expense updated successfully!");
        setIsEditModalOpen(false);
        resetForm();
        // Reload expenses after updating
        setTimeout(() => loadExpenses(), 100);
      } else {
        toast.error(response.data.message || "Failed to update expense");
      }
    } catch (error) {
      console.error("Update expense error:", error);
      toast.error(error.response?.data?.message || "Failed to update expense");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete expense
  const handleDeleteExpense = async () => {
    setIsSubmitting(true);

    try {
      const response = await api.delete(`/expenses/${selectedExpense._id}`);
      
      if (response.data.success) {
        toast.success("Expense deleted successfully!");
        setIsDeleteModalOpen(false);
        setSelectedExpense(null);
        // Reload expenses after deleting
        setTimeout(() => loadExpenses(), 100);
      } else {
        toast.error(response.data.message || "Failed to delete expense");
      }
    } catch (error) {
      console.error("Delete expense error:", error);
      toast.error(error.response?.data?.message || "Failed to delete expense");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      description: "",
      category: "",
      type: "expense",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      user: user?.name || "",
      email: user?.email || "",
    });
    setSelectedExpense(null);
  }, [user]);

  // Open edit modal
  const openEditModal = useCallback((expense) => {
    setSelectedExpense(expense);
    setFormData({
      description: expense.description,
      category: expense.category,
      type: expense.type,
      amount: expense.amount.toString(),
      date: expense.date ? expense.date.split("T")[0] : new Date().toISOString().split("T")[0],
      user: expense.user || user?.name || "",
      email: expense.email || user?.email || "",
    });
    setIsEditModalOpen(true);
  }, [user]);

  // Open delete modal
  const openDeleteModal = useCallback((expense) => {
    setSelectedExpense(expense);
    setIsDeleteModalOpen(true);
  }, []);

  // Generate PDF Report
  const generatePDFReport = useCallback(() => {
    const dataToExport = filteredExpenses.length > 0 ? filteredExpenses : expenses;
    
    if (dataToExport.length === 0) {
      toast.warning("No transactions to export");
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, pageWidth, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("HEMS - My Expenses Report", 14, 25);

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
    doc.text(`User: ${user?.email || "N/A"}`, 14, 60);

    // Summary section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Summary", 14, 75);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const summaryData = [
      ["Total Income", `$${stats.totalIncome.toFixed(2)}`],
      ["Total Expenses", `$${stats.totalExpenses.toFixed(2)}`],
      ["Net Balance", `$${stats.netBalance.toFixed(2)}`],
      ["Total Transactions", `${dataToExport.length}`],
    ];

    let yPos = 85;
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
    const tableData = dataToExport.map((e) => [
      e.date ? new Date(e.date).toLocaleDateString() : "N/A",
      e.description || "N/A",
      e.category || "N/A",
      e.type ? e.type.charAt(0).toUpperCase() + e.type.slice(1) : "N/A",
      e.user || "N/A",
      `$${e.amount ? e.amount.toFixed(2) : "0.00"}`,
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
    doc.save(`hems-my-expenses-${today.toISOString().split("T")[0]}.pdf`);
    toast.success("PDF Report downloaded successfully!");
  }, [expenses, filteredExpenses, stats, user]);

  // Format currency
  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  }, []);

  // Format date
  const formatDate = useCallback((dateString) => {
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
  }, []);

  // Notification Panel Component
  const NotificationPanel = memo(() => {
    if (!showNotifications) return null;

    return (
      <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-[500px] overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center space-x-2">
            <NotificationsIcon className="text-purple-600" />
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={() => toast.info("Mark all as read coming soon")}
                className="text-xs text-purple-600 hover:text-purple-800"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={() => setShowNotifications(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="overflow-y-auto max-h-[400px] p-4 text-center text-gray-500">
          <NotificationsIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p>Notification system coming soon</p>
        </div>
      </div>
    );
  });

  // Get display data
  const displayExpenses = filteredExpenses.length > 0 ? filteredExpenses : expenses;

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

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <ReceiptIcon className="text-blue-500" />
              My Expenses
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Manage and track your personal transactions
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
          <div className="flex flex-wrap gap-2 mt-3 sm:mt-0">
            {/* Notification Button */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
            >
              <NotificationsIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">Notifications</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Panel */}
            <NotificationPanel />

            <button
              onClick={generatePDFReport}
              className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              <PictureAsPdfIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">Export PDF</span>
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
            >
              <AddIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 truncate">Total Income</p>
                <p className="text-base sm:text-2xl font-bold text-green-600 truncate">
                  {formatCurrency(stats.totalIncome)}
                </p>
              </div>
              <TrendingUpIcon className="w-8 h-8 sm:w-10 sm:h-10 text-green-500 bg-green-100 p-1.5 sm:p-2 rounded-full flex-shrink-0" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 truncate">Total Expenses</p>
                <p className="text-base sm:text-2xl font-bold text-red-600 truncate">
                  {formatCurrency(stats.totalExpenses)}
                </p>
              </div>
              <TrendingDownIcon className="w-8 h-8 sm:w-10 sm:h-10 text-red-500 bg-red-100 p-1.5 sm:p-2 rounded-full flex-shrink-0" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 truncate">Net Balance</p>
                <p className={`text-base sm:text-2xl font-bold truncate ${stats.netBalance >= 0 ? "text-blue-600" : "text-red-600"}`}>
                  {formatCurrency(stats.netBalance)}
                </p>
              </div>
              <AttachMoneyIcon className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500 bg-blue-100 p-1.5 sm:p-2 rounded-full flex-shrink-0" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 truncate">Transactions</p>
                <p className="text-base sm:text-2xl font-bold text-purple-600 truncate">
                  {displayExpenses.length}
                </p>
              </div>
              <ReceiptIcon className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500 bg-purple-100 p-1.5 sm:p-2 rounded-full flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search by description or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
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
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading transactions...</p>
            </div>
          ) : displayExpenses.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <ReceiptIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No transactions found</p>
              <p className="text-gray-400 text-sm mt-1">
                Try adjusting your filters or add a new transaction
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold">Date</th>
                    <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold">Description</th>
                    <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold">Category</th>
                    <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold">Type</th>
                    <th className="text-right py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold">Amount</th>
                    <th className="text-center py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayExpenses.map((expense, index) => (
                    <motion.tr
                      key={expense._id || expense.id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-2 sm:py-3 px-3 sm:px-4 text-gray-600 text-xs sm:text-sm">
                        {formatDate(expense.date)}
                      </td>
                      <td className="py-2 sm:py-3 px-3 sm:px-4 text-gray-800 font-medium text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">
                        {expense.description || "N/A"}
                      </td>
                      <td className="py-2 sm:py-3 px-3 sm:px-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium whitespace-nowrap">
                          {expense.category || "Uncategorized"}
                        </span>
                      </td>
                      <td className="py-2 sm:py-3 px-3 sm:px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                            expense.type === "income"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {expense.type ? expense.type.charAt(0).toUpperCase() + expense.type.slice(1) : "N/A"}
                        </span>
                      </td>
                      <td
                        className={`py-2 sm:py-3 px-3 sm:px-4 text-right font-semibold text-xs sm:text-sm ${
                          expense.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {expense.type === "income" ? "+" : "-"}
                        {formatCurrency(expense.amount)}
                      </td>
                      <td className="py-2 sm:py-3 px-3 sm:px-4 text-center">
                        <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                          <button
                            onClick={() => openEditModal(expense)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <EditIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(expense)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <DeleteIcon className="w-4 h-4 sm:w-5 sm:h-5" />
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
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleAddExpense}
          submitLabel="Add Transaction"
          isLoading={isSubmitting}
          categories={categories}
          onCancel={() => {
            setIsAddModalOpen(false);
            resetForm();
          }}
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
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleEditExpense}
          submitLabel="Update Transaction"
          isLoading={isSubmitting}
          categories={categories}
          onCancel={() => {
            setIsEditModalOpen(false);
            resetForm();
          }}
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
              {selectedExpense?.description || "N/A"}
            </p>
            <p className="text-sm text-gray-600">
              {formatCurrency(selectedExpense?.amount || 0)} -{" "}
              {selectedExpense?.category || "Uncategorized"}
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