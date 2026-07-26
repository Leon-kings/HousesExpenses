/* eslint-disable react-hooks/static-components */
/* eslint-disable react-hooks/preserve-manual-memoization */
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
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SavingsIcon from "@mui/icons-material/Savings";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonIcon from "@mui/icons-material/Person";
import BarChartIcon from "@mui/icons-material/BarChart";
import DownloadIcon from "@mui/icons-material/Download";

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

// Income Categories
const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Business",
  "Investment",
  "Rental",
  "Dividends",
  "Gifts",
  "Bonus",
  "Commission",
  "Pension",
  "Social Security",
  "Other"
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
      )}
    </AnimatePresence>
  );
});

// Memoized Income Form Component
const IncomeForm = memo(({ 
  formData, 
  setFormData, 
  onSubmit, 
  submitLabel, 
  isSubmitting,
  categories,
  onCancel
}) => (
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
          Source
        </label>
        <input
          type="text"
          value={formData.source}
          onChange={(e) => setFormData({ ...formData, source: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Income source"
        />
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

    <div className="flex items-center space-x-4">
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={formData.isRecurring}
          onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
        <span className="text-sm text-gray-700">Recurring Income</span>
      </label>

      {formData.isRecurring && (
        <select
          value={formData.frequency}
          onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="weekly">Weekly</option>
          <option value="biweekly">Bi-weekly</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="annually">Annually</option>
        </select>
      )}
    </div>

    <input type="hidden" value={formData.email} />

    <div className="flex flex-col xs:flex-row justify-end gap-2 xs:gap-3 pt-4">
      <button
        type="button"
        onClick={onCancel}
        className="w-full xs:w-auto px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full xs:w-auto px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base"
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

// Memoized Income Table Row
const IncomeRow = memo(({ income, index, formatDate, formatCurrency, openEditModal, setSelectedIncome, setIsDeleteModalOpen }) => (
  <motion.tr
    key={income._id || index}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
  >
    <td className="py-2 sm:py-3 px-3 sm:px-4 text-gray-600 text-xs sm:text-sm">
      {formatDate(income.date)}
    </td>
    <td className="py-2 sm:py-3 px-3 sm:px-4 text-gray-800 font-medium text-xs sm:text-sm truncate max-w-[80px] sm:max-w-none">
      {income.description || "N/A"}
    </td>
    <td className="py-2 sm:py-3 px-3 sm:px-4">
      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium whitespace-nowrap">
        {income.category || income.source || "Uncategorized"}
      </span>
    </td>
    <td className="py-2 sm:py-3 px-3 sm:px-4 text-gray-600 text-xs sm:text-sm">
      {income.source || "N/A"}
    </td>
    <td className="py-2 sm:py-3 px-3 sm:px-4 text-right font-semibold text-xs sm:text-sm text-green-600">
      +{formatCurrency(income.amount)}
    </td>
    <td className="py-2 sm:py-3 px-3 sm:px-4 text-center">
      <div className="flex items-center justify-center space-x-1 sm:space-x-2">
        <button
          onClick={() => openEditModal(income)}
          className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Edit"
        >
          <EditIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={() => {
            setSelectedIncome(income);
            setIsDeleteModalOpen(true);
          }}
          className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete"
        >
          <DeleteIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </td>
  </motion.tr>
));

export const MyIncome = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("userData") || "null");
    } catch {
      return null;
    }
  });

  // State for incomes
  const [incomes, setIncomes] = useState([]);
  const [filteredIncomes, setFilteredIncomes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Refs to track current filter values without causing re-renders
  const searchTermRef = useRef(searchTerm);
  const filterCategoryRef = useRef(filterCategory);
  const selectedMonthRef = useRef(selectedMonth);
  const selectedYearRef = useRef(selectedYear);
  const isFirstLoadRef = useRef(true);
  const isLoadingRef = useRef(false);

  // Stats
  const [stats, setStats] = useState({
    totalIncome: 0,
    monthlyIncome: 0,
    averageIncome: 0,
    incomeCount: 0,
    topIncomeSource: ""
  });

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    description: "",
    category: "",
    source: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    user: "",
    email: "",
    isRecurring: false,
    frequency: "monthly"
  });

  // User is always a regular user for this component
  const isAdmin = false;

  // Get month name
  const getMonthName = useCallback((month) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[month] || "";
  }, []);

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
        user: userData.name || "" 
      }));
    }
    
    // Load data only on initial mount
    if (isFirstLoadRef.current) {
      isFirstLoadRef.current = false;
      loadIncomes();
    }
  }, [navigate]);

  // Load incomes from API using /email/:email endpoint
  const loadIncomes = useCallback(async () => {
    // Prevent concurrent loads
    if (isLoadingRef.current) return;
    
    if (!user?.email) {
      toast.warning("User email not found");
      return;
    }

    isLoadingRef.current = true;
    setIsLoading(true);
    
    try {
      // Use refs to get current values
      const search = searchTermRef.current;
      const category = filterCategoryRef.current;
      
      // Regular user - use /email/:email endpoint
      const url = `/incomes/email/${user.email}`;
      const params = {};

      if (category && category !== "all") {
        params.category = category;
      }

      if (search) {
        params.search = search;
      }

      const response = await api.get(url, { params });
      
      if (response.data.success) {
        const incomeData = response.data.data || [];
        setIncomes(incomeData);
        setFilteredIncomes(incomeData);
        calculateStats(incomeData);
      } else if (Array.isArray(response.data)) {
        setIncomes(response.data);
        setFilteredIncomes(response.data);
        calculateStats(response.data);
      } else {
        toast.warning("Unexpected response format");
      }
    } catch (error) {
      console.error("Load incomes error:", error);
      toast.error(error.response?.data?.message || "Failed to load incomes");
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, [user?.email]);

  // Calculate stats
  const calculateStats = useCallback((incomeData) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyIncomes = incomeData.filter(inc => {
      const date = new Date(inc.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const totalIncome = incomeData.reduce((sum, inc) => sum + (inc.amount || 0), 0);
    const monthlyIncome = monthlyIncomes.reduce((sum, inc) => sum + (inc.amount || 0), 0);
    const averageIncome = incomeData.length > 0 ? totalIncome / incomeData.length : 0;

    // Find top income source
    const sourceMap = {};
    incomeData.forEach(inc => {
      const source = inc.category || inc.source || "Other";
      sourceMap[source] = (sourceMap[source] || 0) + (inc.amount || 0);
    });
    let topSource = "N/A";
    let maxAmount = 0;
    Object.entries(sourceMap).forEach(([source, amount]) => {
      if (amount > maxAmount) {
        maxAmount = amount;
        topSource = source;
      }
    });

    setStats({
      totalIncome,
      monthlyIncome,
      averageIncome,
      incomeCount: incomeData.length,
      topIncomeSource: topSource
    });
  }, []);

  // Handle search and filter - update refs and trigger load with debounce
  useEffect(() => {
    // Update refs with current values
    searchTermRef.current = searchTerm;
    filterCategoryRef.current = filterCategory;
    selectedMonthRef.current = selectedMonth;
    selectedYearRef.current = selectedYear;

    // Debounce the load - only after user stops interacting
    const timer = setTimeout(() => {
      // Skip if this is the initial load
      if (!isFirstLoadRef.current) {
        loadIncomes();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, filterCategory, selectedMonth, selectedYear, loadIncomes]);

  // Filter incomes based on month/year (client-side filtering)
  useEffect(() => {
    let filtered = [...incomes];

    // Month filter
    if (selectedMonth !== undefined && selectedYear !== undefined) {
      filtered = filtered.filter(inc => {
        const date = new Date(inc.date);
        return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
      });
    }

    setFilteredIncomes(filtered);
  }, [incomes, selectedMonth, selectedYear]);

  // Handle add income
  const handleAddIncome = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const incomeData = {
        description: formData.description,
        category: formData.category || formData.source,
        source: formData.source || formData.category,
        amount: parseFloat(formData.amount),
        date: formData.date,
        user: formData.user || user?.name || "Unknown",
        email: formData.email || user?.email,
        isRecurring: formData.isRecurring,
        frequency: formData.frequency
      };

      const response = await api.post("/incomes", incomeData);
      
      if (response.data.success) {
        toast.success("Income added successfully!");
        setIsAddModalOpen(false);
        resetForm();
        // Reload after adding
        setTimeout(() => loadIncomes(), 100);
      } else {
        toast.error(response.data.message || "Failed to add income");
      }
    } catch (error) {
      console.error("Add income error:", error);
      toast.error(error.response?.data?.message || "Failed to add income");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit income
  const handleEditIncome = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const incomeData = {
        description: formData.description,
        category: formData.category || formData.source,
        source: formData.source || formData.category,
        amount: parseFloat(formData.amount),
        date: formData.date,
        user: formData.user || user?.name || "Unknown",
        email: formData.email || user?.email,
        isRecurring: formData.isRecurring,
        frequency: formData.frequency
      };

      const response = await api.put(`/incomes/${selectedIncome._id}`, incomeData);
      
      if (response.data.success) {
        toast.success("Income updated successfully!");
        setIsEditModalOpen(false);
        resetForm();
        // Reload after updating
        setTimeout(() => loadIncomes(), 100);
      } else {
        toast.error(response.data.message || "Failed to update income");
      }
    } catch (error) {
      console.error("Update income error:", error);
      toast.error(error.response?.data?.message || "Failed to update income");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete income
  const handleDeleteIncome = async () => {
    setIsSubmitting(true);

    try {
      const response = await api.delete(`/incomes/${selectedIncome._id}`);
      
      if (response.data.success) {
        toast.success("Income deleted successfully!");
        setIsDeleteModalOpen(false);
        setSelectedIncome(null);
        // Reload after deleting
        setTimeout(() => loadIncomes(), 100);
      } else {
        toast.error(response.data.message || "Failed to delete income");
      }
    } catch (error) {
      console.error("Delete income error:", error);
      toast.error(error.response?.data?.message || "Failed to delete income");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset forms
  const resetForm = useCallback(() => {
    setFormData({
      description: "",
      category: "",
      source: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      user: user?.name || "",
      email: user?.email || "",
      isRecurring: false,
      frequency: "monthly"
    });
    setSelectedIncome(null);
  }, [user]);

  // Open edit modal
  const openEditModal = useCallback((income) => {
    setSelectedIncome(income);
    setFormData({
      description: income.description || "",
      category: income.category || income.source || "",
      source: income.source || income.category || "",
      amount: income.amount?.toString() || "",
      date: income.date ? income.date.split("T")[0] : new Date().toISOString().split("T")[0],
      user: income.user || user?.name || "",
      email: income.email || user?.email || "",
      isRecurring: income.isRecurring || false,
      frequency: income.frequency || "monthly"
    });
    setIsEditModalOpen(true);
  }, [user]);

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

  // Get display data
  const displayIncomes = filteredIncomes.length > 0 ? filteredIncomes : incomes;

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
              <AttachMoneyIcon className="text-green-500 text-2xl sm:text-3xl" />
              My Income
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Track and manage your personal income
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
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
            >
              <AddIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Add Income</span>
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
                <p className="text-xs text-gray-400 mt-1">
                  {stats.incomeCount} transactions
                </p>
              </div>
              <TrendingUpIcon className="w-8 h-8 sm:w-10 sm:h-10 text-green-500 bg-green-100 p-1.5 sm:p-2 rounded-full flex-shrink-0" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 truncate">Monthly Income</p>
                <p className="text-base sm:text-2xl font-bold text-blue-600 truncate">
                  {formatCurrency(stats.monthlyIncome)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {getMonthName(selectedMonth)} {selectedYear}
                </p>
              </div>
              <CalendarTodayIcon className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500 bg-blue-100 p-1.5 sm:p-2 rounded-full flex-shrink-0" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 truncate">Average Income</p>
                <p className="text-base sm:text-2xl font-bold text-purple-600 truncate">
                  {formatCurrency(stats.averageIncome)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Per transaction
                </p>
              </div>
              <AccountBalanceIcon className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500 bg-purple-100 p-1.5 sm:p-2 rounded-full flex-shrink-0" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 truncate">Top Source</p>
                <p className="text-base sm:text-xl font-bold text-orange-600 truncate">
                  {stats.topIncomeSource}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Highest earning category
                </p>
              </div>
              <BarChartIcon className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500 bg-orange-100 p-1.5 sm:p-2 rounded-full flex-shrink-0" />
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
                placeholder="Search income records..."
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
                {INCOME_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>{getMonthName(i)}</option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {[2023, 2024, 2025, 2026, 2027].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterCategory("all");
                }}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Income Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading incomes...</p>
            </div>
          ) : displayIncomes.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <AttachMoneyIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No income records found</p>
              <p className="text-gray-400 text-sm mt-1">
                Click "Add Income" to start tracking your earnings
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
                    <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold">Source</th>
                    <th className="text-right py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold">Amount</th>
                    <th className="text-center py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayIncomes.map((income, index) => (
                    <IncomeRow
                      key={income._id || index}
                      income={income}
                      index={index}
                      formatDate={formatDate}
                      formatCurrency={formatCurrency}
                      openEditModal={openEditModal}
                      setSelectedIncome={setSelectedIncome}
                      setIsDeleteModalOpen={setIsDeleteModalOpen}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Income Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetForm();
        }}
        title="Add New Income"
      >
        <IncomeForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleAddIncome}
          submitLabel="Add Income"
          isSubmitting={isSubmitting}
          categories={INCOME_CATEGORIES}
          onCancel={() => {
            setIsAddModalOpen(false);
            resetForm();
          }}
        />
      </Modal>

      {/* Edit Income Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          resetForm();
        }}
        title="Edit Income"
      >
        <IncomeForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleEditIncome}
          submitLabel="Update Income"
          isSubmitting={isSubmitting}
          categories={INCOME_CATEGORIES}
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
          setSelectedIncome(null);
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
            income record:
          </p>
          <div className="mt-4 p-4 bg-gray-50 rounded-xl">
            <p className="font-semibold text-gray-800">
              {selectedIncome?.description || "N/A"}
            </p>
            <p className="text-sm text-gray-600">
              {formatCurrency(selectedIncome?.amount || 0)} -{" "}
              {selectedIncome?.category || "Uncategorized"}
            </p>
          </div>

          <div className="flex justify-center space-x-3 mt-6">
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedIncome(null);
              }}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteIncome}
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