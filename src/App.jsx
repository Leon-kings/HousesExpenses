/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/immutability */

// /* eslint-disable react-hooks/set-state-in-effect */
// /* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
//   useLocation,
//   useNavigate,
// } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";

// // Import components
// import { Front } from "./components/index/Front";

// // Material Icons
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import LogoutIcon from "@mui/icons-material/Logout";
// import PersonIcon from "@mui/icons-material/Person";
// import PeopleIcon from "@mui/icons-material/People";
// import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
// import ReceiptIcon from "@mui/icons-material/Receipt";
// import TrendingUpIcon from "@mui/icons-material/TrendingUp";
// import TrendingDownIcon from "@mui/icons-material/TrendingDown";
// import SettingsIcon from "@mui/icons-material/Settings";
// import SavingsIcon from "@mui/icons-material/Savings";
// import MenuIcon from "@mui/icons-material/Menu";
// import CloseIcon from "@mui/icons-material/Close";
// import BarChartIcon from "@mui/icons-material/BarChart";
// import HomeIcon from "@mui/icons-material/Home";
// import NotificationsIcon from "@mui/icons-material/Notifications";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import ErrorIcon from "@mui/icons-material/Error";
// import WarningIcon from "@mui/icons-material/Warning";
// import InfoIcon from "@mui/icons-material/Info";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import { Dashboard } from "./components/dashboard/admin/Dashboard";
// import { UserDashboard } from "./components/dashboard/user/UserDashboard";
// import { ExpensesDashboard } from "./components/dashboard/admin/components/expenses/ExpensesManagement";
// import { ReportDashboard } from "./components/dashboard/admin/components/report/ReportManagement";
// import { UserManagement } from "./components/dashboard/admin/components/user/UserManagement";
// import { IncomeManagement } from "./components/dashboard/admin/components/incame/IncomeManagement";
// import { SavingsManagement } from "./components/dashboard/admin/components/savings/SavingManagement";
// import { Money } from "@mui/icons-material";
// import { BudgetManagement } from "./components/dashboard/admin/components/budget/BudgetManagement";
// import { UserProfile } from "./components/dashboard/user/components/me/Myprofile";
// import { MyExpense } from "./components/dashboard/user/components/expenses/MyExpenses";
// import { MyIncome } from "./components/dashboard/user/components/incame/MyIncame";
// import { MyBudget } from "./components/dashboard/user/components/budget/MyBudget";
// import { MySaving } from "./components/dashboard/user/components/saving/MySaving";
// import { MyReport } from "./components/dashboard/user/components/report/MyReport";

// // Axios instance configuration
// const API_BASE_URL =
//   "https://household-expenses-management-system.onrender.com/api";

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Static user data for demo
// const DEMO_USERS = {
//   admin: {
//     email: "admin@example.com",
//     password: "admin",
//     name: "Admin User",
//     role: "admin",
//     id: 1,
//   },
// };

// // Protected Route Component
// const ProtectedRoute = ({ children, allowedRoles = [] }) => {
//   const token = localStorage.getItem("authToken");
//   const userData = JSON.parse(localStorage.getItem("userData") || "null");

//   if (!token || !userData) {
//     return <Navigate to="/" replace />;
//   }

//   if (allowedRoles.length > 0 && !allowedRoles.includes(userData.role)) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

// // Notification Modal Component - Integrated with API using Axios
// const NotificationModal = ({
//   isOpen,
//   onClose,
//   userEmail,
//   onDelete,
//   onUpdate,
//   onConfirm,
// }) => {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedNotification, setSelectedNotification] = useState(null);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [showFailModal, setShowFailModal] = useState(false);
//   const [showUpdateModal, setShowUpdateModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [actionMessage, setActionMessage] = useState("");

//   // Fetch notifications when modal opens
//   useEffect(() => {
//     if (isOpen && userEmail) {
//       fetchNotifications();
//     }
//   }, [isOpen, userEmail]);

//   const fetchNotifications = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await api.get("/notifications/all");
//       if (response.data.success) {
//         setNotifications(response.data.notifications || []);
//       } else {
//         throw new Error(
//           response.data.message || "Failed to load notifications",
//         );
//       }
//     } catch (err) {
//       setError(err.message);
//       toast.error("Failed to load notifications");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getNotificationIcon = (type, severity) => {
//     // Map notification types to icons
//     const typeMap = {
//       savings_milestone: <SavingsIcon className="text-purple-500" />,
//       contact: <InfoIcon className="text-blue-500" />,
//       budget_alert: <WarningIcon className="text-yellow-500" />,
//       expense_added: <AttachMoneyIcon className="text-green-500" />,
//       payment_failed: <ErrorIcon className="text-red-500" />,
//     };

//     // Fallback based on severity
//     if (severity === "high") return <ErrorIcon className="text-red-500" />;
//     if (severity === "medium")
//       return <WarningIcon className="text-yellow-500" />;

//     return typeMap[type] || <InfoIcon className="text-blue-500" />;
//   };

//   const getNotificationColor = (type, severity) => {
//     // Map types to colors
//     const typeColorMap = {
//       savings_milestone: "border-purple-500 bg-purple-50",
//       contact: "border-blue-500 bg-blue-50",
//       budget_alert: "border-yellow-500 bg-yellow-50",
//       expense_added: "border-green-500 bg-green-50",
//       payment_failed: "border-red-500 bg-red-50",
//     };

//     // Fallback based on severity
//     if (severity === "high") return "border-red-500 bg-red-50";
//     if (severity === "medium") return "border-yellow-500 bg-yellow-50";
//     if (severity === "low") return "border-blue-500 bg-blue-50";

//     return typeColorMap[type] || "border-gray-300 bg-gray-50";
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffMs = now - date;
//     const diffMins = Math.floor(diffMs / 60000);
//     const diffHours = Math.floor(diffMs / 3600000);
//     const diffDays = Math.floor(diffMs / 86400000);

//     if (diffMins < 1) return "Just now";
//     if (diffMins < 60)
//       return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
//     if (diffHours < 24)
//       return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
//     if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     });
//   };

//   const handleDelete = (notification) => {
//     setSelectedNotification(notification);
//     setShowDeleteModal(true);
//   };

//   const handleUpdate = (notification) => {
//     setSelectedNotification(notification);
//     setShowUpdateModal(true);
//   };

//   const handleConfirm = (notification) => {
//     setSelectedNotification(notification);
//     setShowConfirmModal(true);
//   };

//   // API calls using Axios
//   const confirmDelete = async () => {
//     if (!selectedNotification) return;

//     try {
//       const response = await api.delete(
//         `/notifications/${selectedNotification._id}`,
//       );

//       if (response.data.success) {
//         setNotifications(
//           notifications.filter((n) => n._id !== selectedNotification._id),
//         );
//         setShowDeleteModal(false);
//         setActionMessage("Notification deleted successfully!");
//         setShowSuccessModal(true);
//         setTimeout(() => setShowSuccessModal(false), 2000);
//         toast.success("Notification deleted successfully!");
//         if (onDelete) onDelete(selectedNotification._id);
//       } else {
//         throw new Error(response.data.message || "Delete failed");
//       }
//     } catch (err) {
//       setShowDeleteModal(false);
//       setActionMessage(
//         err.response?.data?.message || err.message || "Delete failed",
//       );
//       setShowFailModal(true);
//       setTimeout(() => setShowFailModal(false), 3000);
//       toast.error("Failed to delete notification");
//     }
//   };

//   const confirmUpdate = async () => {
//     if (!selectedNotification) return;

//     try {
//       const response = await api.put(
//         `/notifications/read/${selectedNotification._id}`,
//       );

//       if (response.data.success) {
//         // Update local state
//         const updatedNotifications = notifications.map((notif) =>
//           notif._id === selectedNotification._id
//             ? { ...notif, isRead: true }
//             : notif,
//         );
//         setNotifications(updatedNotifications);
//         setShowUpdateModal(false);
//         setActionMessage("Notification marked as read!");
//         setShowSuccessModal(true);
//         setTimeout(() => setShowSuccessModal(false), 2000);
//         toast.success("Notification marked as read!");
//         if (onUpdate) onUpdate(selectedNotification._id);
//       } else {
//         throw new Error(response.data.message || "Update failed");
//       }
//     } catch (err) {
//       setShowUpdateModal(false);
//       setActionMessage(
//         err.response?.data?.message || err.message || "Update failed",
//       );
//       setShowFailModal(true);
//       setTimeout(() => setShowFailModal(false), 3000);
//       toast.error("Failed to update notification");
//     }
//   };

//   const confirmAction = async () => {
//     if (!selectedNotification) return;

//     try {
//       const response = await api.put(
//         `/notifications/read/${selectedNotification._id}`,
//       );

//       if (response.data.success) {
//         const updatedNotifications = notifications.map((notif) =>
//           notif._id === selectedNotification._id
//             ? { ...notif, isRead: true, confirmed: true }
//             : notif,
//         );
//         setNotifications(updatedNotifications);
//         setShowConfirmModal(false);
//         setActionMessage("Notification confirmed!");
//         setShowSuccessModal(true);
//         setTimeout(() => setShowSuccessModal(false), 2000);
//         toast.success("Notification confirmed!");
//         if (onConfirm) onConfirm(selectedNotification._id);
//       } else {
//         throw new Error(response.data.message || "Confirmation failed");
//       }
//     } catch (err) {
//       setShowConfirmModal(false);
//       setActionMessage(
//         err.response?.data?.message || err.message || "Confirmation failed",
//       );
//       setShowFailModal(true);
//       setTimeout(() => setShowFailModal(false), 3000);
//       toast.error("Failed to confirm notification");
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <>
//       {/* Main Notification Modal */}
//       <div className="fixed inset-0 z-50 overflow-y-auto">
//         <div className="flex items-center justify-center min-h-screen px-4 py-6">
//           <div
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
//             onClick={onClose}
//           ></div>

//           <div
//             className="relative bg-white rounded-2xl shadow-2xl transform transition-all w-full 
//                         sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl max-h-[90vh]"
//           >
//             {/* Header */}
//             <div className="bg-white px-4 sm:px-6 pt-5 pb-4 border-b border-gray-200 rounded-t-2xl">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-2">
//                   <NotificationsIcon className="text-purple-600 w-5 h-5 sm:w-6 sm:h-6" />
//                   <h3 className="text-base sm:text-lg font-semibold text-gray-900">
//                     Notifications
//                   </h3>
//                   <span className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full">
//                     {notifications?.length || 0}
//                   </span>
//                   <button
//                     onClick={fetchNotifications}
//                     className="ml-2 p-1 text-gray-400 hover:text-purple-600 transition-colors"
//                     title="Refresh"
//                   >
//                     <svg
//                       className="w-4 h-4"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//                       />
//                     </svg>
//                   </button>
//                 </div>
//                 <button
//                   onClick={onClose}
//                   className="text-gray-400 hover:text-gray-500 transition-colors p-1 hover:bg-gray-100 rounded-full"
//                 >
//                   <CloseIcon className="w-5 h-5 sm:w-6 sm:h-6" />
//                 </button>
//               </div>
//             </div>

//             {/* Body */}
//             <div className="px-4 sm:px-6 py-4 max-h-[60vh] overflow-y-auto">
//               {loading ? (
//                 <div className="flex justify-center items-center py-8">
//                   <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
//                 </div>
//               ) : error ? (
//                 <div className="text-center py-8">
//                   <ErrorIcon className="text-red-400 w-12 h-12 mx-auto mb-3" />
//                   <p className="text-red-500 text-sm">{error}</p>
//                   <button
//                     onClick={fetchNotifications}
//                     className="mt-3 text-purple-600 hover:text-purple-700 text-sm font-medium"
//                   >
//                     Try Again
//                   </button>
//                 </div>
//               ) : notifications && notifications.length > 0 ? (
//                 <div className="space-y-3">
//                   {notifications.map((notification) => (
//                     <div
//                       key={notification._id}
//                       className={`p-3 sm:p-4 border-l-4 rounded-lg ${getNotificationColor(notification.type, notification.severity)} transition-all hover:shadow-md ${notification.isRead ? "opacity-70" : ""}`}
//                     >
//                       <div className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-3">
//                         <div className="flex-shrink-0 mt-0.5">
//                           {getNotificationIcon(
//                             notification.type,
//                             notification.severity,
//                           )}
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-start justify-between">
//                             <p className="text-sm font-medium text-gray-900">
//                               {notification.title}
//                               {!notification.isRead && (
//                                 <span className="ml-2 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
//                               )}
//                             </p>
//                             {notification.severity && (
//                               <span
//                                 className={`text-xs px-2 py-0.5 rounded-full ml-2 flex-shrink-0 ${
//                                   notification.severity === "high"
//                                     ? "bg-red-100 text-red-700"
//                                     : notification.severity === "medium"
//                                       ? "bg-yellow-100 text-yellow-700"
//                                       : "bg-blue-100 text-blue-700"
//                                 }`}
//                               >
//                                 {notification.severity}
//                               </span>
//                             )}
//                           </div>
//                           <p className="text-sm text-gray-600 mt-1 break-words">
//                             {notification.message}
//                           </p>
//                           <div className="flex items-center justify-between mt-2">
//                             <p className="text-xs text-gray-400">
//                               {formatDate(notification.createdAt)}
//                             </p>
//                             <div className="flex space-x-1 sm:space-x-2">
//                               <button
//                                 onClick={() => handleUpdate(notification)}
//                                 className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
//                                 title="Mark as Read"
//                               >
//                                 <EditIcon className="w-4 h-4" />
//                               </button>
//                               <button
//                                 onClick={() => handleDelete(notification)}
//                                 className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors"
//                                 title="Delete"
//                               >
//                                 <DeleteIcon className="w-4 h-4" />
//                               </button>
//                               <button
//                                 onClick={() => handleConfirm(notification)}
//                                 className="p-1.5 text-green-600 hover:bg-green-50 rounded-full transition-colors"
//                                 title="Confirm"
//                               >
//                                 <CheckCircleIcon className="w-4 h-4" />
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-8 sm:py-12">
//                   <NotificationsIcon className="text-gray-300 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3" />
//                   <p className="text-gray-500 text-sm sm:text-base">
//                     No notifications
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Delete Confirmation Modal */}
//       {showDeleteModal && (
//         <div className="fixed inset-0 z-60 overflow-y-auto">
//           <div className="flex items-center justify-center min-h-screen px-4 py-6">
//             <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
//             <div className="relative bg-white rounded-2xl max-w-sm w-full sm:max-w-md p-6 shadow-2xl mx-4">
//               <div className="text-center">
//                 <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
//                   <DeleteIcon className="h-6 w-6 text-red-600" />
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                   Delete Notification
//                 </h3>
//                 <p className="text-sm text-gray-500 mb-6">
//                   Are you sure you want to delete this notification? This action
//                   cannot be undone.
//                 </p>
//                 <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 justify-center">
//                   <button
//                     onClick={() => setShowDeleteModal(false)}
//                     className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors w-full sm:w-auto"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={confirmDelete}
//                     className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors w-full sm:w-auto"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Update Modal */}
//       {showUpdateModal && (
//         <div className="fixed inset-0 z-60 overflow-y-auto">
//           <div className="flex items-center justify-center min-h-screen px-4 py-6">
//             <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
//             <div className="relative bg-white rounded-2xl max-w-sm w-full sm:max-w-md p-6 shadow-2xl mx-4">
//               <div className="text-center">
//                 <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
//                   <EditIcon className="h-6 w-6 text-blue-600" />
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                   Mark as Read
//                 </h3>
//                 <p className="text-sm text-gray-500 mb-6">
//                   Are you sure you want to mark this notification as read?
//                 </p>
//                 <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 justify-center">
//                   <button
//                     onClick={() => setShowUpdateModal(false)}
//                     className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors w-full sm:w-auto"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={confirmUpdate}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
//                   >
//                     Mark as Read
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Confirm Action Modal */}
//       {showConfirmModal && (
//         <div className="fixed inset-0 z-60 overflow-y-auto">
//           <div className="flex items-center justify-center min-h-screen px-4 py-6">
//             <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
//             <div className="relative bg-white rounded-2xl max-w-sm w-full sm:max-w-md p-6 shadow-2xl mx-4">
//               <div className="text-center">
//                 <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
//                   <CheckCircleIcon className="h-6 w-6 text-green-600" />
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                   Confirm Action
//                 </h3>
//                 <p className="text-sm text-gray-500 mb-6">
//                   Are you sure you want to confirm this notification action?
//                 </p>
//                 <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 justify-center">
//                   <button
//                     onClick={() => setShowConfirmModal(false)}
//                     className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors w-full sm:w-auto"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={confirmAction}
//                     className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full sm:w-auto"
//                   >
//                     Confirm
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Success Modal */}
//       {showSuccessModal && (
//         <div className="fixed inset-0 z-70 overflow-y-auto">
//           <div className="flex items-center justify-center min-h-screen px-4 py-6">
//             <div className="fixed inset-0 bg-black/30 backdrop-blur-sm"></div>
//             <div className="relative bg-white rounded-2xl max-w-sm w-full sm:max-w-md p-8 shadow-2xl mx-4 animate-bounce">
//               <div className="text-center">
//                 <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
//                   <CheckCircleIcon className="h-8 w-8 text-green-600" />
//                 </div>
//                 <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
//                   Success!
//                 </h3>
//                 <p className="text-sm text-gray-500 mt-2">
//                   {actionMessage || "Action completed successfully."}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Fail Modal */}
//       {showFailModal && (
//         <div className="fixed inset-0 z-70 overflow-y-auto">
//           <div className="flex items-center justify-center min-h-screen px-4 py-6">
//             <div className="fixed inset-0 bg-black/30 backdrop-blur-sm"></div>
//             <div className="relative bg-white rounded-2xl max-w-sm w-full sm:max-w-md p-6 shadow-2xl mx-4">
//               <div className="text-center">
//                 <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
//                   <ErrorIcon className="h-8 w-8 text-red-600" />
//                 </div>
//                 <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
//                   Failed!
//                 </h3>
//                 <p className="text-sm text-gray-500 mt-2 mb-6">
//                   {actionMessage || "Action could not be completed."}
//                 </p>
//                 <button
//                   onClick={() => setShowFailModal(false)}
//                   className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors w-full sm:w-auto"
//                 >
//                   Try Again
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// // Sidebar Component
// const Sidebar = ({
//   user,
//   onLogout,
//   isOpen,
//   onToggle,
//   location,
//   onNotificationClick,
// }) => {
//   const navigate = useNavigate();

//   const adminMenuItems = [
//     {
//       id: "dashboard",
//       label: "Dashboard",
//       icon: <DashboardIcon />,
//       path: "/dashboard",
//     },
//     {
//       id: "users",
//       label: "Users",
//       icon: <PeopleIcon />,
//       path: "/dashboard/users",
//     },
//     {
//       id: "expenses",
//       label: "Expenses",
//       icon: <AttachMoneyIcon />,
//       path: "/dashboard/expenses",
//     },
//     {
//       id: "income",
//       label: "Income",
//       icon: <TrendingUpIcon />,
//       path: "/dashboard/income",
//     },
//     {
//       id: "savings",
//       label: "Savings",
//       icon: <SavingsIcon />,
//       path: "/dashboard/savings",
//     },
//     {
//       id: "budget",
//       label: "Budget",
//       icon: <Money />,
//       path: "/dashboard/budget",
//     },
//     {
//       id: "reports",
//       label: "Reports",
//       icon: <BarChartIcon />,
//       path: "/dashboard/reports",
//     },
//   ];

//   const userMenuItems = [
//     {
//       id: "dashboard",
//       label: "Dashboard",
//       icon: <DashboardIcon />,
//       path: "/user/dashboard",
//     },
//     {
//       id: "expenses",
//       label: "My Expenses",
//       icon: <AttachMoneyIcon />,
//       path: "/user/expenses",
//     },
//     {
//       id: "income",
//       label: "My Income",
//       icon: <TrendingUpIcon />,
//       path: "/user/income",
//     },
//     {
//       id: "budget",
//       label: "My Budget",
//       icon: <Money />,
//       path: "/user/budget",
//     },
//     {
//       id: "savings",
//       label: "My Savings",
//       icon: <SavingsIcon />,
//       path: "/user/savings",
//     },
//     {
//       id: "reports",
//       label: "Reports",
//       icon: <BarChartIcon />,
//       path: "/user/reports",
//     },
//   ];

//   const menuItems = user?.role === "admin" ? adminMenuItems : userMenuItems;
//   const isAdmin = user?.role === "admin";

//   const handleNavigation = (path) => {
//     navigate(path);
//     if (window.innerWidth < 1024) {
//       onToggle();
//     }
//   };

//   return (
//     <>
//       {/* Mobile Menu Button - Fixed position under navbar */}
//       <button
//         onClick={onToggle}
//         className={`lg:hidden fixed z-50 p-2.5 bg-white rounded-xl shadow-lg hover:bg-gray-50 transition-all duration-200 ${
//           isOpen ? "top-4 left-4" : "top-20 left-4"
//         }`}
//         style={{
//           top: isOpen ? "1rem" : "5rem",
//           left: "1rem",
//           boxShadow:
//             "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
//         }}
//       >
//         {isOpen ? (
//           <CloseIcon className="w-6 h-6 text-gray-700" />
//         ) : (
//           <MenuIcon className="w-6 h-6 text-gray-700" />
//         )}
//       </button>

//       {/* Sidebar */}
//       <div
//         className={`fixed top-0 left-0 h-full bg-white shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${
//           isOpen ? "translate-x-0" : "-translate-x-full"
//         } lg:translate-x-0 w-64 sm:w-72 md:w-80 lg:w-64 xl:w-72 2xl:w-80`}
//       >
//         <div className="flex flex-col h-full">
//           {/* Brand */}
//           <div className="p-4 sm:p-5 md:p-6 border-b border-gray-200">
//             <div className="flex items-center space-x-3">
//               <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl flex-shrink-0">
//                 <SavingsIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
//               </div>
//               <div className="min-w-0">
//                 <h1 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
//                   HEMS
//                 </h1>
//                 <p className="text-xs text-gray-500 truncate">
//                   {isAdmin ? "Admin Panel" : "User Panel"}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* User Info */}
//           <div className="p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
//             <div className="flex items-center space-x-3">
//               <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
//                 <PersonIcon className="text-white text-sm sm:text-base" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium text-gray-800 truncate">
//                   {user?.name}
//                 </p>
//                 <p className="text-xs text-gray-500 truncate">{user?.email}</p>
//               </div>
//             </div>
//           </div>

//           {/* Menu Items */}
//           <nav className="flex-1 p-3 sm:p-4 overflow-y-auto">
//             {menuItems.map((item) => (
//               <button
//                 key={item.id}
//                 onClick={() => handleNavigation(item.path)}
//                 className={`w-full flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200 mb-1 ${
//                   location.pathname === item.path
//                     ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
//                     : "text-gray-600 hover:bg-gray-100"
//                 }`}
//               >
//                 <span className="w-5 h-5 flex-shrink-0">{item.icon}</span>
//                 <span className="font-medium text-sm sm:text-base truncate">
//                   {item.label}
//                 </span>
//               </button>
//             ))}
//           </nav>

//           {/* Bottom Actions */}
//           <div className="p-3 sm:p-4 border-t border-gray-200 space-y-2">
//             <button
//               onClick={onNotificationClick}
//               className="w-full flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-purple-600 hover:bg-purple-50 transition-all duration-200 relative"
//             >
//               <NotificationsIcon className="w-5 h-5 flex-shrink-0" />
//               <span className="font-medium text-sm sm:text-base">
//                 Notifications
//               </span>
//               <span className="absolute top-2 right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                 +
//               </span>
//             </button>
//             <button
//               onClick={() => {
//                 onLogout();
//                 onToggle();
//               }}
//               className="w-full flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
//             >
//               <LogoutIcon className="w-5 h-5 flex-shrink-0" />
//               <span className="font-medium text-sm sm:text-base">Logout</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Overlay for mobile */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-30 lg:hidden"
//           onClick={onToggle}
//         />
//       )}
//     </>
//   );
// };

// // Layout with Sidebar
// const DashboardLayout = ({ children }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("authToken");
//     const userData = JSON.parse(localStorage.getItem("userData") || "null");

//     if (!token || !userData) {
//       navigate("/");
//       return;
//     }

//     setUser(userData);

//     const handleResize = () => {
//       const width = window.innerWidth;
//       if (width >= 1536) {
//         setIsSidebarOpen(true);
//       } else if (width >= 1280) {
//         setIsSidebarOpen(true);
//       } else if (width >= 1024) {
//         setIsSidebarOpen(true);
//       } else {
//         setIsSidebarOpen(false);
//       }
//     };

//     window.addEventListener("resize", handleResize);
//     handleResize();

//     return () => window.removeEventListener("resize", handleResize);
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem("authToken");
//     localStorage.removeItem("userData");
//     toast.success("Logged out successfully!");
//     navigate("/");
//   };

//   // Notification handlers
//   const handleDeleteNotification = (id) => {
//     // The actual deletion is handled in the modal
//     toast.info("Notification deleted");
//   };

//   const handleUpdateNotification = (id) => {
//     // The actual update is handled in the modal
//     toast.info("Notification marked as read");
//   };

//   const handleConfirmNotification = (id) => {
//     // The actual confirmation is handled in the modal
//     toast.info("Notification confirmed");
//   };

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="colored"
//       />

//       <Sidebar
//         user={user}
//         onLogout={handleLogout}
//         isOpen={isSidebarOpen}
//         onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
//         location={location}
//         onNotificationClick={() => setIsNotificationModalOpen(true)}
//       />

//       {/* Main Content */}
//       <div
//         className={`transition-all duration-300 ${
//           isSidebarOpen ? "lg:ml-64 xl:ml-72 2xl:ml-80" : "ml-0"
//         }`}
//       >
//         <div className="p-3 sm:p-4 md:p-6 lg:p-8">{children}</div>
//       </div>

//       {/* Notification Modal */}
//       <NotificationModal
//         isOpen={isNotificationModalOpen}
//         onClose={() => setIsNotificationModalOpen(false)}
//         userEmail={user?.email}
//         onDelete={handleDeleteNotification}
//         onUpdate={handleUpdateNotification}
//         onConfirm={handleConfirmNotification}
//       />
//     </div>
//   );
// };

// // Login handler for Front component
// export const handleLogin = (email, password) => {
//   // Check against demo users
//   if (
//     email === DEMO_USERS.admin.email &&
//     password === DEMO_USERS.admin.password
//   ) {
//     const userData = {
//       id: DEMO_USERS.admin.id,
//       name: DEMO_USERS.admin.name,
//       email: DEMO_USERS.admin.email,
//       role: DEMO_USERS.admin.role,
//     };

//     localStorage.setItem("authToken", "demo-token-12345");
//     localStorage.setItem("userData", JSON.stringify(userData));

//     toast.success("Welcome Admin! Redirecting to dashboard...");
//     return { success: true, user: userData };
//   }

//   // For demo purposes, also allow any email/password to login as regular user
//   if (email && password && password.length >= 4) {
//     const userData = {
//       id: 2,
//       name: email.split("@")[0] || "User",
//       email: email,
//       role: "user",
//     };

//     localStorage.setItem("authToken", "demo-user-token-67890");
//     localStorage.setItem("userData", JSON.stringify(userData));

//     toast.success("Welcome! Redirecting to dashboard...");
//     return { success: true, user: userData };
//   }

//   toast.error("Invalid email or password. Try admin@example.com / admin");
//   return { success: false };
// };

// // Currency configuration
// export const CURRENCY = {
//   code: "RWF",
//   symbol: "FRw",
//   name: "Rwandan Franc",
//   locale: "rw-RW",
//   format: (amount) => {
//     return new Intl.NumberFormat("rw-RW", {
//       style: "currency",
//       currency: "RWF",
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(amount);
//   },
// };

// // Helper function to format currency
// export const formatCurrency = (amount) => {
//   if (amount === undefined || amount === null) return "FRw 0";
//   return CURRENCY.format(amount);
// };

// export default function App() {
//   return (
//     <Routes>
//       {/* Public Routes */}
//       <Route path="/" element={<Front />} />

//       {/* Admin Dashboard Routes with Sidebar */}
//       <Route
//         path="/dashboard"
//         element={
//           <ProtectedRoute allowedRoles={["admin"]}>
//             <DashboardLayout>
//               <Dashboard />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/dashboard/expenses"
//         element={
//           <ProtectedRoute allowedRoles={["admin"]}>
//             <DashboardLayout>
//               <ExpensesDashboard />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/dashboard/users"
//         element={
//           <ProtectedRoute allowedRoles={["admin"]}>
//             <DashboardLayout>
//               <UserManagement />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/dashboard/budget"
//         element={
//           <ProtectedRoute allowedRoles={["admin"]}>
//             <DashboardLayout>
//               <BudgetManagement />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/dashboard/savings"
//         element={
//           <ProtectedRoute allowedRoles={["admin"]}>
//             <DashboardLayout>
//               <SavingsManagement />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/dashboard/income"
//         element={
//           <ProtectedRoute allowedRoles={["admin"]}>
//             <DashboardLayout>
//               <IncomeManagement />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/dashboard/reports"
//         element={
//           <ProtectedRoute allowedRoles={["admin"]}>
//             <DashboardLayout>
//               <ReportDashboard />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/dashboard/settings"
//         element={
//           <ProtectedRoute allowedRoles={["admin"]}>
//             <DashboardLayout>
//               <div className="bg-white rounded-2xl shadow-lg p-6">
//                 <h2 className="text-2xl font-bold text-gray-800 mb-4">
//                   Settings
//                 </h2>
//                 <p className="text-gray-600">
//                   Settings management features coming soon...
//                 </p>
//               </div>
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />

//       {/* User Dashboard Routes with Sidebar */}
//       <Route
//         path="/user/dashboard"
//         element={
//           <ProtectedRoute allowedRoles={["user"]}>
//             <DashboardLayout>
//               <UserDashboard />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/user/expenses"
//         element={
//           <ProtectedRoute allowedRoles={["user"]}>
//             <DashboardLayout>
//               <MyExpense />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/user/income"
//         element={
//           <ProtectedRoute allowedRoles={["user"]}>
//             <DashboardLayout>
//               <MyIncome />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/user/reports"
//         element={
//           <ProtectedRoute allowedRoles={["user"]}>
//             <DashboardLayout>
//               <MyReport />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/user/budget"
//         element={
//           <ProtectedRoute allowedRoles={["user"]}>
//             <DashboardLayout>
//               <MyBudget />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/user/savings"
//         element={
//           <ProtectedRoute allowedRoles={["user"]}>
//             <DashboardLayout>
//               <MySaving />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/user/settings"
//         element={
//           <ProtectedRoute allowedRoles={["user"]}>
//             <DashboardLayout>
//               <UserProfile />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />

//       {/* Catch all - redirect to home */}
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// }
















/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// Import components
import { Front } from "./components/index/Front";

// Material Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ReceiptIcon from "@mui/icons-material/Receipt";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import SettingsIcon from "@mui/icons-material/Settings";
import SavingsIcon from "@mui/icons-material/Savings";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import BarChartIcon from "@mui/icons-material/BarChart";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { Dashboard } from "./components/dashboard/admin/Dashboard";
import { UserDashboard } from "./components/dashboard/user/UserDashboard";
import { ExpensesDashboard } from "./components/dashboard/admin/components/expenses/ExpensesManagement";
import { ReportDashboard } from "./components/dashboard/admin/components/report/ReportManagement";
import { UserManagement } from "./components/dashboard/admin/components/user/UserManagement";
import { IncomeManagement } from "./components/dashboard/admin/components/incame/IncomeManagement";
import { SavingsManagement } from "./components/dashboard/admin/components/savings/SavingManagement";
import { Money } from "@mui/icons-material";
import { BudgetManagement } from "./components/dashboard/admin/components/budget/BudgetManagement";
import { UserProfile } from "./components/dashboard/user/components/me/Myprofile";
import { MyExpense } from "./components/dashboard/user/components/expenses/MyExpenses";
import { MyIncome } from "./components/dashboard/user/components/incame/MyIncame";
import { MyBudget } from "./components/dashboard/user/components/budget/MyBudget";
import { MySaving } from "./components/dashboard/user/components/saving/MySaving";
import { MyReport } from "./components/dashboard/user/components/report/MyReport";

// Axios instance configuration
const API_BASE_URL =
  "https://household-expenses-management-system.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Static user data for demo
const DEMO_USERS = {
  admin: {
    email: "admin@example.com",
    password: "admin",
    name: "Admin User",
    role: "admin",
    id: 1,
  },
};

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem("authToken");
  const userData = JSON.parse(localStorage.getItem("userData") || "null");

  if (!token || !userData) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userData.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Notification Modal Component - Integrated with API using Axios
const NotificationModal = ({
  isOpen,
  onClose,
  userEmail,
  onDelete,
  onUpdate,
  onConfirm,
  onBulkRead,
}) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkReadModal, setShowBulkReadModal] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isBulkReading, setIsBulkReading] = useState(false);

  // Fetch notifications when modal opens
  useEffect(() => {
    if (isOpen && userEmail) {
      fetchNotifications();
    }
  }, [isOpen, userEmail]);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/notifications/all");
      if (response.data.success) {
        const notificationsData = response.data.notifications || [];
        setNotifications(notificationsData);
        // Count unread notifications
        const unread = notificationsData.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      } else {
        throw new Error(
          response.data.message || "Failed to load notifications",
        );
      }
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type, severity) => {
    const typeMap = {
      savings_milestone: <SavingsIcon className="text-purple-500" />,
      contact: <InfoIcon className="text-blue-500" />,
      budget_alert: <WarningIcon className="text-yellow-500" />,
      expense_added: <AttachMoneyIcon className="text-green-500" />,
      payment_failed: <ErrorIcon className="text-red-500" />,
      expense: <AttachMoneyIcon className="text-green-500" />,
      alert: <WarningIcon className="text-yellow-500" />,
      info: <InfoIcon className="text-blue-500" />,
    };

    if (severity === "high") return <ErrorIcon className="text-red-500" />;
    if (severity === "medium")
      return <WarningIcon className="text-yellow-500" />;

    return typeMap[type] || <InfoIcon className="text-blue-500" />;
  };

  const getNotificationColor = (type, severity) => {
    const typeColorMap = {
      savings_milestone: "border-purple-500 bg-purple-50",
      contact: "border-blue-500 bg-blue-50",
      budget_alert: "border-yellow-500 bg-yellow-50",
      expense_added: "border-green-500 bg-green-50",
      payment_failed: "border-red-500 bg-red-50",
      expense: "border-green-500 bg-green-50",
      alert: "border-yellow-500 bg-yellow-50",
      info: "border-blue-500 bg-blue-50",
    };

    if (severity === "high") return "border-red-500 bg-red-50";
    if (severity === "medium") return "border-yellow-500 bg-yellow-50";
    if (severity === "low") return "border-blue-500 bg-blue-50";

    return typeColorMap[type] || "border-gray-300 bg-gray-50";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60)
      return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDelete = (notification) => {
    setSelectedNotification(notification);
    setShowDeleteModal(true);
  };

  const handleUpdate = (notification) => {
    setSelectedNotification(notification);
    setShowUpdateModal(true);
  };

  const handleConfirm = (notification) => {
    setSelectedNotification(notification);
    setShowConfirmModal(true);
  };

  const handleBulkRead = () => {
    const unreadNotifications = notifications.filter((n) => !n.isRead);
    if (unreadNotifications.length === 0) {
      toast.info("No unread notifications to mark as read");
      return;
    }
    setShowBulkReadModal(true);
  };

  // API calls using Axios
  const confirmDelete = async () => {
    if (!selectedNotification) return;
    setIsDeleting(true);
    try {
      const response = await api.delete(
        `/notifications/${selectedNotification._id}`,
      );

      if (response.data.success) {
        const updatedNotifications = notifications.filter(
          (n) => n._id !== selectedNotification._id,
        );
        setNotifications(updatedNotifications);
        const unread = updatedNotifications.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
        setShowDeleteModal(false);
        setActionMessage("Notification deleted successfully!");
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 2000);
        toast.success("Notification deleted successfully!");
        if (onDelete) onDelete(selectedNotification._id);
      } else {
        throw new Error(response.data.message || "Delete failed");
      }
    } catch (err) {
      setShowDeleteModal(false);
      setActionMessage(
        err.response?.data?.message || err.message || "Delete failed",
      );
      setShowFailModal(true);
      setTimeout(() => setShowFailModal(false), 3000);
      toast.error("Failed to delete notification");
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmUpdate = async () => {
    if (!selectedNotification) return;
    setIsUpdating(true);
    try {
      const response = await api.put(
        `/notifications/read/${selectedNotification._id}`,
      );

      if (response.data.success) {
        const updatedNotifications = notifications.map((notif) =>
          notif._id === selectedNotification._id
            ? { ...notif, isRead: true }
            : notif,
        );
        setNotifications(updatedNotifications);
        const unread = updatedNotifications.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
        setShowUpdateModal(false);
        setActionMessage("Notification marked as read!");
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 2000);
        toast.success("Notification marked as read!");
        if (onUpdate) onUpdate(selectedNotification._id);
      } else {
        throw new Error(response.data.message || "Update failed");
      }
    } catch (err) {
      setShowUpdateModal(false);
      setActionMessage(
        err.response?.data?.message || err.message || "Update failed",
      );
      setShowFailModal(true);
      setTimeout(() => setShowFailModal(false), 3000);
      toast.error("Failed to update notification");
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmAction = async () => {
    if (!selectedNotification) return;
    setIsConfirming(true);
    try {
      const response = await api.put(
        `/notifications/read/${selectedNotification._id}`,
      );

      if (response.data.success) {
        const updatedNotifications = notifications.map((notif) =>
          notif._id === selectedNotification._id
            ? { ...notif, isRead: true, confirmed: true }
            : notif,
        );
        setNotifications(updatedNotifications);
        const unread = updatedNotifications.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
        setShowConfirmModal(false);
        setActionMessage("Notification confirmed!");
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 2000);
        toast.success("Notification confirmed!");
        if (onConfirm) onConfirm(selectedNotification._id);
      } else {
        throw new Error(response.data.message || "Confirmation failed");
      }
    } catch (err) {
      setShowConfirmModal(false);
      setActionMessage(
        err.response?.data?.message || err.message || "Confirmation failed",
      );
      setShowFailModal(true);
      setTimeout(() => setShowFailModal(false), 3000);
      toast.error("Failed to confirm notification");
    } finally {
      setIsConfirming(false);
    }
  };

  const confirmBulkRead = async () => {
    const unreadNotifications = notifications.filter((n) => !n.isRead);
    if (unreadNotifications.length === 0) {
      toast.info("No unread notifications to mark as read");
      setShowBulkReadModal(false);
      return;
    }

    setIsBulkReading(true);
    try {
      const notificationIds = unreadNotifications.map((n) => n._id);
      
      const response = await api.put("/notifications/bulk-read", {
        notificationIds,
      });

      if (response.data.success) {
        const updatedNotifications = notifications.map((notif) =>
          unreadNotifications.some((n) => n._id === notif._id)
            ? { ...notif, isRead: true }
            : notif,
        );
        setNotifications(updatedNotifications);
        setUnreadCount(0);
        setShowBulkReadModal(false);
        setActionMessage(`Marked ${unreadNotifications.length} notifications as read!`);
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 2000);
        toast.success(`Marked ${unreadNotifications.length} notifications as read!`);
        if (onBulkRead) onBulkRead(notificationIds);
      } else {
        throw new Error(response.data.message || "Bulk read failed");
      }
    } catch (err) {
      setShowBulkReadModal(false);
      setActionMessage(
        err.response?.data?.message || err.message || "Bulk read failed",
      );
      setShowFailModal(true);
      setTimeout(() => setShowFailModal(false), 3000);
      toast.error("Failed to mark notifications as read");
    } finally {
      setIsBulkReading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Main Notification Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 py-6">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          ></div>

          <div
            className="relative bg-white rounded-2xl shadow-2xl transform transition-all w-full 
                        sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl max-h-[90vh]"
          >
            {/* Header */}
            <div className="bg-white px-4 sm:px-6 pt-5 pb-4 border-b border-gray-200 rounded-t-2xl">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <NotificationsIcon className="text-purple-600 w-5 h-5 sm:w-6 sm:h-6" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Notifications
                  </h3>
                  <span className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full">
                    {notifications?.length || 0}
                  </span>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                      {unreadCount} new
                    </span>
                  )}
                  <button
                    onClick={fetchNotifications}
                    className="ml-2 p-1 text-gray-400 hover:text-purple-600 transition-colors"
                    title="Refresh"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleBulkRead}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                      disabled={isBulkReading}
                    >
                      <DoneAllIcon className="w-4 h-4" />
                      <span>Mark All Read</span>
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 transition-colors p-1 hover:bg-gray-100 rounded-full"
                  >
                    <CloseIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-4 sm:px-6 py-4 max-h-[60vh] overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <ErrorIcon className="text-red-400 w-12 h-12 mx-auto mb-3" />
                  <p className="text-red-500 text-sm">{error}</p>
                  <button
                    onClick={fetchNotifications}
                    className="mt-3 text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    Try Again
                  </button>
                </div>
              ) : notifications && notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`p-3 sm:p-4 border-l-4 rounded-lg ${getNotificationColor(notification.type, notification.severity)} transition-all hover:shadow-md ${notification.isRead ? "opacity-70" : ""}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(
                            notification.type,
                            notification.severity,
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                              {!notification.isRead && (
                                <span className="ml-2 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                              )}
                            </p>
                            {notification.severity && (
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ml-2 flex-shrink-0 ${
                                  notification.severity === "high"
                                    ? "bg-red-100 text-red-700"
                                    : notification.severity === "medium"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {notification.severity}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1 break-words">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-gray-400">
                              {formatDate(notification.createdAt)}
                            </p>
                            <div className="flex space-x-1 sm:space-x-2">
                              <button
                                onClick={() => handleUpdate(notification)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                title="Mark as Read"
                                disabled={isUpdating}
                              >
                                <EditIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(notification)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                title="Delete"
                                disabled={isDeleting}
                              >
                                <DeleteIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleConfirm(notification)}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                title="Confirm"
                                disabled={isConfirming}
                              >
                                <CheckCircleIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <NotificationsIcon className="text-gray-300 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm sm:text-base">
                    No notifications
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-60 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-6">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
            <div className="relative bg-white rounded-2xl max-w-sm w-full sm:max-w-md p-6 shadow-2xl mx-4">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <DeleteIcon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Delete Notification
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to delete this notification? This action
                  cannot be undone.
                </p>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 justify-center">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors w-full sm:w-auto"
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-60 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-6">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
            <div className="relative bg-white rounded-2xl max-w-sm w-full sm:max-w-md p-6 shadow-2xl mx-4">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                  <EditIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Mark as Read
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to mark this notification as read?
                </p>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 justify-center">
                  <button
                    onClick={() => setShowUpdateModal(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors w-full sm:w-auto"
                    disabled={isUpdating}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmUpdate}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                        Updating...
                      </>
                    ) : (
                      "Mark as Read"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Action Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-60 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-6">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
            <div className="relative bg-white rounded-2xl max-w-sm w-full sm:max-w-md p-6 shadow-2xl mx-4">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Confirm Action
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to confirm this notification action?
                </p>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 justify-center">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors w-full sm:w-auto"
                    disabled={isConfirming}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmAction}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isConfirming}
                  >
                    {isConfirming ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                        Confirming...
                      </>
                    ) : (
                      "Confirm"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Read Confirmation Modal */}
      {showBulkReadModal && (
        <div className="fixed inset-0 z-60 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-6">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
            <div className="relative bg-white rounded-2xl max-w-sm w-full sm:max-w-md p-6 shadow-2xl mx-4">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                  <DoneAllIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Mark All as Read
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to mark all {unreadCount} unread notifications as read?
                </p>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 justify-center">
                  <button
                    onClick={() => setShowBulkReadModal(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors w-full sm:w-auto"
                    disabled={isBulkReading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmBulkRead}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isBulkReading}
                  >
                    {isBulkReading ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                        Processing...
                      </>
                    ) : (
                      `Mark ${unreadCount} as Read`
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-70 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-6">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm"></div>
            <div className="relative bg-white rounded-2xl max-w-sm w-full sm:max-w-md p-8 shadow-2xl mx-4 animate-bounce">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <CheckCircleIcon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Success!
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  {actionMessage || "Action completed successfully."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fail Modal */}
      {showFailModal && (
        <div className="fixed inset-0 z-70 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-6">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm"></div>
            <div className="relative bg-white rounded-2xl max-w-sm w-full sm:max-w-md p-6 shadow-2xl mx-4">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                  <ErrorIcon className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Failed!
                </h3>
                <p className="text-sm text-gray-500 mt-2 mb-6">
                  {actionMessage || "Action could not be completed."}
                </p>
                <button
                  onClick={() => setShowFailModal(false)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors w-full sm:w-auto"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Sidebar Component
const Sidebar = ({
  user,
  onLogout,
  isOpen,
  onToggle,
  location,
  onNotificationClick,
}) => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread count for badge
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await api.get("/notifications/all");
        if (response.data.success) {
          const unread = (response.data.notifications || []).filter(
            (n) => !n.isRead,
          ).length;
          setUnreadCount(unread);
        }
      } catch (err) {
        console.error("Failed to fetch unread count:", err);
      }
    };

    fetchUnreadCount();
    // Refresh every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const adminMenuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
    },
    {
      id: "users",
      label: "Users",
      icon: <PeopleIcon />,
      path: "/dashboard/users",
    },
    {
      id: "expenses",
      label: "Expenses",
      icon: <AttachMoneyIcon />,
      path: "/dashboard/expenses",
    },
    {
      id: "income",
      label: "Income",
      icon: <TrendingUpIcon />,
      path: "/dashboard/income",
    },
    {
      id: "savings",
      label: "Savings",
      icon: <SavingsIcon />,
      path: "/dashboard/savings",
    },
    // {
    //   id: "budget",
    //   label: "Budget",
    //   icon: <Money />,
    //   path: "/dashboard/budget",
    // },
    {
      id: "reports",
      label: "Reports",
      icon: <BarChartIcon />,
      path: "/dashboard/reports",
    },
  ];

  const userMenuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <DashboardIcon />,
      path: "/user/dashboard",
    },
    {
      id: "expenses",
      label: "My Expenses",
      icon: <AttachMoneyIcon />,
      path: "/user/expenses",
    },
    {
      id: "income",
      label: "My Income",
      icon: <TrendingUpIcon />,
      path: "/user/income",
    },
    // {
    //   id: "budget",
    //   label: "My Budget",
    //   icon: <Money />,
    //   path: "/user/budget",
    // },
    {
      id: "savings",
      label: "My Savings",
      icon: <SavingsIcon />,
      path: "/user/savings",
    },
    {
      id: "reports",
      label: "Reports",
      icon: <BarChartIcon />,
      path: "/user/reports",
    },
  ];

  const menuItems = user?.role === "admin" ? adminMenuItems : userMenuItems;
  const isAdmin = user?.role === "admin";

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) {
      onToggle();
    }
  };

  return (
    <>
      {/* Mobile Menu Button - Fixed position under navbar */}
      <button
        onClick={onToggle}
        className={`lg:hidden fixed z-50 p-2.5 bg-white rounded-xl shadow-lg hover:bg-gray-50 transition-all duration-200 ${
          isOpen ? "top-4 left-4" : "top-20 left-4"
        }`}
        style={{
          top: isOpen ? "1rem" : "5rem",
          left: "1rem",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
      >
        {isOpen ? (
          <CloseIcon className="w-6 h-6 text-gray-700" />
        ) : (
          <MenuIcon className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 w-64 sm:w-72 md:w-80 lg:w-64 xl:w-72 2xl:w-80`}
      >
        <div className="flex flex-col h-full">
          {/* Brand */}
          <div className="p-4 sm:p-5 md:p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl flex-shrink-0">
                <SavingsIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
                  HEMS
                </h1>
                <p className="text-xs text-gray-500 truncate">
                  {isAdmin ? "Admin Panel" : "User Panel"}
                </p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <PersonIcon className="text-white text-sm sm:text-base" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-3 sm:p-4 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200 mb-1 ${
                  location.pathname === item.path
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="w-5 h-5 flex-shrink-0">{item.icon}</span>
                <span className="font-medium text-sm sm:text-base truncate">
                  {item.label}
                </span>
              </button>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-3 sm:p-4 border-t border-gray-200 space-y-2">
            <button
              onClick={onNotificationClick}
              className="w-full flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-purple-600 hover:bg-purple-50 transition-all duration-200 relative"
            >
              <NotificationsIcon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-3 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                onLogout();
                onToggle();
              }}
              className="w-full flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <LogoutIcon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
};

// Layout with Sidebar
const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = JSON.parse(localStorage.getItem("userData") || "null");

    if (!token || !userData) {
      navigate("/");
      return;
    }

    setUser(userData);

    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1536) {
        setIsSidebarOpen(true);
      } else if (width >= 1280) {
        setIsSidebarOpen(true);
      } else if (width >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    toast.success("Logged out successfully!");
    navigate("/");
  };

  // Notification handlers
  const handleDeleteNotification = (id) => {
    toast.info("Notification deleted");
  };

  const handleUpdateNotification = (id) => {
    toast.info("Notification marked as read");
  };

  const handleConfirmNotification = (id) => {
    toast.info("Notification confirmed");
  };

  const handleBulkRead = (ids) => {
    toast.info(`Marked ${ids.length} notifications as read`);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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

      <Sidebar
        user={user}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        location={location}
        onNotificationClick={() => setIsNotificationModalOpen(true)}
      />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64 xl:ml-72 2xl:ml-80" : "ml-0"
        }`}
      >
        <div className="p-3 sm:p-4 md:p-6 lg:p-8">{children}</div>
      </div>

      {/* Notification Modal */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        userEmail={user?.email}
        onDelete={handleDeleteNotification}
        onUpdate={handleUpdateNotification}
        onConfirm={handleConfirmNotification}
        onBulkRead={handleBulkRead}
      />
    </div>
  );
};

// Login handler for Front component
export const handleLogin = (email, password) => {
  // Check against demo users
  if (
    email === DEMO_USERS.admin.email &&
    password === DEMO_USERS.admin.password
  ) {
    const userData = {
      id: DEMO_USERS.admin.id,
      name: DEMO_USERS.admin.name,
      email: DEMO_USERS.admin.email,
      role: DEMO_USERS.admin.role,
    };

    localStorage.setItem("authToken", "demo-token-12345");
    localStorage.setItem("userData", JSON.stringify(userData));

    toast.success("Welcome Admin! Redirecting to dashboard...");
    return { success: true, user: userData };
  }

  // For demo purposes, also allow any email/password to login as regular user
  if (email && password && password.length >= 4) {
    const userData = {
      id: 2,
      name: email.split("@")[0] || "User",
      email: email,
      role: "user",
    };

    localStorage.setItem("authToken", "demo-user-token-67890");
    localStorage.setItem("userData", JSON.stringify(userData));

    toast.success("Welcome! Redirecting to dashboard...");
    return { success: true, user: userData };
  }

  toast.error("Invalid email or password. Try admin@example.com / admin");
  return { success: false };
};

// Currency configuration
export const CURRENCY = {
  code: "RWF",
  symbol: "FRw",
  name: "Rwandan Franc",
  locale: "rw-RW",
  format: (amount) => {
    return new Intl.NumberFormat("rw-RW", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  },
};

// Helper function to format currency
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "FRw 0";
  return CURRENCY.format(amount);
};

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Front />} />

      {/* Admin Dashboard Routes with Sidebar */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/expenses"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardLayout>
              <ExpensesDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardLayout>
              <UserManagement />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/budget"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardLayout>
              <BudgetManagement />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/savings"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardLayout>
              <SavingsManagement />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/income"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardLayout>
              <IncomeManagement />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/reports"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardLayout>
              <ReportDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/settings"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardLayout>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Settings
                </h2>
                <p className="text-gray-600">
                  Settings management features coming soon...
                </p>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* User Dashboard Routes with Sidebar */}
      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <DashboardLayout>
              <UserDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/expenses"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <DashboardLayout>
              <MyExpense />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/income"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <DashboardLayout>
              <MyIncome />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/reports"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <DashboardLayout>
              <MyReport />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/budget"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <DashboardLayout>
              <MyBudget />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/savings"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <DashboardLayout>
              <MySaving />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/settings"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <DashboardLayout>
              <UserProfile />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}