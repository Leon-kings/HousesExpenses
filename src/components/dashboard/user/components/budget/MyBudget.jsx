// 











/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

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
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
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
  "Other",
];

// Months
const MONTHS = [
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

// Currency formatter for RWF
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("rw-RW", {
    style: "currency",
    currency: "RWF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

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
                <h3 className="font-bold text-gray-800">{title}</h3>
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

// Memoized Budget Form Component with validation and motion
const BudgetForm = memo(
  ({
    formData,
    setFormData,
    onSubmit,
    submitLabel,
    isSubmitting,
    categories,
    onCancel,
    months,
    selectedMonth,
    selectedYear,
    errors,
    setErrors,
    isAdmin,
  }) => {
    const validateField = (name, value) => {
      let error = "";
      if (!value || value === "") {
        error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
      }
      if (name === "allocatedAmount" && value > 0 && isNaN(parseFloat(value))) {
        error = "Please enter a valid number";
      }
      if (name === "allocatedAmount" && parseFloat(value) < 0) {
        error = "Amount cannot be negative";
      }
      return error;
    };

    const handleBlur = (e) => {
      const { name, value } = e.target;
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    };

    return (
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 border ${errors.category ? "border-red-500" : "border-gray-300"} rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-1"
            >
              {errors.category}
            </motion.p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Allocated Amount (RWF) *
          </label>
          <input
            type="number"
            name="allocatedAmount"
            step="1"
            min="0"
            value={formData.allocatedAmount}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 border ${errors.allocatedAmount ? "border-red-500" : "border-gray-300"} rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
            placeholder="0"
            required
          />
          {errors.allocatedAmount && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-1"
            >
              {errors.allocatedAmount}
            </motion.p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Month
            </label>
            <select
              name="month"
              value={formData.month}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              {months.map((month, index) => (
                <option key={index} value={index}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year
            </label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
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
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            rows="2"
            placeholder="Additional notes about this budget"
          />
        </div>

        {/* User Name field - required for all users */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            User Name *
          </label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 border ${errors.userName ? "border-red-500" : "border-gray-300"} rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
            placeholder="Enter user name"
            required
          />
          {errors.userName && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-1"
            >
              {errors.userName}
            </motion.p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Enter the name of the user this budget belongs to
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isSubmitting ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-2"
              >
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Processing...</span>
              </motion.div>
            ) : (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {submitLabel}
              </motion.span>
            )}
          </motion.button>
        </div>
      </form>
    );
  },
);

export const MyBudget = () => {
  const navigate = useNavigate();
  const { userName } = useParams(); // Get userName from route params
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
  const [filterUserName, setFilterUserName] = useState(userName || ""); // Filter by user name
  const [selectedMonth, setSelectedMonth] = useState(-1); // -1 = All Months
  const [selectedYear, setSelectedYear] = useState(0); // 0 = All Years

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
    userName: "",
    email: "",
  });

  // Form errors
  const [errors, setErrors] = useState({
    category: "",
    allocatedAmount: "",
    userName: "",
  });

  // Refs
  const isFirstLoadRef = useRef(true);
  const isLoadingRef = useRef(false);

  // Check if user is admin
  const isAdmin = user?.role === "admin" || user?.role === "Admin";

  // Get user email
  const getUserEmail = useCallback(() => {
    return user?.email || "";
  }, [user]);

  // Redirect if no valid session
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = JSON.parse(localStorage.getItem("userData") || "null");

    if (!token || !userData) {
      navigate("/");
      return;
    }

    if (!user) setUser(userData);

    // Set user name in form data
    const targetUserName = userName || userData.name || "";
    setFilterUserName(targetUserName);

    // Set form data with user name and email
    if (targetUserName) {
      setFormData((prev) => ({
        ...prev,
        userName: targetUserName,
        email: userData.email || "",
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
      }));
    }

    // Load budgets only on initial mount
    if (isFirstLoadRef.current) {
      isFirstLoadRef.current = false;
      loadBudgets();
    }
  }, [navigate, userName]);

  // CRITICAL: Load budgets by email
  const loadBudgets = useCallback(async () => {
    // Prevent concurrent loads
    if (isLoadingRef.current) return;
    
    const userEmail = getUserEmail();
    const targetUserName = userName || user?.name || "";

    // If not admin and no email, show warning
    if (!isAdmin && !userEmail) {
      toast.warning("User email not found");
      return;
    }

    isLoadingRef.current = true;
    setIsLoading(true);

    try {
      let allBudgets = [];

      if (isAdmin) {
        // Admin can fetch all budgets with filters
        const params = {};

        // Only add month if NOT "All Months" (-1)
        if (selectedMonth !== -1) {
          params.month = selectedMonth;
        }

        // Only add year if NOT "All Years" (0)
        if (selectedYear !== 0) {
          params.year = selectedYear;
        }

        // Add category filter if selected
        if (filterCategory && filterCategory !== "all") {
          params.category = filterCategory;
        }

        console.log("Admin fetching all budgets with params:", params);
        const response = await api.get("/budgets", { params });

        if (response.data.success) {
          allBudgets = response.data.data || [];
        } else if (Array.isArray(response.data)) {
          allBudgets = response.data;
        } else {
          toast.warning("Unexpected response format");
          setIsLoading(false);
          isLoadingRef.current = false;
          return;
        }

        // Apply user name filter if specified
        if (filterUserName) {
          const filterName = filterUserName.toLowerCase();
          allBudgets = allBudgets.filter(b => {
            const budgetUserName = b.userName || b.user || "";
            return budgetUserName.toLowerCase().includes(filterName);
          });
          console.log(`✅ Filtered to ${allBudgets.length} budgets containing user name: "${filterUserName}"`);
        }

        console.log(`👑 Admin viewing ${allBudgets.length} budgets`);

      } else {
        // Non-admin: Fetch budgets by email using the email endpoint
        console.log(`🔍 Fetching budgets for email: ${userEmail}`);
        
        const response = await api.get(`/budgets/email/${userEmail}`);
        
        console.log("API Response:", response.data);

        if (response.data.success) {
          allBudgets = response.data.data || [];
        } else if (Array.isArray(response.data)) {
          allBudgets = response.data;
        } else {
          toast.warning("Unexpected response format");
          setIsLoading(false);
          isLoadingRef.current = false;
          return;
        }

        console.log(`✅ Found ${allBudgets.length} budgets for email: ${userEmail}`);

        // Apply month/year filtering client-side for non-admin
        let filteredData = allBudgets;

        // Month filter
        if (selectedMonth !== -1) {
          filteredData = filteredData.filter(b => b.month === selectedMonth);
        }

        // Year filter
        if (selectedYear !== 0) {
          filteredData = filteredData.filter(b => b.year === selectedYear);
        }

        // Category filter
        if (filterCategory && filterCategory !== "all") {
          filteredData = filteredData.filter(b => b.category === filterCategory);
        }

        allBudgets = filteredData;
        console.log(`✅ After client-side filtering: ${allBudgets.length} budgets`);
      }

      // Log unique users found for debugging
      const uniqueUsers = [...new Set(allBudgets.map(b => b.userName || b.user || "").filter(Boolean))];
      console.log("👥 All users found in budgets:", uniqueUsers);

      setBudgets(allBudgets);
      setFilteredBudgets(allBudgets);

      // Calculate stats
      calculateStats(allBudgets);

      // Show toast with count
      if (allBudgets.length > 0) {
        let filterInfo = "";
        if (selectedMonth !== -1) filterInfo += ` ${MONTHS[selectedMonth]}`;
        if (selectedYear !== 0) filterInfo += ` ${selectedYear}`;
        if (!isAdmin && targetUserName) filterInfo += ` for "${targetUserName}"`;
        else if (isAdmin && filterUserName) filterInfo += ` containing "${filterUserName}"`;
        if (!filterInfo) filterInfo = " (all budgets)";
        
        toast.success(`Loaded ${allBudgets.length} budgets${filterInfo}`);
      } else {
        let filterInfo = "";
        if (!isAdmin && targetUserName) filterInfo += ` for "${targetUserName}"`;
        else if (isAdmin && filterUserName) filterInfo += ` containing "${filterUserName}"`;
        
        toast.info(`No budgets found${filterInfo}`);
      }

    } catch (error) {
      console.error("Load budgets error:", error);
      
      if (error.response) {
        console.error("Error response:", error.response.data);
        
        if (error.response.status === 401) {
          toast.error("Session expired. Please login again.");
          navigate("/");
        } else if (error.response.status === 404) {
          toast.info("No budgets found for this user");
        } else {
          toast.error(error.response.data?.message || "Failed to load budgets");
        }
      } else if (error.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("An unexpected error occurred");
      }
      
      setBudgets([]);
      setFilteredBudgets([]);
      setStats({
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
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, [selectedMonth, selectedYear, filterCategory, filterUserName, user, isAdmin, userName, navigate, getUserEmail]);

  // Calculate stats
  const calculateStats = useCallback((budgetData) => {
    const totalAllocated = budgetData.reduce(
      (sum, b) => sum + (b.allocatedAmount || 0),
      0,
    );
    const totalSpent = budgetData.reduce(
      (sum, b) => sum + (b.spentAmount || 0),
      0,
    );
    const totalRemaining = totalAllocated - totalSpent;
    const overallPercentage =
      totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;

    const overBudgetCount = budgetData.filter(
      (b) => b.status === "over-budget",
    ).length;
    const approachingCount = budgetData.filter(
      (b) => b.status === "approaching-limit",
    ).length;
    const onTrackCount = budgetData.filter(
      (b) => b.status === "on-track",
    ).length;
    const underBudgetCount = budgetData.filter(
      (b) => b.status === "under-budget",
    ).length;

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

  // Filter budgets based on search term and status (client-side filtering)
  useEffect(() => {
    let filtered = [...budgets];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.category?.toLowerCase().includes(term) ||
          b.description?.toLowerCase().includes(term) ||
          (b.userName || b.user || "")?.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (filterStatus && filterStatus !== "all") {
      filtered = filtered.filter((b) => b.status === filterStatus);
    }

    setFilteredBudgets(filtered);
  }, [budgets, searchTerm, filterStatus]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    if (
      !formData.allocatedAmount ||
      parseFloat(formData.allocatedAmount) <= 0
    ) {
      newErrors.allocatedAmount = "Please enter a valid amount greater than 0";
    }
    if (!formData.userName || formData.userName.trim() === "") {
      newErrors.userName = "User name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle add budget
  const handleAddBudget = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const budgetData = {
        category: formData.category,
        allocatedAmount: parseFloat(formData.allocatedAmount),
        month: parseInt(formData.month),
        year: parseInt(formData.year),
        description: formData.description || "",
        userName: formData.userName.trim(),
        email: formData.email || user?.email || "",
      };

      console.log("Adding budget:", budgetData);

      const response = await api.post("/budgets", budgetData);

      if (response.data.success) {
        toast.success("Budget set successfully!");
        setIsAddModalOpen(false);
        resetForm();
        await loadBudgets();
      } else {
        toast.error(response.data.message || "Failed to set budget");
      }
    } catch (error) {
      console.error("Add budget error:", error);
      if (error.response?.status === 400) {
        toast.error(
          error.response?.data?.message ||
            "Budget may already exist for this category/month/user",
        );
      } else if (error.response?.status === 409) {
        toast.error("A budget for this category and month already exists for this user");
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

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const budgetData = {
        category: formData.category,
        allocatedAmount: parseFloat(formData.allocatedAmount),
        month: parseInt(formData.month),
        year: parseInt(formData.year),
        description: formData.description || "",
        userName: formData.userName.trim(),
        email: formData.email || user?.email || "",
      };

      console.log("Updating budget:", budgetData);

      const response = await api.put(
        `/budgets/${selectedBudget._id}`,
        budgetData,
      );

      if (response.data.success) {
        toast.success("Budget updated successfully!");
        setIsEditModalOpen(false);
        resetForm();
        await loadBudgets();
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
      console.log("Deleting budget:", selectedBudget._id);

      const response = await api.delete(`/budgets/${selectedBudget._id}`);

      if (response.data.success) {
        toast.success("Budget deleted successfully!");
        setIsDeleteModalOpen(false);
        setSelectedBudget(null);
        await loadBudgets();
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
    const targetUserName = userName || user?.name || "";
    setFormData({
      category: "",
      allocatedAmount: "",
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      description: "",
      userName: targetUserName,
      email: user?.email || "",
    });
    setErrors({ category: "", allocatedAmount: "", userName: "" });
    setSelectedBudget(null);
  }, [user, userName]);

  // Open edit modal
  const openEditModal = useCallback(
    (budget) => {
      setSelectedBudget(budget);
      setFormData({
        category: budget.category || "",
        allocatedAmount: budget.allocatedAmount?.toString() || "",
        month: budget.month || new Date().getMonth(),
        year: budget.year || new Date().getFullYear(),
        description: budget.description || "",
        userName: budget.userName || budget.user || "",
        email: budget.email || user?.email || "",
      });
      setErrors({ category: "", allocatedAmount: "", userName: "" });
      setIsEditModalOpen(true);
    },
    [user]
  );

  // Get status badge
  const getStatusBadge = useCallback((status) => {
    const statusConfig = {
      "on-track": {
        color: "bg-green-100 text-green-800",
        icon: <CheckCircleIcon className="w-3 h-3" />,
        label: "On Track",
      },
      "approaching-limit": {
        color: "bg-yellow-100 text-yellow-800",
        icon: <WarningIcon className="w-3 h-3" />,
        label: "Approaching Limit",
      },
      "over-budget": {
        color: "bg-red-100 text-red-800",
        icon: <CancelIcon className="w-3 h-3" />,
        label: "Over Budget",
      },
      "under-budget": {
        color: "bg-blue-100 text-blue-800",
        icon: <TrendingDownIcon className="w-3 h-3" />,
        label: "Under Budget",
      },
    };

    const config = statusConfig[status] || statusConfig["on-track"];
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}
      >
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
    const headers = [
      "User Name",
      "Category",
      "Allocated (RWF)",
      "Spent (RWF)",
      "Remaining (RWF)",
      "Used %",
      "Status",
      "Description",
      "Month",
      "Year",
    ];
    const rows = filteredBudgets.map((b) => [
      b.userName || b.user || "",
      b.category || "",
      b.allocatedAmount || 0,
      b.spentAmount || 0,
      b.remainingAmount || 0,
      `${b.percentageUsed?.toFixed(1) || 0}%`,
      b.status || "on-track",
      b.description || "",
      MONTHS[b.month] || "",
      b.year || "",
    ]);

    let csv = headers.join(",") + "\n";
    rows.forEach((row) => {
      csv += row.join(",") + "\n";
    });

    // Add summary
    csv += "\nSummary\n";
    let filterInfo = "";
    if (selectedMonth !== -1) filterInfo += ` ${MONTHS[selectedMonth]}`;
    if (selectedYear !== 0) filterInfo += ` ${selectedYear}`;
    if (userName) filterInfo += ` for "${userName}"`;
    if (!filterInfo) filterInfo = " All Budgets";
    
    csv += `Filter,${filterInfo}\n`;
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
    let filename = "budget-report";
    if (selectedMonth !== -1) filename += `-${MONTHS[selectedMonth]}`;
    if (selectedYear !== 0) filename += `-${selectedYear}`;
    if (userName) filename += `-${userName}`;
    a.download = `${filename}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("Report exported successfully!");
  }, [filteredBudgets, selectedMonth, selectedYear, stats, userName]);

  // Memoized Budget Card Component
  const BudgetCard = memo(
    ({ budget, onEdit, onDelete, getStatusBadge, getStatusColor }) => {
      const percentageUsed = budget.percentageUsed || 0;
      const status = budget.status || "on-track";
      const isOverBudget = status === "over-budget";

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 transition-all hover:shadow-xl ${
            status === "over-budget"
              ? "border-l-red-500"
              : status === "approaching-limit"
                ? "border-l-yellow-500"
                : status === "under-budget"
                  ? "border-l-blue-500"
                  : "border-l-green-500"
          }`}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">
                {budget.category}
              </h3>
              <p className="text-sm text-gray-500">
                {budget.description || "No description"}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <PersonIcon className="w-4 h-4 text-gray-400" />
                <p className="text-xs text-gray-500">
                  {budget.userName || budget.user || "No user"}
                </p>
              </div>
              <p className="text-xs text-gray-400">
                📅 {MONTHS[budget.month]} {budget.year}
              </p>
            </div>
            {getStatusBadge(status)}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                Budget: {formatCurrency(budget.allocatedAmount)}
              </span>
              <span className="text-gray-600">
                Spent: {formatCurrency(budget.spentAmount || 0)}
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${getStatusColor(status)}`}
                style={{ width: `${Math.min(percentageUsed, 100)}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-gray-500">
              <span>{percentageUsed.toFixed(1)}% used</span>
              <span
                className={
                  isOverBudget ? "text-red-500 font-medium" : "text-green-600"
                }
              >
                {isOverBudget
                  ? "⚠ Over Budget"
                  : `${formatCurrency(budget.remainingAmount || 0)} left`}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end mt-4 pt-3 border-t border-gray-100">
            <div className="flex space-x-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onEdit(budget)}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit"
              >
                <EditIcon className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(budget)}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <DeleteIcon className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      );
    },
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
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <AccountBalanceIcon className="text-blue-500" />
              My Budgets
            </h2>
            <p className="text-gray-600 mt-1">
              Plan and track your monthly budgets in RWF
            </p>
            {isAdmin && (
              <span className="inline-flex items-center gap-1 text-sm text-purple-600 bg-purple-100 px-3 py-1 rounded-full mt-1">
                <AdminPanelSettingsIcon className="w-4 h-4" />
                Admin View - All Households
              </span>
            )}
            {userName && !isAdmin && (
              <p className="text-sm text-gray-500 mt-1">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium">
                  👤 Viewing budgets for: {userName}
                </span>
              </p>
            )}
            {user?.email && !isAdmin && !userName && (
              <p className="text-sm text-gray-500 mt-1">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-medium">
                  📧 {user.email}
                </span>
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            <div className="flex items-center gap-2">
              <select
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(parseInt(e.target.value));
                  isFirstLoadRef.current = false;
                  setTimeout(() => loadBudgets(), 100);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="-1">📅 All Months</option>
                {MONTHS.map((month, index) => (
                  <option key={index} value={index}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(parseInt(e.target.value));
                  isFirstLoadRef.current = false;
                  setTimeout(() => loadBudgets(), 100);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="0">📅 All Years</option>
                {[2023, 2024, 2025, 2026, 2027].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportReport}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <DownloadIcon className="w-5 h-5" />
              <span>Export</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                isFirstLoadRef.current = false;
                loadBudgets();
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
            >
              <RefreshIcon className="w-5 h-5" />
              <span>Refresh</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              <AddIcon className="w-5 h-5" />
              <span>Set Budget</span>
            </motion.button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-purple-500"
          >
            <p className="text-sm text-gray-500">Total Budget</p>
            <p className="font-bold text-purple-600">
              {formatCurrency(stats.totalAllocated)}
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-orange-500"
          >
            <p className="text-sm text-gray-500">Spent</p>
            <p className="font-bold text-orange-600">
              {formatCurrency(stats.totalSpent)}
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-500"
          >
            <p className="text-sm text-gray-500">Remaining</p>
            <p className="font-bold text-green-600">
              {formatCurrency(stats.totalRemaining)}
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-500"
          >
            <p className="text-sm text-gray-500">Usage</p>
            <p className="font-bold text-blue-600">
              {(stats.overallPercentage || 0).toFixed(1)}%
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-indigo-500"
          >
            <p className="text-sm text-gray-500">Status</p>
            <p className="text-lg font-bold text-indigo-600 flex items-center gap-1">
              {getStatusBadge(stats.status)}
            </p>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search budgets by category, description, or user name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={filterCategory}
                onChange={(e) => {
                  setFilterCategory(e.target.value);
                  isFirstLoadRef.current = false;
                  setTimeout(() => loadBudgets(), 100);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="all">All Categories</option>
                {BUDGET_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
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

              {/* User Name filter for admin */}
              {isAdmin && (
                <input
                  type="text"
                  placeholder="Filter by user name..."
                  value={filterUserName}
                  onChange={(e) => {
                    setFilterUserName(e.target.value);
                    setTimeout(() => loadBudgets(), 100);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all min-w-[200px]"
                />
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSearchTerm("");
                  setFilterCategory("all");
                  setFilterStatus("all");
                  setFilterUserName("");
                  setSelectedMonth(-1);
                  setSelectedYear(0);
                  setTimeout(() => loadBudgets(), 100);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Clear All Filters
              </motion.button>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <AccountBalanceIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No budgets found</p>
            <p className="text-gray-400 text-sm mt-1">
              {searchTerm || filterCategory !== "all" || filterStatus !== "all" || filterUserName
                ? "Try adjusting your filters"
                : userName 
                  ? `No budgets found for "${userName}"` 
                  : "Set your first budget to get started"}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
            >
              <AddIcon className="w-5 h-5 inline mr-2" />
              Set Your First Budget
            </motion.button>
          </motion.div>
        ) : (
          <AnimatePresence>
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
                  getStatusBadge={getStatusBadge}
                  getStatusColor={getStatusColor}
                />
              ))}
            </div>
          </AnimatePresence>
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
          errors={errors}
          setErrors={setErrors}
          isAdmin={isAdmin}
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
          errors={errors}
          setErrors={setErrors}
          isAdmin={isAdmin}
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
              👤 {selectedBudget?.userName || selectedBudget?.user || "No user"}
            </p>
            <p className="text-sm text-gray-600">
              Allocated: {formatCurrency(selectedBudget?.allocatedAmount || 0)}{" "}
              - Spent: {formatCurrency(selectedBudget?.spentAmount || 0)}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              📅 {MONTHS[selectedBudget?.month]} {selectedBudget?.year}
            </p>
          </div>

          <div className="flex justify-center space-x-3 mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedBudget(null);
              }}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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
            </motion.button>
          </div>
        </div>
      </Modal>
    </div>
  );
};