/* eslint-disable no-dupe-else-if */

// /* eslint-disable react-hooks/static-components */
// /* eslint-disable react-hooks/immutability */
// /* eslint-disable react-hooks/set-state-in-effect */
// /* eslint-disable no-unused-vars */
// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useState, useEffect, useCallback, useRef, memo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// // Material Icons
// import PersonIcon from "@mui/icons-material/Person";
// import EmailIcon from "@mui/icons-material/Email";
// import PhoneIcon from "@mui/icons-material/Phone";
// import EditIcon from "@mui/icons-material/Edit";
// import SaveIcon from "@mui/icons-material/Save";
// import CloseIcon from "@mui/icons-material/Close";
// import BadgeIcon from "@mui/icons-material/Badge";
// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
// import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
// import TrendingUpIcon from "@mui/icons-material/TrendingUp";
// import TrendingDownIcon from "@mui/icons-material/TrendingDown";
// import SavingsIcon from "@mui/icons-material/Savings";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import LockIcon from "@mui/icons-material/Lock";

// // API Base URL
// const API_URL = "https://household-expenses-management-system.onrender.com/api";

// // Axios instance with auth token
// const api = axios.create({
//   baseURL: API_URL,
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("authToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Memoized Modal Component
// const Modal = memo(({ isOpen, onClose, title, children, size = "md" }) => {
//   if (!isOpen) return null;

//   const sizes = {
//     sm: "max-w-md",
//     md: "max-w-2xl",
//     lg: "max-w-4xl",
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
//           onClick={onClose}
//         >
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0, y: 20 }}
//             animate={{ scale: 1, opacity: 1, y: 0 }}
//             exit={{ scale: 0.9, opacity: 0, y: 20 }}
//             className={`bg-white rounded-3xl shadow-2xl ${sizes[size]} w-full max-h-[90vh] overflow-y-auto relative`}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="sticky top-0 bg-white z-10 p-4 sm:p-6 border-b border-gray-200 rounded-t-3xl">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-xl sm:text-2xl font-bold text-gray-800">{title}</h3>
//                 <button
//                   onClick={onClose}
//                   className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                 >
//                   <CloseIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
//                 </button>
//               </div>
//             </div>
//             <div className="p-4 sm:p-6">{children}</div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// });

// export const UserProfile = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(() => {
//     try {
//       return JSON.parse(localStorage.getItem("userData") || "null");
//     } catch {
//       return null;
//     }
//   });

//   // State for user data
//   const [userData, setUserData] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Refs for preventing concurrent loads
//   const isFirstLoadRef = useRef(true);
//   const isLoadingRef = useRef(false);

//   // State for user stats
//   const [stats, setStats] = useState({
//     totalIncome: 0,
//     totalExpenses: 0,
//     netBalance: 0,
//     totalSavings: 0,
//     transactionCount: 0,
//     budgetCount: 0,
//     savingsCount: 0,
//   });

//   // Form data for editing - matches user model exactly
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//   });

//   // Redirect if no valid session
//   useEffect(() => {
//     const token = localStorage.getItem("authToken");
//     const userData = JSON.parse(localStorage.getItem("userData") || "null");

//     if (!token || !userData) {
//       navigate("/");
//       return;
//     }

//     if (!user) setUser(userData);
    
//     // Load user data only on initial mount
//     if (isFirstLoadRef.current) {
//       isFirstLoadRef.current = false;
//       loadUserData(userData?.email);
//     }
//   }, [navigate]);

//   // Load user data by email - gets the user and stores their ID
//   const loadUserData = useCallback(async (email) => {
//     if (isLoadingRef.current) return;
    
//     if (!email) {
//       toast.error("User email not found");
//       return;
//     }

//     isLoadingRef.current = true;
//     setIsLoading(true);
    
//     try {
//       // Get user by email
//       const response = await api.get(`/users/email/${email}`);
      
//       console.log("User data response:", response.data); // Debug log
      
//       if (response.data.success) {
//         const data = response.data.data || response.data.user;
        
//         console.log("User data:", data); // Debug log
//         console.log("User ID:", data._id || data.id); // Debug log
        
//         setUserData(data);
        
//         // Try multiple possible ID field names
//         const id = data._id || data.id || data.userId || data.user_id;
//         setUserId(id);
        
//         if (!id) {
//           console.warn("No ID found in user data:", data);
//         }
        
//         setFormData({
//           name: data.name || "",
//           email: data.email || "",
//           phone: data.phone || "",
//         });
        
//         loadUserStats(email);
//       } else {
//         toast.error(response.data.message || "Failed to load user data");
//       }
//     } catch (error) {
//       console.error("Load user error:", error);
//       if (error.response?.status === 404) {
//         toast.error("User not found");
//       } else {
//         toast.error(error.response?.data?.message || "Failed to load user data");
//       }
//     } finally {
//       setIsLoading(false);
//       isLoadingRef.current = false;
//     }
//   }, []);

//   // Load user statistics
//   const loadUserStats = useCallback(async (email) => {
//     try {
//       const expensesRes = await api.get(`/expenses/email/${email}`);
//       const expenses = expensesRes.data.success ? expensesRes.data.data || [] : [];

//       const incomesRes = await api.get(`/incomes/email/${email}`);
//       const incomes = incomesRes.data.success ? incomesRes.data.data || [] : [];

//       const budgetsRes = await api.get(`/budgets/email/${email}`);
//       const budgets = budgetsRes.data.success ? budgetsRes.data.data || [] : [];

//       const savingsRes = await api.get(`/savings/email/${email}`);
//       const savings = savingsRes.data.success ? savingsRes.data.data || [] : [];

//       const totalIncome = incomes.reduce((sum, inc) => sum + (inc.amount || 0), 0);
//       const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
//       const netBalance = totalIncome - totalExpenses;
//       const totalSavings = savings.reduce((sum, sav) => sum + (sav.currentAmount || 0), 0);

//       setStats({
//         totalIncome,
//         totalExpenses,
//         netBalance,
//         totalSavings,
//         transactionCount: expenses.length + incomes.length,
//         budgetCount: budgets.length,
//         savingsCount: savings.length,
//       });
//     } catch (error) {
//       console.error("Load stats error:", error);
//     }
//   }, []);

//   // Open edit modal - uses the stored userId from the email fetch
//   const openEditModal = useCallback(() => {
//     console.log("Current userId:", userId); // Debug log
//     console.log("Current userData:", userData); // Debug log
    
//     if (userId) {
//       setIsEditModalOpen(true);
//     } else {
//       // Fallback: try to get ID from userData
//       const id = userData?._id || userData?.id || userData?.userId;
//       if (id) {
//         setUserId(id);
//         setIsEditModalOpen(true);
//       } else {
//         toast.error("User ID not found. Please refresh and try again.");
//       }
//     }
//   }, [userId, userData]);

//   // Handle update user - uses the stored userId
//   const handleUpdateUser = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       // Get the ID from state or fallback to userData
//       const id = userId || userData?._id || userData?.id || userData?.userId;
      
//       if (!id) {
//         toast.error("User ID not found");
//         setIsSubmitting(false);
//         return;
//       }

//       // Only update fields that exist in the user model
//       const updateData = {
//         name: formData.name,
//         email: formData.email,
//         phone: formData.phone,
//       };

//       console.log("Updating user with ID:", id);
//       console.log("Update data:", updateData);

//       const response = await api.put(`/users/${id}`, updateData);
      
//       if (response.data.success) {
//         toast.success("User information updated successfully!");
//         setIsEditModalOpen(false);
        
//         const updatedUser = response.data.data || response.data.user;
//         setUserData(updatedUser);
        
//         // Update ID if it changed
//         const newId = updatedUser._id || updatedUser.id || updatedUser.userId;
//         if (newId) setUserId(newId);
        
//         const userData = JSON.parse(localStorage.getItem("userData") || "null");
//         if (userData) {
//           const newUserData = { ...userData, ...updatedUser };
//           localStorage.setItem("userData", JSON.stringify(newUserData));
//           setUser(newUserData);
//         }
        
//         // Reload user data with the updated email
//         loadUserData(formData.email);
//       } else {
//         toast.error(response.data.message || "Failed to update user information");
//       }
//     } catch (error) {
//       console.error("Update user error:", error);
//       toast.error(error.response?.data?.message || "Failed to update user information");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Format currency
//   const formatCurrency = useCallback((amount) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//     }).format(amount || 0);
//   }, []);

//   // Format date
//   const formatDate = useCallback((dateString) => {
//     if (!dateString) return "N/A";
//     try {
//       return new Date(dateString).toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//       });
//     } catch {
//       return "N/A";
//     }
//   }, []);

//   // Get role badge - always shows "User"
//   const getRoleBadge = useCallback(() => {
//     return (
//       <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
//         <PersonIcon className="w-4 h-4" />
//         User
//       </span>
//     );
//   }, []);

//   // User Card Component
//   const UserCard = memo(({ userData, getRoleBadge, formatDate }) => (
//     <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//       <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 sm:p-6">
//         <div className="flex items-center gap-3 sm:gap-4">
//           <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
//             <PersonIcon className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
//           </div>
//           <div className="text-white min-w-0 flex-1">
//             <h2 className="text-xl sm:text-2xl font-bold truncate">{userData?.name || "User"}</h2>
//             <div className="flex flex-wrap items-center gap-2 mt-1">
//               {getRoleBadge()}
//               {userData?.isVerified && (
//                 <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-800">
//                   <CheckCircleIcon className="w-3 h-3 sm:w-4 sm:h-4" />
//                   <span className="hidden xs:inline">Verified</span>
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
      
//       <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
//         <div className="flex items-center gap-3 text-gray-600">
//           <EmailIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
//           <span className="truncate">{userData?.email || "No email"}</span>
//         </div>
        
//         <div className="flex items-center gap-3 text-gray-600">
//           <PhoneIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
//           <span className="truncate">{userData?.phone || "No phone number"}</span>
//         </div>
        
//         <div className="flex items-center gap-3 text-gray-600">
//           <CalendarTodayIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
//           <span className="truncate">Joined: {formatDate(userData?.createdAt)}</span>
//         </div>
        
//         {userData?.lastLogin && (
//           <div className="flex items-center gap-3 text-gray-600">
//             <BadgeIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
//             <span className="truncate">Last login: {formatDate(userData?.lastLogin)}</span>
//           </div>
//         )}
//       </div>
//     </div>
//   ));

//   // Stats Cards Component
//   const StatsCards = memo(({ stats, formatCurrency }) => (
//     <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
//       <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 border-l-4 border-green-500">
//         <div className="flex items-center justify-between">
//           <div className="min-w-0">
//             <p className="text-xs sm:text-sm text-gray-500 truncate">Total Income</p>
//             <p className="text-lg sm:text-2xl font-bold text-green-600 truncate">
//               {formatCurrency(stats.totalIncome)}
//             </p>
//           </div>
//           <TrendingUpIcon className="w-8 h-8 sm:w-10 sm:h-10 text-green-500 bg-green-100 p-1.5 sm:p-2 rounded-full flex-shrink-0" />
//         </div>
//       </div>

//       <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 border-l-4 border-red-500">
//         <div className="flex items-center justify-between">
//           <div className="min-w-0">
//             <p className="text-xs sm:text-sm text-gray-500 truncate">Total Expenses</p>
//             <p className="text-lg sm:text-2xl font-bold text-red-600 truncate">
//               {formatCurrency(stats.totalExpenses)}
//             </p>
//           </div>
//           <TrendingDownIcon className="w-8 h-8 sm:w-10 sm:h-10 text-red-500 bg-red-100 p-1.5 sm:p-2 rounded-full flex-shrink-0" />
//         </div>
//       </div>

//       <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 border-l-4 border-blue-500">
//         <div className="flex items-center justify-between">
//           <div className="min-w-0">
//             <p className="text-xs sm:text-sm text-gray-500 truncate">Net Balance</p>
//             <p className={`text-lg sm:text-2xl font-bold truncate ${stats.netBalance >= 0 ? "text-blue-600" : "text-red-600"}`}>
//               {formatCurrency(stats.netBalance)}
//             </p>
//           </div>
//           <AccountBalanceWalletIcon className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500 bg-blue-100 p-1.5 sm:p-2 rounded-full flex-shrink-0" />
//         </div>
//       </div>

//       <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 border-l-4 border-purple-500">
//         <div className="flex items-center justify-between">
//           <div className="min-w-0">
//             <p className="text-xs sm:text-sm text-gray-500 truncate">Total Savings</p>
//             <p className="text-lg sm:text-2xl font-bold text-purple-600 truncate">
//               {formatCurrency(stats.totalSavings)}
//             </p>
//           </div>
//           <SavingsIcon className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500 bg-purple-100 p-1.5 sm:p-2 rounded-full flex-shrink-0" />
//         </div>
//       </div>
//     </div>
//   ));

//   // Quick Stats Component
//   const QuickStats = memo(({ stats }) => (
//     <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 sm:gap-4">
//       <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 text-center">
//         <p className="text-xs sm:text-sm text-gray-500">Transactions</p>
//         <p className="text-xl sm:text-2xl font-bold text-gray-700">{stats.transactionCount}</p>
//       </div>
//       <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 text-center">
//         <p className="text-xs sm:text-sm text-gray-500">Budgets Set</p>
//         <p className="text-xl sm:text-2xl font-bold text-gray-700">{stats.budgetCount}</p>
//       </div>
//       <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 text-center">
//         <p className="text-xs sm:text-sm text-gray-500">Savings Goals</p>
//         <p className="text-xl sm:text-2xl font-bold text-gray-700">{stats.savingsCount}</p>
//       </div>
//     </div>
//   ));

//   // Edit Form Component - matches user model exactly
//   const EditForm = memo(({ formData, setFormData, onSubmit, isSubmitting, onCancel }) => (
//     <form onSubmit={onSubmit} className="space-y-4">
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Full Name *
//         </label>
//         <input
//           type="text"
//           value={formData.name}
//           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
//           placeholder="Enter your full name"
//           required
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Email Address *
//         </label>
//         <input
//           type="email"
//           value={formData.email}
//           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
//           placeholder="Enter your email"
//           required
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Phone Number *
//         </label>
//         <input
//           type="tel"
//           value={formData.phone}
//           onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
//           placeholder="Enter your phone number"
//           required
//         />
//       </div>

//       <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4">
//         <p className="text-xs sm:text-sm text-blue-700 flex items-center gap-2">
//           <LockIcon className="w-4 h-4 flex-shrink-0" />
//           <span>Your role is <strong>User</strong> and cannot be changed</span>
//         </p>
//       </div>

//       <div className="flex flex-col xs:flex-row justify-end gap-2 xs:gap-3 pt-4">
//         <button
//           type="button"
//           onClick={onCancel}
//           className="w-full xs:w-auto px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
//         >
//           Cancel
//         </button>
//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="w-full xs:w-auto px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base"
//         >
//           {isSubmitting ? (
//             <>
//               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//               <span>Updating...</span>
//             </>
//           ) : (
//             <>
//               <SaveIcon className="w-5 h-5" />
//               <span>Update Information</span>
//             </>
//           )}
//         </button>
//       </div>
//     </form>
//   ));

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading user data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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

//       <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
//           <div>
//             <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
//               <PersonIcon className="text-blue-500 text-2xl sm:text-3xl" />
//               My Profile
//             </h2>
//             <p className="text-sm sm:text-base text-gray-600 mt-1">
//               View and manage your personal information
//             </p>
//             <span className="inline-flex items-center gap-1 text-xs sm:text-sm text-blue-600 bg-blue-100 px-2 sm:px-3 py-1 rounded-full mt-1">
//               <PersonIcon className="w-3 h-3 sm:w-4 sm:h-4" />
//               User Account
//             </span>
//           </div>
//           <div className="flex flex-wrap gap-2 mt-3 sm:mt-0">
//             <button
//               onClick={openEditModal}
//               className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
//             >
//               <EditIcon className="w-4 h-4 sm:w-5 sm:h-5" />
//               <span>Edit Information</span>
//             </button>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
//           {/* Left Column - User Card */}
//           <div className="lg:col-span-1">
//             {userData && (
//               <UserCard
//                 userData={userData}
//                 getRoleBadge={getRoleBadge}
//                 formatDate={formatDate}
//               />
//             )}
//           </div>

//           {/* Right Column - Stats */}
//           <div className="lg:col-span-2 space-y-4 sm:space-y-6">
//             {/* Stats Cards */}
//             <StatsCards stats={stats} formatCurrency={formatCurrency} />

//             {/* Quick Stats */}
//             <QuickStats stats={stats} />

//             {/* User Information Card */}
//             {userData && (
//               <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
//                 <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
//                   Account Information
//                 </h3>
//                 <div className="space-y-3">
//                   <div className="flex flex-col xs:flex-row justify-between py-2 border-b border-gray-100 gap-1 xs:gap-0">
//                     <span className="text-gray-600 text-sm sm:text-base">User ID</span>
//                     <span className="text-gray-800 font-mono text-xs sm:text-sm break-all">
//                       {userData._id || userData.id || userData.userId || "N/A"}
//                     </span>
//                   </div>
//                   <div className="flex flex-col xs:flex-row justify-between py-2 border-b border-gray-100 gap-1 xs:gap-0">
//                     <span className="text-gray-600 text-sm sm:text-base">Status</span>
//                     <span className="text-green-600 font-medium text-sm sm:text-base">
//                       {userData.isActive !== false ? "Active" : "Inactive"}
//                     </span>
//                   </div>
//                   <div className="flex flex-col xs:flex-row justify-between py-2 border-b border-gray-100 gap-1 xs:gap-0">
//                     <span className="text-gray-600 text-sm sm:text-base">Email Verified</span>
//                     <span className={userData.isVerified ? "text-green-600" : "text-yellow-600"}>
//                       {userData.isVerified ? "Yes" : "No"}
//                     </span>
//                   </div>
//                   <div className="flex flex-col xs:flex-row justify-between py-2 gap-1 xs:gap-0">
//                     <span className="text-gray-600 text-sm sm:text-base">Role</span>
//                     <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
//                       <PersonIcon className="w-4 h-4" />
//                       User
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Edit User Information Modal */}
//       <Modal
//         isOpen={isEditModalOpen}
//         onClose={() => {
//           setIsEditModalOpen(false);
//           if (userData) {
//             setFormData({
//               name: userData.name || "",
//               email: userData.email || "",
//               phone: userData.phone || "",
//             });
//           }
//         }}
//         title="Edit User Information"
//       >
//         <EditForm
//           formData={formData}
//           setFormData={setFormData}
//           onSubmit={handleUpdateUser}
//           isSubmitting={isSubmitting}
//           onCancel={() => {
//             setIsEditModalOpen(false);
//             if (userData) {
//               setFormData({
//                 name: userData.name || "",
//                 email: userData.email || "",
//                 phone: userData.phone || "",
//               });
//             }
//           }}
//         />
//       </Modal>
//     </div>
//   );
// };



/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import axios from "axios";

// Material Icons
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

// API Configuration
const getApiConfig = () => {
  const env = typeof window !== "undefined" ? window._env_ || {} : {};
  return {
    apiBaseUrl:
      env.REACT_APP_API_URL ||
      "https://household-expenses-management-system.onrender.com/api",
  };
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const safeStatus = status || "pending";

  const statusConfig = {
    active: {
      color: "bg-green-100 text-green-800",
      icon: <CheckCircleIcon className="w-4 h-4" />,
    },
    inactive: {
      color: "bg-red-100 text-red-800",
      icon: <CancelIcon className="w-4 h-4" />,
    },
    pending: {
      color: "bg-yellow-100 text-yellow-800",
      icon: <PersonIcon className="w-4 h-4" />,
    },
  };

  const config = statusConfig[safeStatus] || statusConfig.pending;

  return (
    <span
      className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${config.color}`}
    >
      {config.icon}
      {safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)}
    </span>
  );
};

// Role Badge Component
const RoleBadge = ({ role }) => {
  const safeRole = role || "user";

  const roleConfig = {
    admin: {
      color: "bg-purple-100 text-purple-800",
      icon: <AdminPanelSettingsIcon className="w-4 h-4" />,
    },
    user: {
      color: "bg-blue-100 text-blue-800",
      icon: <PersonIcon className="w-4 h-4" />,
    },
  };

  const config = roleConfig[safeRole] || roleConfig.user;

  return (
    <span
      className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${config.color}`}
    >
      {config.icon}
      {safeRole.charAt(0).toUpperCase() + safeRole.slice(1)}
    </span>
  );
};

// Edit Profile Modal
const EditProfileModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "",
        confirmPassword: "",
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (formData.phone.replace(/\D/g, "").length < 10) {
      newErrors.phone = "Invalid phone number";
    }

    // Password validation (optional)
    if (formData.password && formData.password.length > 0) {
      if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your new password";
      } else if (formData.confirmPassword !== formData.password) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors before continuing");
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = { ...formData };
      
      // Remove password fields if they're empty
      if (!submitData.password) {
        delete submitData.password;
        delete submitData.confirmPassword;
      } else {
        delete submitData.confirmPassword;
      }

      await onSave(submitData);
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-200 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <EditIcon className="text-blue-600" />
              <h2 className="text-xl font-bold text-gray-800">
                Edit Profile
              </h2>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <CloseIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <div className="relative">
              <PersonIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  setErrors({ ...errors, name: undefined });
                }}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
                  errors.name
                    ? "border-red-400 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                placeholder="John Doe"
                disabled={isSubmitting}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email - Read only */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <EmailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                disabled
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Email cannot be changed
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <div className="relative">
              <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  setErrors({ ...errors, phone: undefined });
                }}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
                  errors.phone
                    ? "border-red-400 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                placeholder="+1 (555) 000-0000"
                disabled={isSubmitting}
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Password fields - Optional */}
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600 mb-3">
              Leave password fields empty to keep current password
            </p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setErrors({ ...errors, password: undefined });
                  }}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
                    errors.password
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="Enter new password (optional)"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <VisibilityOffIcon className="w-5 h-5" />
                  ) : (
                    <VisibilityIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, confirmPassword: e.target.value });
                    setErrors({ ...errors, confirmPassword: undefined });
                  }}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
                    errors.confirmPassword
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="Confirm new password"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <VisibilityOffIcon className="w-5 h-5" />
                  ) : (
                    <VisibilityIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <SaveIcon className="w-5 h-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Main User Profile Component
export const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const apiConfig = getApiConfig();
  const { apiBaseUrl } = apiConfig;

  // Get user email from localStorage or context
  const getUserEmail = useCallback(() => {
    // Try to get email from localStorage
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        return parsed.email;
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
    
    // Fallback to auth token email
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        // Try to decode JWT token to get email
        const payload = token.split('.')[1];
        if (payload) {
          const decoded = JSON.parse(atob(payload));
          return decoded.email || decoded.sub;
        }
      } catch (e) {
        console.error("Error decoding token:", e);
      }
    }
    
    return null;
  }, []);

  // Fetch user profile by email using URL parameter
  const fetchUserProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const email = getUserEmail();
      
      if (!email) {
        toast.warning("Please log in to view your profile");
        setIsLoading(false);
        return;
      }

      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.warning("Please log in to view your profile");
        setIsLoading(false);
        return;
      }

      // Use the correct route: /api/users/email/:email
      const response = await axios.get(`${apiBaseUrl}/users/email/${encodeURIComponent(email)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Handle the response - your backend returns { success: true, user: {...} }
      let userData = null;
      
      if (response.data) {
        // If the response has a user property (your backend structure)
        if (response.data.user) {
          userData = response.data.user;
        } 
        // If the response is the user object directly
        else if (response.data._id || response.data.id) {
          userData = response.data;
        }
        // If the response has a data property
        else if (response.data.data) {
          userData = response.data.data;
        }
        // If the response has success and user
        else if (response.data.success && response.data.user) {
          userData = response.data.user;
        }
      }

      // Check for _id (MongoDB uses _id)
      if (userData && userData._id) {
        setUser(userData);
        toast.success("Profile loaded successfully");
      } else {
        console.error("No user data found in response:", response.data);
        setUser(null);
        toast.error("User profile not found");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);

      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
        
        if (error.response.status === 404) {
          toast.error("User not found");
        } else if (error.response.status === 400) {
          toast.error(error.response.data.message || "Invalid email provided");
        } else if (error.response.status === 401) {
          toast.error("Please log in again");
        } else {
          toast.error(`Server error: ${error.response.status}`);
        }
      } else if (error.request) {
        console.error("No response received");
        toast.error("No response from server");
      } else {
        toast.error("Failed to fetch profile");
      }
      
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [apiBaseUrl, getUserEmail]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Update user profile
  const handleUpdateProfile = async (updatedData) => {
    try {
      const token = localStorage.getItem("authToken");
      const userId = user._id; // Use _id consistently
      
      if (!userId || !token) {
        toast.error("Please log in to update your profile");
        throw new Error("Authentication required");
      }

      // Update user using user ID
      const response = await axios.put(
        `${apiBaseUrl}/users/${userId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      let updatedUser = response.data;
      
      // Handle different response formats
      if (response.data && response.data.user) {
        updatedUser = response.data.user;
      } else if (response.data && response.data.data) {
        updatedUser = response.data.data;
      }

      setUser(updatedUser);
      toast.success("Profile updated successfully!");
      
      // Update localStorage with new user data
      const userData = localStorage.getItem("userData");
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          const newUserData = { ...parsed, ...updatedData };
          localStorage.setItem("userData", JSON.stringify(newUserData));
        } catch (e) {
          console.error("Error updating localStorage:", e);
        }
      }

      // Refresh profile data
      await fetchUserProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      
      if (error.response) {
        toast.error(error.response.data.message || "Failed to update profile");
      } else {
        toast.error("Failed to update profile");
      }
      throw error;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <PersonIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Profile Found</h3>
          <p className="text-gray-600 mb-6">
            We couldn't find your profile. Please make sure you're logged in.
          </p>
          <button
            onClick={fetchUserProfile}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-600 mt-1">
            View and manage your personal information
          </p>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-8 sm:px-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-white/30">
                {(user.name || "U").charAt(0).toUpperCase()}
              </div>
              
              {/* User Info */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-white">
                  {user.name || "Unknown User"}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-2 justify-center sm:justify-start">
                  <RoleBadge role={user.role} />
                  <StatusBadge status={user.status} />
                </div>
                <p className="text-blue-100 mt-2 flex items-center justify-center sm:justify-start gap-2">
                  <EmailIcon className="w-4 h-4" />
                  {user.email || "No email"}
                </p>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-6 py-2.5 bg-white text-blue-600 rounded-xl hover:shadow-lg transition-all flex items-center gap-2 font-medium"
              >
                <EditIcon className="w-5 h-5" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Personal Information
                </h3>
                
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="text-gray-800 font-medium">{user.name || "Not set"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="text-gray-800 font-medium">{user.email || "Not set"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="text-gray-800 font-medium">{user.phone || "Not set"}</p>
                </div>
              </div>

              {/* Account Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Account Information
                </h3>
                
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <div className="mt-1">
                    <RoleBadge role={user.role} />
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="mt-1">
                    <StatusBadge status={user.status} />
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Account Created</p>
                  <p className="text-gray-800 font-medium flex items-center gap-2">
                    <CalendarTodayIcon className="w-4 h-4 text-gray-400" />
                    {formatDate(user.createdAt)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Last Login</p>
                  <p className="text-gray-800 font-medium">
                    {formatDate(user.lastLogin)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onSave={handleUpdateProfile}
      />
    </div>
  );
};