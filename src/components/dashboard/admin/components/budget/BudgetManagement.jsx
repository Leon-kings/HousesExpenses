
/* eslint-disable react-hooks/static-components */
/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Material Icons
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import CancelIcon from "@mui/icons-material/Cancel";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import PieChartIcon from "@mui/icons-material/PieChart";
import BarChartIcon from "@mui/icons-material/BarChart";

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

// Budget Categories (matching your model)
const BUDGET_CATEGORIES = [
  "Food",
  "Utilities",
  "Transport",
  "Entertainment",
  "Shopping",
  "Healthcare",
  "Education",
  "Rent",
  "Insurance",
  "Groceries",
  "Dining Out",
  "Subscriptions",
  "Clothing",
  "Home Maintenance",
  "Other"
];

// Months
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Memoized Modal Component
const Modal = memo(({ isOpen, onClose, title, children, size = "md" }) => {
  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl"
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
      )}
    </AnimatePresence>
  );
});

// Memoized Budget Form Component
const BudgetForm = memo(({ 
  formData, 
  setFormData, 
  onSubmit, 
  submitLabel, 
  isSubmitting, 
  categories,
  onCancel,
  months,
  selectedMonth,
  selectedYear
}) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Category *
      </label>
      <select
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
        Allocated Amount ($) *
      </label>
      <input
        type="number"
        step="0.01"
        min="0"
        value={formData.allocatedAmount}
        onChange={(e) => setFormData({ ...formData, allocatedAmount: e.target.value })}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
        placeholder="0.00"
        required
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Month
        </label>
        <select
          value={formData.month}
          onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
        >
          {months.map((month, index) => (
            <option key={index} value={index}>{month}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Year
        </label>
        <input
          type="number"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          min={2020}
          max={2030}
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Description (Optional)
      </label>
      <textarea
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
        rows="2"
        placeholder="Additional notes about this budget"
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
        disabled={isSubmitting}
        className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
      >
        {isSubmitting ? (
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

export const BudgetManagement = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("userData") || "null");
    } catch {
      return null;
    }
  });

  // State for budgets
  const [budgets, setBudgets] = useState([]);
  const [filteredBudgets, setFilteredBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Refs to track current filter values without causing re-renders
  const searchTermRef = useRef(searchTerm);
  const filterCategoryRef = useRef(filterCategory);
  const filterStatusRef = useRef(filterStatus);
  const selectedMonthRef = useRef(selectedMonth);
  const selectedYearRef = useRef(selectedYear);
  const isFirstLoadRef = useRef(true);
  const isLoadingRef = useRef(false);

  // Stats
  const [stats, setStats] = useState({
    totalAllocated: 0,
    totalSpent: 0,
    totalRemaining: 0,
    overallPercentage: 0,
    status: "on-track",
    categoryCount: 0,
    overBudgetCount: 0,
    approachingCount: 0,
    onTrackCount: 0,
    underBudgetCount: 0,
  });

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    category: "",
    allocatedAmount: "",
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    description: "",
    email: "",
  });

  // Check if user is admin
  const isAdmin = user?.role === "admin" || user?.role === "Admin";

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
      setFormData(prev => ({ 
        ...prev, 
        email: userData.email,
        month: selectedMonth,
        year: selectedYear
      }));
    }
    
    // Load budgets only on initial mount
    if (isFirstLoadRef.current) {
      isFirstLoadRef.current = false;
      loadBudgets();
    }
  }, [navigate]);

  // Load budgets from API
  const loadBudgets = useCallback(async () => {
    // Prevent concurrent loads
    if (isLoadingRef.current) return;
    
    if (!user?.email && !isAdmin) {
      toast.warning("User email not found");
      return;
    }

    isLoadingRef.current = true;
    setIsLoading(true);
    
    try {
      // Use refs to get current values
      const month = selectedMonthRef.current;
      const year = selectedYearRef.current;
      const category = filterCategoryRef.current;
      
      const params = {
        month: month,
        year: year
      };
      
      // If not admin, filter by email
      if (!isAdmin) {
        params.email = user.email;
      }

      // Add category filter if not "all"
      if (category && category !== "all") {
        params.category = category;
      }

      const response = await api.get("/budgets", { params });
      
      // Handle response based on your API structure
      if (response.data.success) {
        const budgetData = response.data.data || [];
        setBudgets(budgetData);
        setFilteredBudgets(budgetData);
        
        // Update stats from response
        if (response.data.summary) {
          setStats(response.data.summary);
        } else {
          calculateStats(budgetData);
        }
      } else if (Array.isArray(response.data)) {
        setBudgets(response.data);
        setFilteredBudgets(response.data);
        calculateStats(response.data);
      } else {
        toast.warning("Unexpected response format");
      }
    } catch (error) {
      console.error("Load budgets error:", error);
      // Check if it's a 400 error (likely missing email)
      if (error.response?.status === 400) {
        toast.error("Please provide your email to view budgets");
      } else {
        toast.error(error.response?.data?.message || "Failed to load budgets");
      }
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, [user?.email, isAdmin]);

  // Calculate stats
  const calculateStats = useCallback((budgetData) => {
    const totalAllocated = budgetData.reduce((sum, b) => sum + (b.allocatedAmount || 0), 0);
    const totalSpent = budgetData.reduce((sum, b) => sum + (b.spentAmount || 0), 0);
    const totalRemaining = totalAllocated - totalSpent;
    const overallPercentage = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;

    const overBudgetCount = budgetData.filter(b => b.status === "over-budget").length;
    const approachingCount = budgetData.filter(b => b.status === "approaching-limit").length;
    const onTrackCount = budgetData.filter(b => b.status === "on-track").length;
    const underBudgetCount = budgetData.filter(b => b.status === "under-budget").length;

    let status = "on-track";
    if (overBudgetCount > 0) status = "over-budget";
    else if (approachingCount > 0) status = "approaching-limit";
    else if (underBudgetCount > 0 && totalSpent > 0) status = "under-budget";

    setStats({
      totalAllocated,
      totalSpent,
      totalRemaining,
      overallPercentage,
      status,
      categoryCount: budgetData.length,
      overBudgetCount,
      approachingCount,
      onTrackCount,
      underBudgetCount,
    });
  }, []);

  // Handle search and filter - update refs and trigger load with debounce
  useEffect(() => {
    // Update refs with current values
    searchTermRef.current = searchTerm;
    filterCategoryRef.current = filterCategory;
    filterStatusRef.current = filterStatus;
    selectedMonthRef.current = selectedMonth;
    selectedYearRef.current = selectedYear;

    // Debounce the load - only after user stops interacting
    const timer = setTimeout(() => {
      // Skip if this is the initial load
      if (!isFirstLoadRef.current) {
        loadBudgets();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, filterCategory, filterStatus, selectedMonth, selectedYear, loadBudgets]);

  // Filter budgets based on search term and status (client-side filtering)
  useEffect(() => {
    let filtered = [...budgets];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.category?.toLowerCase().includes(term) ||
          b.description?.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (filterStatus && filterStatus !== "all") {
      filtered = filtered.filter((b) => b.status === filterStatus);
    }

    setFilteredBudgets(filtered);
  }, [budgets, searchTerm, filterStatus]);

  // Handle add budget
  const handleAddBudget = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const budgetData = {
        category: formData.category,
        allocatedAmount: parseFloat(formData.allocatedAmount),
        month: parseInt(formData.month),
        year: parseInt(formData.year),
        description: formData.description || "",
        email: formData.email || user?.email,
      };

      const response = await api.post("/budgets", budgetData);
      
      if (response.data.success) {
        toast.success("Budget set successfully!");
        setIsAddModalOpen(false);
        resetForm();
        // Reload budgets after adding
        setTimeout(() => loadBudgets(), 100);
      } else {
        toast.error(response.data.message || "Failed to set budget");
      }
    } catch (error) {
      console.error("Add budget error:", error);
      if (error.response?.status === 400) {
        toast.error(error.response?.data?.message || "Budget may already exist for this category/month");
      } else {
        toast.error(error.response?.data?.message || "Failed to set budget");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit budget
  const handleEditBudget = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const budgetData = {
        category: formData.category,
        allocatedAmount: parseFloat(formData.allocatedAmount),
        month: parseInt(formData.month),
        year: parseInt(formData.year),
        description: formData.description || "",
      };

      const response = await api.put(`/budgets/${selectedBudget._id}`, budgetData);
      
      if (response.data.success) {
        toast.success("Budget updated successfully!");
        setIsEditModalOpen(false);
        resetForm();
        // Reload budgets after updating
        setTimeout(() => loadBudgets(), 100);
      } else {
        toast.error(response.data.message || "Failed to update budget");
      }
    } catch (error) {
      console.error("Update budget error:", error);
      toast.error(error.response?.data?.message || "Failed to update budget");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete budget
  const handleDeleteBudget = async () => {
    setIsSubmitting(true);

    try {
      const response = await api.delete(`/budgets/${selectedBudget._id}`);
      
      if (response.data.success) {
        toast.success("Budget deleted successfully!");
        setIsDeleteModalOpen(false);
        setSelectedBudget(null);
        // Reload budgets after deleting
        setTimeout(() => loadBudgets(), 100);
      } else {
        toast.error(response.data.message || "Failed to delete budget");
      }
    } catch (error) {
      console.error("Delete budget error:", error);
      toast.error(error.response?.data?.message || "Failed to delete budget");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      category: "",
      allocatedAmount: "",
      month: selectedMonth,
      year: selectedYear,
      description: "",
      email: user?.email || "",
    });
    setSelectedBudget(null);
  }, [selectedMonth, selectedYear, user]);

  // Open edit modal
  const openEditModal = useCallback((budget) => {
    setSelectedBudget(budget);
    setFormData({
      category: budget.category || "",
      allocatedAmount: budget.allocatedAmount?.toString() || "",
      month: budget.month || selectedMonth,
      year: budget.year || selectedYear,
      description: budget.description || "",
      email: budget.email || user?.email || "",
    });
    setIsEditModalOpen(true);
  }, [selectedMonth, selectedYear, user]);

  // Format currency
  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  }, []);

  // Get status badge
  const getStatusBadge = useCallback((status) => {
    const statusConfig = {
      "on-track": { color: "bg-green-100 text-green-800", icon: <CheckCircleIcon className="w-3 h-3" />, label: "On Track" },
      "approaching-limit": { color: "bg-yellow-100 text-yellow-800", icon: <WarningIcon className="w-3 h-3" />, label: "Approaching Limit" },
      "over-budget": { color: "bg-red-100 text-red-800", icon: <CancelIcon className="w-3 h-3" />, label: "Over Budget" },
      "under-budget": { color: "bg-blue-100 text-blue-800", icon: <TrendingDownIcon className="w-3 h-3" />, label: "Under Budget" },
    };

    const config = statusConfig[status] || statusConfig["on-track"];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}>
        {config.icon}
        {config.label}
      </span>
    );
  }, []);

  // Get status color for progress bar
  const getStatusColor = useCallback((status) => {
    const colors = {
      "on-track": "bg-green-500",
      "approaching-limit": "bg-yellow-500",
      "over-budget": "bg-red-500",
      "under-budget": "bg-blue-500",
    };
    return colors[status] || "bg-purple-500";
  }, []);

  // Export budget report
  const exportReport = useCallback(() => {
    if (filteredBudgets.length === 0) {
      toast.warning("No budget data to export");
      return;
    }

    // Create CSV
    const headers = ["Category", "Allocated", "Spent", "Remaining", "Used %", "Status", "Description"];
    const rows = filteredBudgets.map(b => [
      b.category || "",
      b.allocatedAmount || 0,
      b.spentAmount || 0,
      b.remainingAmount || 0,
      `${b.percentageUsed?.toFixed(1) || 0}%`,
      b.status || "on-track",
      b.description || ""
    ]);

    let csv = headers.join(",") + "\n";
    rows.forEach(row => {
      csv += row.join(",") + "\n";
    });

    // Add summary
    csv += "\nSummary\n";
    csv += `Month,${MONTHS[selectedMonth]} ${selectedYear}\n`;
    csv += `Total Allocated,${stats.totalAllocated}\n`;
    csv += `Total Spent,${stats.totalSpent}\n`;
    csv += `Total Remaining,${stats.totalRemaining}\n`;
    csv += `Overall Usage,${stats.overallPercentage.toFixed(1)}%\n`;
    csv += `Overall Status,${stats.status}\n`;
    csv += `Categories,${stats.categoryCount}\n`;
    csv += `Over Budget,${stats.overBudgetCount}\n`;
    csv += `Approaching Limit,${stats.approachingCount}\n`;
    csv += `On Track,${stats.onTrackCount}\n`;
    csv += `Under Budget,${stats.underBudgetCount}\n`;

    // Download
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `budget-report-${selectedMonth+1}-${selectedYear}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("Report exported successfully!");
  }, [filteredBudgets, selectedMonth, selectedYear, stats]);

  // Memoized Status Badge Component
  const StatusBadge = memo(({ status }) => getStatusBadge(status));

  // Memoized Budget Card Component
  const BudgetCard = memo(({ budget, onEdit, onDelete, formatCurrency, getStatusBadge, getStatusColor }) => {
    const percentageUsed = budget.percentageUsed || 0;
    const status = budget.status || "on-track";
    const isOverBudget = status === "over-budget";

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 transition-all hover:shadow-xl ${
          status === "over-budget" ? "border-l-red-500" :
          status === "approaching-limit" ? "border-l-yellow-500" :
          status === "under-budget" ? "border-l-blue-500" :
          "border-l-green-500"
        }`}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800">
              {budget.category}
            </h3>
            <p className="text-sm text-gray-500">{budget.description || "No description"}</p>
          </div>
          {getStatusBadge(status)}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Budget: {formatCurrency(budget.allocatedAmount)}</span>
            <span className="text-gray-600">Spent: {formatCurrency(budget.spentAmount || 0)}</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${getStatusColor(status)}`}
              style={{ width: `${Math.min(percentageUsed, 100)}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-gray-500">
            <span>{percentageUsed.toFixed(1)}% used</span>
            <span className={isOverBudget ? "text-red-500 font-medium" : "text-green-600"}>
              {isOverBudget ? "⚠ Over Budget" : `${formatCurrency(budget.remainingAmount || 0)} left`}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end mt-4 pt-3 border-t border-gray-100">
          <div className="flex space-x-1">
            <button
              onClick={() => onEdit(budget)}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit"
            >
              <EditIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(budget)}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <DeleteIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  });

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
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <AccountBalanceIcon className="text-blue-500" />
              Budget Management
            </h2>
            <p className="text-gray-600 mt-1">
              Plan and track your monthly budgets
            </p>
            {isAdmin && (
              <span className="inline-flex items-center gap-1 text-sm text-purple-600 bg-purple-100 px-3 py-1 rounded-full mt-1">
                <AdminPanelSettingsIcon className="w-4 h-4" />
                Admin View - All Households
              </span>
            )}
            {user?.email && !isAdmin && (
              <p className="text-sm text-gray-500 mt-1">
                User: {user.email}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            <div className="flex items-center gap-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {MONTHS.map((month, index) => (
                  <option key={index} value={index}>{month}</option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {[2023, 2024, 2025, 2026, 2027].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <button
              onClick={exportReport}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <DownloadIcon className="w-5 h-5" />
              <span>Export</span>
            </button>
            <button
              onClick={() => {
                isFirstLoadRef.current = false;
                loadBudgets();
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
            >
              <RefreshIcon className="w-5 h-5" />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              <AddIcon className="w-5 h-5" />
              <span>Set Budget</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-purple-500">
            <p className="text-sm text-gray-500">Total Budget</p>
            <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.totalAllocated)}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-orange-500">
            <p className="text-sm text-gray-500">Spent</p>
            <p className="text-2xl font-bold text-orange-600">{formatCurrency(stats.totalSpent)}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-500">
            <p className="text-sm text-gray-500">Remaining</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalRemaining)}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-500">
            <p className="text-sm text-gray-500">Usage</p>
            <p className="text-2xl font-bold text-blue-600">{stats.overallPercentage.toFixed(1)}%</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-indigo-500">
            <p className="text-sm text-gray-500">Status</p>
            <p className="text-lg font-bold text-indigo-600 flex items-center gap-1">
              {getStatusBadge(stats.status)}
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search budgets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="all">All Categories</option>
                {BUDGET_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="all">All Status</option>
                <option value="on-track">On Track</option>
                <option value="approaching-limit">Approaching Limit</option>
                <option value="over-budget">Over Budget</option>
                <option value="under-budget">Under Budget</option>
              </select>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterCategory("all");
                  setFilterStatus("all");
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Budget Cards Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading budgets...</p>
            </div>
          </div>
        ) : filteredBudgets.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <AccountBalanceIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No budgets found</p>
            <p className="text-gray-400 text-sm mt-1">
              {searchTerm || filterCategory !== "all" || filterStatus !== "all"
                ? "Try adjusting your filters"
                : `Set your first budget for ${MONTHS[selectedMonth]} ${selectedYear}`}
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
            >
              <AddIcon className="w-5 h-5 inline mr-2" />
              Set Your First Budget
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBudgets.map((budget) => (
              <BudgetCard
                key={budget._id}
                budget={budget}
                onEdit={openEditModal}
                onDelete={(b) => {
                  setSelectedBudget(b);
                  setIsDeleteModalOpen(true);
                }}
                formatCurrency={formatCurrency}
                getStatusBadge={getStatusBadge}
                getStatusColor={getStatusColor}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Budget Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetForm();
        }}
        title="Set Budget"
      >
        <BudgetForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleAddBudget}
          submitLabel="Set Budget"
          isSubmitting={isSubmitting}
          categories={BUDGET_CATEGORIES}
          months={MONTHS}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onCancel={() => {
            setIsAddModalOpen(false);
            resetForm();
          }}
        />
      </Modal>

      {/* Edit Budget Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          resetForm();
        }}
        title="Edit Budget"
      >
        <BudgetForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleEditBudget}
          submitLabel="Update Budget"
          isSubmitting={isSubmitting}
          categories={BUDGET_CATEGORIES}
          months={MONTHS}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
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
          setSelectedBudget(null);
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
            budget:
          </p>
          <div className="mt-4 p-4 bg-gray-50 rounded-xl">
            <p className="font-semibold text-gray-800">
              {selectedBudget?.category || "N/A"}
            </p>
            <p className="text-sm text-gray-600">
              Allocated: {formatCurrency(selectedBudget?.allocatedAmount || 0)} - 
              Spent: {formatCurrency(selectedBudget?.spentAmount || 0)}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {MONTHS[selectedBudget?.month]} {selectedBudget?.year}
            </p>
          </div>

          <div className="flex justify-center space-x-3 mt-6">
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedBudget(null);
              }}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteBudget}
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