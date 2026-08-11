
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
import NotificationsIcon from "@mui/icons-material/Notifications";
import WarningIcon from "@mui/icons-material/Warning";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MarkunreadIcon from "@mui/icons-material/Markunread";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import GroupIcon from "@mui/icons-material/Group";

// Currency formatter for RWF
const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "FRw 0";
  return new Intl.NumberFormat("rw-RW", {
    style: "currency",
    currency: "RWF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Initial empty state
const EMPTY_STATE = {
  totalExpenses: 0,
  monthlyExpenses: 0,
  totalIncome: 0,
  monthlyIncome: 0,
  savings: 0,
  monthlyBudget: 0,
  membersCount: 0,
  recentTransactions: [],
  budgetAlerts: [],
};

export const Dashboard = () => {
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

  // Dashboard data state - only keep what's used
  const [stats, setStats] = useState(EMPTY_STATE);
  const [allTransactions, setAllTransactions] = useState([]);
  const [householdDetails, setHouseholdDetails] = useState(null);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // API Base URL
  const API_BASE_URL =
    "https://household-expenses-management-system.onrender.com/api";

  // Fetch dashboard data from API
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log("Fetching dashboard data...");

      // Fetch all data in parallel with proper error handling
      const responses = await Promise.allSettled([
        axios.get(`${API_BASE_URL}/expenses`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE_URL}/incomes`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE_URL}/savings`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE_URL}/budgets`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE_URL}/household`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE_URL}/notifications/all`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      // Extract data from responses with proper error handling
      let expenses = [];
      let incomes = [];
      let savings = [];
      let budgets = [];
      let household = null;
      let notifs = [];
      let users = [];

      // Expenses
      if (responses[0].status === "fulfilled") {
        console.log("Expenses API Response:", responses[0].value.data);
        expenses = responses[0].value.data?.data || [];
      } else {
        console.error("Expenses API Error:", responses[0].reason);
        toast.warning("Could not load expenses data");
      }

      // Incomes
      if (responses[1].status === "fulfilled") {
        console.log("Income API Response:", responses[1].value.data);
        incomes = responses[1].value.data?.data || [];
      } else {
        console.error("Income API Error:", responses[1].reason);
        toast.warning("Could not load income data");
      }

      // Savings
      if (responses[2].status === "fulfilled") {
        console.log("Savings API Response:", responses[2].value.data);
        savings = responses[2].value.data?.data || [];
      } else {
        console.error("Savings API Error:", responses[2].reason);
        toast.warning("Could not load savings data");
      }

      // Budgets
      if (responses[3].status === "fulfilled") {
        console.log("Budgets API Response:", responses[3].value.data);
        budgets = responses[3].value.data?.data || [];
      } else {
        console.error("Budgets API Error:", responses[3].reason);
        toast.warning("Could not load budgets data");
      }

      // Household
      if (responses[4].status === "fulfilled") {
        console.log("Household API Response:", responses[4].value.data);
        household = responses[4].value.data || null;
      } else {
        console.error("Household API Error:", responses[4].reason);
      }

      // Notifications
      if (responses[5].status === "fulfilled") {
        console.log("Notifications API Response:", responses[5].value.data);
        notifs = responses[5].value.data?.notifications || [];
      } else {
        console.error("Notifications API Error:", responses[5].reason);
      }

      // Users (for household members)
      if (responses[6].status === "fulfilled") {
        console.log("Users API Response:", responses[6].value.data);
        users = responses[6].value.data || [];
      } else {
        console.error("Users API Error:", responses[6].reason);
        toast.warning("Could not load users data");
      }

      console.log("Extracted data:", {
        expenses,
        incomes,
        savings,
        budgets,
        household,
        notifs,
        users,
      });

      // Calculate totals
      const totalExpenses = expenses.reduce(
        (sum, exp) => sum + (exp.amount || 0),
        0,
      );
      const totalIncome = incomes.reduce(
        (sum, inc) => sum + (inc.amount || 0),
        0,
      );

      console.log("Calculated totals:", { totalExpenses, totalIncome });

      // Calculate monthly expenses (current month)
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      const monthlyExpenses = expenses
        .filter((exp) => {
          const expDate = new Date(exp.date);
          return (
            expDate.getMonth() === currentMonth &&
            expDate.getFullYear() === currentYear
          );
        })
        .reduce((sum, exp) => sum + (exp.amount || 0), 0);

      const monthlyIncome = incomes
        .filter((inc) => {
          const incDate = new Date(inc.date);
          return (
            incDate.getMonth() === currentMonth &&
            incDate.getFullYear() === currentYear
          );
        })
        .reduce((sum, inc) => sum + (inc.amount || 0), 0);

      console.log("Monthly totals:", { monthlyExpenses, monthlyIncome });

      // Calculate savings total
      const totalSavings = savings.reduce(
        (sum, save) => sum + (save.currentAmount || 0),
        0,
      );
      console.log("Total savings:", totalSavings);

      // Calculate monthly budget
      const monthlyBudget = budgets
        .filter((b) => b.month === currentMonth + 1 && b.year === currentYear)
        .reduce((sum, b) => sum + (b.allocatedAmount || 0), 0);
      console.log("Monthly budget:", monthlyBudget);

      // Get members count from users
      const membersCount = users.length || 0;
      console.log("Members count from users:", membersCount);

      // Set household details with users data
      setHouseholdDetails({
        ...household,
        members: users,
      });

      // Get recent transactions (combine expenses and incomes, sort by date)
      const allTrans = [
        ...expenses.map((e) => ({ ...e, type: "expense" })),
        ...incomes.map((i) => ({ ...i, type: "income" })),
      ].sort((a, b) => new Date(b.date) - new Date(a.date));

      console.log("All transactions:", allTrans);
      setAllTransactions(allTrans);

      // Get recent transactions for stats (latest 8)
      const recentTransactions = allTrans.slice(0, 8);

      // Prepare budget alerts from notifications
      const budgetAlerts = notifs
        .filter(
          (n) =>
            n.type === "budget_alert" ||
            n.severity === "high" ||
            n.severity === "medium",
        )
        .slice(0, 5)
        .map((n) => ({
          id: n._id,
          category: n.title || "Budget Alert",
          message: n.message || "Budget alert notification",
          severity: n.severity || "medium",
          date: n.createdAt,
          read: n.isRead || false,
          percentageUsed: 75,
        }));

      // Set notifications
      setNotifications(notifs);

      // Update stats
      const newStats = {
        totalExpenses,
        monthlyExpenses,
        totalIncome,
        monthlyIncome,
        savings: totalSavings,
        monthlyBudget,
        membersCount,
        recentTransactions,
        budgetAlerts: budgetAlerts.length > 0 ? budgetAlerts : [],
      };

      console.log("New stats:", newStats);
      setStats(newStats);

      // Prepare category breakdown from expenses
      const categoryMap = {};
      expenses.forEach((exp) => {
        if (categoryMap[exp.category]) {
          categoryMap[exp.category] += exp.amount;
        } else {
          categoryMap[exp.category] = exp.amount;
        }
      });

      const totalExp = expenses.reduce(
        (sum, exp) => sum + (exp.amount || 0),
        0,
      );
      const categoryBreakdownData = Object.entries(categoryMap).map(
        ([category, amount]) => ({
          category,
          amount,
          percentage: totalExp > 0 ? Math.round((amount / totalExp) * 100) : 0,
        }),
      );

      console.log("Category breakdown:", categoryBreakdownData);
      setCategoryBreakdown(categoryBreakdownData);

      toast.success("Dashboard data refreshed");
    } catch (error) {
      console.error("Error fetching dashboard data:", error);

      if (error.response) {
        console.error("Error response:", error.response.data);
        toast.error(
          `Error: ${error.response.data.message || "Failed to fetch data"}`,
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("Cannot connect to server. Please check your connection.");
      } else {
        console.error("Request error:", error.message);
        toast.error("An unexpected error occurred.");
      }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    toast.success("Logged out successfully!");
    navigate("/");
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
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
    return notifications?.filter((n) => !n.isRead).length || 0;
  };

  // Get filtered notifications
  const getFilteredNotifications = () => {
    if (!notifications) return [];

    switch (notificationFilter) {
      case "unread":
        return notifications.filter((n) => !n.isRead);
      case "read":
        return notifications.filter((n) => n.isRead);
      default:
        return notifications;
    }
  };

  // Get filtered transactions
  const getFilteredTransactions = () => {
    let filtered = allTransactions || [];

    if (transactionFilter === "income") {
      filtered = filtered.filter((t) => t.type === "income");
    } else if (transactionFilter === "expense") {
      filtered = filtered.filter((t) => t.type === "expense");
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.description?.toLowerCase().includes(term) ||
          t.category?.toLowerCase().includes(term) ||
          t.notes?.toLowerCase().includes(term),
      );
    }

    return filtered;
  };

  // Get filtered transactions for modal
  const getFilteredTransactionsModal = () => {
    return getFilteredTransactions();
  };

  // Mark notification as read/unread
  const toggleNotificationRead = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      const notification = notifications.find((n) => n._id === id);
      await axios.patch(
        `${API_BASE_URL}/notifications/read/${id}`,
        { isRead: !notification?.isRead },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: !n.isRead } : n)),
      );

      toast.success(
        notification?.isRead ? "Marked as unread" : "Marked as read",
      );
    } catch (error) {
      toast.error("Failed to update notification");
      console.error(error);
    }
  };

  // Delete notification
  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`${API_BASE_URL}/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success("Notification deleted");
    } catch (error) {
      toast.error("Failed to delete notification");
      console.error(error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const unreadIds = notifications
        .filter((n) => !n.isRead)
        .map((n) => n._id);

      await Promise.all(
        unreadIds.map((id) =>
          axios.patch(
            `${API_BASE_URL}/notifications/read/${id}`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          ),
        ),
      );

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all as read");
      console.error(error);
    }
  };

  // Delete all notifications
  const deleteAllNotifications = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await Promise.all(
        notifications.map((n) =>
          axios.delete(`${API_BASE_URL}/notifications/${n._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ),
      );

      setNotifications([]);
      toast.success("All notifications deleted");
    } catch (error) {
      toast.error("Failed to delete all notifications");
      console.error(error);
    }
  };

  // Get severity color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
      case "critical":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  // Get severity icon
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "high":
      case "critical":
        return <WarningIcon className="w-5 h-5 text-red-500" />;
      case "medium":
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
    const transactions = getFilteredTransactionsModal();
    if (transactions.length === 0) {
      toast.warning("No transactions to export");
      return;
    }

    const headers = [
      "Date",
      "Description",
      "Category",
      "Type",
      "Amount (RWF)",
      "User",
      "Notes",
    ];
    const rows = transactions.map((t) => [
      formatDate(t.date),
      t.description || "N/A",
      t.category || "N/A",
      t.type || "N/A",
      t.amount || 0,
      t.user || "N/A",
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
    a.download = `transactions_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Transactions exported successfully");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnBottom
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
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl">
                <SavingsIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">HEMS</h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Household Expense Management System
                </p>
                <p className="text-[10px] text-gray-400 hidden sm:block">
                  Currency: RWF
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
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
                className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
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
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <NotificationsIcon className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" />
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                      Notifications
                    </h2>
                    <p className="text-xs text-gray-500">
                      {getUnreadCount()} unread · {notifications?.length || 0}{" "}
                      total
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsNotificationModalOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <CloseIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                </button>
              </div>

              {/* Filter and Actions Bar */}
              <div className="p-3 sm:p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2 flex-wrap gap-1">
                  <button
                    onClick={() => setNotificationFilter("all")}
                    className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full transition-colors ${
                      notificationFilter === "all"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setNotificationFilter("unread")}
                    className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full transition-colors ${
                      notificationFilter === "unread"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Unread
                    {getUnreadCount() > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                        {getUnreadCount()}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setNotificationFilter("read")}
                    className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full transition-colors ${
                      notificationFilter === "read"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Read
                  </button>
                </div>
                <div className="flex items-center space-x-2 flex-wrap gap-1">
                  {getUnreadCount() > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors flex items-center space-x-1"
                    >
                      <DoneAllIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Mark all read</span>
                    </button>
                  )}
                  {notifications?.length > 0 && (
                    <button
                      onClick={deleteAllNotifications}
                      className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors flex items-center space-x-1"
                    >
                      <DeleteIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Delete all</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Notification List */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
                {getFilteredNotifications().length > 0 ? (
                  getFilteredNotifications().map((notification) => (
                    <motion.div
                      key={notification._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`p-3 sm:p-4 rounded-xl border transition-all ${
                        notification.isRead
                          ? "bg-white border-gray-200 opacity-75"
                          : "bg-blue-50/50 border-blue-200 shadow-sm"
                      } ${getSeverityColor(notification.severity)}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div className="flex items-start space-x-3 flex-1 min-w-0">
                          <div className="mt-0.5 flex-shrink-0">
                            {getSeverityIcon(notification.severity)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span
                                className={`text-sm font-semibold ${
                                  notification.isRead
                                    ? "text-gray-600"
                                    : "text-gray-900"
                                }`}
                              >
                                {notification.title || "Notification"}
                              </span>
                              {!notification.isRead && (
                                <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full flex-shrink-0">
                                  New
                                </span>
                              )}
                              <span
                                className={`px-2 py-0.5 text-xs rounded-full flex-shrink-0 ${
                                  notification.severity === "high" ||
                                  notification.severity === "critical"
                                    ? "bg-red-200 text-red-800"
                                    : notification.severity === "medium"
                                      ? "bg-yellow-200 text-yellow-800"
                                      : "bg-blue-200 text-blue-800"
                                }`}
                              >
                                {notification.severity || "low"}
                              </span>
                            </div>
                            <p
                              className={`text-sm ${notification.isRead ? "text-gray-600" : "text-gray-800"} break-words`}
                            >
                              {notification.message}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
                              <span className="text-xs text-gray-500">
                                {formatDateTime(notification.createdAt)}
                              </span>
                              {notification.type && (
                                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                                  {notification.type}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 ml-0 sm:ml-4 flex-shrink-0">
                          <button
                            onClick={() =>
                              toggleNotificationRead(notification._id)
                            }
                            className="p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                            title={
                              notification.isRead
                                ? "Mark as unread"
                                : "Mark as read"
                            }
                          >
                            {notification.isRead ? (
                              <MarkunreadIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                            ) : (
                              <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                            )}
                          </button>
                          <button
                            onClick={() => deleteNotification(notification._id)}
                            className="p-1.5 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <DeleteIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-red-600" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <NotificationsIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
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
              <div className="p-3 sm:p-4 border-t border-gray-200 bg-gray-50 rounded-b-3xl">
                <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 gap-2">
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
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <ReceiptIcon className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                      All Transactions
                    </h2>
                    <p className="text-xs text-gray-500">
                      {getFilteredTransactionsModal().length} transactions ·{" "}
                      {allTransactions.length} total
                    </p>
                    <p className="text-[10px] text-gray-400">Amounts in RWF</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsTransactionsModalOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <CloseIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                </button>
              </div>

              {/* Filter and Search Bar */}
              <div className="p-3 sm:p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2 flex-wrap gap-1">
                  <button
                    onClick={() => setTransactionFilter("all")}
                    className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full transition-colors ${
                      transactionFilter === "all"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setTransactionFilter("income")}
                    className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full transition-colors ${
                      transactionFilter === "income"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Income
                  </button>
                  <button
                    onClick={() => setTransactionFilter("expense")}
                    className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full transition-colors ${
                      transactionFilter === "expense"
                        ? "bg-red-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Expenses
                  </button>
                </div>
                <div className="flex items-center space-x-2 flex-1 min-w-[200px] max-w-md">
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
                    className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors flex items-center space-x-1 flex-shrink-0"
                  >
                    <DownloadIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Export</span>
                  </button>
                </div>
              </div>

              {/* Transactions List */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                {getFilteredTransactionsModal().length > 0 ? (
                  <div className="space-y-2">
                    {getFilteredTransactionsModal().map((transaction) => (
                      <motion.div
                        key={transaction._id || transaction.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-3 sm:p-4 rounded-xl border ${
                          transaction.type === "income"
                            ? "bg-green-50 border-green-200"
                            : "bg-red-50 border-red-200"
                        } hover:shadow-md transition-all`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-semibold text-gray-800 truncate">
                                {transaction.description || "N/A"}
                              </h4>
                              <span
                                className={`px-2 py-0.5 text-xs rounded-full flex-shrink-0 ${
                                  transaction.type === "income"
                                    ? "bg-green-200 text-green-800"
                                    : "bg-red-200 text-red-800"
                                }`}
                              >
                                {transaction.type}
                              </span>
                              <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full flex-shrink-0">
                                {transaction.category || "N/A"}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 text-xs sm:text-sm text-gray-600">
                              <span>{formatDate(transaction.date)}</span>
                              {transaction.user && (
                                <span>• {transaction.user}</span>
                              )}
                              {transaction.description &&
                                transaction.description !==
                                  transaction.category && (
                                  <span className="text-gray-500 truncate">
                                    • {transaction.description}
                                  </span>
                                )}
                            </div>
                          </div>
                          <div
                            className={`text-base sm:text-lg font-bold flex-shrink-0 ${
                              transaction.type === "income"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {transaction.type === "income" ? "+" : "-"}
                            {formatCurrency(transaction.amount || 0)}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <ReceiptIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
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
              <div className="p-3 sm:p-4 border-t border-gray-200 bg-gray-50 rounded-b-3xl">
                <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 gap-2">
                  <span>
                    {getFilteredTransactionsModal().length} transaction
                    {getFilteredTransactionsModal().length !== 1 ? "s" : ""}{" "}
                    showing
                  </span>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <span className="text-green-600">
                      Income:{" "}
                      {formatCurrency(
                        getFilteredTransactionsModal()
                          .filter((t) => t.type === "income")
                          .reduce((sum, t) => sum + (t.amount || 0), 0),
                      )}
                    </span>
                    <span className="text-red-600">
                      Expenses:{" "}
                      {formatCurrency(
                        getFilteredTransactionsModal()
                          .filter((t) => t.type === "expense")
                          .reduce((sum, t) => sum + (t.amount || 0), 0),
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
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <FamilyRestroomIcon className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" />
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                      Household Members
                    </h2>
                    <p className="text-xs text-gray-500">
                      {householdDetails?.householdName || "Household"} ·{" "}
                      {householdDetails?.members?.length || 0} members
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsHouseholdModalOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <CloseIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                </button>
              </div>

              {/* Household Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {householdDetails?.members &&
                householdDetails.members.length > 0 ? (
                  <>
                    {/* Household Info */}
                    <div className="mb-6 p-4 bg-purple-50 rounded-xl">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-600">
                            Household Name
                          </p>
                          <p className="text-sm font-semibold text-gray-800">
                            {householdDetails.householdName || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Total Members</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {householdDetails.members.length}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Admin</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {householdDetails.members.find(
                              (m) => m.role === "admin",
                            )?.name || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Address</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {householdDetails.address || "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Category Breakdown */}
                    {categoryBreakdown.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-800 mb-3">
                          Category Breakdown
                        </h4>
                        <div className="space-y-3">
                          {categoryBreakdown.map((cat, index) => (
                            <div key={index}>
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-gray-700">
                                  {cat.category}
                                </span>
                                <span className="font-medium text-gray-800">
                                  {formatCurrency(cat.amount)} ({cat.percentage}
                                  %)
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
                    )}

                    {/* Members List */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                        <GroupIcon className="w-5 h-5 mr-2 text-purple-600" />
                        All Members ({householdDetails.members.length})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {householdDetails.members.map((member, index) => (
                          <div
                            key={member._id || index}
                            className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-all"
                          >
                            <div className="flex items-start space-x-3">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  member.role === "admin"
                                    ? "bg-purple-100"
                                    : "bg-blue-100"
                                }`}
                              >
                                <PersonIcon
                                  className={`w-5 h-5 ${
                                    member.role === "admin"
                                      ? "text-purple-600"
                                      : "text-blue-600"
                                  }`}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium text-gray-800 truncate">
                                    {member.name}
                                  </p>
                                  {member.role === "admin" && (
                                    <span className="px-2 py-0.5 bg-purple-200 text-purple-800 text-xs rounded-full flex-shrink-0">
                                      Admin
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 truncate">
                                  {member.role || "Member"}
                                </p>
                                <div className="flex flex-col gap-0.5 mt-1">
                                  {member.email && (
                                    <span className="text-xs text-gray-400 flex items-center truncate">
                                      <EmailIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                                      <span className="truncate text-xs">
                                        {member.email}
                                      </span>
                                    </span>
                                  )}
                                  {member.phone && (
                                    <span className="text-xs text-gray-400 flex items-center">
                                      <PhoneIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                                      <span className="text-xs">
                                        {member.phone}
                                      </span>
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  {member.isVerified && (
                                    <span className="text-xs text-green-600 flex items-center">
                                      <CheckCircleIcon className="w-3 h-3 mr-0.5" />
                                      Verified
                                    </span>
                                  )}
                                  {member.joinedAt && (
                                    <span className="text-xs text-gray-400">
                                      Joined: {formatDate(member.joinedAt)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <FamilyRestroomIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">
                      No household members found
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Please set up your household information
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-3 sm:p-4 border-t border-gray-200 bg-gray-50 rounded-b-3xl">
                <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 gap-2">
                  <span>
                    {householdDetails?.members?.length || 0} members in
                    household
                  </span>
                  <span>{categoryBreakdown.length} categories tracked</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm">Loading dashboard data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Welcome Section */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                Welcome back, {user?.name}!
              </h2>
              <p className="text-gray-600 mt-1 text-sm">
                Here's an overview of your household finances
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                All amounts are in Rwandan Francs (RWF)
              </p>
            </div>

            {/* Budget Alerts Section */}
            {stats.budgetAlerts?.filter((a) => !a.read).length > 0 && (
              <div className="mb-6 p-3 sm:p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-xl">
                <div className="flex items-start">
                  <WarningIcon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <h4 className="font-semibold text-yellow-800 text-sm">
                      Unread Budget Alerts (
                      {stats.budgetAlerts.filter((a) => !a.read).length})
                    </h4>
                    <ul className="mt-1 space-y-1">
                      {stats.budgetAlerts
                        .filter((a) => !a.read)
                        .slice(0, 3)
                        .map((alert) => (
                          <li
                            key={alert.id}
                            className="text-sm text-yellow-700 break-words"
                          >
                            {alert.category}: {alert.message}
                            {alert.percentageUsed && (
                              <span className="ml-2 text-xs font-medium">
                                ({Math.round(alert.percentageUsed)}% used)
                              </span>
                            )}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border-l-4 border-blue-500"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm text-gray-500 font-medium">
                      Total Income
                    </p>
                    <p className="text-xl font-bold text-gray-800 mt-1 truncate">
                      {formatCurrency(stats.totalIncome)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUpIcon className="text-blue-600 w-6 h-6" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border-l-4 border-red-500"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm text-gray-500 font-medium">
                      Total Expenses
                    </p>
                    <p className="text-xl font-bold text-gray-800 mt-1 truncate">
                      {formatCurrency(stats.totalExpenses)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingDownIcon className="text-red-600 w-6 h-6" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border-l-4 border-green-500"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm text-gray-500 font-medium">Savings</p>
                    <p className="text-xl font-bold text-gray-800 mt-1 truncate">
                      {formatCurrency(stats.savings)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <SavingsIcon className="text-green-600 w-6 h-6" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border-l-4 border-purple-500"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm text-gray-500 font-medium">
                      Monthly Expenses
                    </p>
                    <p className="text-xl font-bold text-gray-800 mt-1 truncate">
                      {formatCurrency(stats.monthlyExpenses)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CalendarTodayIcon className="text-purple-600 w-6 h-6" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Recent Transactions and Alerts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Recent Transactions - Takes 2/3 of the space */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-sm sm:text-base font-bold text-gray-800 flex items-center">
                    <ReceiptIcon className="mr-2 w-5 h-5 sm:w-6 sm:h-6" />
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
                  <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <table className="w-full min-w-[500px]">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 sm:py-3 px-3 sm:px-4 text-xs font-semibold text-gray-600">
                            Description
                          </th>
                          <th className="text-left py-2 sm:py-3 px-3 sm:px-4 text-xs font-semibold text-gray-600">
                            Category
                          </th>
                          <th className="text-left py-2 sm:py-3 px-3 sm:px-4 text-xs font-semibold text-gray-600 hidden sm:table-cell">
                            Date
                          </th>
                          <th className="text-right py-2 sm:py-3 px-3 sm:px-4 text-xs font-semibold text-gray-600">
                            Amount (RWF)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentTransactions
                          .slice(0, 6)
                          .map((transaction, index) => (
                            <motion.tr
                              key={transaction._id || transaction.id || index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                              onClick={() => setIsTransactionsModalOpen(true)}
                            >
                              <td className="py-2 sm:py-3 px-3 sm:px-4 text-sm text-gray-800 truncate max-w-[100px] sm:max-w-[150px]">
                                {transaction.description || "N/A"}
                              </td>
                              <td className="py-2 sm:py-3 px-3 sm:px-4">
                                <span
                                  className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                                    transaction.type === "income"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {transaction.category || "N/A"}
                                </span>
                              </td>
                              <td className="py-2 sm:py-3 px-3 sm:px-4 text-sm text-gray-600 hidden sm:table-cell">
                                {formatDate(transaction.date)}
                              </td>
                              <td
                                className={`py-2 sm:py-3 px-3 sm:px-4 text-right text-sm font-semibold ${
                                  transaction.type === "income"
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {transaction.type === "income" ? "+" : "-"}
                                {formatCurrency(transaction.amount || 0)}
                              </td>
                            </motion.tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8">
                    <ReceiptIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm">No transactions yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Start adding your expenses and income
                    </p>
                  </div>
                )}
              </div>

              {/* Household Summary - Takes 1/3 of the space */}
              <div
                className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 cursor-pointer hover:shadow-xl transition-all"
                onClick={() => setIsHouseholdModalOpen(true)}
              >
                <h3 className="text-sm sm:text-base font-bold text-gray-800 flex items-center mb-4 sm:mb-6">
                  <FamilyRestroomIcon className="mr-2 w-5 h-5 sm:w-6 sm:h-6" />
                  Household Summary
                  <span className="ml-2 text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full flex-shrink-0">
                    Click for details
                  </span>
                </h3>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                    <div className="min-w-0">
                      <p className="text-sm text-gray-600">Household Members</p>
                      <p className="text-lg font-bold text-blue-700">
                        {stats.membersCount}
                      </p>
                    </div>
                    <FamilyRestroomIcon className="w-8 h-8 text-blue-600 flex-shrink-0" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                    <div className="min-w-0">
                      <p className="text-sm text-gray-600">Monthly Budget</p>
                      <p className="text-lg font-bold text-green-700 truncate">
                        {formatCurrency(stats.monthlyBudget)}
                      </p>
                    </div>
                    <AttachMoneyIcon className="w-8 h-8 text-green-600 flex-shrink-0" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                    <div className="min-w-0">
                      <p className="text-sm text-gray-600">Budget Used</p>
                      <p className="text-lg font-bold text-purple-700">
                        {stats.monthlyBudget && stats.monthlyBudget > 0
                          ? Math.min(
                              Math.round(
                                (stats.monthlyExpenses / stats.monthlyBudget) *
                                  100,
                              ),
                              100,
                            )
                          : 0}
                        %
                      </p>
                    </div>
                    <AnalyticsIcon className="w-8 h-8 text-purple-600 flex-shrink-0" />
                  </div>

                  <div
                    className="mt-2 sm:mt-4 p-3 bg-yellow-50 rounded-xl cursor-pointer hover:bg-yellow-100 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsNotificationModalOpen(true);
                    }}
                  >
                    <p className="text-sm text-gray-600 flex items-center">
                      <WarningIcon className="w-4 h-4 text-yellow-600 mr-1" />
                      Notifications
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-yellow-700">
                        {getUnreadCount()} unread
                      </p>
                      <span className="text-sm text-yellow-600">
                        Click to view →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mt-6 sm:mt-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl shadow-lg p-4 sm:p-6 text-left hover:shadow-xl transition-all duration-300"
                onClick={() => toast.info("Add Expense feature coming soon!")}
              >
                <AttachMoneyIcon className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2" />
                <h4 className="font-semibold text-sm sm:text-base">
                  Add Expense
                </h4>
                <p className="text-xs opacity-90 mt-0.5 sm:mt-1">
                  Record a new expense
                </p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl shadow-lg p-4 sm:p-6 text-left hover:shadow-xl transition-all duration-300"
                onClick={() => toast.info("Add Income feature coming soon!")}
              >
                <TrendingUpIcon className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2" />
                <h4 className="font-semibold text-sm sm:text-base">
                  Add Income
                </h4>
                <p className="text-xs opacity-90 mt-0.5 sm:mt-1">
                  Record new income
                </p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl shadow-lg p-4 sm:p-6 text-left hover:shadow-xl transition-all duration-300"
                onClick={() => toast.info("Reports feature coming soon!")}
              >
                <AnalyticsIcon className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2" />
                <h4 className="font-semibold text-sm sm:text-base">
                  View Reports
                </h4>
                <p className="text-xs opacity-90 mt-0.5 sm:mt-1">
                  See detailed analytics
                </p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl shadow-lg p-4 sm:p-6 text-left hover:shadow-xl transition-all duration-300"
                onClick={() => setIsHouseholdModalOpen(true)}
              >
                <FamilyRestroomIcon className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2" />
                <h4 className="font-semibold text-sm sm:text-base">
                  Manage Members
                </h4>
                <p className="text-xs opacity-90 mt-0.5 sm:mt-1">
                  Add or remove members
                </p>
              </motion.button>
            </div>

            {/* Features Highlight */}
            <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg">
              <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-3 sm:mb-4 flex items-center">
                <SavingsIcon className="mr-2 text-purple-600 w-5 h-5 sm:w-6 sm:h-6" />
                System Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-sm font-bold">1</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 text-sm">
                      Real-time Tracking
                    </p>
                    <p className="text-xs text-gray-600">
                      Record income & expenses instantly
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 text-sm font-bold">2</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 text-sm">
                      Budget Alerts
                    </p>
                    <p className="text-xs text-gray-600">
                      Get notified when approaching limits
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 text-sm font-bold">3</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 text-sm">
                      Multi-User Support
                    </p>
                    <p className="text-xs text-gray-600">
                      Manage family finances together
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-600 text-sm font-bold">4</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 text-sm">
                      Reports & Analytics
                    </p>
                    <p className="text-xs text-gray-600">
                      Make informed decisions
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-gray-200">
              <p className="text-xs sm:text-sm text-gray-500 text-center">
                Household Expense Management System (HEMS) — Designed to improve
                accuracy, transparency, and efficiency in tracking household
                income and expenditure.
                <span className="block mt-1">
                  Supporting multiple household members, budget alerts, and
                  financial reporting.
                </span>
                <span className="block mt-1 text-gray-400">
                  All amounts displayed in Rwandan Francs (RWF)
                </span>
              </p>
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
