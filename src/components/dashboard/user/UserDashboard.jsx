/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

// Material Icons
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ReceiptIcon from "@mui/icons-material/Receipt";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SavingsIcon from "@mui/icons-material/Savings";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import NotificationsIcon from "@mui/icons-material/Notifications";
import WarningIcon from "@mui/icons-material/Warning";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MarkunreadIcon from "@mui/icons-material/Markunread";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";

// Fallback/Default Data for User
const FALLBACK_USER_DATA = {
  totalExpenses: 1850.25,
  monthlyExpenses: 720.5,
  totalIncome: 3200.0,
  monthlyIncome: 2800.0,
  savings: 1349.75,
  monthlyBudget: 2200.0,
  membersCount: 3,
  recentTransactions: [
    {
      id: 1,
      description: "Grocery Shopping",
      category: "Food",
      type: "expense",
      amount: 85.5,
      date: "2026-07-22",
      paymentMethod: "Credit Card",
      notes: "Weekly groceries at Walmart",
    },
    {
      id: 2,
      description: "Electricity Bill",
      category: "Utilities",
      type: "expense",
      amount: 65.0,
      date: "2026-07-21",
      paymentMethod: "Bank Transfer",
      notes: "Monthly electricity payment",
    },
    {
      id: 3,
      description: "Salary Deposit",
      category: "Salary",
      type: "income",
      amount: 2800.0,
      date: "2026-07-20",
      paymentMethod: "Direct Deposit",
      notes: "Monthly salary from employer",
    },
    {
      id: 4,
      description: "Internet Subscription",
      category: "Utilities",
      type: "expense",
      amount: 45.0,
      date: "2026-07-19",
      paymentMethod: "Credit Card",
      notes: "Monthly internet bill",
    },
    {
      id: 5,
      description: "Transportation",
      category: "Transport",
      type: "expense",
      amount: 30.0,
      date: "2026-07-18",
      paymentMethod: "Cash",
      notes: "Bus fare and gas",
    },
    {
      id: 6,
      description: "Freelance Payment",
      category: "Freelance",
      type: "income",
      amount: 400.0,
      date: "2026-07-17",
      paymentMethod: "PayPal",
      notes: "Web development project",
    },
    {
      id: 7,
      description: "Restaurant Dinner",
      category: "Food",
      type: "expense",
      amount: 65.75,
      date: "2026-07-16",
      paymentMethod: "Credit Card",
      notes: "Dinner with family",
    },
    {
      id: 8,
      description: "Gym Membership",
      category: "Health",
      type: "expense",
      amount: 50.0,
      date: "2026-07-15",
      paymentMethod: "Credit Card",
      notes: "Monthly gym subscription",
    },
    {
      id: 9,
      description: "Netflix Subscription",
      category: "Entertainment",
      type: "expense",
      amount: 15.99,
      date: "2026-07-14",
      paymentMethod: "Credit Card",
      notes: "Monthly Netflix subscription",
    },
  ],
  budgetAlerts: [
    {
      id: 1,
      category: "Utilities",
      message: "Utilities budget is at 88% of monthly limit",
      percentageUsed: 88,
      severity: "warning",
      read: false,
      date: "2026-07-22T10:30:00",
    },
    {
      id: 2,
      category: "Food",
      message: "Food budget is at 75% of monthly limit",
      percentageUsed: 75,
      severity: "warning",
      read: false,
      date: "2026-07-21T14:45:00",
    },
    {
      id: 3,
      category: "Entertainment",
      message: "Entertainment budget is at 90% of monthly limit",
      percentageUsed: 90,
      severity: "critical",
      read: false,
      date: "2026-07-20T09:15:00",
    },
  ],
  householdDetails: {
    name: "The Johnson Family",
    members: [
      {
        id: 1,
        name: "John Johnson",
        role: "Head of Household",
        email: "john@example.com",
        phone: "+1 (555) 123-4567",
      },
      {
        id: 2,
        name: "Jane Johnson",
        role: "Co-Head",
        email: "jane@example.com",
        phone: "+1 (555) 987-6543",
      },
      {
        id: 3,
        name: "Michael Johnson",
        role: "Member",
        email: "michael@example.com",
        phone: "+1 (555) 456-7890",
      },
    ],
    address: "123 Main Street, Anytown, USA 12345",
    createdDate: "2024-01-15",
    totalMembers: 3,
  },
  categoryBreakdown: [
    { category: "Food", amount: 450.5, percentage: 28 },
    { category: "Utilities", amount: 350.0, percentage: 22 },
    { category: "Transportation", amount: 180.75, percentage: 11 },
    { category: "Entertainment", amount: 150.5, percentage: 9 },
    { category: "Health", amount: 120.0, percentage: 8 },
    { category: "Other", amount: 350.0, percentage: 22 },
  ],
};

export const UserDashboard = () => {
  const navigate = useNavigate();

  // Read auth data synchronously on first render
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("userData") || "null");
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false);
  const [isHouseholdModalOpen, setIsHouseholdModalOpen] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState("all");
  const [transactionFilter, setTransactionFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Dashboard data state
  const [stats, setStats] = useState(FALLBACK_USER_DATA);
  const [allTransactions, setAllTransactions] = useState(
    FALLBACK_USER_DATA.recentTransactions,
  );
  const [householdDetails, setHouseholdDetails] = useState(
    FALLBACK_USER_DATA.householdDetails,
  );
  const [categoryBreakdown, setCategoryBreakdown] = useState(
    FALLBACK_USER_DATA.categoryBreakdown,
  );

  // API Base URL
  const API_BASE_URL =
   "http://localhost:5000/api";

  // Fetch dashboard data from API
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      // Fetch all data in parallel
      const [
        statsResponse,
        transactionsResponse,
        householdResponse,
        categoriesResponse,
        alertsResponse,
      ] = await Promise.all([
        axios.get(`${API_BASE_URL}/user/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE_URL}/user/transactions`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE_URL}/user/household`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE_URL}/user/dashboard/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE_URL}/user/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      // Update stats
      setStats((prev) => ({
        ...prev,
        totalExpenses: statsResponse.data.totalExpenses || prev.totalExpenses,
        monthlyExpenses:
          statsResponse.data.monthlyExpenses || prev.monthlyExpenses,
        totalIncome: statsResponse.data.totalIncome || prev.totalIncome,
        monthlyIncome: statsResponse.data.monthlyIncome || prev.monthlyIncome,
        savings: statsResponse.data.savings || prev.savings,
        monthlyBudget: statsResponse.data.monthlyBudget || prev.monthlyBudget,
        membersCount: statsResponse.data.membersCount || prev.membersCount,
      }));

      // Update transactions
      if (transactionsResponse.data && transactionsResponse.data.length > 0) {
        setAllTransactions(transactionsResponse.data);
        setStats((prev) => ({
          ...prev,
          recentTransactions: transactionsResponse.data.slice(0, 8),
        }));
      }

      // Update household details
      if (householdResponse.data) {
        setHouseholdDetails(householdResponse.data);
      }

      // Update category breakdown
      if (categoriesResponse.data) {
        setCategoryBreakdown(categoriesResponse.data);
      }

      // Update budget alerts
      if (alertsResponse.data) {
        setStats((prev) => ({
          ...prev,
          budgetAlerts: alertsResponse.data,
        }));
      }

      toast.success("Dashboard data refreshed");
    } catch (error) {
      console.error("Error fetching dashboard data:", error);

      // Use fallback data with a notification
      toast.warning("Using fallback data - API unavailable");

      // Ensure fallback data is set
      setStats(FALLBACK_USER_DATA);
      setAllTransactions(FALLBACK_USER_DATA.recentTransactions);
      setHouseholdDetails(FALLBACK_USER_DATA.householdDetails);
      setCategoryBreakdown(FALLBACK_USER_DATA.categoryBreakdown);
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if no valid session
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = JSON.parse(localStorage.getItem("userData") || "null");

    if (!token || !userData) {
      navigate("/");
      return;
    }

    if (!user) setUser(userData);

    // Fetch dashboard data
    fetchDashboardData();

    // Show toast notifications for critical alerts that are unread
    const unreadCriticalAlerts = stats.budgetAlerts?.filter(
      (alert) => alert.severity === "critical" && !alert.read,
    );

    unreadCriticalAlerts?.forEach((alert) => {
      toast.warning(`⚠️ ${alert.category}: ${alert.message}`, {
        position: "top-right",
        autoClose: 8000,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    toast.success("Logged out successfully!");
    navigate("/");
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

  // Format time
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format date and time
  const formatDateTime = (dateString) => {
    return `${formatDate(dateString)} at ${formatTime(dateString)}`;
  };

  // Get notification count (unread)
  const getUnreadCount = () => {
    return stats.budgetAlerts?.filter((alert) => !alert.read).length || 0;
  };

  // Get filtered notifications
  const getFilteredNotifications = () => {
    if (!stats.budgetAlerts) return [];

    switch (notificationFilter) {
      case "unread":
        return stats.budgetAlerts.filter((alert) => !alert.read);
      case "read":
        return stats.budgetAlerts.filter((alert) => alert.read);
      default:
        return stats.budgetAlerts;
    }
  };

  // Get filtered transactions
  const getFilteredTransactions = () => {
    let filtered = allTransactions;

    // Filter by type
    if (transactionFilter === "income") {
      filtered = filtered.filter((t) => t.type === "income");
    } else if (transactionFilter === "expense") {
      filtered = filtered.filter((t) => t.type === "expense");
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(term) ||
          t.category.toLowerCase().includes(term) ||
          t.notes?.toLowerCase().includes(term),
      );
    }

    return filtered;
  };

  // Mark notification as read/unread
  const toggleNotificationRead = (id) => {
    setStats((prev) => ({
      ...prev,
      budgetAlerts: prev.budgetAlerts.map((alert) =>
        alert.id === id ? { ...alert, read: !alert.read } : alert,
      ),
    }));

    const notification = stats.budgetAlerts.find((a) => a.id === id);
    if (notification) {
      toast.success(notification.read ? "Marked as unread" : "Marked as read");
    }
  };

  // Delete notification
  const deleteNotification = (id) => {
    setStats((prev) => ({
      ...prev,
      budgetAlerts: prev.budgetAlerts.filter((alert) => alert.id !== id),
    }));
    toast.success("Notification deleted");
  };

  // Mark all as read
  const markAllAsRead = () => {
    setStats((prev) => ({
      ...prev,
      budgetAlerts: prev.budgetAlerts.map((alert) => ({
        ...alert,
        read: true,
      })),
    }));
    toast.success("All notifications marked as read");
  };

  // Delete all notifications
  const deleteAllNotifications = () => {
    setStats((prev) => ({
      ...prev,
      budgetAlerts: [],
    }));
    toast.success("All notifications deleted");
  };

  // Get severity color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical":
        return "text-red-600 bg-red-50 border-red-200";
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "info":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  // Get severity icon
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "critical":
        return <WarningIcon className="w-5 h-5 text-red-500" />;
      case "warning":
        return <WarningIcon className="w-5 h-5 text-yellow-500" />;
      default:
        return <InfoIcon className="w-5 h-5 text-blue-500" />;
    }
  };

  // Refresh data
  const handleRefreshData = () => {
    fetchDashboardData();
  };

  // Export transactions to CSV
  const exportToCSV = () => {
    const transactions = getFilteredTransactions();
    if (transactions.length === 0) {
      toast.warning("No transactions to export");
      return;
    }

    const headers = [
      "Date",
      "Description",
      "Category",
      "Type",
      "Amount",
      "Payment Method",
      "Notes",
    ];
    const rows = transactions.map((t) => [
      formatDate(t.date),
      t.description,
      t.category,
      t.type,
      t.amount,
      t.paymentMethod || "N/A",
      t.notes || "N/A",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `user_transactions_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Transactions exported successfully");
  };

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

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl">
                <SavingsIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">HEMS</h1>
                <p className="text-xs text-gray-500">
                  Household Expense Management
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Refresh Button */}
              <button
                onClick={handleRefreshData}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Refresh Data"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>

              {/* Notification Bell with Badge */}
              <button
                onClick={() => setIsNotificationModalOpen(true)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <NotificationsIcon className="w-6 h-6 text-gray-600" />
                {getUnreadCount() > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {getUnreadCount()}
                  </span>
                )}
              </button>

              <div className="hidden md:flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <PersonIcon className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                <LogoutIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Modal */}
      <AnimatePresence>
        {isNotificationModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsNotificationModalOpen(false);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col relative"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <NotificationsIcon className="w-7 h-7 text-purple-600" />
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Notifications
                    </h2>
                    <p className="text-xs text-gray-500">
                      {getUnreadCount()} unread ·{" "}
                      {stats.budgetAlerts?.length || 0} total
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsNotificationModalOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <CloseIcon className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Filter and Actions Bar */}
              <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setNotificationFilter("all")}
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                      notificationFilter === "all"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setNotificationFilter("unread")}
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                      notificationFilter === "unread"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Unread
                    {getUnreadCount() > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                        {getUnreadCount()}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setNotificationFilter("read")}
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                      notificationFilter === "read"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Read
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  {getUnreadCount() > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors flex items-center space-x-1"
                    >
                      <DoneAllIcon className="w-4 h-4" />
                      <span>Mark all read</span>
                    </button>
                  )}
                  {stats.budgetAlerts?.length > 0 && (
                    <button
                      onClick={deleteAllNotifications}
                      className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors flex items-center space-x-1"
                    >
                      <DeleteIcon className="w-4 h-4" />
                      <span>Delete all</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Notification List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {getFilteredNotifications().length > 0 ? (
                  getFilteredNotifications().map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`p-4 rounded-xl border transition-all ${
                        notification.read
                          ? "bg-white border-gray-200 opacity-75"
                          : "bg-blue-50/50 border-blue-200 shadow-sm"
                      } ${getSeverityColor(notification.severity)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="mt-0.5">
                            {getSeverityIcon(notification.severity)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span
                                className={`text-sm font-semibold ${
                                  notification.read
                                    ? "text-gray-600"
                                    : "text-gray-900"
                                }`}
                              >
                                {notification.category}
                              </span>
                              {!notification.read && (
                                <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                                  New
                                </span>
                              )}
                              <span
                                className={`px-2 py-0.5 text-xs rounded-full ${
                                  notification.severity === "critical"
                                    ? "bg-red-200 text-red-800"
                                    : notification.severity === "warning"
                                      ? "bg-yellow-200 text-yellow-800"
                                      : "bg-blue-200 text-blue-800"
                                }`}
                              >
                                {notification.severity}
                              </span>
                            </div>
                            <p
                              className={`text-sm ${notification.read ? "text-gray-600" : "text-gray-800"}`}
                            >
                              {notification.message}
                            </p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-xs text-gray-500">
                                {formatDateTime(notification.date)}
                              </span>
                              <span className="text-xs font-medium text-gray-600">
                                {Math.round(notification.percentageUsed)}% used
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 ml-4">
                          <button
                            onClick={() =>
                              toggleNotificationRead(notification.id)
                            }
                            className="p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                            title={
                              notification.read
                                ? "Mark as unread"
                                : "Mark as read"
                            }
                          >
                            {notification.read ? (
                              <MarkunreadIcon className="w-5 h-5 text-gray-500" />
                            ) : (
                              <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                            )}
                          </button>
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1.5 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <DeleteIcon className="w-5 h-5 text-gray-400 hover:text-red-600" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <NotificationsIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">
                      No notifications
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {notificationFilter === "all"
                        ? "You're all caught up!"
                        : notificationFilter === "unread"
                          ? "No unread notifications"
                          : "No read notifications"}
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-3xl">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {getFilteredNotifications().length} notification
                    {getFilteredNotifications().length !== 1 ? "s" : ""} showing
                  </span>
                  <span>{getUnreadCount()} unread</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transactions Modal */}
      <AnimatePresence>
        {isTransactionsModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsTransactionsModalOpen(false);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col relative"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <ReceiptIcon className="w-7 h-7 text-blue-600" />
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      My Transactions
                    </h2>
                    <p className="text-xs text-gray-500">
                      {getFilteredTransactions().length} transactions ·{" "}
                      {allTransactions.length} total
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsTransactionsModalOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <CloseIcon className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Filter and Search Bar */}
              <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setTransactionFilter("all")}
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                      transactionFilter === "all"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setTransactionFilter("income")}
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                      transactionFilter === "income"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Income
                  </button>
                  <button
                    onClick={() => setTransactionFilter("expense")}
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                      transactionFilter === "expense"
                        ? "bg-red-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Expenses
                  </button>
                </div>
                <div className="flex items-center space-x-2 flex-1 max-w-md">
                  <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-1.5 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={exportToCSV}
                    className="px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors flex items-center space-x-1"
                  >
                    <DownloadIcon className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              {/* Transactions List */}
              <div className="flex-1 overflow-y-auto p-4">
                {getFilteredTransactions().length > 0 ? (
                  <div className="space-y-2">
                    {getFilteredTransactions().map((transaction) => (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl border ${
                          transaction.type === "income"
                            ? "bg-green-50 border-green-200"
                            : "bg-red-50 border-red-200"
                        } hover:shadow-md transition-all`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <h4 className="font-semibold text-gray-800">
                                {transaction.description}
                              </h4>
                              <span
                                className={`px-2 py-0.5 text-xs rounded-full ${
                                  transaction.type === "income"
                                    ? "bg-green-200 text-green-800"
                                    : "bg-red-200 text-red-800"
                                }`}
                              >
                                {transaction.type}
                              </span>
                              <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full">
                                {transaction.category}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                              <span>{formatDate(transaction.date)}</span>
                              {transaction.paymentMethod && (
                                <span>• {transaction.paymentMethod}</span>
                              )}
                              {transaction.notes && (
                                <span className="text-xs text-gray-500">
                                  • {transaction.notes}
                                </span>
                              )}
                            </div>
                          </div>
                          <div
                            className={`text-lg font-bold ${
                              transaction.type === "income"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {transaction.type === "income" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ReceiptIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">
                      No transactions found
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {searchTerm
                        ? "Try adjusting your search or filters"
                        : "Start adding your expenses and income"}
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-3xl">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {getFilteredTransactions().length} transaction
                    {getFilteredTransactions().length !== 1 ? "s" : ""} showing
                  </span>
                  <div className="flex items-center space-x-4">
                    <span className="text-green-600">
                      Income:{" "}
                      {formatCurrency(
                        getFilteredTransactions()
                          .filter((t) => t.type === "income")
                          .reduce((sum, t) => sum + t.amount, 0),
                      )}
                    </span>
                    <span className="text-red-600">
                      Expenses:{" "}
                      {formatCurrency(
                        getFilteredTransactions()
                          .filter((t) => t.type === "expense")
                          .reduce((sum, t) => sum + t.amount, 0),
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Household Details Modal */}
      <AnimatePresence>
        {isHouseholdModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsHouseholdModalOpen(false);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col relative"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <FamilyRestroomIcon className="w-7 h-7 text-purple-600" />
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Household Details
                    </h2>
                    <p className="text-xs text-gray-500">
                      {householdDetails?.name || "Household"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsHouseholdModalOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <CloseIcon className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Household Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Household Info */}
                <div className="mb-6 p-4 bg-purple-50 rounded-xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Household Name</p>
                      <p className="font-semibold text-gray-800">
                        {householdDetails?.name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Members</p>
                      <p className="font-semibold text-gray-800">
                        {householdDetails?.totalMembers || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-semibold text-gray-800">
                        {householdDetails?.address || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Created</p>
                      <p className="font-semibold text-gray-800">
                        {householdDetails?.createdDate
                          ? formatDate(householdDetails.createdDate)
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Category Breakdown */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Category Breakdown
                  </h4>
                  <div className="space-y-3">
                    {categoryBreakdown.map((cat, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-700">{cat.category}</span>
                          <span className="font-medium text-gray-800">
                            {formatCurrency(cat.amount)} ({cat.percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              cat.percentage > 30
                                ? "bg-red-500"
                                : cat.percentage > 20
                                  ? "bg-yellow-500"
                                  : "bg-blue-500"
                            }`}
                            style={{
                              width: `${Math.min(cat.percentage, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Members List */}
                {householdDetails?.members &&
                  householdDetails.members.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">
                        Household Members
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {householdDetails.members.map((member) => (
                          <div
                            key={member.id}
                            className="p-3 bg-gray-50 rounded-xl border border-gray-200"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                <PersonIcon className="w-5 h-5 text-purple-600" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-800">
                                  {member.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {member.role}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {member.email}
                                </p>
                                {member.phone && (
                                  <p className="text-xs text-gray-400">
                                    {member.phone}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-3xl">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {householdDetails?.totalMembers || 0} members in household
                  </span>
                  <span>{categoryBreakdown.length} categories tracked</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading dashboard data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                Welcome back, {user?.name}!
              </h2>
              <p className="text-gray-600 mt-1">
                Here's an overview of your household finances
              </p>
            </div>

            {/* Budget Alerts Section */}
            {stats.budgetAlerts?.filter((a) => !a.read).length > 0 && (
              <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-xl">
                <div className="flex items-start">
                  <WarningIcon className="w-6 h-6 text-yellow-600 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800">
                      Unread Budget Alerts (
                      {stats.budgetAlerts.filter((a) => !a.read).length})
                    </h4>
                    <ul className="mt-1 space-y-1">
                      {stats.budgetAlerts
                        .filter((a) => !a.read)
                        .map((alert) => (
                          <li
                            key={alert.id}
                            className="text-sm text-yellow-700"
                          >
                            {alert.category}: {alert.message}
                            <span className="ml-2 text-xs font-medium">
                              ({Math.round(alert.percentageUsed)}% used)
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Total Income
                    </p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                      {formatCurrency(stats.totalIncome)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUpIcon className="text-blue-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Total Expenses
                    </p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                      {formatCurrency(stats.totalExpenses)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <TrendingDownIcon className="text-red-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Savings</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                      {formatCurrency(stats.savings)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <SavingsIcon className="text-green-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Monthly Expenses
                    </p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                      {formatCurrency(stats.monthlyExpenses)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <CalendarTodayIcon className="text-purple-600" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Recent Transactions and Household Summary Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Recent Transactions - Takes 2/3 of the space */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <ReceiptIcon className="mr-2" />
                    Recent Transactions
                  </h3>
                  <button
                    onClick={() => setIsTransactionsModalOpen(true)}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors flex items-center space-x-1"
                  >
                    <span>View All</span>
                    <span className="text-xs bg-purple-100 px-2 py-0.5 rounded-full">
                      {allTransactions.length}
                    </span>
                  </button>
                </div>

                {stats.recentTransactions &&
                stats.recentTransactions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                            Description
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                            Category
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                            Date
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentTransactions
                          .slice(0, 8)
                          .map((transaction, index) => (
                            <motion.tr
                              key={transaction.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                              onClick={() => setIsTransactionsModalOpen(true)}
                            >
                              <td className="py-3 px-4 text-gray-800">
                                {transaction.description}
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    transaction.type === "income"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {transaction.category}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-gray-600">
                                {formatDate(transaction.date)}
                              </td>
                              <td
                                className={`py-3 px-4 text-right font-semibold ${
                                  transaction.type === "income"
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {transaction.type === "income" ? "+" : "-"}
                                {formatCurrency(transaction.amount)}
                              </td>
                            </motion.tr>
                          ))}
                      </tbody>
                    </table>
                    {stats.recentTransactions.length > 8 && (
                      <div className="text-center mt-4">
                        <button
                          onClick={() => setIsTransactionsModalOpen(true)}
                          className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                        >
                          + {stats.recentTransactions.length - 8} more
                          transactions
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ReceiptIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No transactions yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Start adding your expenses and income
                    </p>
                  </div>
                )}
              </div>

              {/* Household Summary - Takes 1/3 of the space */}
              <div
                className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all"
                onClick={() => setIsHouseholdModalOpen(true)}
              >
                <h3 className="text-xl font-bold text-gray-800 flex items-center mb-6">
                  <FamilyRestroomIcon className="mr-2" />
                  Household Summary
                  <span className="ml-2 text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                    Click for details
                  </span>
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                    <div>
                      <p className="text-sm text-gray-600">Household Members</p>
                      <p className="text-2xl font-bold text-blue-700">
                        {stats.membersCount}
                      </p>
                    </div>
                    <FamilyRestroomIcon className="w-8 h-8 text-blue-600" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                    <div>
                      <p className="text-sm text-gray-600">Monthly Budget</p>
                      <p className="text-2xl font-bold text-green-700">
                        {formatCurrency(stats.monthlyBudget)}
                      </p>
                    </div>
                    <AttachMoneyIcon className="w-8 h-8 text-green-600" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                    <div>
                      <p className="text-sm text-gray-600">Budget Used</p>
                      <p className="text-2xl font-bold text-purple-700">
                        {stats.monthlyBudget && stats.monthlyExpenses
                          ? Math.round(
                              (stats.monthlyExpenses / stats.monthlyBudget) *
                                100,
                            )
                          : 0}
                        %
                      </p>
                    </div>
                    <AnalyticsIcon className="w-8 h-8 text-purple-600" />
                  </div>

                  <div
                    className="mt-4 p-3 bg-yellow-50 rounded-xl cursor-pointer hover:bg-yellow-100 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsNotificationModalOpen(true);
                    }}
                  >
                    <p className="text-sm text-gray-600 flex items-center">
                      <WarningIcon className="w-4 h-4 text-yellow-600 mr-1" />
                      Budget Alerts
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-yellow-700">
                        {getUnreadCount()} unread
                      </p>
                      <span className="text-xs text-yellow-600">
                        Click to view →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl shadow-lg p-6 text-left hover:shadow-xl transition-all duration-300"
                onClick={() => toast.info("Add Expense feature coming soon!")}
              >
                <AttachMoneyIcon className="w-8 h-8 mb-2" />
                <h4 className="font-semibold">Add Expense</h4>
                <p className="text-sm opacity-90 mt-1">Record a new expense</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl shadow-lg p-6 text-left hover:shadow-xl transition-all duration-300"
                onClick={() => toast.info("Add Income feature coming soon!")}
              >
                <TrendingUpIcon className="w-8 h-8 mb-2" />
                <h4 className="font-semibold">Add Income</h4>
                <p className="text-sm opacity-90 mt-1">Record new income</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl shadow-lg p-6 text-left hover:shadow-xl transition-all duration-300"
                onClick={() => toast.info("Reports feature coming soon!")}
              >
                <AnalyticsIcon className="w-8 h-8 mb-2" />
                <h4 className="font-semibold">View Reports</h4>
                <p className="text-sm opacity-90 mt-1">
                  See detailed analytics
                </p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl shadow-lg p-6 text-left hover:shadow-xl transition-all duration-300"
                onClick={() => setIsHouseholdModalOpen(true)}
              >
                <FamilyRestroomIcon className="w-8 h-8 mb-2" />
                <h4 className="font-semibold">Household</h4>
                <p className="text-sm opacity-90 mt-1">
                  View household details
                </p>
              </motion.button>
            </div>

            {/* Features Highlight */}
            <div className="mt-12 p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <SavingsIcon className="mr-2 text-purple-600" />
                Your Financial Tools
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-sm font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      Track Spending
                    </p>
                    <p className="text-sm text-gray-600">
                      Monitor every transaction
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 text-sm font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Budget Alerts</p>
                    <p className="text-sm text-gray-600">
                      Stay within your limits
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 text-sm font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Family View</p>
                    <p className="text-sm text-gray-600">
                      See household finances
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-600 text-sm font-bold">4</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      Smart Insights
                    </p>
                    <p className="text-sm text-gray-600">
                      Make better decisions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// InfoIcon component
const InfoIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
