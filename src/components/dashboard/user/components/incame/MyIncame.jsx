
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
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WarningIcon from "@mui/icons-material/Warning";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
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

// Income Categories - matches the model's enum
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
  "Other",
];

// Frequency options for recurring income
const FREQUENCY_OPTIONS = ["weekly", "biweekly", "monthly", "quarterly", "annually"];

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

// Memoized Income Form Component - matches Income model
const IncomeForm = memo(
  ({
    formData,
    setFormData,
    onSubmit,
    submitLabel,
    isSubmitting,
    categories,
    onCancel,
  }) => (
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
          maxLength={200}
        />
        <p className="text-xs text-gray-500 mt-1">Max 200 characters</p>
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
            Source
          </label>
          <input
            type="text"
            value={formData.source}
            onChange={(e) =>
              setFormData({ ...formData, source: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="Income source (e.g., Company name)"
            maxLength={100}
          />
          <p className="text-xs text-gray-500 mt-1">Max 100 characters</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (RWF) *
          </label>
          <input
            type="number"
            step="1"
            min="0"
            value={formData.amount}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || /^\d+$/.test(value)) {
                setFormData({ ...formData, amount: value });
              }
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="0"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Whole numbers only (no decimals)
          </p>
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
          User Name *
        </label>
        <input
          type="text"
          value={formData.user}
          onChange={(e) => setFormData({ ...formData, user: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-gray-50"
          placeholder="Enter user name"
          required
          maxLength={100}
          readOnly
        />
        <p className="text-xs text-gray-500 mt-1">Auto-filled from your profile</p>
      </div>

      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.isRecurring}
            onChange={(e) =>
              setFormData({ ...formData, isRecurring: e.target.checked })
            }
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700">Recurring Income</span>
        </label>

        {formData.isRecurring && (
          <select
            value={formData.frequency}
            onChange={(e) =>
              setFormData({ ...formData, frequency: e.target.value })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {FREQUENCY_OPTIONS.map((freq) => (
              <option key={freq} value={freq}>
                {freq.charAt(0).toUpperCase() + freq.slice(1)}
              </option>
            ))}
          </select>
        )}
      </div>

      <input type="hidden" value={formData.email} />
      <input type="hidden" value={formData.userId} />

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
  ),
);

export const MyIncome = () => {
  const navigate = useNavigate();
  const { userName } = useParams();
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
  const [filterUserName, setFilterUserName] = useState("");
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth().toString());
  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());

  // Refs
  const searchTermRef = useRef(searchTerm);
  const filterCategoryRef = useRef(filterCategory);
  const selectedMonthRef = useRef(new Date().getMonth());
  const selectedYearRef = useRef(new Date().getFullYear());
  const isFirstLoadRef = useRef(true);
  const isLoadingRef = useRef(false);

  // Stats
  const [stats, setStats] = useState({
    totalIncome: 0,
    monthlyIncome: 0,
    averageIncome: 0,
    incomeCount: 0,
    topIncomeSource: "",
  });

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data - matches Income model
  const [formData, setFormData] = useState({
    description: "",
    category: "",
    source: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    user: "",
    email: "",
    userId: "",
    isRecurring: false,
    frequency: "monthly",
  });

  // Check if user is admin
  const isAdmin = user?.role === "admin" || user?.role === "Admin";

  // Get user email
  const getUserEmail = useCallback(() => {
    return user?.email || "";
  }, [user]);

  // Get user ID
  const getUserId = useCallback(() => {
    return user?.id || user?._id || "";
  }, [user]);

  // Get user name
  const getUserName = useCallback(() => {
    return user?.name || "";
  }, [user]);

  // Get month name
  const getMonthName = useCallback((month) => {
    const months = [
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

    const targetUserName = userName || userData.name || "";
    setFilterUserName(targetUserName);

    const userEmail = userData.email || "";
    const userId = userData.id || userData._id || "";
    const displayName = targetUserName || userData.name || "";

    setFormData((prev) => ({
      ...prev,
      email: userEmail,
      userId: userId,
      user: displayName,
    }));

    if (isFirstLoadRef.current) {
      isFirstLoadRef.current = false;
      loadIncomes();
    }
  }, [navigate, userName, user]);

  // Load incomes
  const loadIncomes = useCallback(async () => {
    if (isLoadingRef.current) return;

    const userId = getUserId();

    if (!userId && !isAdmin) {
      toast.warning("User ID not found");
      return;
    }

    isLoadingRef.current = true;
    setIsLoading(true);

    try {
      const params = {};
      
      if (!isAdmin && userId) {
        params.userId = userId;
      }

      if (selectedMonthRef.current !== undefined) {
        params.month = selectedMonthRef.current;
      }
      if (selectedYearRef.current !== undefined) {
        params.year = selectedYearRef.current;
      }

      const response = await api.get("/incomes", { params });

      let allIncomes = [];

      if (response.data.success) {
        allIncomes = response.data.data || [];
      } else if (Array.isArray(response.data)) {
        allIncomes = response.data;
      } else {
        toast.warning("Unexpected response format");
        setIsLoading(false);
        isLoadingRef.current = false;
        return;
      }

      console.log(`✅ Found ${allIncomes.length} total incomes`);

      let filteredData = allIncomes;

      const category = filterCategoryRef.current;
      const search = searchTermRef.current;

      if (category && category !== "all") {
        filteredData = filteredData.filter((inc) => inc.category === category);
      }

      if (search) {
        const searchLower = search.toLowerCase();
        filteredData = filteredData.filter(
          (inc) =>
            (inc.description &&
              inc.description.toLowerCase().includes(searchLower)) ||
            (inc.category &&
              inc.category.toLowerCase().includes(searchLower)) ||
            (inc.source && inc.source.toLowerCase().includes(searchLower)) ||
            (inc.user && inc.user.toLowerCase().includes(searchLower)),
        );
      }

      setIncomes(filteredData);
      setFilteredIncomes(filteredData);
      calculateStats(filteredData);

      if (filteredData.length === 0 && !isAdmin) {
        toast.info("No incomes found");
      }
    } catch (error) {
      console.error("Load incomes error:", error);
      toast.error(error.response?.data?.message || "Failed to load incomes");
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, [getUserId, isAdmin]);

  // Calculate stats
  const calculateStats = useCallback(
    (incomeData) => {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const monthlyIncomes = incomeData.filter((inc) => {
        const date = new Date(inc.date);
        return (
          date.getMonth() === currentMonth && date.getFullYear() === currentYear
        );
      });

      const totalIncome = incomeData.reduce(
        (sum, inc) => sum + (inc.amount || 0),
        0,
      );
      const monthlyIncome = monthlyIncomes.reduce(
        (sum, inc) => sum + (inc.amount || 0),
        0,
      );
      const averageIncome =
        incomeData.length > 0 ? totalIncome / incomeData.length : 0;

      // Find top income source
      const sourceMap = {};
      incomeData.forEach((inc) => {
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
        topIncomeSource: topSource,
      });
    },
    [],
  );

  // Handle search and filter
  useEffect(() => {
    searchTermRef.current = searchTerm;
    filterCategoryRef.current = filterCategory;
    selectedMonthRef.current = parseInt(filterMonth);
    selectedYearRef.current = parseInt(filterYear);

    const timer = setTimeout(() => {
      if (!isFirstLoadRef.current) {
        loadIncomes();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [
    searchTerm,
    filterCategory,
    filterMonth,
    filterYear,
    loadIncomes,
  ]);

  // Filter incomes based on month/year
  useEffect(() => {
    let filtered = [...incomes];

    if (filterMonth !== undefined && filterYear !== undefined) {
      const month = parseInt(filterMonth);
      const year = parseInt(filterYear);
      filtered = filtered.filter((inc) => {
        const date = new Date(inc.date);
        return (
          date.getMonth() === month &&
          date.getFullYear() === year
        );
      });
    }

    setFilteredIncomes(filtered);
  }, [incomes, filterMonth, filterYear]);

  // Handle add income
  const handleAddIncome = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const amountValue = Number(formData.amount);
    if (!Number.isInteger(amountValue) || amountValue <= 0) {
      toast.error("Amount must be a positive whole number (no decimals)");
      setIsSubmitting(false);
      return;
    }

    try {
      const incomeData = {
        description: formData.description.trim(),
        category: formData.category || formData.source,
        source: formData.source || formData.category,
        amount: amountValue,
        date: formData.date,
        user: formData.user || getUserName() || "Unknown",
        email: formData.email || getUserEmail() || "",
        userId: formData.userId || getUserId() || "",
        isRecurring: formData.isRecurring || false,
        frequency: formData.frequency || "monthly",
      };

      if (!incomeData.userId) {
        toast.error("User ID is required");
        setIsSubmitting(false);
        return;
      }

      const response = await api.post("/incomes", incomeData);

      if (response.data.success) {
        toast.success("Income added successfully!");
        setIsAddModalOpen(false);
        resetForm();
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

    const amountValue = Number(formData.amount);
    if (!Number.isInteger(amountValue) || amountValue <= 0) {
      toast.error("Amount must be a positive whole number (no decimals)");
      setIsSubmitting(false);
      return;
    }

    try {
      const incomeData = {
        description: formData.description.trim(),
        category: formData.category || formData.source,
        source: formData.source || formData.category,
        amount: amountValue,
        date: formData.date,
        user: formData.user || getUserName() || "Unknown",
        email: formData.email || getUserEmail() || "",
        userId: formData.userId || getUserId() || "",
        isRecurring: formData.isRecurring || false,
        frequency: formData.frequency || "monthly",
      };

      const response = await api.put(
        `/incomes/${selectedIncome._id}`,
        incomeData,
      );

      if (response.data.success) {
        toast.success("Income updated successfully!");
        setIsEditModalOpen(false);
        resetForm();
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

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      description: "",
      category: "",
      source: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      user: getUserName() || filterUserName || "",
      email: getUserEmail() || "",
      userId: getUserId() || "",
      isRecurring: false,
      frequency: "monthly",
    });
    setSelectedIncome(null);
  }, [getUserName, getUserEmail, getUserId, filterUserName]);

  // Open edit modal
  const openEditModal = useCallback(
    (income) => {
      setSelectedIncome(income);
      setFormData({
        description: income.description || "",
        category: income.category || income.source || "",
        source: income.source || income.category || "",
        amount: income.amount?.toString() || "",
        date: income.date
          ? income.date.split("T")[0]
          : new Date().toISOString().split("T")[0],
        user: income.user || getUserName() || filterUserName || "",
        email: income.email || getUserEmail() || "",
        userId: income.userId || getUserId() || "",
        isRecurring: income.isRecurring || false,
        frequency: income.frequency || "monthly",
      });
      setIsEditModalOpen(true);
    },
    [getUserName, getUserEmail, getUserId, filterUserName],
  );

  // Format currency
  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
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

  // Generate report
  const generateReport = useCallback(() => {
    setIsReportModalOpen(true);
  }, []);

  // Export report data
  const exportReport = useCallback(() => {
    const data = {
      user: userName || getUserName() || "All Users",
      generatedDate: new Date().toISOString(),
      stats,
      incomes: filteredIncomes,
    };

    // Create CSV
    const headers = [
      "Date",
      "Description",
      "Category",
      "Source",
      "Amount (RWF)",
      "User",
    ];
    const rows = filteredIncomes.map((inc) => [
      formatDate(inc.date),
      inc.description || "",
      inc.category || "",
      inc.source || "",
      inc.amount || 0,
      inc.user || "",
    ]);

    let csv = headers.join(",") + "\n";
    rows.forEach((row) => {
      csv += row.join(",") + "\n";
    });

    // Download
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `income-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("Report exported successfully!");
    setIsReportModalOpen(false);
  }, [filteredIncomes, stats, userName, getUserName, formatDate]);

  // Get display data
  const displayIncomes = filteredIncomes.length > 0 ? filteredIncomes : incomes;

  // Memoized Income Table Row
  const IncomeRow = memo(
    ({
      income,
      index,
      formatDate,
      formatCurrency,
      openEditModal,
      setSelectedIncome,
      setIsDeleteModalOpen,
    }) => (
      <motion.tr
        key={income._id || index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
      >
        <td className="py-3 px-4 text-gray-600 text-sm">
          {formatDate(income.date)}
        </td>
        <td className="py-3 px-4 text-gray-800 font-medium">
          {income.description || "N/A"}
        </td>
        <td className="py-3 px-4">
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            {income.category || income.source || "Uncategorized"}
          </span>
        </td>
        <td className="py-3 px-4 text-gray-600 text-sm">
          {income.source || "N/A"}
        </td>
        <td className="py-3 px-4 text-gray-600 text-sm">
          {income.user || "Unknown"}
        </td>
        <td className="py-3 px-4 text-right font-semibold text-green-600">
          +{formatCurrency(income.amount)}
        </td>
        <td className="py-3 px-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => openEditModal(income)}
              className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit"
            >
              <EditIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setSelectedIncome(income);
                setIsDeleteModalOpen(true);
              }}
              className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <DeleteIcon className="w-5 h-5" />
            </button>
          </div>
        </td>
      </motion.tr>
    ),
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
              <AttachMoneyIcon className="text-green-500" />
              My Income
            </h2>
            <p className="text-gray-600 mt-1">
              Track and manage your income records
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
                  👤 Viewing incomes for: {userName}
                </span>
              </p>
            )}
            {getUserEmail() && !isAdmin && !userName && (
              <p className="text-sm text-gray-500 mt-1">User: {getUserEmail()}</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              <AddIcon className="w-5 h-5" />
              <span>Add Income</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Income</p>
                <p className="text-xs font-bold text-green-600">
                  {formatCurrency(stats.totalIncome)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {stats.incomeCount} transactions
                </p>
              </div>
             
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Monthly Income</p>
                <p className="text-xs font-bold text-blue-600">
                  {formatCurrency(stats.monthlyIncome)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {getMonthName(parseInt(filterMonth))} {filterYear}
                </p>
              </div>
             
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Average Income</p>
                <p className="text-xs font-bold text-purple-600">
                  {formatCurrency(stats.averageIncome)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Per transaction
                </p>
              </div>
            
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Top Source</p>
                <p className="text-xs font-bold text-orange-600 truncate">
                  {stats.topIncomeSource}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Highest earning category
                </p>
              </div>
              
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search income records..."
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
                  {INCOME_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <select
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i}>
                      {getMonthName(i)}
                    </option>
                  ))}
                </select>

                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  {[2023, 2024, 2025, 2026, 2027].map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterCategory("all");
                    setFilterMonth(new Date().getMonth().toString());
                    setFilterYear(new Date().getFullYear().toString());
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Income Table */}
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading incomes...</p>
            </div>
          ) : displayIncomes.length === 0 ? (
            <div className="p-12 text-center">
              <AttachMoneyIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                No income records found
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {userName
                  ? `No incomes found for "${userName}"`
                  : "Click 'Add Income' to start tracking your earnings"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-green-500 to-green-600 text-white">
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
                      Source
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">
                      User
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold">
                      Amount (RWF)
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold">
                      Actions
                    </th>
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

      {/* Report Modal */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Income Report"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-xl">
              <p className="text-sm text-gray-500">Total Income</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.totalIncome)}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl">
              <p className="text-sm text-gray-500">Monthly Income</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(stats.monthlyIncome)}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl">
              <p className="text-sm text-gray-500">Average Income</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(stats.averageIncome)}
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-xl">
              <p className="text-sm text-gray-500">Top Source</p>
              <p className="text-2xl font-bold text-orange-600 truncate">
                {stats.topIncomeSource}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Recent Incomes</h4>
            <div className="max-h-40 overflow-y-auto">
              {displayIncomes.slice(0, 5).map((income, index) => (
                <div
                  key={index}
                  className="flex justify-between py-2 border-b border-gray-100"
                >
                  <span className="text-sm">{income.description || "N/A"}</span>
                  <span className="text-sm font-semibold text-green-600">
                    +{formatCurrency(income.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsReportModalOpen(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
  
          </div>
        </div>
      </Modal>
    </div>
  );
};