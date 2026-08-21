
/* eslint-disable no-useless-assignment */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback, useRef, memo } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import RefreshIcon from "@mui/icons-material/Refresh";

// API Base URL
const API_URL = "https://household-expenses-management-system.onrender.com/api";

// Axios instance with auth token
const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`📤 ${config.method.toUpperCase()} ${config.url}`);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(`📥 Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error(
      "❌ API Error:",
      error.response?.status,
      error.response?.data || error.message,
    );
    return Promise.reject(error);
  },
);

// Memoized Expense Form Component
const ExpenseForm = memo(
  ({
    formData,
    setFormData,
    onSubmit,
    submitLabel,
    isLoading,
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
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
            Amount (RWF) *
          </label>
          <input
            type="number"
            step="1"
            min="1"
            value={formData.amount}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || /^\d+$/.test(value)) {
                setFormData({ ...formData, amount: value });
              }
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
          maxLength={100}
        />
        <p className="text-xs text-gray-500 mt-1">Max 100 characters</p>
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
  ),
);

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
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                {title}
              </h3>
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
  const { userEmail } = useParams();
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
  const [error, setError] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterUserEmail, setFilterUserEmail] = useState(userEmail || "");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Refs
  const isMountedRef = useRef(true);
  const dataLoadedRef = useRef(false);

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

  // User Modal states
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    description: "",
    category: "",
    type: "expense",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    user: "",
    email: "",
    userId: "",
  });

  // Categories
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
    "Bonus",
    "Other",
  ];

  // Months and years for filters
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // Stats summary
  const [stats, setStats] = useState({
    totalExpenses: 0,
    totalIncome: 0,
    netBalance: 0,
    expenseCount: 0,
    incomeCount: 0,
    userEmail: "",
    userName: "",
  });

  // Helper function to check if a transaction is income
  const isIncomeTransaction = (expense) => {
    // Check if category is in income categories
    const incomeCategories = ["Salary", "Bonus", "Freelance", "Investment"];
    if (incomeCategories.includes(expense.category)) {
      return true;
    }

    // Check by type field
    if (expense.type === "income") {
      return true;
    }

    // Check by source field (for API data)
    if (
      expense.source === "Job" ||
      expense.source === "Salary" ||
      expense.source === "Bonus"
    ) {
      return true;
    }

    return false;
  };

  // Calculate stats from expenses - FIXED to use income data for total income
  const calculateStats = (expensesData, incomeTotal = 0) => {
    let totalExpenses = 0;
    let expenseCount = 0;
    let incomeCount = 0;
    let userEmail = "";
    let userName = "";

    // Calculate expenses from the expenses data
    expensesData.forEach((exp) => {
      const isIncome = isIncomeTransaction(exp);

      if (isIncome) {
        incomeCount++;
      } else {
        totalExpenses += Number(exp.amount) || 0;
        expenseCount++;
      }

      // Get user info from first expense
      if (!userEmail && exp.email) {
        userEmail = exp.email;
        userName = exp.user || "";
      }
    });

    setStats({
      totalIncome: incomeTotal, // Use the incomeTotal from the API
      totalExpenses,
      netBalance: incomeTotal - totalExpenses,
      expenseCount,
      incomeCount,
      userEmail: userEmail || user?.email || "",
      userName: userName || user?.name || "",
    });
  };

  // Load expenses - FIXED: Fetch expenses and incomes separately
  const loadExpenses = useCallback(async () => {
    console.log("🔍 Starting loadExpenses...");

    if (!isMountedRef.current) {
      console.log("⚠️ Component unmounted, skipping load");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("authToken");
      console.log("🔑 Token present:", !!token);

      if (!token) {
        throw new Error("No authentication token found");
      }

      const userData = JSON.parse(localStorage.getItem("userData") || "null");

      // Get the email from URL param or user data
      let targetEmail = userEmail;

      // If no email in URL, use the logged-in user's email
      if (!targetEmail) {
        targetEmail = userData?.email || "";
      }

      console.log("📧 Target email for filtering:", targetEmail);

      if (!targetEmail) {
        toast.warning("No email found to filter expenses");
        setExpenses([]);
        setFilteredExpenses([]);
        calculateStats([], 0);
        setIsLoading(false);
        return;
      }

      // Fetch expenses
      console.log("📤 Fetching expenses...");
      const expensesResponse = await api.get(
        `/expenses?email=${encodeURIComponent(targetEmail)}`,
      );

      // Fetch incomes (only for statistics)
      console.log("📤 Fetching incomes for statistics...");
      const incomesResponse = await api.get(
        `/incomes/email/${encodeURIComponent(targetEmail)}`,
      );

      console.log("📦 Expenses response status:", expensesResponse.status);
      console.log("📦 Incomes response status:", incomesResponse.status);

      let allExpenses = [];
      let incomeTotal = 0;
      let incomeCount = 0;

      // Process expenses
      if (expensesResponse.data) {
        if (
          expensesResponse.data.success === true &&
          expensesResponse.data.data &&
          Array.isArray(expensesResponse.data.data)
        ) {
          allExpenses = expensesResponse.data.data;
          console.log(`✅ Found ${allExpenses.length} expenses from API`);
        } else if (Array.isArray(expensesResponse.data)) {
          allExpenses = expensesResponse.data;
          console.log(
            `✅ Found ${allExpenses.length} expenses as direct array`,
          );
        }
      }

      // Process incomes (only for statistics, not for display)
      if (incomesResponse.data) {
        let incomes = [];
        if (
          incomesResponse.data.success === true &&
          incomesResponse.data.data &&
          Array.isArray(incomesResponse.data.data)
        ) {
          incomes = incomesResponse.data.data;
          console.log(`✅ Found ${incomes.length} incomes from API`);
        } else if (Array.isArray(incomesResponse.data)) {
          incomes = incomesResponse.data;
          console.log(`✅ Found ${incomes.length} incomes as direct array`);
        }

        // Calculate total income from the incomes data
        incomeTotal = incomes.reduce(
          (sum, inc) => sum + (Number(inc.amount) || 0),
          0,
        );
        incomeCount = incomes.length;
        console.log(`💰 Total income from API: ${incomeTotal}`);
        console.log(`💰 Income count: ${incomeCount}`);
      }

      console.log(`📋 Total expenses: ${allExpenses.length}`);
      console.log(`📋 Total income (from incomes API): ${incomeTotal}`);

      if (allExpenses.length === 0 && incomeTotal === 0) {
        console.warn(`⚠️ No transactions found for email: ${targetEmail}`);
        setExpenses([]);
        setFilteredExpenses([]);
        calculateStats([], 0);
        toast.info(`No transactions found for ${targetEmail}`);
        setIsLoading(false);
        return;
      }

      // Set the expenses data (only expenses, not incomes)
      setExpenses(allExpenses);
      setFilteredExpenses(allExpenses);

      // Calculate stats with the income total from the incomes API
      calculateStats(allExpenses, incomeTotal);
      dataLoadedRef.current = true;

      toast.success(
        `Loaded ${allExpenses.length} expenses, Total Income: RWF ${incomeTotal.toLocaleString()}`,
      );
    } catch (error) {
      console.error("❌ Load expenses error:", error);

      if (!isMountedRef.current) return;

      let errorMessage = "Failed to load expenses";

      if (error.response) {
        console.error(
          "Server response:",
          error.response.status,
          error.response.data,
        );

        if (error.response.status === 401) {
          errorMessage = "Authentication failed. Please log in again.";
          localStorage.removeItem("authToken");
          localStorage.removeItem("userData");
          setTimeout(() => navigate("/"), 2000);
        } else if (error.response.status === 403) {
          errorMessage = "You don't have permission to view expenses.";
        } else {
          errorMessage =
            error.response.data?.message ||
            `Server error: ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else {
        errorMessage = error.message || "An unexpected error occurred";
      }

      setError(errorMessage);
      toast.error(errorMessage);

      setExpenses([]);
      setFilteredExpenses([]);
      calculateStats([], 0);
    } finally {
      setIsLoading(false);
    }
  }, [navigate, userEmail]);

  // Apply client-side filters
  const applyFilters = useCallback(() => {
    let filtered = [...expenses];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (exp) =>
          (exp.description && exp.description.toLowerCase().includes(term)) ||
          (exp.category && exp.category.toLowerCase().includes(term)) ||
          (exp.user && exp.user.toLowerCase().includes(term)) ||
          (exp.email && exp.email.toLowerCase().includes(term)),
      );
    }

    if (filterCategory && filterCategory !== "all") {
      filtered = filtered.filter((exp) => exp.category === filterCategory);
    }

    if (filterType && filterType !== "all") {
      filtered = filtered.filter((exp) => {
        const isIncome = isIncomeTransaction(exp);

        if (filterType === "income") return isIncome;
        if (filterType === "expense") return !isIncome;
        return true;
      });
    }

    if (filterUserEmail) {
      const emailFilter = filterUserEmail.toLowerCase();
      filtered = filtered.filter(
        (exp) => exp.email && exp.email.toLowerCase().includes(emailFilter),
      );
    }

    if (filterMonth) {
      filtered = filtered.filter((exp) => {
        if (!exp.date) return false;
        const expDate = new Date(exp.date);
        const expMonth = String(expDate.getMonth() + 1).padStart(2, "0");
        return expMonth === filterMonth;
      });
    }

    if (filterYear) {
      filtered = filtered.filter((exp) => {
        if (!exp.date) return false;
        const expDate = new Date(exp.date);
        return String(expDate.getFullYear()) === filterYear;
      });
    }

    setFilteredExpenses(filtered);
    // Recalculate stats with the filtered data, but keep the income total from the API
    // We need to get the income total from the stats
    const currentIncomeTotal = stats.totalIncome;
    calculateStats(filtered, currentIncomeTotal);
  }, [
    expenses,
    searchTerm,
    filterCategory,
    filterType,
    filterUserEmail,
    filterMonth,
    filterYear,
    stats.totalIncome,
  ]);

  // Apply filters when expenses or filter values change
  useEffect(() => {
    if (dataLoadedRef.current) {
      applyFilters();
    }
  }, [
    searchTerm,
    filterCategory,
    filterType,
    filterUserEmail,
    filterMonth,
    filterYear,
    expenses,
    applyFilters,
  ]);

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm("");
    setFilterCategory("all");
    setFilterType("all");
    setFilterUserEmail(userEmail || "");
    setFilterMonth("");
    setFilterYear("");
    toast.info("All filters cleared");
  };

  // INITIAL LOAD
  useEffect(() => {
    console.log("🚀 Component mounted, starting initial load...");

    const token = localStorage.getItem("authToken");
    const userData = JSON.parse(localStorage.getItem("userData") || "null");

    console.log("🔐 Auth token:", token ? "Present" : "Missing");
    console.log("👤 User data:", userData);

    if (!token || !userData) {
      console.log("❌ No token or user data, redirecting to login");
      navigate("/");
      return;
    }

    setUser(userData);

    const targetEmail = userEmail || userData.email || "";
    setFilterUserEmail(targetEmail);

    setFormData((prev) => ({
      ...prev,
      user: userData.name || "",
      email: userData.email || "",
      userId: userData.id || userData._id || "",
    }));

    console.log("📊 Calling loadExpenses...");
    loadExpenses();

    loadNotifications();

    return () => {
      console.log("🧹 Component unmounting");
      isMountedRef.current = false;
    };
  }, [userEmail]);

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

  // Fetch user by ID
  const fetchUserById = async (userId) => {
    if (!userId) {
      toast.error("User ID is required");
      return;
    }

    setIsUserLoading(true);
    setSelectedUserId(userId);
    setUserData(null);

    try {
      console.log(`📤 Fetching user with ID: ${userId}`);
      const response = await api.get(`/users/${userId}`);

      console.log("📦 User response:", response.data);

      let userInfo = null;

      if (response.data) {
        if (response.data.success === true && response.data.data) {
          userInfo = response.data.data;
        } else if (response.data._id || response.data.id) {
          userInfo = response.data;
        } else if (
          response.data.data &&
          (response.data.data._id || response.data.data.id)
        ) {
          userInfo = response.data.data;
        } else if (
          response.data.user &&
          (response.data.user._id || response.data.user.id)
        ) {
          userInfo = response.data.user;
        } else if (
          typeof response.data === "object" &&
          response.data !== null
        ) {
          userInfo = response.data;
        }
      }

      if (userInfo && (userInfo._id || userInfo.id)) {
        console.log("✅ User data loaded successfully:", userInfo);
        setUserData(userInfo);
        setIsUserModalOpen(true);
        toast.success(`Loaded user: ${userInfo.name || userInfo.email}`);
      } else {
        console.error("❌ No valid user data found in response");
        toast.error("User not found or invalid data format");
      }
    } catch (error) {
      console.error("❌ Fetch user error:", error);

      let errorMessage = "Failed to fetch user details";

      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "User not found";
        } else {
          errorMessage =
            error.response.data?.message ||
            `Server error: ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else {
        errorMessage = error.message || "An unexpected error occurred";
      }

      toast.error(errorMessage);
    } finally {
      setIsUserLoading(false);
    }
  };

  // Handle add expense
  const handleAddExpense = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const amountValue = Number(formData.amount);
    if (!Number.isInteger(amountValue) || amountValue <= 0) {
      toast.error("Amount must be a positive whole number (no decimals)");
      setIsSubmitting(false);
      return;
    }

    if (!categories.includes(formData.category)) {
      toast.error("Invalid category selected");
      setIsSubmitting(false);
      return;
    }

    try {
      const expenseData = {
        description: formData.description.trim(),
        category: formData.category,
        type: formData.type,
        amount: amountValue,
        date: formData.date,
        user: formData.user.trim() || user?.name || "Unknown",
        email: formData.email || user?.email || "",
        userId: formData.userId || user?.id || user?._id || "",
      };

      console.log("📤 Creating expense with data:", expenseData);

      // Choose endpoint based on type
      const endpoint = formData.type === "income" ? "/incomes" : "/expenses";
      const response = await api.post(endpoint, expenseData);

      console.log("📥 Create response:", response.data);

      if (response.data.success) {
        toast.success(
          `${formData.type === "income" ? "Income" : "Expense"} added successfully!`,
        );
        setIsAddModalOpen(false);
        resetForm();
        // Refresh the page by reloading expenses
        await loadExpenses();
        // Force a re-render by updating the state
        setExpenses((prev) => [...prev]);
      } else {
        toast.error(response.data.message || "Failed to add transaction");
      }
    } catch (error) {
      console.error("❌ Add expense error:", error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to add transaction. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit expense
  const handleEditExpense = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const amountValue = Number(formData.amount);
    if (!Number.isInteger(amountValue) || amountValue <= 0) {
      toast.error("Amount must be a positive whole number (no decimals)");
      setIsSubmitting(false);
      return;
    }

    if (!categories.includes(formData.category)) {
      toast.error("Invalid category selected");
      setIsSubmitting(false);
      return;
    }

    try {
      const expenseData = {
        description: formData.description.trim(),
        category: formData.category,
        type: formData.type,
        amount: amountValue,
        date: formData.date,
        user: formData.user.trim() || user?.name || "Unknown",
        email: formData.email || user?.email || "",
        userId: formData.userId || user?.id || user?._id || "",
      };

      console.log("📤 Updating expense with data:", expenseData);

      // Choose endpoint based on type
      const isIncome = isIncomeTransaction(selectedExpense);
      const endpoint = isIncome ? "/incomes" : "/expenses";
      const response = await api.put(
        `${endpoint}/${selectedExpense._id}`,
        expenseData,
      );

      console.log("📥 Update response:", response.data);

      if (response.data.success) {
        toast.success(
          `${isIncome ? "Income" : "Expense"} updated successfully!`,
        );
        setIsEditModalOpen(false);
        resetForm();
        // Refresh the page by reloading expenses
        await loadExpenses();
        // Force a re-render by updating the state
        setExpenses((prev) => [...prev]);
      } else {
        toast.error(response.data.message || "Failed to update transaction");
      }
    } catch (error) {
      console.error("❌ Update expense error:", error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update transaction. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete expense
  const handleDeleteExpense = async () => {
    setIsSubmitting(true);

    try {
      // Choose endpoint based on type
      const isIncome = isIncomeTransaction(selectedExpense);
      const endpoint = isIncome ? "/incomes" : "/expenses";
      const response = await api.delete(`${endpoint}/${selectedExpense._id}`);

      if (response.data.success) {
        toast.success(
          `${isIncome ? "Income" : "Expense"} deleted successfully!`,
        );
        setIsDeleteModalOpen(false);
        setSelectedExpense(null);
        // Refresh the page by reloading expenses
        await loadExpenses();
        // Force a re-render by updating the state
        setExpenses((prev) => [...prev]);
      } else {
        toast.error(response.data.message || "Failed to delete transaction");
      }
    } catch (error) {
      console.error("❌ Delete expense error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete transaction",
      );
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
      userId: user?.id || user?._id || "",
    });
    setSelectedExpense(null);
  }, [user]);

  // Open edit modal
  const openEditModal = useCallback(
    (expense) => {
      setSelectedExpense(expense);
      const isIncome = isIncomeTransaction(expense);

      setFormData({
        description: expense.description || "",
        category: expense.category || "",
        type: isIncome ? "income" : "expense",
        amount: expense.amount ? expense.amount.toString() : "",
        date: expense.date
          ? expense.date.split("T")[0]
          : new Date().toISOString().split("T")[0],
        user: expense.user || user?.name || "",
        email: expense.email || user?.email || "",
        userId: expense.userId || user?.id || user?._id || "",
      });
      setIsEditModalOpen(true);
    },
    [user],
  );

  // Open delete modal
  const openDeleteModal = useCallback((expense) => {
    setSelectedExpense(expense);
    setIsDeleteModalOpen(true);
  }, []);

  // Generate PDF Report
  const generatePDFReport = useCallback(() => {
    const dataToExport =
      filteredExpenses.length > 0 ? filteredExpenses : expenses;

    if (dataToExport.length === 0) {
      toast.warning("No transactions to export");
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, pageWidth, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("HEMS - My Expenses Report", 14, 25);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    const today = new Date();
    doc.text(
      `Generated: ${today.toLocaleDateString()} ${today.toLocaleTimeString()}`,
      14,
      50,
    );
    doc.text(`User Email: ${stats.userEmail || userEmail || "N/A"}`, 14, 60);
    doc.text(`User Name: ${stats.userName || user?.name || "N/A"}`, 14, 70);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Summary", 14, 85);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const summaryData = [
      ["Total Income", `RWF ${stats.totalIncome.toFixed(0)}`],
      ["Total Expenses", `RWF ${stats.totalExpenses.toFixed(0)}`],
      ["Net Balance", `RWF ${stats.netBalance.toFixed(0)}`],
      ["Total Transactions", `${dataToExport.length}`],
      ["Income Transactions", `${stats.incomeCount}`],
      ["Expense Transactions", `${stats.expenseCount}`],
    ];

    let yPos = 95;
    summaryData.forEach(([label, value]) => {
      doc.text(`${label}:`, 20, yPos);
      doc.text(value, 80, yPos);
      yPos += 8;
    });

    yPos += 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Transaction Details", 14, yPos);

    yPos += 10;
    const tableData = dataToExport.map((e) => {
      const isIncome = isIncomeTransaction(e);
      return [
        e.date ? new Date(e.date).toLocaleDateString() : "N/A",
        e.description || "N/A",
        e.category || "N/A",
        isIncome ? "Income" : "Expense",
        e.user || "N/A",
        `RWF ${e.amount ? e.amount.toFixed(0) : "0"}`,
      ];
    });

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

    doc.save(
      `hems-expenses-${stats.userEmail || userEmail || "user"}-${today.toISOString().split("T")[0]}.pdf`,
    );
    toast.success("PDF Report downloaded successfully!");
  }, [expenses, filteredExpenses, stats, user, userEmail]);

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

  // Debug stats
  useEffect(() => {
    if (expenses.length > 0 || stats.totalIncome > 0) {
      console.log("📊 Final stats:", stats);
      console.log("📊 Total Income:", stats.totalIncome);
      console.log("📊 Total Expenses:", stats.totalExpenses);
      console.log("📊 Net Balance:", stats.netBalance);
    }
  }, [expenses, stats]);

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

  const displayExpenses =
    filteredExpenses.length > 0 ? filteredExpenses : expenses;

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
            {stats.userEmail && (
              <p className="text-sm text-gray-500 mt-1">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium">
                  📧 {stats.userEmail}
                </span>
                {stats.userName && (
                  <span className="ml-2 bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-medium">
                    👤 {stats.userName}
                  </span>
                )}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              Total: {expenses.length} expenses | Showing:{" "}
              {displayExpenses.length}
              {stats.totalIncome > 0 && (
                <span className="ml-2 text-green-600 font-medium">
                  | Total Income: {formatCurrency(stats.totalIncome)}
                </span>
              )}
              {stats.totalExpenses > 0 && (
                <span className="ml-2 text-red-600 font-medium">
                  | Total Expenses: {formatCurrency(stats.totalExpenses)}
                </span>
              )}
            </p>
            {error && <p className="text-sm text-red-500 mt-1">⚠️ {error}</p>}
          </div>
          <div className="flex flex-wrap gap-2 mt-3 sm:mt-0">
            <button
              onClick={() => loadExpenses()}
              disabled={isLoading}
              className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 text-sm sm:text-base"
            >
              <RefreshIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Refresh</span>
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
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  Total Income
                </p>
                <p className="text-base sm:text-xs font-bold text-green-600 truncate">
                  {formatCurrency(stats.totalIncome)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {stats.incomeCount} transactions
                </p>
              </div>
              <TrendingUpIcon className="w-8 h-8 sm:w-10 sm:h-10 text-green-500 bg-green-100 p-1.5 sm:p-2 rounded-full flex-shrink-0" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  Total Expenses
                </p>
                <p className="text-base sm:text-xs font-bold text-red-600 truncate">
                  {formatCurrency(stats.totalExpenses)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {stats.expenseCount} transactions
                </p>
              </div>
              <TrendingDownIcon className="w-8 h-8 sm:w-10 sm:h-10 text-red-500 bg-red-100 p-1.5 sm:p-2 rounded-full flex-shrink-0" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  Net Balance
                </p>
                <p
                  className={`text-base sm:text-xs font-bold truncate ${stats.netBalance >= 0 ? "text-blue-600" : "text-red-600"}`}
                >
                  {formatCurrency(stats.netBalance)}
                </p>
              </div>
              <AttachMoneyIcon className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500 bg-blue-100 p-1.5 sm:p-2 rounded-full flex-shrink-0" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  Transactions
                </p>
                <p className="text-base sm:text-xs font-bold text-purple-600 truncate">
                  {displayExpenses.length}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {stats.userEmail ? `User: ${stats.userEmail}` : ""}
                </p>
              </div>
              <ReceiptIcon className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500 bg-purple-100 p-1.5 sm:p-2 rounded-full flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search by description, category, or user..."
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
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-1 px-3 sm:px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm sm:text-base"
                >
                  <FilterListIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Filters</span>
                  {(filterUserEmail || filterMonth || filterYear) && (
                    <span className="ml-1 bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {
                        [filterUserEmail, filterMonth, filterYear].filter(
                          Boolean,
                        ).length
                      }
                    </span>
                  )}
                </button>

                {(filterUserEmail ||
                  filterMonth ||
                  filterYear ||
                  searchTerm ||
                  filterCategory !== "all" ||
                  filterType !== "all") && (
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center space-x-1 px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors text-sm sm:text-base"
                  >
                    <ClearIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Email
                  </label>
                  <input
                    type="text"
                    placeholder="Enter email..."
                    value={filterUserEmail}
                    onChange={(e) => setFilterUserEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Month
                  </label>
                  <select
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">All Months</option>
                    {months.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Year
                  </label>
                  <select
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">All Years</option>
                    {years.map((year) => (
                      <option key={year} value={String(year)}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}
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
              <p className="text-gray-500 text-lg">No expenses found</p>
              <p className="text-gray-400 text-sm mt-1">
                {expenses.length > 0
                  ? "Try adjusting your filters"
                  : "Add a new expense to get started"}
              </p>
              {error && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                  <button
                    onClick={() => loadExpenses()}
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold">
                      Date
                    </th>
                    <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold">
                      Description
                    </th>
                    <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold">
                      Category
                    </th>
                    <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold">
                      Type
                    </th>
                    <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold">
                      User
                    </th>
                    <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold">
                      Email
                    </th>
                    <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold">
                      User ID
                    </th>
                    <th className="text-right py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold">
                      Amount (RWF)
                    </th>
                    <th className="text-center py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayExpenses.map((expense, index) => {
                    const isIncome = isIncomeTransaction(expense);
                    return (
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
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                              isIncome
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {expense.category || "Uncategorized"}
                          </span>
                        </td>
                        <td className="py-2 sm:py-3 px-3 sm:px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                              isIncome
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {isIncome ? "Income" : "Expense"}
                          </span>
                        </td>
                        <td className="py-2 sm:py-3 px-3 sm:px-4 text-gray-600 text-xs sm:text-sm">
                          {expense.user || "Unknown"}
                        </td>
                        <td className="py-2 sm:py-3 px-3 sm:px-4 text-gray-600 text-xs sm:text-sm">
                          {expense.email || "N/A"}
                        </td>
                        <td className="py-2 sm:py-3 px-3 sm:px-4 text-gray-600 text-xs sm:text-sm">
                          <button
                            onClick={() => fetchUserById(expense.userId)}
                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium cursor-pointer transition-colors"
                            title="Click to view user details"
                          >
                            {expense.userId
                              ? String(expense.userId).substring(0, 10) + "..."
                              : "N/A"}
                          </button>
                        </td>
                        <td
                          className={`py-2 sm:py-3 px-3 sm:px-4 text-right font-semibold text-xs sm:text-sm ${
                            isIncome ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {isIncome ? "+" : "-"}
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
                    );
                  })}
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

      {/* User Details Modal */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false);
          setUserData(null);
          setSelectedUserId(null);
        }}
        title="User Details"
        size="md"
      >
        {isUserLoading ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading user details...</p>
          </div>
        ) : userData ? (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <PersonIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {userData.name || "N/A"}
                </h3>
                <p className="text-gray-600">{userData.email || "No email"}</p>
                {userData.role && (
                  <span
                    className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                      userData.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {userData.role.charAt(0).toUpperCase() +
                      userData.role.slice(1)}
                  </span>
                )}
                {userData.isVerified !== undefined && (
                  <span
                    className={`inline-block ml-2 mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                      userData.isVerified
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {userData.isVerified
                      ? "✅ Verified"
                      : "⏳ Pending Verification"}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 text-gray-600">
                  <BadgeIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">User ID</span>
                </div>
                <p className="mt-1 text-gray-800 font-mono text-sm break-all">
                  {userData._id || userData.id || "N/A"}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 text-gray-600">
                  <EmailIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">Email</span>
                </div>
                <p className="mt-1 text-gray-800">{userData.email || "N/A"}</p>
              </div>

              {userData.phone && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <PhoneIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">Phone</span>
                  </div>
                  <p className="mt-1 text-gray-800">{userData.phone}</p>
                </div>
              )}

              {userData.address && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <HomeIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">Address</span>
                  </div>
                  <p className="mt-1 text-gray-800">{userData.address}</p>
                </div>
              )}

              {userData.createdAt && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <CalendarTodayIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">Joined</span>
                  </div>
                  <p className="mt-1 text-gray-800">
                    {new Date(userData.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>

            {userData.bio && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">{userData.bio}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>No user data found</p>
          </div>
        )}
      </Modal>
    </div>
  );
};
