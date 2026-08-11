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
import ErrorIcon from "@mui/icons-material/Error";
import CancelIcon from "@mui/icons-material/Cancel";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

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
  if (config.method === "put" || config.method === "post") {
    console.log(
      `📤 ${config.method.toUpperCase()} ${config.url} data:`,
      JSON.stringify(config.data, null, 2),
    );
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

// Expense Categories (matching your expense model)
const EXPENSE_CATEGORIES = [
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

// ============================================================
// SUCCESS MODAL COMPONENT
// ============================================================
const SuccessModal = memo(({ isOpen, onClose, title, message, details }) => {
  if (!isOpen) return null;

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
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="w-12 h-12 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
              <p className="text-gray-600">{message}</p>
              {details && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl text-left">
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {details}
                  </p>
                </div>
              )}
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// ============================================================
// ERROR/FAIL MODAL COMPONENT
// ============================================================
const ErrorModal = memo(({ isOpen, onClose, title, message, details }) => {
  if (!isOpen) return null;

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
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ErrorIcon className="w-12 h-12 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
              <p className="text-gray-600">{message}</p>
              {details && (
                <div className="mt-4 p-4 bg-red-50 rounded-xl text-left">
                  <p className="text-sm text-red-700 whitespace-pre-line">
                    {details}
                  </p>
                </div>
              )}
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// ============================================================
// CONFIRM MODAL COMPONENT
// ============================================================
const ConfirmModal = memo(
  ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    isSubmitting = false,
    type = "danger",
  }) => {
    if (!isOpen) return null;

    const colors = {
      danger: {
        icon: WarningIcon,
        iconColor: "text-red-500",
        bgColor: "bg-red-100",
        buttonColor: "bg-red-500 hover:bg-red-600",
      },
      warning: {
        icon: WarningIcon,
        iconColor: "text-yellow-500",
        bgColor: "bg-yellow-100",
        buttonColor: "bg-yellow-500 hover:bg-yellow-600",
      },
      info: {
        icon: CheckCircleIcon,
        iconColor: "text-blue-500",
        bgColor: "bg-blue-100",
        buttonColor: "bg-blue-500 hover:bg-blue-600",
      },
    };

    const colorConfig = colors[type] || colors.danger;
    const IconComponent = colorConfig.icon;

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
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 text-center">
                <div
                  className={`w-20 h-20 ${colorConfig.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <IconComponent
                    className={`w-12 h-12 ${colorConfig.iconColor}`}
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {title}
                </h3>
                <p className="text-gray-600 whitespace-pre-line">{message}</p>

                <div className="flex justify-center space-x-3 mt-6">
                  <button
                    onClick={onClose}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {cancelLabel}
                  </button>
                  <button
                    onClick={onConfirm}
                    disabled={isSubmitting}
                    className={`px-6 py-2 text-white rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 ${colorConfig.buttonColor}`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>{confirmLabel}</span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  },
);

// ============================================================
// MEMOIZED MODAL COMPONENT
// ============================================================
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

// ============================================================
// MEMOIZED BUDGET FORM COMPONENT
// ============================================================
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

        {isAdmin ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
              placeholder="user@example.com"
              required
            />
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.email}
              </motion.p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Enter the email of the user this budget belongs to
            </p>
          </div>
        ) : (
          <input type="hidden" name="email" value={formData.email} />
        )}

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
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              <span>{submitLabel}</span>
            )}
          </motion.button>
        </div>
      </form>
    );
  },
);

// ============================================================
// EXPENSE CONTRIBUTION FORM
// ============================================================
const ExpenseContributionForm = memo(
  ({
    selectedBudget,
    expenseData,
    setExpenseData,
    onSubmit,
    isSubmitting,
    formatCurrency,
    onCancel,
    categories,
  }) => {
    return (
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <p className="text-sm text-gray-600">
            Budget:{" "}
            <span className="font-semibold">{selectedBudget?.category}</span>
          </p>
          <p className="text-sm text-gray-600">
            Allocated: {formatCurrency(selectedBudget?.allocatedAmount || 0)}
          </p>
          <p className="text-sm text-gray-600">
            Spent: {formatCurrency(selectedBudget?.spentAmount || 0)}
          </p>
          <p className="text-sm font-semibold text-blue-600">
            Remaining: {formatCurrency(selectedBudget?.remainingAmount || 0)}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expense Description *
          </label>
          <input
            type="text"
            name="description"
            value={expenseData.description}
            onChange={(e) =>
              setExpenseData({ ...expenseData, description: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="What did you spend on?"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            name="category"
            value={expenseData.category}
            onChange={(e) =>
              setExpenseData({ ...expenseData, category: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
            Amount (RWF) *
          </label>
          <input
            type="number"
            name="amount"
            step="1"
            min="1"
            value={expenseData.amount}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || /^\d+$/.test(value)) {
                setExpenseData({ ...expenseData, amount: value });
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
            User Name *
          </label>
          <input
            type="text"
            name="user"
            value={expenseData.user}
            onChange={(e) =>
              setExpenseData({ ...expenseData, user: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="Your name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={expenseData.date}
            onChange={(e) =>
              setExpenseData({ ...expenseData, date: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
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
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              <>
                <AttachMoneyIcon className="w-5 h-5" />
                <span>Add Expense</span>
              </>
            )}
          </motion.button>
        </div>
      </form>
    );
  },
);

// ============================================================
// MAIN BUDGET MANAGEMENT COMPONENT
// ============================================================
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
  const [filterEmail, setFilterEmail] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(-1);
  const [selectedYear, setSelectedYear] = useState(0);

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
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ============================================================
  // SUCCESS/ERROR/CONFIRM MODAL STATES
  // ============================================================
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    details: "",
  });

  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    details: "",
  });

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    type: "danger",
    confirmLabel: "Confirm",
  });

  // Form data
  const [formData, setFormData] = useState({
    category: "",
    allocatedAmount: "",
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    description: "",
    email: "",
    userId: "",
  });

  // Expense form data
  const [expenseData, setExpenseData] = useState({
    description: "",
    category: "",
    amount: "",
    user: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Form errors
  const [errors, setErrors] = useState({
    category: "",
    allocatedAmount: "",
    email: "",
  });

  // Refs
  const isFirstLoadRef = useRef(true);

  // Check if user is admin
  const isAdmin = user?.role === "admin" || user?.role === "Admin";

  // ============================================================
  // SHOW MODAL HELPERS
  // ============================================================
  const showSuccess = useCallback((title, message, details = "") => {
    setSuccessModal({ isOpen: true, title, message, details });
  }, []);

  const showError = useCallback((title, message, details = "") => {
    setErrorModal({ isOpen: true, title, message, details });
  }, []);

  const showConfirm = useCallback(
    (title, message, onConfirm, type = "danger", confirmLabel = "Confirm") => {
      setConfirmModal({
        isOpen: true,
        title,
        message,
        onConfirm,
        type,
        confirmLabel,
      });
    },
    [],
  );

  // ============================================================
  // GET USER ID - Returns valid MongoDB ObjectId
  // ============================================================
  const getUserId = useCallback(() => {
    let userId = "";

    // Try to get from user state
    if (user) {
      userId = user?.id || user?._id || user?.userId || "";
    }

    // If not found, try from localStorage
    if (!userId) {
      try {
        const userData = JSON.parse(localStorage.getItem("userData") || "null");
        if (userData) {
          userId = userData.id || userData._id || userData.userId || "";
        }
      } catch (e) {
        console.error("Error reading from localStorage:", e);
      }
    }

    // Validate that it's a proper ObjectId (24 hex chars)
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(userId);

    console.log("🔑 Getting userId:", userId);
    console.log("🔑 UserId length:", userId?.length);
    console.log("🔑 Is valid ObjectId?:", isValidObjectId);

    // If not a valid ObjectId, try to get it from the user's email
    if (!isValidObjectId && userId) {
      console.warn("⚠️ UserId is not a valid MongoDB ObjectId format:", userId);
      console.warn("⚠️ This will cause validation errors on the backend");
    }

    return userId;
  }, [user]);

  const getValidUserIdOrThrow = useCallback(() => {
    const userId = getUserId();
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(userId);

    if (!userId) {
      console.error("❌ No userId found");
      throw new Error("User ID not found. Please log out and log in again.");
    }

    if (!isValidObjectId) {
      console.error("❌ Invalid userId format:", userId);
      console.error("❌ Expected a 24-character hex string");
      throw new Error(
        "Invalid user ID format. Please log out and log in again.",
      );
    }

    return userId;
  }, [getUserId]);

  // ============================================================
  // INITIALIZATION
  // ============================================================
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = JSON.parse(localStorage.getItem("userData") || "null");

    if (!token || !userData) {
      navigate("/");
      return;
    }

    if (!user) setUser(userData);

    if (userData?.email) {
      const userId = userData.id || userData._id || userData.userId || "";
      setFormData((prev) => ({
        ...prev,
        email: userData.email,
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        userId: userId,
      }));
      console.log("🔑 User ID set in form:", userId);
      console.log("🔑 Is valid ObjectId?:", /^[0-9a-fA-F]{24}$/.test(userId));
    }

    if (isFirstLoadRef.current) {
      isFirstLoadRef.current = false;
      loadBudgets();
    }
  }, [navigate, isAdmin]);

  // ============================================================
  // LOAD BUDGETS
  // ============================================================
  const loadBudgets = useCallback(async () => {
    setIsLoading(true);

    try {
      const params = {};

      if (selectedMonth !== -1) {
        params.month = selectedMonth;
      }

      if (selectedYear !== 0) {
        params.year = selectedYear;
      }

      if (filterCategory && filterCategory !== "all") {
        params.category = filterCategory;
      }

      if (filterEmail && filterEmail.trim() !== "") {
        params.email = filterEmail.trim();
      }

      console.log("📤 Loading budgets with params:", params);

      const response = await api.get("/budgets", { params });

      console.log("📦 Budgets response:", response.data);

      if (response.data.success) {
        const budgetData = response.data.data || [];
        setBudgets(budgetData);
        setFilteredBudgets(budgetData);

        if (response.data.summary) {
          setStats(response.data.summary);
        } else {
          calculateStats(budgetData);
        }

        if (budgetData.length > 0) {
          let filterInfo = "";
          if (selectedMonth !== -1) filterInfo += ` ${MONTHS[selectedMonth]}`;
          if (selectedYear !== 0) filterInfo += ` ${selectedYear}`;
          if (filterEmail) filterInfo += ` for ${filterEmail}`;
          if (!filterInfo) filterInfo = " (all budgets)";

          toast.success(`Loaded ${budgetData.length} budgets${filterInfo}`);
        } else {
          toast.info("No budgets found");
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

      if (error.response) {
        if (error.response.status === 401) {
          toast.error("Session expired. Please login again.");
          navigate("/");
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
    }
  }, [selectedMonth, selectedYear, filterCategory, filterEmail, navigate]);

  // ============================================================
  // CALCULATE STATS
  // ============================================================
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

  // ============================================================
  // FILTER EFFECTS
  // ============================================================
  useEffect(() => {
    let filtered = [...budgets];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.category?.toLowerCase().includes(term) ||
          b.description?.toLowerCase().includes(term) ||
          b.email?.toLowerCase().includes(term),
      );
    }

    if (filterStatus && filterStatus !== "all") {
      filtered = filtered.filter((b) => b.status === filterStatus);
    }

    setFilteredBudgets(filtered);
  }, [budgets, searchTerm, filterStatus]);

  // ============================================================
  // VALIDATE FORM
  // ============================================================
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
    if (isAdmin && (!formData.email || formData.email.trim() === "")) {
      newErrors.email = "User email is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============================================================
  // CRUD OPERATIONS - CREATE BUDGET
  // ============================================================
  const handleAddBudget = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const userId = getValidUserIdOrThrow();

      const budgetData = {
        category: formData.category,
        allocatedAmount: parseFloat(formData.allocatedAmount),
        month: parseInt(formData.month),
        year: parseInt(formData.year),
        description: formData.description || "",
        email: isAdmin ? formData.email.trim() : user?.email,
        userId: userId,
      };

      console.log(
        "📦 Creating budget with data:",
        JSON.stringify(budgetData, null, 2),
      );
      console.log("🔑 UserId being sent:", userId);
      console.log("🔑 Is valid ObjectId?:", /^[0-9a-fA-F]{24}$/.test(userId));

      const response = await api.post("/budgets", budgetData);

      if (response.data.success) {
        const newBudget = response.data.data || response.data;
        setIsAddModalOpen(false);
        resetForm();

        showSuccess(
          "Budget Set Successfully! 📊",
          `Budget of ${formatCurrency(newBudget.allocatedAmount)} allocated for ${newBudget.category}`,
          `Month: ${MONTHS[newBudget.month]} ${newBudget.year}\nUser: ${newBudget.email}`,
        );

        setTimeout(() => loadBudgets(), 300);
      } else {
        throw new Error(response.data.message || "Failed to set budget");
      }
    } catch (error) {
      console.error("Add budget error:", error);
      const errorDetails =
        error.response?.data?.errors?.join("\n") ||
        error.message ||
        "An error occurred";

      if (
        errorDetails.includes("User ID is required") ||
        errorDetails.includes("userId")
      ) {
        showError(
          "User ID Error",
          "The system could not identify your user account.",
          "Please log out and log in again to refresh your session.",
        );
      } else {
        showError(
          "Failed to Set Budget",
          error.response?.data?.message || "Could not set budget",
          errorDetails,
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // CRUD OPERATIONS - UPDATE BUDGET
  // ============================================================
  const handleEditBudget = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const userId = getValidUserIdOrThrow();

      const budgetData = {
        category: formData.category,
        allocatedAmount: parseFloat(formData.allocatedAmount),
        month: parseInt(formData.month),
        year: parseInt(formData.year),
        description: formData.description || "",
        email: isAdmin ? formData.email.trim() : user?.email,
        userId: userId,
      };

      console.log(
        "📦 Updating budget with data:",
        JSON.stringify(budgetData, null, 2),
      );
      console.log("🔑 UserId being sent:", userId);
      console.log("🔑 Is valid ObjectId?:", /^[0-9a-fA-F]{24}$/.test(userId));

      const response = await api.put(
        `/budgets/${selectedBudget._id}`,
        budgetData,
      );

      if (response.data.success) {
        const updatedBudget = response.data.data || response.data;
        setIsEditModalOpen(false);
        resetForm();

        showSuccess(
          "Budget Updated Successfully! ✏️",
          `Budget for ${updatedBudget.category} has been updated.`,
          `Allocated: ${formatCurrency(updatedBudget.allocatedAmount)}\nMonth: ${MONTHS[updatedBudget.month]} ${updatedBudget.year}`,
        );

        setTimeout(() => loadBudgets(), 300);
      } else {
        throw new Error(response.data.message || "Failed to update budget");
      }
    } catch (error) {
      console.error("Update budget error:", error);
      const errorDetails =
        error.response?.data?.errors?.join("\n") ||
        error.message ||
        "An error occurred";

      if (
        errorDetails.includes("User ID is required") ||
        errorDetails.includes("userId")
      ) {
        showError(
          "User ID Error",
          "The system could not identify your user account.",
          "Please log out and log in again to refresh your session.",
        );
      } else {
        showError(
          "Failed to Update Budget",
          error.response?.data?.message || "Could not update budget",
          errorDetails,
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // CRUD OPERATIONS - DELETE BUDGET
  // ============================================================
  const handleDeleteBudget = async () => {
    setIsSubmitting(true);

    try {
      const response = await api.delete(`/budgets/${selectedBudget._id}`);

      if (response.data.success) {
        setIsDeleteModalOpen(false);

        showSuccess(
          "Budget Deleted Successfully! 🗑️",
          `The budget for ${selectedBudget.category} has been permanently deleted.`,
          `Month: ${MONTHS[selectedBudget.month]} ${selectedBudget.year}\nAllocated: ${formatCurrency(selectedBudget.allocatedAmount)}`,
        );

        setTimeout(() => loadBudgets(), 300);
      } else {
        throw new Error(response.data.message || "Failed to delete budget");
      }
    } catch (error) {
      console.error("Delete budget error:", error);
      const errorDetails =
        error.response?.data?.errors?.join("\n") ||
        error.message ||
        "An error occurred";
      showError(
        "Failed to Delete Budget",
        error.response?.data?.message || "Could not delete budget",
        errorDetails,
      );
    } finally {
      setIsSubmitting(false);
      setSelectedBudget(null);
    }
  };

  // // ============================================================
  // // ADD EXPENSE - Uses /api/expenses endpoint
  // // ============================================================

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const amountValue = Number(expenseData.amount);
      if (!Number.isInteger(amountValue) || amountValue <= 0) {
        showError(
          "Invalid Amount",
          "Amount must be a positive whole number (no decimals)",
          "Please enter a valid whole number",
        );
        setIsSubmitting(false);
        return;
      }

      // Get the userId from the user
      const userId = getValidUserIdOrThrow();
      const userEmail = user?.email || selectedBudget?.email;

      if (!userEmail) {
        showError(
          "Email Missing",
          "User email is required to add an expense",
          "Please log out and log in again.",
        );
        setIsSubmitting(false);
        return;
      }

      // Ensure the budget has valid userId and email for notification
      if (!selectedBudget.userId) {
        console.warn("⚠️ Budget missing userId, using current user:", userId);
      }
      if (!selectedBudget.email) {
        console.warn("⚠️ Budget missing email, using current user:", userEmail);
      }

      console.log("📍 Current user ID:", userId);
      console.log("📍 Current user email:", userEmail);
      console.log("📍 Selected budget:", selectedBudget);
      console.log("🔑 Is valid ObjectId?:", /^[0-9a-fA-F]{24}$/.test(userId));

      // ============================================================
      // Create the expense via POST /api/expenses
      // The backend will handle the budget update automatically
      // through the applyBudgetAmount function
      // ============================================================
      const expenseDataToSend = {
        description: expenseData.description.trim(),
        category: expenseData.category || selectedBudget.category || "Other",
        type: "expense",
        amount: amountValue,
        date: expenseData.date || new Date().toISOString().split("T")[0],
        user: expenseData.user || user?.name || "Unknown",
        email: userEmail,
        userId: userId,
        budgetId: selectedBudget._id,
        budgetAmountUsed: amountValue,
        incomeUsed: 0,
        savingsUsed: 0,
        incomeAllocations: [],
        savingsAllocations: [],
      };

      console.log(
        "📤 Creating expense via POST /api/expenses:",
        JSON.stringify(expenseDataToSend, null, 2),
      );

      // POST request to /api/expenses - this will handle everything
      // including the budget update
      const expenseResponse = await api.post("/expenses", expenseDataToSend);

      if (!expenseResponse.data.success) {
        throw new Error(
          expenseResponse.data.message || "Failed to create expense",
        );
      }

      console.log("✅ Expense created successfully:", expenseResponse.data);

      // ============================================================
      // Success - no separate budget update needed
      // The expense creation already updated the budget
      // ============================================================
      setIsExpenseModalOpen(false);

      const expenseDataResult =
        expenseResponse.data.data || expenseResponse.data;

      // Calculate remaining amount from the response
      const remaining =
        selectedBudget.allocatedAmount -
        (selectedBudget.spentAmount || 0) -
        amountValue;
      const isOverBudget = remaining < 0;

      showSuccess(
        isOverBudget
          ? "⚠️ Expense Added - Over Budget!"
          : "Expense Added Successfully! 💰",
        `${formatCurrency(amountValue)} spent on ${expenseData.description || selectedBudget.category}`,
        `Budget: ${selectedBudget.category}\nRemaining: ${formatCurrency(Math.max(0, remaining))}\n${isOverBudget ? "⚠️ This budget is now over budget by " + formatCurrency(Math.abs(remaining)) : "✅ Budget is on track"}`,
      );

      setExpenseData({
        description: "",
        category: "",
        amount: "",
        user: "",
        date: new Date().toISOString().split("T")[0],
      });

      // Refresh budgets to show updated data
      setTimeout(() => loadBudgets(), 300);
    } catch (error) {
      console.error("Add expense error:", error);
      console.error("Error response:", error.response?.data);

      const errorData = error.response?.data || {};
      const errorMessage =
        errorData.message || error.message || "An error occurred";
      const errorDetails = errorData.errors?.join("\n") || "";

      // Check for insufficient funds error
      if (errorMessage.includes("Insufficient funds")) {
        showError(
          "Insufficient Funds 💰",
          "You don't have enough income or savings to cover this expense.",
          `${errorMessage}\n\nPlease add income or savings first before adding expenses.`,
        );
      } else if (
        errorMessage.includes("User ID") ||
        errorDetails.includes("User ID") ||
        errorMessage.includes("userId") ||
        errorDetails.includes("userId") ||
        errorMessage.includes("Invalid userId") ||
        errorDetails.includes("Invalid userId")
      ) {
        showError(
          "User ID Validation Error",
          errorMessage,
          errorDetails ||
            "Please log out and log in again to refresh your session.",
        );
      } else if (errorMessage.includes("Budget validation failed")) {
        showError(
          "Budget Update Failed",
          "The budget could not be updated.",
          `Validation error: ${errorDetails || "Please check the budget data and try again."}`,
        );
      } else {
        showError(
          "Failed to Add Expense",
          errorMessage,
          errorDetails || "Please try again",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // RESET FORM
  // ============================================================
  const resetForm = useCallback(() => {
    const userId = getUserId();
    setFormData({
      category: "",
      allocatedAmount: "",
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      description: "",
      email: isAdmin ? "" : user?.email || "",
      userId: userId,
    });
    setErrors({ category: "", allocatedAmount: "", email: "" });
    setSelectedBudget(null);
  }, [user, isAdmin, getUserId]);

  // ============================================================
  // OPEN MODALS
  // ============================================================
  const openEditModal = useCallback(
    (budget) => {
      setSelectedBudget(budget);
      const userId = getUserId();
      setFormData({
        category: budget.category || "",
        allocatedAmount: budget.allocatedAmount?.toString() || "",
        month: budget.month || new Date().getMonth(),
        year: budget.year || new Date().getFullYear(),
        description: budget.description || "",
        email: budget.email || user?.email || "",
        userId: userId,
      });
      setErrors({ category: "", allocatedAmount: "", email: "" });
      setIsEditModalOpen(true);
    },
    [getUserId, user],
  );

  const openExpenseModal = useCallback(
    (budget) => {
      setSelectedBudget(budget);
      setExpenseData({
        description: "",
        category: budget.category || "",
        amount: "",
        user: user?.name || "",
        date: new Date().toISOString().split("T")[0],
      });
      setIsExpenseModalOpen(true);
    },
    [user],
  );

  // ============================================================
  // GET STATUS BADGE
  // ============================================================
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

  // ============================================================
  // GET STATUS COLOR
  // ============================================================
  const getStatusColor = useCallback((status) => {
    const colors = {
      "on-track": "bg-green-500",
      "approaching-limit": "bg-yellow-500",
      "over-budget": "bg-red-500",
      "under-budget": "bg-blue-500",
    };
    return colors[status] || "bg-purple-500";
  }, []);

  // ============================================================
  // EXPORT REPORT
  // ============================================================
  const exportReport = useCallback(() => {
    if (filteredBudgets.length === 0) {
      toast.warning("No budget data to export");
      return;
    }

    const headers = [
      "Email",
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
      b.email || "",
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

    let filterInfo = "";
    if (selectedMonth !== -1) filterInfo += ` ${MONTHS[selectedMonth]}`;
    if (selectedYear !== 0) filterInfo += ` ${selectedYear}`;
    if (!filterInfo) filterInfo = " All Budgets";

    csv += "\nSummary\n";
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

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    let filename = "budget-report";
    if (selectedMonth !== -1) filename += `-${MONTHS[selectedMonth]}`;
    if (selectedYear !== 0) filename += `-${selectedYear}`;
    a.download = `${filename}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("Report exported successfully!");
  }, [filteredBudgets, selectedMonth, selectedYear, stats]);

  // ============================================================
  // MEMOIZED BUDGET CARD COMPONENT
  // ============================================================
  const BudgetCard = memo(
    ({
      budget,
      onEdit,
      onDelete,
      onAddExpense,
      getStatusBadge,
      getStatusColor,
    }) => {
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
              <p className="text-xs text-gray-400 mt-1">
                👤 {budget.email || "No email"}
              </p>
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
            </div>
          </div>

          <div className="flex items-center justify-end mt-4 pt-3 border-t border-gray-100">
            <div className="flex space-x-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onAddExpense(budget)}
                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Add Expense"
              >
                <AttachMoneyIcon className="w-5 h-5" />
              </motion.button>
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

  // ============================================================
  // RENDER
  // ============================================================
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
              Plan and track your monthly budgets in RWF
            </p>
            {isAdmin && (
              <span className="inline-flex items-center gap-1 text-sm text-purple-600 bg-purple-100 px-3 py-1 rounded-full mt-1">
                <AdminPanelSettingsIcon className="w-4 h-4" />
                Admin View - All Households
              </span>
            )}
            {user?.email && !isAdmin && (
              <p className="text-sm text-gray-500 mt-1">User: {user.email}</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            <div className="flex items-center gap-2">
              <select
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(parseInt(e.target.value));
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-purple-500"
          >
            <p className="text-sm text-gray-500">Total Budget</p>
            <p className="font-bold text-xs text-purple-600">
              {formatCurrency(stats.totalAllocated)}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-500"
          >
            <p className="text-sm text-gray-500">Remaining</p>
            <p className="font-bold text-xs text-green-600">
              {formatCurrency(stats.totalRemaining)}
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-500"
          >
            <p className="text-sm text-gray-500">Usage</p>
            <p className="font-bold text-xs text-blue-600">
              {(stats.overallPercentage || 0).toFixed(1)}%
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-indigo-500"
          >
            <p className="text-sm text-gray-500">Status</p>
            <p className="text-sm font-bold text-indigo-600 flex items-center gap-1">
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
                placeholder="Search budgets by category, description, or email..."
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

              {isAdmin && (
                <input
                  type="email"
                  placeholder="Filter by email..."
                  value={filterEmail}
                  onChange={(e) => {
                    setFilterEmail(e.target.value);
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
                  setFilterEmail("");
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
              {searchTerm ||
              filterCategory !== "all" ||
              filterStatus !== "all" ||
              filterEmail
                ? "Try adjusting your filters"
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
                  onAddExpense={openExpenseModal}
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
          errors={errors}
          setErrors={setErrors}
          isAdmin={isAdmin}
          onCancel={() => {
            setIsEditModalOpen(false);
            resetForm();
          }}
        />
      </Modal>

      {/* Add Expense to Budget Modal */}
      <Modal
        isOpen={isExpenseModalOpen}
        onClose={() => {
          setIsExpenseModalOpen(false);
          setSelectedBudget(null);
          setExpenseData({
            description: "",
            category: "",
            amount: "",
            user: "",
            date: new Date().toISOString().split("T")[0],
          });
        }}
        title="Add Expense to Budget"
        size="md"
      >
        <ExpenseContributionForm
          selectedBudget={selectedBudget}
          expenseData={expenseData}
          setExpenseData={setExpenseData}
          onSubmit={handleAddExpense}
          isSubmitting={isSubmitting}
          formatCurrency={formatCurrency}
          categories={EXPENSE_CATEGORIES}
          onCancel={() => {
            setIsExpenseModalOpen(false);
            setSelectedBudget(null);
            setExpenseData({
              description: "",
              category: "",
              amount: "",
              user: "",
              date: new Date().toISOString().split("T")[0],
            });
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedBudget(null);
        }}
        onConfirm={handleDeleteBudget}
        title="Delete Budget"
        message={`Are you sure you want to delete this budget?\n\n"${selectedBudget?.category || "N/A"}"\nAllocated: ${formatCurrency(selectedBudget?.allocatedAmount || 0)}\nSpent: ${formatCurrency(selectedBudget?.spentAmount || 0)}`}
        type="danger"
        confirmLabel="Delete"
        isSubmitting={isSubmitting}
      />

      {/* SUCCESS, ERROR, CONFIRM MODALS */}
      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal((prev) => ({ ...prev, isOpen: false }))}
        title={successModal.title}
        message={successModal.message}
        details={successModal.details}
      />

      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal((prev) => ({ ...prev, isOpen: false }))}
        title={errorModal.title}
        message={errorModal.message}
        details={errorModal.details}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={() => {
          if (confirmModal.onConfirm) {
            confirmModal.onConfirm();
          }
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        confirmLabel={confirmModal.confirmLabel}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
