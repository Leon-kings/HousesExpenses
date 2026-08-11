
// /* eslint-disable react-hooks/preserve-manual-memoization */
// /* eslint-disable react-hooks/immutability */
// /* eslint-disable react-hooks/set-state-in-effect */
// /* eslint-disable no-unused-vars */
// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useState, useEffect, useCallback, useRef, memo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";
// import { useNavigate, useParams } from "react-router-dom";

// // Material Icons
// import AddIcon from "@mui/icons-material/Add";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import CloseIcon from "@mui/icons-material/Close";
// import SearchIcon from "@mui/icons-material/Search";
// import TrendingUpIcon from "@mui/icons-material/TrendingUp";
// import TrendingDownIcon from "@mui/icons-material/TrendingDown";
// import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
// import SavingsIcon from "@mui/icons-material/Savings";
// import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
// import WarningIcon from "@mui/icons-material/Warning";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import PersonIcon from "@mui/icons-material/Person";
// import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
// import BarChartIcon from "@mui/icons-material/BarChart";
// import PieChartIcon from "@mui/icons-material/PieChart";
// import DownloadIcon from "@mui/icons-material/Download";

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

// // Income Categories
// const INCOME_CATEGORIES = [
//   "Salary",
//   "Freelance",
//   "Business",
//   "Investment",
//   "Rental",
//   "Dividends",
//   "Gifts",
//   "Bonus",
//   "Commission",
//   "Pension",
//   "Social Security",
//   "Other",
// ];

// // Savings Categories
// const SAVINGS_CATEGORIES = [
//   "Emergency Fund",
//   "Retirement",
//   "Education",
//   "Housing",
//   "Health",
//   "Travel",
//   "Investment",
//   "General Savings",
//   "Children's Education",
//   "Business Fund",
// ];

// // Budget Categories (expense categories for budget planning)
// const BUDGET_CATEGORIES = [
//   "Food",
//   "Utilities",
//   "Transport",
//   "Entertainment",
//   "Shopping",
//   "Healthcare",
//   "Education",
//   "Rent",
//   "Insurance",
//   "Groceries",
//   "Dining Out",
//   "Subscriptions",
//   "Clothing",
//   "Home Maintenance",
//   "Other",
// ];

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
//             <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-200 rounded-t-3xl">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
//                 <button
//                   onClick={onClose}
//                   className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                 >
//                   <CloseIcon className="w-6 h-6 text-gray-500" />
//                 </button>
//               </div>
//             </div>
//             <div className="p-6">{children}</div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// });

// // Memoized Income Form Component
// const IncomeForm = memo(
//   ({
//     formData,
//     setFormData,
//     onSubmit,
//     submitLabel,
//     isSubmitting,
//     categories,
//     onCancel,
//   }) => (
//     <form onSubmit={onSubmit} className="space-y-4">
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Description *
//         </label>
//         <input
//           type="text"
//           value={formData.description}
//           onChange={(e) =>
//             setFormData({ ...formData, description: e.target.value })
//           }
//           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//           placeholder="Enter description"
//           required
//         />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Category *
//           </label>
//           <select
//             value={formData.category}
//             onChange={(e) =>
//               setFormData({ ...formData, category: e.target.value })
//             }
//             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//             required
//           >
//             <option value="">Select Category</option>
//             {categories.map((cat) => (
//               <option key={cat} value={cat}>
//                 {cat}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Source
//           </label>
//           <input
//             type="text"
//             value={formData.source}
//             onChange={(e) =>
//               setFormData({ ...formData, source: e.target.value })
//             }
//             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//             placeholder="Income source"
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Amount (RWF) *
//           </label>
//           <input
//             type="number"
//             step="1"
//             min="0"
//             value={formData.amount}
//             onChange={(e) => {
//               const value = e.target.value;
//               // Only allow whole numbers (no decimals)
//               if (value === "" || /^\d+$/.test(value)) {
//                 setFormData({ ...formData, amount: value });
//               }
//             }}
//             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//             placeholder="0"
//             required
//           />
//           <p className="text-xs text-gray-500 mt-1">
//             Whole numbers only (no decimals)
//           </p>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Date *
//           </label>
//           <input
//             type="date"
//             value={formData.date}
//             onChange={(e) => setFormData({ ...formData, date: e.target.value })}
//             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//             required
//           />
//         </div>
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           User Name *
//         </label>
//         <input
//           type="text"
//           value={formData.user}
//           onChange={(e) => setFormData({ ...formData, user: e.target.value })}
//           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//           placeholder="Enter user name"
//           required
//         />
//       </div>

//       <div className="flex items-center space-x-4">
//         <label className="flex items-center space-x-2">
//           <input
//             type="checkbox"
//             checked={formData.isRecurring}
//             onChange={(e) =>
//               setFormData({ ...formData, isRecurring: e.target.checked })
//             }
//             className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
//           />
//           <span className="text-sm text-gray-700">Recurring Income</span>
//         </label>

//         {formData.isRecurring && (
//           <select
//             value={formData.frequency}
//             onChange={(e) =>
//               setFormData({ ...formData, frequency: e.target.value })
//             }
//             className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//           >
//             <option value="weekly">Weekly</option>
//             <option value="biweekly">Bi-weekly</option>
//             <option value="monthly">Monthly</option>
//             <option value="quarterly">Quarterly</option>
//             <option value="annually">Annually</option>
//           </select>
//         )}
//       </div>

//       <input type="hidden" value={formData.email} />

//       <div className="flex justify-end space-x-3 pt-4">
//         <button
//           type="button"
//           onClick={onCancel}
//           className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//         >
//           Cancel
//         </button>
//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
//         >
//           {isSubmitting ? (
//             <>
//               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//               <span>Processing...</span>
//             </>
//           ) : (
//             <span>{submitLabel}</span>
//           )}
//         </button>
//       </div>
//     </form>
//   ),
// );

// // Memoized Budget Form Component
// const BudgetForm = memo(
//   ({
//     budgetFormData,
//     setBudgetFormData,
//     onSubmit,
//     isSubmitting,
//     categories,
//     onCancel,
//     getMonthName,
//   }) => (
//     <form onSubmit={onSubmit} className="space-y-4">
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Category *
//         </label>
//         <select
//           value={budgetFormData.category}
//           onChange={(e) =>
//             setBudgetFormData({ ...budgetFormData, category: e.target.value })
//           }
//           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//           required
//         >
//           <option value="">Select Category</option>
//           {categories.map((cat) => (
//             <option key={cat} value={cat}>
//               {cat}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Allocated Amount (RWF) *
//         </label>
//         <input
//           type="number"
//           step="1"
//           min="0"
//           value={budgetFormData.allocatedAmount}
//           onChange={(e) => {
//             const value = e.target.value;
//             // Only allow whole numbers (no decimals)
//             if (value === "" || /^\d+$/.test(value)) {
//               setBudgetFormData({ ...budgetFormData, allocatedAmount: value });
//             }
//           }}
//           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//           placeholder="0"
//           required
//         />
//         <p className="text-xs text-gray-500 mt-1">
//           Whole numbers only (no decimals)
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Month
//           </label>
//           <select
//             value={budgetFormData.month}
//             onChange={(e) =>
//               setBudgetFormData({
//                 ...budgetFormData,
//                 month: parseInt(e.target.value),
//               })
//             }
//             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//           >
//             {Array.from({ length: 12 }, (_, i) => (
//               <option key={i} value={i}>
//                 {getMonthName(i)}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Year
//           </label>
//           <input
//             type="number"
//             value={budgetFormData.year}
//             onChange={(e) =>
//               setBudgetFormData({
//                 ...budgetFormData,
//                 year: parseInt(e.target.value),
//               })
//             }
//             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//             min={2020}
//             max={2030}
//           />
//         </div>
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Description (Optional)
//         </label>
//         <textarea
//           value={budgetFormData.description}
//           onChange={(e) =>
//             setBudgetFormData({
//               ...budgetFormData,
//               description: e.target.value,
//             })
//           }
//           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//           rows="2"
//           placeholder="Additional notes"
//         />
//       </div>

//       <div className="flex justify-end space-x-3 pt-4">
//         <button
//           type="button"
//           onClick={onCancel}
//           className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//         >
//           Cancel
//         </button>
//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
//         >
//           {isSubmitting ? (
//             <>
//               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//               <span>Saving...</span>
//             </>
//           ) : (
//             <span>Set Budget</span>
//           )}
//         </button>
//       </div>
//     </form>
//   ),
// );

// // Memoized Savings Form Component
// const SavingsForm = memo(
//   ({
//     savingsFormData,
//     setSavingsFormData,
//     onSubmit,
//     isSubmitting,
//     categories,
//     onCancel,
//   }) => (
//     <form onSubmit={onSubmit} className="space-y-4">
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Savings Category *
//         </label>
//         <select
//           value={savingsFormData.category}
//           onChange={(e) =>
//             setSavingsFormData({ ...savingsFormData, category: e.target.value })
//           }
//           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//           required
//         >
//           <option value="">Select Category</option>
//           {categories.map((cat) => (
//             <option key={cat} value={cat}>
//               {cat}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Target Amount (RWF) *
//           </label>
//           <input
//             type="number"
//             step="1"
//             min="0"
//             value={savingsFormData.targetAmount}
//             onChange={(e) => {
//               const value = e.target.value;
//               // Only allow whole numbers (no decimals)
//               if (value === "" || /^\d+$/.test(value)) {
//                 setSavingsFormData({ ...savingsFormData, targetAmount: value });
//               }
//             }}
//             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//             placeholder="0"
//             required
//           />
//           <p className="text-xs text-gray-500 mt-1">
//             Whole numbers only (no decimals)
//           </p>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Current Amount (RWF)
//           </label>
//           <input
//             type="number"
//             step="1"
//             min="0"
//             value={savingsFormData.currentAmount}
//             onChange={(e) => {
//               const value = e.target.value;
//               // Only allow whole numbers (no decimals)
//               if (value === "" || /^\d+$/.test(value)) {
//                 setSavingsFormData({
//                   ...savingsFormData,
//                   currentAmount: value,
//                 });
//               }
//             }}
//             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//             placeholder="0"
//           />
//           <p className="text-xs text-gray-500 mt-1">
//             Whole numbers only (no decimals)
//           </p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Deadline
//           </label>
//           <input
//             type="date"
//             value={savingsFormData.deadline}
//             onChange={(e) =>
//               setSavingsFormData({
//                 ...savingsFormData,
//                 deadline: e.target.value,
//               })
//             }
//             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Priority
//           </label>
//           <select
//             value={savingsFormData.priority}
//             onChange={(e) =>
//               setSavingsFormData({
//                 ...savingsFormData,
//                 priority: e.target.value,
//               })
//             }
//             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//           >
//             <option value="low">Low</option>
//             <option value="medium">Medium</option>
//             <option value="high">High</option>
//             <option value="critical">Critical</option>
//           </select>
//         </div>
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Description (Optional)
//         </label>
//         <textarea
//           value={savingsFormData.description}
//           onChange={(e) =>
//             setSavingsFormData({
//               ...savingsFormData,
//               description: e.target.value,
//             })
//           }
//           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//           rows="2"
//           placeholder="Additional notes about this savings goal"
//         />
//       </div>

//       <div className="flex justify-end space-x-3 pt-4">
//         <button
//           type="button"
//           onClick={onCancel}
//           className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//         >
//           Cancel
//         </button>
//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
//         >
//           {isSubmitting ? (
//             <>
//               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//               <span>Saving...</span>
//             </>
//           ) : (
//             <span>Set Savings Goal</span>
//           )}
//         </button>
//       </div>
//     </form>
//   ),
// );

// // Memoized Budget Status Badge
// const BudgetStatusBadge = memo(({ allocated, actual }) => {
//   const percentage = allocated > 0 ? (actual / allocated) * 100 : 0;
//   let status = "On Track";
//   let color = "bg-green-100 text-green-800";

//   if (percentage > 100) {
//     status = "Over Budget";
//     color = "bg-red-100 text-red-800";
//   } else if (percentage > 80) {
//     status = "Approaching Limit";
//     color = "bg-yellow-100 text-yellow-800";
//   } else if (percentage < 50) {
//     status = "Under Budget";
//     color = "bg-blue-100 text-blue-800";
//   }

//   return (
//     <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
//       {status} ({percentage.toFixed(1)}%)
//     </span>
//   );
// });

// // Memoized Savings Progress
// const SavingsProgress = memo(({ current, target, formatCurrency }) => {
//   const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;
//   return (
//     <div className="w-full">
//       <div className="flex justify-between text-xs text-gray-600 mb-1">
//         <span>Progress: {percentage.toFixed(1)}%</span>
//         <span>
//           {formatCurrency(current)} / {formatCurrency(target)}
//         </span>
//       </div>
//       <div className="w-full bg-gray-200 rounded-full h-2">
//         <div
//           className={`h-2 rounded-full transition-all duration-500 ${
//             percentage >= 100
//               ? "bg-green-500"
//               : percentage >= 50
//                 ? "bg-blue-500"
//                 : "bg-purple-500"
//           }`}
//           style={{ width: `${percentage}%` }}
//         />
//       </div>
//     </div>
//   );
// });

// export const MyIncome = () => {
//   const navigate = useNavigate();
//   const { userName } = useParams(); // Get userName from route params
//   const [user, setUser] = useState(() => {
//     try {
//       return JSON.parse(localStorage.getItem("userData") || "null");
//     } catch {
//       return null;
//     }
//   });

//   // State for incomes
//   const [incomes, setIncomes] = useState([]);
//   const [filteredIncomes, setFilteredIncomes] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterCategory, setFilterCategory] = useState("all");
//   const [filterUserName, setFilterUserName] = useState(userName || ""); // Filter by user name
//   const [filterMonth, setFilterMonth] = useState("");
//   const [filterYear, setFilterYear] = useState(new Date().getFullYear());

//   // Refs to track current filter values without causing re-renders
//   const searchTermRef = useRef(searchTerm);
//   const filterCategoryRef = useRef(filterCategory);
//   const selectedMonthRef = useRef(new Date().getMonth());
//   const selectedYearRef = useRef(new Date().getFullYear());
//   const isFirstLoadRef = useRef(true);
//   const isLoadingRef = useRef(false);

//   // Budget and Savings state
//   const [budgets, setBudgets] = useState([]);
//   const [savings, setSavings] = useState([]);
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

//   // Stats
//   const [stats, setStats] = useState({
//     totalIncome: 0,
//     monthlyIncome: 0,
//     averageIncome: 0,
//     totalSavings: 0,
//     monthlySavings: 0,
//     savingsRate: 0,
//     budgetUtilization: 0,
//     incomeCount: 0,
//     topIncomeSource: "",
//     budgetStatus: "on-track",
//   });

//   // Modal states
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
//   const [isSavingsModalOpen, setIsSavingsModalOpen] = useState(false);
//   const [isReportModalOpen, setIsReportModalOpen] = useState(false);
//   const [selectedIncome, setSelectedIncome] = useState(null);
//   const [selectedBudget, setSelectedBudget] = useState(null);
//   const [selectedSavings, setSelectedSavings] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [activeTab, setActiveTab] = useState("incomes"); // incomes, budgets, savings

//   // Form data
//   const [formData, setFormData] = useState({
//     description: "",
//     category: "",
//     source: "",
//     amount: "",
//     date: new Date().toISOString().split("T")[0],
//     user: "",
//     email: "",
//     isRecurring: false,
//     frequency: "monthly",
//   });

//   // Budget form data
//   const [budgetFormData, setBudgetFormData] = useState({
//     category: "",
//     allocatedAmount: "",
//     month: new Date().getMonth(),
//     year: new Date().getFullYear(),
//     description: "",
//   });

//   // Savings form data
//   const [savingsFormData, setSavingsFormData] = useState({
//     category: "",
//     targetAmount: "",
//     currentAmount: "",
//     deadline: "",
//     description: "",
//     priority: "medium",
//   });

//   // Check if user is admin
//   const isAdmin = user?.role === "admin" || user?.role === "Admin";

//   // Get user email
//   const getUserEmail = useCallback(() => {
//     return user?.email || "";
//   }, [user]);

//   // Get month name
//   const getMonthName = useCallback((month) => {
//     const months = [
//       "January",
//       "February",
//       "March",
//       "April",
//       "May",
//       "June",
//       "July",
//       "August",
//       "September",
//       "October",
//       "November",
//       "December",
//     ];
//     return months[month] || "";
//   }, []);

//   // Redirect if no valid session
//   useEffect(() => {
//     const token = localStorage.getItem("authToken");
//     const userData = JSON.parse(localStorage.getItem("userData") || "null");

//     if (!token || !userData) {
//       navigate("/");
//       return;
//     }

//     if (!user) setUser(userData);

//     // Set user name and email in form data
//     const targetUserName = userName || userData.name || "";
//     setFilterUserName(targetUserName);

//     if (userData?.email) {
//       setFormData((prev) => ({
//         ...prev,
//         email: userData.email,
//         user: targetUserName || userData.name || "",
//       }));
//     }

//     // Load data only on initial mount
//     if (isFirstLoadRef.current) {
//       isFirstLoadRef.current = false;
//       loadIncomes();
//       loadBudgets();
//       loadSavings();
//     }
//   }, [navigate, userName]);

//   // CRITICAL: Load incomes and filter by user name
//   const loadIncomes = useCallback(async () => {
//     // Prevent concurrent loads
//     if (isLoadingRef.current) return;

//     const targetUserName = userName || user?.name || "";

//     if (!targetUserName && !isAdmin) {
//       toast.warning("User name not found");
//       return;
//     }

//     isLoadingRef.current = true;
//     setIsLoading(true);

//     try {
//       // Use refs to get current values
//       const search = searchTermRef.current;
//       const category = filterCategoryRef.current;

//       // Fetch ALL incomes from the API
//       const response = await api.get("/incomes");

//       let allIncomes = [];

//       if (response.data.success) {
//         allIncomes = response.data.data || [];
//       } else if (Array.isArray(response.data)) {
//         allIncomes = response.data;
//       } else {
//         toast.warning("Unexpected response format");
//         setIsLoading(false);
//         isLoadingRef.current = false;
//         return;
//       }

//       console.log(`✅ Found ${allIncomes.length} total incomes`);

//       // CRITICAL: Filter incomes by user name (case insensitive)
//       let filteredData = allIncomes;

//       if (!isAdmin && targetUserName) {
//         filteredData = allIncomes.filter((inc) => {
//           const incomeUserName = inc.user || "";
//           return incomeUserName.toLowerCase() === targetUserName.toLowerCase();
//         });
//         console.log(
//           `✅ Filtered to ${filteredData.length} incomes for user: "${targetUserName}"`,
//         );
//       } else if (isAdmin) {
//         // Admin sees all incomes
//         console.log(`👑 Admin viewing all ${filteredData.length} incomes`);
//       }

//       // Log unique users found for debugging
//       const uniqueUsers = [
//         ...new Set(allIncomes.map((inc) => inc.user).filter(Boolean)),
//       ];
//       console.log("👥 All users found in incomes:", uniqueUsers);
//       console.log("🎯 Target user:", targetUserName);

//       // Apply additional filters (category, search)
//       if (category && category !== "all") {
//         filteredData = filteredData.filter((inc) => inc.category === category);
//       }

//       if (search) {
//         const searchLower = search.toLowerCase();
//         filteredData = filteredData.filter(
//           (inc) =>
//             (inc.description &&
//               inc.description.toLowerCase().includes(searchLower)) ||
//             (inc.category &&
//               inc.category.toLowerCase().includes(searchLower)) ||
//             (inc.source && inc.source.toLowerCase().includes(searchLower)) ||
//             (inc.user && inc.user.toLowerCase().includes(searchLower)),
//         );
//       }

//       setIncomes(filteredData);
//       setFilteredIncomes(filteredData);
//       calculateStats(filteredData);

//       if (filteredData.length === 0 && !isAdmin) {
//         toast.info(`No incomes found for user: "${targetUserName}"`);
//       } else if (filteredData.length === 0 && isAdmin) {
//         toast.info("No incomes found");
//       } else {
//         toast.success(
//           `Loaded ${filteredData.length} incomes${!isAdmin ? ` for "${targetUserName}"` : ""}`,
//         );
//       }
//     } catch (error) {
//       console.error("Load incomes error:", error);
//       toast.error(error.response?.data?.message || "Failed to load incomes");
//     } finally {
//       setIsLoading(false);
//       isLoadingRef.current = false;
//     }
//   }, [user?.name, isAdmin, userName]);

//   // Load budgets by email
//   const loadBudgets = useCallback(async () => {
//     try {
//       const userEmail = getUserEmail();

//       // If not admin and no email, show warning
//       if (!isAdmin && !userEmail) {
//         console.warn("No user email found for loading budgets");
//         return;
//       }

//       // Build params
//       const params = {
//         month: selectedMonthRef.current,
//         year: selectedYearRef.current,
//       };

//       // If not admin, add email to params
//       if (!isAdmin && userEmail) {
//         params.email = userEmail;
//       }

//       const response = await api.get("/budgets", { params });

//       if (response.data.success) {
//         let budgetData = response.data.data || [];
//         setBudgets(budgetData);
//         console.log(
//           `✅ Loaded ${budgetData.length} budgets for email: ${userEmail || "all"}`,
//         );
//       }
//     } catch (error) {
//       console.error("Load budgets error:", error);
//       // Don't show error for budgets as it's a secondary feature
//     }
//   }, [isAdmin, getUserEmail]);

//   // Load savings by email
//   const loadSavings = useCallback(async () => {
//     try {
//       const userEmail = getUserEmail();

//       // If not admin and no email, show warning
//       if (!isAdmin && !userEmail) {
//         console.warn("No user email found for loading savings");
//         return;
//       }

//       // Build params
//       const params = {};

//       // If not admin, add email to params
//       if (!isAdmin && userEmail) {
//         params.email = userEmail;
//       }

//       const response = await api.get("/savings", { params });

//       if (response.data.success) {
//         let savingsData = response.data.data || [];
//         setSavings(savingsData);
//         console.log(
//           `✅ Loaded ${savingsData.length} savings for email: ${userEmail || "all"}`,
//         );
//       }
//     } catch (error) {
//       console.error("Load savings error:", error);
//     }
//   }, [isAdmin, getUserEmail]);

//   // Calculate stats
//   const calculateStats = useCallback(
//     (incomeData) => {
//       const currentMonth = new Date().getMonth();
//       const currentYear = new Date().getFullYear();

//       const monthlyIncomes = incomeData.filter((inc) => {
//         const date = new Date(inc.date);
//         return (
//           date.getMonth() === currentMonth && date.getFullYear() === currentYear
//         );
//       });

//       const totalIncome = incomeData.reduce(
//         (sum, inc) => sum + (inc.amount || 0),
//         0,
//       );
//       const monthlyIncome = monthlyIncomes.reduce(
//         (sum, inc) => sum + (inc.amount || 0),
//         0,
//       );
//       const averageIncome =
//         incomeData.length > 0 ? totalIncome / incomeData.length : 0;

//       // Find top income source
//       const sourceMap = {};
//       incomeData.forEach((inc) => {
//         const source = inc.category || inc.source || "Other";
//         sourceMap[source] = (sourceMap[source] || 0) + (inc.amount || 0);
//       });
//       let topSource = "N/A";
//       let maxAmount = 0;
//       Object.entries(sourceMap).forEach(([source, amount]) => {
//         if (amount > maxAmount) {
//           maxAmount = amount;
//           topSource = source;
//         }
//       });

//       // Calculate savings rate (assuming 20% target savings rate)
//       const totalSavings = savings.reduce(
//         (sum, sav) => sum + (sav.currentAmount || 0),
//         0,
//       );
//       const savingsRate =
//         totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;

//       // Budget utilization
//       const totalBudgeted = budgets.reduce(
//         (sum, b) => sum + (b.allocatedAmount || 0),
//         0,
//       );
//       const budgetUtilization =
//         totalBudgeted > 0 ? (totalIncome / totalBudgeted) * 100 : 0;

//       // Budget status
//       let budgetStatus = "on-track";
//       if (budgetUtilization > 100) budgetStatus = "over-budget";
//       else if (budgetUtilization > 80) budgetStatus = "approaching-limit";
//       else if (budgetUtilization < 50) budgetStatus = "under-budget";

//       setStats({
//         totalIncome,
//         monthlyIncome,
//         averageIncome,
//         totalSavings,
//         monthlySavings: totalSavings / 12,
//         savingsRate,
//         budgetUtilization,
//         incomeCount: incomeData.length,
//         topIncomeSource: topSource,
//         budgetStatus,
//       });
//     },
//     [savings, budgets],
//   );

//   // Handle search and filter - update refs and trigger load with debounce
//   useEffect(() => {
//     // Update refs with current values
//     searchTermRef.current = searchTerm;
//     filterCategoryRef.current = filterCategory;
//     selectedMonthRef.current = selectedMonth;
//     selectedYearRef.current = selectedYear;

//     // Debounce the load - only after user stops interacting
//     const timer = setTimeout(() => {
//       // Skip if this is the initial load
//       if (!isFirstLoadRef.current) {
//         loadIncomes();
//         loadBudgets();
//       }
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [
//     searchTerm,
//     filterCategory,
//     selectedMonth,
//     selectedYear,
//     loadIncomes,
//     loadBudgets,
//   ]);

//   // Filter incomes based on month/year (client-side filtering)
//   useEffect(() => {
//     let filtered = [...incomes];

//     // Month filter
//     if (selectedMonth !== undefined && selectedYear !== undefined) {
//       filtered = filtered.filter((inc) => {
//         const date = new Date(inc.date);
//         return (
//           date.getMonth() === selectedMonth &&
//           date.getFullYear() === selectedYear
//         );
//       });
//     }

//     setFilteredIncomes(filtered);
//   }, [incomes, selectedMonth, selectedYear]);

//   // Handle add income
//   const handleAddIncome = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     // Validate amount is a whole number
//     const amountValue = Number(formData.amount);
//     if (!Number.isInteger(amountValue) || amountValue <= 0) {
//       toast.error("Amount must be a positive whole number (no decimals)");
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       const incomeData = {
//         description: formData.description,
//         category: formData.category || formData.source,
//         source: formData.source || formData.category,
//         amount: amountValue,
//         date: formData.date,
//         user: formData.user || user?.name || userName || "Unknown",
//         email: formData.email || user?.email,
//         isRecurring: formData.isRecurring,
//         frequency: formData.frequency,
//       };

//       const response = await api.post("/incomes", incomeData);

//       if (response.data.success) {
//         toast.success("Income added successfully!");
//         setIsAddModalOpen(false);
//         resetForm();
//         // Reload after adding
//         setTimeout(() => {
//           loadIncomes();
//           loadSavings();
//         }, 100);
//       } else {
//         toast.error(response.data.message || "Failed to add income");
//       }
//     } catch (error) {
//       console.error("Add income error:", error);
//       toast.error(error.response?.data?.message || "Failed to add income");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Handle edit income
//   const handleEditIncome = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     // Validate amount is a whole number
//     const amountValue = Number(formData.amount);
//     if (!Number.isInteger(amountValue) || amountValue <= 0) {
//       toast.error("Amount must be a positive whole number (no decimals)");
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       const incomeData = {
//         description: formData.description,
//         category: formData.category || formData.source,
//         source: formData.source || formData.category,
//         amount: amountValue,
//         date: formData.date,
//         user: formData.user || user?.name || userName || "Unknown",
//         email: formData.email || user?.email,
//         isRecurring: formData.isRecurring,
//         frequency: formData.frequency,
//       };

//       const response = await api.put(
//         `/incomes/${selectedIncome._id}`,
//         incomeData,
//       );

//       if (response.data.success) {
//         toast.success("Income updated successfully!");
//         setIsEditModalOpen(false);
//         resetForm();
//         // Reload after updating
//         setTimeout(() => loadIncomes(), 100);
//       } else {
//         toast.error(response.data.message || "Failed to update income");
//       }
//     } catch (error) {
//       console.error("Update income error:", error);
//       toast.error(error.response?.data?.message || "Failed to update income");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Handle delete income
//   const handleDeleteIncome = async () => {
//     setIsSubmitting(true);

//     try {
//       const response = await api.delete(`/incomes/${selectedIncome._id}`);

//       if (response.data.success) {
//         toast.success("Income deleted successfully!");
//         setIsDeleteModalOpen(false);
//         setSelectedIncome(null);
//         // Reload after deleting
//         setTimeout(() => {
//           loadIncomes();
//           loadSavings();
//         }, 100);
//       } else {
//         toast.error(response.data.message || "Failed to delete income");
//       }
//     } catch (error) {
//       console.error("Delete income error:", error);
//       toast.error(error.response?.data?.message || "Failed to delete income");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Handle add budget
//   const handleAddBudget = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     // Validate allocated amount is a whole number
//     const allocatedValue = Number(budgetFormData.allocatedAmount);
//     if (!Number.isInteger(allocatedValue) || allocatedValue < 0) {
//       toast.error("Allocated amount must be a whole number (no decimals)");
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       const budgetData = {
//         ...budgetFormData,
//         allocatedAmount: allocatedValue,
//         email: user?.email,
//         user: user?.name || userName || "Unknown",
//         month: parseInt(budgetFormData.month),
//         year: parseInt(budgetFormData.year),
//       };

//       const response = await api.post("/budgets", budgetData);

//       if (response.data.success) {
//         toast.success("Budget set successfully!");
//         setIsBudgetModalOpen(false);
//         resetBudgetForm();
//         // Reload after adding
//         setTimeout(() => loadBudgets(), 100);
//       } else {
//         toast.error(response.data.message || "Failed to set budget");
//       }
//     } catch (error) {
//       console.error("Add budget error:", error);
//       toast.error(error.response?.data?.message || "Failed to set budget");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Handle add savings
//   const handleAddSavings = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     // Validate target amount is a whole number
//     const targetValue = Number(savingsFormData.targetAmount);
//     const currentValue = Number(savingsFormData.currentAmount) || 0;

//     if (!Number.isInteger(targetValue) || targetValue <= 0) {
//       toast.error(
//         "Target amount must be a positive whole number (no decimals)",
//       );
//       setIsSubmitting(false);
//       return;
//     }

//     if (!Number.isInteger(currentValue) || currentValue < 0) {
//       toast.error("Current amount must be a whole number (no decimals)");
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       const savingsData = {
//         ...savingsFormData,
//         targetAmount: targetValue,
//         currentAmount: currentValue,
//         email: user?.email,
//         user: user?.name || userName || "Unknown",
//       };

//       const response = await api.post("/savings", savingsData);

//       if (response.data.success) {
//         toast.success("Savings goal set successfully!");
//         setIsSavingsModalOpen(false);
//         resetSavingsForm();
//         // Reload after adding
//         setTimeout(() => {
//           loadSavings();
//           loadIncomes(); // Refresh stats
//         }, 100);
//       } else {
//         toast.error(response.data.message || "Failed to set savings goal");
//       }
//     } catch (error) {
//       console.error("Add savings error:", error);
//       toast.error(
//         error.response?.data?.message || "Failed to set savings goal",
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Reset forms
//   const resetForm = useCallback(() => {
//     setFormData({
//       description: "",
//       category: "",
//       source: "",
//       amount: "",
//       date: new Date().toISOString().split("T")[0],
//       user: user?.name || userName || "",
//       email: user?.email || "",
//       isRecurring: false,
//       frequency: "monthly",
//     });
//     setSelectedIncome(null);
//   }, [user, userName]);

//   const resetBudgetForm = useCallback(() => {
//     setBudgetFormData({
//       category: "",
//       allocatedAmount: "",
//       month: new Date().getMonth(),
//       year: new Date().getFullYear(),
//       description: "",
//     });
//     setSelectedBudget(null);
//   }, []);

//   const resetSavingsForm = useCallback(() => {
//     setSavingsFormData({
//       category: "",
//       targetAmount: "",
//       currentAmount: "",
//       deadline: "",
//       description: "",
//       priority: "medium",
//     });
//     setSelectedSavings(null);
//   }, []);

//   // Open edit modal
//   const openEditModal = useCallback(
//     (income) => {
//       setSelectedIncome(income);
//       setFormData({
//         description: income.description || "",
//         category: income.category || income.source || "",
//         source: income.source || income.category || "",
//         amount: income.amount?.toString() || "",
//         date: income.date
//           ? income.date.split("T")[0]
//           : new Date().toISOString().split("T")[0],
//         user: income.user || user?.name || userName || "",
//         email: income.email || user?.email || "",
//         isRecurring: income.isRecurring || false,
//         frequency: income.frequency || "monthly",
//       });
//       setIsEditModalOpen(true);
//     },
//     [user, userName],
//   );

//   // Format currency (RWF - Rwandan Franc)
//   const formatCurrency = useCallback((amount) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "RWF",
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(amount || 0);
//   }, []);

//   // Format date
//   const formatDate = useCallback((dateString) => {
//     if (!dateString) return "N/A";
//     try {
//       return new Date(dateString).toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//       });
//     } catch {
//       return "N/A";
//     }
//   }, []);

//   // Generate report
//   const generateReport = useCallback(() => {
//     setIsReportModalOpen(true);
//   }, []);

//   // Export report data
//   const exportReport = useCallback(() => {
//     const data = {
//       user: userName || user?.name || "All Users",
//       generatedDate: new Date().toISOString(),
//       stats,
//       incomes: filteredIncomes,
//       budgets,
//       savings,
//     };

//     // Create CSV
//     const headers = [
//       "Date",
//       "Description",
//       "Category",
//       "Source",
//       "Amount (RWF)",
//       "User",
//     ];
//     const rows = filteredIncomes.map((inc) => [
//       formatDate(inc.date),
//       inc.description || "",
//       inc.category || "",
//       inc.source || "",
//       inc.amount || 0,
//       inc.user || "",
//     ]);

//     let csv = headers.join(",") + "\n";
//     rows.forEach((row) => {
//       csv += row.join(",") + "\n";
//     });

//     // Add budget summary
//     csv += "\nBudget Summary\n";
//     csv += "Category,Allocated Amount (RWF),Actual Amount (RWF),Status\n";
//     budgets.forEach((budget) => {
//       const actual = filteredIncomes
//         .filter((inc) => inc.category === budget.category)
//         .reduce((sum, inc) => sum + (inc.amount || 0), 0);
//       const status =
//         actual <= budget.allocatedAmount ? "On Track" : "Over Budget";
//       csv += `${budget.category},${budget.allocatedAmount},${actual},${status}\n`;
//     });

//     // Add savings summary
//     csv += "\nSavings Goals\n";
//     csv +=
//       "Category,Target Amount (RWF),Current Amount (RWF),Progress,Deadline\n";
//     savings.forEach((saving) => {
//       const progress = (
//         (saving.currentAmount / saving.targetAmount) *
//         100
//       ).toFixed(1);
//       csv += `${saving.category},${saving.targetAmount},${saving.currentAmount},${progress}%,${saving.deadline || "N/A"}\n`;
//     });

//     // Download
//     const blob = new Blob([csv], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `income-report-${new Date().toISOString().split("T")[0]}.csv`;
//     a.click();
//     window.URL.revokeObjectURL(url);

//     toast.success("Report exported successfully!");
//     setIsReportModalOpen(false);
//   }, [filteredIncomes, budgets, savings, stats, user, userName, formatDate]);

//   // Get display data
//   const displayIncomes = filteredIncomes.length > 0 ? filteredIncomes : incomes;

//   // Current month/year for filtering
//   const currentMonth = new Date().getMonth();
//   const currentYear = new Date().getFullYear();

//   // Filter incomes by month/year for budget comparison
//   const monthlyIncomes = displayIncomes.filter((inc) => {
//     const date = new Date(inc.date);
//     return (
//       date.getMonth() === selectedMonth && date.getFullYear() === selectedYear
//     );
//   });

//   // Calculate actual spending per category for budget comparison
//   const categoryActuals = {};
//   monthlyIncomes.forEach((inc) => {
//     const category = inc.category || "Other";
//     categoryActuals[category] =
//       (categoryActuals[category] || 0) + (inc.amount || 0);
//   });

//   // Memoized Income Table Row
//   const IncomeRow = memo(
//     ({
//       income,
//       index,
//       formatDate,
//       formatCurrency,
//       openEditModal,
//       setSelectedIncome,
//       setIsDeleteModalOpen,
//     }) => (
//       <motion.tr
//         key={income._id || index}
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: index * 0.05 }}
//         className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
//       >
//         <td className="py-3 px-4 text-gray-600 text-sm">
//           {formatDate(income.date)}
//         </td>
//         <td className="py-3 px-4 text-gray-800 font-medium">
//           {income.description || "N/A"}
//         </td>
//         <td className="py-3 px-4">
//           <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
//             {income.category || income.source || "Uncategorized"}
//           </span>
//         </td>
//         <td className="py-3 px-4 text-gray-600 text-sm">
//           {income.source || "N/A"}
//         </td>
//         <td className="py-3 px-4 text-gray-600 text-sm">
//           {income.user || "Unknown"}
//         </td>
//         <td className="py-3 px-4 text-right font-semibold text-green-600">
//           +{formatCurrency(income.amount)}
//         </td>
//         <td className="py-3 px-4 text-center">
//           <div className="flex items-center justify-center space-x-2">
//             <button
//               onClick={() => openEditModal(income)}
//               className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//               title="Edit"
//             >
//               <EditIcon className="w-5 h-5" />
//             </button>
//             <button
//               onClick={() => {
//                 setSelectedIncome(income);
//                 setIsDeleteModalOpen(true);
//               }}
//               className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//               title="Delete"
//             >
//               <DeleteIcon className="w-5 h-5" />
//             </button>
//           </div>
//         </td>
//       </motion.tr>
//     ),
//   );

//   // Memoized Budget Card
//   const BudgetCard = memo(({ budget, actual, formatCurrency }) => (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="bg-gray-50 rounded-xl p-4 border border-gray-200"
//     >
//       <div className="flex justify-between items-start mb-2">
//         <div>
//           <h4 className="font-semibold text-gray-800">{budget.category}</h4>
//           <p className="text-sm text-gray-500">
//             {budget.description || "No description"}
//           </p>
//         </div>
//         <BudgetStatusBadge allocated={budget.allocatedAmount} actual={actual} />
//       </div>
//       <div className="flex justify-between text-sm text-gray-600 mb-2">
//         <span>Budgeted: {formatCurrency(budget.allocatedAmount)}</span>
//         <span>Spent: {formatCurrency(actual)}</span>
//       </div>
//       <div className="w-full bg-gray-200 rounded-full h-2">
//         <div
//           className={`h-2 rounded-full transition-all duration-500 ${
//             actual > budget.allocatedAmount
//               ? "bg-red-500"
//               : actual > budget.allocatedAmount * 0.8
//                 ? "bg-yellow-500"
//                 : "bg-green-500"
//           }`}
//           style={{
//             width: `${Math.min((actual / budget.allocatedAmount) * 100, 100)}%`,
//           }}
//         />
//       </div>
//     </motion.div>
//   ));

//   // Memoized Savings Card
//   const SavingsCard = memo(({ saving, formatCurrency, formatDate }) => {
//     const progress =
//       saving.targetAmount > 0
//         ? Math.min((saving.currentAmount / saving.targetAmount) * 100, 100)
//         : 0;
//     const isComplete = progress >= 100;

//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         className={`rounded-xl p-4 border ${
//           isComplete
//             ? "bg-green-50 border-green-300"
//             : "bg-white border-gray-200"
//         }`}
//       >
//         <div className="flex justify-between items-start mb-2">
//           <div>
//             <h4 className="font-semibold text-gray-800 flex items-center gap-2">
//               {saving.category}
//               {isComplete && (
//                 <CheckCircleIcon className="w-5 h-5 text-green-500" />
//               )}
//             </h4>
//             <p className="text-sm text-gray-500">
//               {saving.description || "No description"}
//             </p>
//           </div>
//           <span
//             className={`text-xs px-2 py-1 rounded-full ${
//               saving.priority === "critical"
//                 ? "bg-red-100 text-red-700"
//                 : saving.priority === "high"
//                   ? "bg-orange-100 text-orange-700"
//                   : saving.priority === "medium"
//                     ? "bg-yellow-100 text-yellow-700"
//                     : "bg-blue-100 text-blue-700"
//             }`}
//           >
//             {saving.priority || "Medium"}
//           </span>
//         </div>

//         <SavingsProgress
//           current={saving.currentAmount || 0}
//           target={saving.targetAmount}
//           formatCurrency={formatCurrency}
//         />

//         <div className="flex justify-between text-xs text-gray-500 mt-2">
//           <span>Goal: {formatCurrency(saving.targetAmount)}</span>
//           {saving.deadline && (
//             <span>Deadline: {formatDate(saving.deadline)}</span>
//           )}
//         </div>
//       </motion.div>
//     );
//   });

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

//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
//           <div>
//             <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
//               <AttachMoneyIcon className="text-green-500" />
//               Income & Budget Management
//             </h2>
//             <p className="text-gray-600 mt-1">
//               Track income, plan budgets, and manage savings goals
//             </p>
//             {isAdmin && (
//               <span className="inline-flex items-center gap-1 text-sm text-purple-600 bg-purple-100 px-3 py-1 rounded-full mt-1">
//                 <AdminPanelSettingsIcon className="w-4 h-4" />
//                 Admin View - All Households
//               </span>
//             )}
//             {userName && !isAdmin && (
//               <p className="text-sm text-gray-500 mt-1">
//                 <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium">
//                   👤 Viewing incomes for: {userName}
//                 </span>
//               </p>
//             )}
//             {user?.email && !isAdmin && !userName && (
//               <p className="text-sm text-gray-500 mt-1">User: {user.email}</p>
//             )}
//           </div>
//           <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
//             <button
//               onClick={() => setIsBudgetModalOpen(true)}
//               className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg"
//             >
//               <AccountBalanceIcon className="w-5 h-5" />
//               <span>Set Budget</span>
//             </button>
//             <button
//               onClick={() => setIsSavingsModalOpen(true)}
//               className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 shadow-md hover:shadow-lg"
//             >
//               <SavingsIcon className="w-5 h-5" />
//               <span>Set Savings Goal</span>
//             </button>
//             <button
//               onClick={generateReport}
//               className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200 shadow-md hover:shadow-lg"
//             >
//               <BarChartIcon className="w-5 h-5" />
//               <span>Report</span>
//             </button>
//             <button
//               onClick={() => setIsAddModalOpen(true)}
//               className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
//             >
//               <AddIcon className="w-5 h-5" />
//               <span>Add Income</span>
//             </button>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//           <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-500">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500">Total Income</p>
//                 <p className="text-xs font-bold text-green-600">
//                   {formatCurrency(stats.totalIncome)}
//                 </p>
//                 <p className="text-xs text-gray-400 mt-1">
//                   {stats.incomeCount} transactions
//                 </p>
//               </div>
//               <TrendingUpIcon className="w-10 h-10 text-green-500 bg-green-100 p-2 rounded-full" />
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-500">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500">Monthly Income</p>
//                 <p className="text-xs font-bold text-blue-600">
//                   {formatCurrency(stats.monthlyIncome)}
//                 </p>
//                 <p className="text-xs text-gray-400 mt-1">
//                   {getMonthName(selectedMonth)} {selectedYear}
//                 </p>
//               </div>
//               <CalendarTodayIcon className="w-10 h-10 text-blue-500 bg-blue-100 p-2 rounded-full" />
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-purple-500">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500">Savings Rate</p>
//                 <p className="text-xs font-bold text-purple-600">
//                   {stats.savingsRate.toFixed(1)}%
//                 </p>
//                 <p className="text-xs text-gray-400 mt-1">
//                   {formatCurrency(stats.totalSavings)} total savings
//                 </p>
//               </div>
//               <SavingsIcon className="w-10 h-10 text-purple-500 bg-purple-100 p-2 rounded-full" />
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-orange-500">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500">Budget Status</p>
//                 <p className="text-2xl font-bold text-orange-600">
//                   {stats.budgetStatus === "on-track" && "✓ On Track"}
//                   {stats.budgetStatus === "over-budget" && "⚠ Over Budget"}
//                   {stats.budgetStatus === "approaching-limit" &&
//                     "⚡ Approaching"}
//                   {stats.budgetStatus === "under-budget" && "📉 Under Budget"}
//                 </p>
//                 <p className="text-xs text-gray-400 mt-1">
//                   Top Source: {stats.topIncomeSource}
//                 </p>
//               </div>
//               <AccountBalanceIcon className="w-10 h-10 text-orange-500 bg-orange-100 p-2 rounded-full" />
//             </div>
//           </div>
//         </div>

//         {/* Tab Navigation */}
//         <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
//           <div className="flex border-b border-gray-200">
//             <button
//               onClick={() => setActiveTab("incomes")}
//               className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
//                 activeTab === "incomes"
//                   ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50"
//                   : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
//               }`}
//             >
//               <TrendingUpIcon className="w-4 h-4 inline mr-2" />
//               Income Records
//             </button>
//             <button
//               onClick={() => setActiveTab("budgets")}
//               className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
//                 activeTab === "budgets"
//                   ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
//                   : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
//               }`}
//             >
//               <AccountBalanceIcon className="w-4 h-4 inline mr-2" />
//               Budget Planning
//             </button>
//             <button
//               onClick={() => setActiveTab("savings")}
//               className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
//                 activeTab === "savings"
//                   ? "text-green-600 border-b-2 border-green-600 bg-green-50"
//                   : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
//               }`}
//             >
//               <SavingsIcon className="w-4 h-4 inline mr-2" />
//               Savings Goals
//             </button>
//           </div>
//         </div>

//         {/* Tab Content */}
//         <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//           {/* Incomes Tab */}
//           {activeTab === "incomes" && (
//             <div>
//               {/* Search and Filters */}
//               <div className="p-4 border-b border-gray-200">
//                 <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
//                   <div className="flex-1 relative">
//                     <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                     <input
//                       type="text"
//                       placeholder="Search income records..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//                     />
//                   </div>

//                   <div className="flex space-x-3">
//                     <select
//                       value={filterCategory}
//                       onChange={(e) => setFilterCategory(e.target.value)}
//                       className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//                     >
//                       <option value="all">All Categories</option>
//                       {INCOME_CATEGORIES.map((cat) => (
//                         <option key={cat} value={cat}>
//                           {cat}
//                         </option>
//                       ))}
//                     </select>

//                     <select
//                       value={selectedMonth}
//                       onChange={(e) =>
//                         setSelectedMonth(parseInt(e.target.value))
//                       }
//                       className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//                     >
//                       {Array.from({ length: 12 }, (_, i) => (
//                         <option key={i} value={i}>
//                           {getMonthName(i)}
//                         </option>
//                       ))}
//                     </select>

//                     <select
//                       value={selectedYear}
//                       onChange={(e) =>
//                         setSelectedYear(parseInt(e.target.value))
//                       }
//                       className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//                     >
//                       {[2023, 2024, 2025, 2026, 2027].map((year) => (
//                         <option key={year} value={year}>
//                           {year}
//                         </option>
//                       ))}
//                     </select>

//                     <button
//                       onClick={() => {
//                         setSearchTerm("");
//                         setFilterCategory("all");
//                       }}
//                       className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
//                     >
//                       Clear
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Income Table */}
//               {isLoading ? (
//                 <div className="p-8 text-center">
//                   <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
//                   <p className="mt-4 text-gray-600">Loading incomes...</p>
//                 </div>
//               ) : displayIncomes.length === 0 ? (
//                 <div className="p-12 text-center">
//                   <AttachMoneyIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                   <p className="text-gray-500 text-lg">
//                     No income records found
//                   </p>
//                   <p className="text-gray-400 text-sm mt-1">
//                     {userName
//                       ? `No incomes found for "${userName}"`
//                       : "Click 'Add Income' to start tracking your earnings"}
//                   </p>
//                 </div>
//               ) : (
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead>
//                       <tr className="bg-gradient-to-r from-green-500 to-green-600 text-white">
//                         <th className="text-left py-3 px-4 text-sm font-semibold">
//                           Date
//                         </th>
//                         <th className="text-left py-3 px-4 text-sm font-semibold">
//                           Description
//                         </th>
//                         <th className="text-left py-3 px-4 text-sm font-semibold">
//                           Category
//                         </th>
//                         <th className="text-left py-3 px-4 text-sm font-semibold">
//                           Source
//                         </th>
//                         <th className="text-left py-3 px-4 text-sm font-semibold">
//                           User
//                         </th>
//                         <th className="text-right py-3 px-4 text-sm font-semibold">
//                           Amount (RWF)
//                         </th>
//                         <th className="text-center py-3 px-4 text-sm font-semibold">
//                           Actions
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {displayIncomes.map((income, index) => (
//                         <IncomeRow
//                           key={income._id || index}
//                           income={income}
//                           index={index}
//                           formatDate={formatDate}
//                           formatCurrency={formatCurrency}
//                           openEditModal={openEditModal}
//                           setSelectedIncome={setSelectedIncome}
//                           setIsDeleteModalOpen={setIsDeleteModalOpen}
//                         />
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Budgets Tab */}
//           {activeTab === "budgets" && (
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-6">
//                 <div>
//                   <h3 className="text-xl font-bold text-gray-800">
//                     Budget Planning
//                   </h3>
//                   <p className="text-sm text-gray-500">
//                     {getMonthName(selectedMonth)} {selectedYear} - Track your
//                     spending against budget
//                   </p>
//                   {user?.email && (
//                     <p className="text-xs text-gray-400 mt-1">
//                       Budgets for: {user.email}
//                     </p>
//                   )}
//                 </div>
//                 <button
//                   onClick={() => setIsBudgetModalOpen(true)}
//                   className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//                 >
//                   <AddIcon className="w-5 h-5" />
//                   <span>Add Budget</span>
//                 </button>
//               </div>

//               {budgets.length === 0 ? (
//                 <div className="text-center py-8">
//                   <AccountBalanceIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                   <p className="text-gray-500">No budgets set for this month</p>
//                   <p className="text-gray-400 text-sm">
//                     Set a budget to start tracking your spending
//                   </p>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {budgets.map((budget, index) => {
//                     const actual = categoryActuals[budget.category] || 0;
//                     return (
//                       <BudgetCard
//                         key={budget._id || index}
//                         budget={budget}
//                         actual={actual}
//                         formatCurrency={formatCurrency}
//                       />
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Savings Tab */}
//           {activeTab === "savings" && (
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-6">
//                 <div>
//                   <h3 className="text-xl font-bold text-gray-800">
//                     Savings Goals
//                   </h3>
//                   <p className="text-sm text-gray-500">
//                     Track your progress towards financial goals
//                   </p>
//                   {user?.email && (
//                     <p className="text-xs text-gray-400 mt-1">
//                       Savings for: {user.email}
//                     </p>
//                   )}
//                 </div>
//                 <button
//                   onClick={() => setIsSavingsModalOpen(true)}
//                   className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
//                 >
//                   <AddIcon className="w-5 h-5" />
//                   <span>Add Savings Goal</span>
//                 </button>
//               </div>

//               {savings.length === 0 ? (
//                 <div className="text-center py-8">
//                   <SavingsIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                   <p className="text-gray-500">No savings goals set</p>
//                   <p className="text-gray-400 text-sm">
//                     Start saving towards your financial goals
//                   </p>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {savings.map((saving, index) => (
//                     <SavingsCard
//                       key={saving._id || index}
//                       saving={saving}
//                       formatCurrency={formatCurrency}
//                       formatDate={formatDate}
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Add Income Modal */}
//       <Modal
//         isOpen={isAddModalOpen}
//         onClose={() => {
//           setIsAddModalOpen(false);
//           resetForm();
//         }}
//         title="Add New Income"
//       >
//         <IncomeForm
//           formData={formData}
//           setFormData={setFormData}
//           onSubmit={handleAddIncome}
//           submitLabel="Add Income"
//           isSubmitting={isSubmitting}
//           categories={INCOME_CATEGORIES}
//           onCancel={() => {
//             setIsAddModalOpen(false);
//             resetForm();
//           }}
//         />
//       </Modal>

//       {/* Edit Income Modal */}
//       <Modal
//         isOpen={isEditModalOpen}
//         onClose={() => {
//           setIsEditModalOpen(false);
//           resetForm();
//         }}
//         title="Edit Income"
//       >
//         <IncomeForm
//           formData={formData}
//           setFormData={setFormData}
//           onSubmit={handleEditIncome}
//           submitLabel="Update Income"
//           isSubmitting={isSubmitting}
//           categories={INCOME_CATEGORIES}
//           onCancel={() => {
//             setIsEditModalOpen(false);
//             resetForm();
//           }}
//         />
//       </Modal>

//       {/* Delete Confirmation Modal */}
//       <Modal
//         isOpen={isDeleteModalOpen}
//         onClose={() => {
//           setIsDeleteModalOpen(false);
//           setSelectedIncome(null);
//         }}
//         title="Confirm Delete"
//         size="sm"
//       >
//         <div className="text-center py-4">
//           <WarningIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
//           <h3 className="text-xl font-bold text-gray-800 mb-2">
//             Are you sure?
//           </h3>
//           <p className="text-gray-600">
//             This action cannot be undone. This will permanently delete the
//             income record:
//           </p>
//           <div className="mt-4 p-4 bg-gray-50 rounded-xl">
//             <p className="font-semibold text-gray-800">
//               {selectedIncome?.description || "N/A"}
//             </p>
//             <p className="text-sm text-gray-600">
//               {formatCurrency(selectedIncome?.amount || 0)} -{" "}
//               {selectedIncome?.category || "Uncategorized"}
//             </p>
//           </div>

//           <div className="flex justify-center space-x-3 mt-6">
//             <button
//               onClick={() => {
//                 setIsDeleteModalOpen(false);
//                 setSelectedIncome(null);
//               }}
//               className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleDeleteIncome}
//               disabled={isSubmitting}
//               className="px-6 py-2 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
//             >
//               {isSubmitting ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                   <span>Deleting...</span>
//                 </>
//               ) : (
//                 <>
//                   <DeleteIcon className="w-5 h-5" />
//                   <span>Delete</span>
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </Modal>

//       {/* Budget Modal */}
//       <Modal
//         isOpen={isBudgetModalOpen}
//         onClose={() => {
//           setIsBudgetModalOpen(false);
//           resetBudgetForm();
//         }}
//         title="Set Budget"
//       >
//         <BudgetForm
//           budgetFormData={budgetFormData}
//           setBudgetFormData={setBudgetFormData}
//           onSubmit={handleAddBudget}
//           isSubmitting={isSubmitting}
//           categories={BUDGET_CATEGORIES}
//           onCancel={() => {
//             setIsBudgetModalOpen(false);
//             resetBudgetForm();
//           }}
//           getMonthName={getMonthName}
//         />
//       </Modal>

//       {/* Savings Modal */}
//       <Modal
//         isOpen={isSavingsModalOpen}
//         onClose={() => {
//           setIsSavingsModalOpen(false);
//           resetSavingsForm();
//         }}
//         title="Set Savings Goal"
//       >
//         <SavingsForm
//           savingsFormData={savingsFormData}
//           setSavingsFormData={setSavingsFormData}
//           onSubmit={handleAddSavings}
//           isSubmitting={isSubmitting}
//           categories={SAVINGS_CATEGORIES}
//           onCancel={() => {
//             setIsSavingsModalOpen(false);
//             resetSavingsForm();
//           }}
//         />
//       </Modal>

//       {/* Report Modal */}
//       <Modal
//         isOpen={isReportModalOpen}
//         onClose={() => setIsReportModalOpen(false)}
//         title="Income & Budget Report"
//         size="lg"
//       >
//         <div className="space-y-6">
//           <div className="grid grid-cols-2 gap-4">
//             <div className="bg-green-50 p-4 rounded-xl">
//               <p className="text-sm text-gray-500">Total Income</p>
//               <p className="text-2xl font-bold text-green-600">
//                 {formatCurrency(stats.totalIncome)}
//               </p>
//             </div>
//             <div className="bg-blue-50 p-4 rounded-xl">
//               <p className="text-sm text-gray-500">Monthly Income</p>
//               <p className="text-2xl font-bold text-blue-600">
//                 {formatCurrency(stats.monthlyIncome)}
//               </p>
//             </div>
//             <div className="bg-purple-50 p-4 rounded-xl">
//               <p className="text-sm text-gray-500">Savings Rate</p>
//               <p className="text-2xl font-bold text-purple-600">
//                 {stats.savingsRate.toFixed(1)}%
//               </p>
//             </div>
//             <div className="bg-orange-50 p-4 rounded-xl">
//               <p className="text-sm text-gray-500">Budget Status</p>
//               <p className="text-2xl font-bold text-orange-600">
//                 {stats.budgetStatus === "on-track"
//                   ? "On Track"
//                   : stats.budgetStatus === "over-budget"
//                     ? "Over Budget"
//                     : stats.budgetStatus === "approaching-limit"
//                       ? "Approaching"
//                       : "Under Budget"}
//               </p>
//             </div>
//           </div>

//           <div>
//             <h4 className="font-semibold text-gray-800 mb-2">
//               Top Income Source
//             </h4>
//             <p className="text-lg text-gray-700">{stats.topIncomeSource}</p>
//           </div>

//           <div>
//             <h4 className="font-semibold text-gray-800 mb-2">Recent Incomes</h4>
//             <div className="max-h-40 overflow-y-auto">
//               {displayIncomes.slice(0, 5).map((income, index) => (
//                 <div
//                   key={index}
//                   className="flex justify-between py-2 border-b border-gray-100"
//                 >
//                   <span className="text-sm">{income.description || "N/A"}</span>
//                   <span className="text-sm font-semibold text-green-600">
//                     +{formatCurrency(income.amount)}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div>
//             <h4 className="font-semibold text-gray-800 mb-2">
//               Savings Goals Summary
//             </h4>
//             {savings.length === 0 ? (
//               <p className="text-gray-500 text-sm">No savings goals set</p>
//             ) : (
//               <div className="space-y-2">
//                 {savings.map((saving, index) => (
//                   <div
//                     key={index}
//                     className="flex justify-between items-center"
//                   >
//                     <span className="text-sm">{saving.category}</span>
//                     <span className="text-sm">
//                       {formatCurrency(saving.currentAmount || 0)} /{" "}
//                       {formatCurrency(saving.targetAmount)}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="flex justify-end space-x-3 pt-4">
//             <button
//               onClick={() => setIsReportModalOpen(false)}
//               className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//             >
//               Close
//             </button>
//             <button
//               onClick={exportReport}
//               className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
//             >
//               <DownloadIcon className="w-5 h-5" />
//               <span>Export CSV</span>
//             </button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };











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
import SavingsIcon from "@mui/icons-material/Savings";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
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

// Savings Categories
const SAVINGS_CATEGORIES = [
  "Emergency Fund",
  "Retirement",
  "Education",
  "Housing",
  "Health",
  "Travel",
  "Investment",
  "General Savings",
  "Children's Education",
  "Business Fund",
];

// Budget Categories (expense categories for budget planning)
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

// Frequency options for recurring income
const FREQUENCY_OPTIONS = ["weekly", "biweekly", "monthly", "quarterly", "annually"];

// Priority options for savings
const PRIORITY_OPTIONS = ["low", "medium", "high", "critical"];

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

// Memoized Budget Form Component - matches Budget model
const BudgetForm = memo(
  ({
    budgetFormData,
    setBudgetFormData,
    onSubmit,
    isSubmitting,
    categories,
    onCancel,
    getMonthName,
  }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category *
        </label>
        <select
          value={budgetFormData.category}
          onChange={(e) =>
            setBudgetFormData({ ...budgetFormData, category: e.target.value })
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
          Allocated Amount (RWF) *
        </label>
        <input
          type="number"
          step="1"
          min="0"
          value={budgetFormData.allocatedAmount}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "" || /^\d+$/.test(value)) {
              setBudgetFormData({ ...budgetFormData, allocatedAmount: value });
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Month *
          </label>
          <select
            value={budgetFormData.month}
            onChange={(e) =>
              setBudgetFormData({
                ...budgetFormData,
                month: parseInt(e.target.value),
              })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            required
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {getMonthName(i)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year *
          </label>
          <input
            type="number"
            value={budgetFormData.year}
            onChange={(e) =>
              setBudgetFormData({
                ...budgetFormData,
                year: parseInt(e.target.value) || new Date().getFullYear(),
              })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            min={2000}
            max={2030}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description (Optional)
        </label>
        <textarea
          value={budgetFormData.description}
          onChange={(e) =>
            setBudgetFormData({
              ...budgetFormData,
              description: e.target.value,
            })
          }
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          rows="2"
          placeholder="Additional notes"
          maxLength={500}
        />
        <p className="text-xs text-gray-500 mt-1">Max 500 characters</p>
      </div>

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
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Saving...</span>
            </>
          ) : (
            <span>Set Budget</span>
          )}
        </button>
      </div>
    </form>
  ),
);

// Memoized Savings Form Component - matches Savings model
const SavingsForm = memo(
  ({
    savingsFormData,
    setSavingsFormData,
    onSubmit,
    isSubmitting,
    categories,
    onCancel,
  }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Savings Category *
        </label>
        <select
          value={savingsFormData.category}
          onChange={(e) =>
            setSavingsFormData({ ...savingsFormData, category: e.target.value })
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Amount (RWF) *
          </label>
          <input
            type="number"
            step="1"
            min="1"
            value={savingsFormData.targetAmount}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || /^\d+$/.test(value)) {
                setSavingsFormData({ ...savingsFormData, targetAmount: value });
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
            Current Amount (RWF)
          </label>
          <input
            type="number"
            step="1"
            min="0"
            value={savingsFormData.currentAmount}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || /^\d+$/.test(value)) {
                setSavingsFormData({
                  ...savingsFormData,
                  currentAmount: value,
                });
              }
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="0"
          />
          <p className="text-xs text-gray-500 mt-1">
            Whole numbers only (no decimals)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deadline
          </label>
          <input
            type="date"
            value={savingsFormData.deadline}
            onChange={(e) =>
              setSavingsFormData({
                ...savingsFormData,
                deadline: e.target.value,
              })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <select
            value={savingsFormData.priority}
            onChange={(e) =>
              setSavingsFormData({
                ...savingsFormData,
                priority: e.target.value,
              })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description (Optional)
        </label>
        <textarea
          value={savingsFormData.description}
          onChange={(e) =>
            setSavingsFormData({
              ...savingsFormData,
              description: e.target.value,
            })
          }
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          rows="2"
          placeholder="Additional notes about this savings goal"
          maxLength={500}
        />
        <p className="text-xs text-gray-500 mt-1">Max 500 characters</p>
      </div>

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
          className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Saving...</span>
            </>
          ) : (
            <span>Set Savings Goal</span>
          )}
        </button>
      </div>
    </form>
  ),
);

// Memoized Budget Status Badge
const BudgetStatusBadge = memo(({ allocated, spent, status }) => {
  const percentage = allocated > 0 ? (spent / allocated) * 100 : 0;
  
  const statusMap = {
    "on-track": { label: "On Track", color: "bg-green-100 text-green-800" },
    "approaching-limit": { label: "Approaching Limit", color: "bg-yellow-100 text-yellow-800" },
    "over-budget": { label: "Over Budget", color: "bg-red-100 text-red-800" },
  };

  const currentStatus = statusMap[status] || statusMap["on-track"];

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${currentStatus.color}`}>
      {currentStatus.label} ({percentage.toFixed(1)}%)
    </span>
  );
});

// Memoized Savings Progress
const SavingsProgress = memo(({ current, target, formatCurrency, progress }) => {
  const percentage = progress || (target > 0 ? Math.min((current / target) * 100, 100) : 0);
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-600 mb-1">
        <span>Progress: {percentage.toFixed(1)}%</span>
        <span>
          {formatCurrency(current)} / {formatCurrency(target)}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${
            percentage >= 100
              ? "bg-green-500"
              : percentage >= 50
                ? "bg-blue-500"
                : "bg-purple-500"
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
});

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

  // Budget and Savings state
  const [budgets, setBudgets] = useState([]);
  const [savings, setSavings] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Stats
  const [stats, setStats] = useState({
    totalIncome: 0,
    monthlyIncome: 0,
    averageIncome: 0,
    totalSavings: 0,
    monthlySavings: 0,
    savingsRate: 0,
    budgetUtilization: 0,
    incomeCount: 0,
    topIncomeSource: "",
    budgetStatus: "on-track",
  });

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isSavingsModalOpen, setIsSavingsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [selectedSavings, setSelectedSavings] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("incomes");

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

  // Budget form data - matches Budget model
  const [budgetFormData, setBudgetFormData] = useState({
    category: "",
    allocatedAmount: "",
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    description: "",
  });

  // Savings form data - matches Savings model
  const [savingsFormData, setSavingsFormData] = useState({
    category: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
    description: "",
    priority: "medium",
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

    // Get the user name (from URL param or from user data)
    const targetUserName = userName || userData.name || "";
    setFilterUserName(targetUserName);

    // Auto-fill form data with user info
    const userEmail = userData.email || "";
    const userId = userData.id || userData._id || "";
    const displayName = targetUserName || userData.name || "";

    setFormData((prev) => ({
      ...prev,
      email: userEmail,
      userId: userId,
      user: displayName, // Auto-fill user name
    }));

    // Load data only on initial mount
    if (isFirstLoadRef.current) {
      isFirstLoadRef.current = false;
      loadIncomes();
      loadBudgets();
      loadSavings();
    }
  }, [navigate, userName, user]);

  // CRITICAL: Load incomes and filter by userId
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
      // Build query params
      const params = {};
      
      // If not admin, filter by userId
      if (!isAdmin && userId) {
        params.userId = userId;
      }

      // Add month/year filters if selected
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

      // Apply additional filters (category, search)
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

  // Load budgets by userId
  const loadBudgets = useCallback(async () => {
    try {
      const userId = getUserId();

      if (!isAdmin && !userId) {
        console.warn("No user ID found for loading budgets");
        return;
      }

      const params = {
        month: selectedMonthRef.current,
        year: selectedYearRef.current,
      };

      if (!isAdmin && userId) {
        params.userId = userId;
      }

      const response = await api.get("/budgets", { params });

      if (response.data.success) {
        const budgetData = response.data.data || [];
        setBudgets(budgetData);
        console.log(`✅ Loaded ${budgetData.length} budgets`);
      }
    } catch (error) {
      console.error("Load budgets error:", error);
    }
  }, [isAdmin, getUserId]);

  // Load savings by userId
  const loadSavings = useCallback(async () => {
    try {
      const userId = getUserId();

      if (!isAdmin && !userId) {
        console.warn("No user ID found for loading savings");
        return;
      }

      const params = {};

      if (!isAdmin && userId) {
        params.userId = userId;
      }

      const response = await api.get("/savings", { params });

      if (response.data.success) {
        const savingsData = response.data.data || [];
        setSavings(savingsData);
        console.log(`✅ Loaded ${savingsData.length} savings`);
      }
    } catch (error) {
      console.error("Load savings error:", error);
    }
  }, [isAdmin, getUserId]);

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

      // Calculate savings rate
      const totalSavings = savings.reduce(
        (sum, sav) => sum + (sav.currentAmount || 0),
        0,
      );
      const savingsRate =
        totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;

      // Budget utilization
      const totalBudgeted = budgets.reduce(
        (sum, b) => sum + (b.allocatedAmount || 0),
        0,
      );
      const budgetUtilization =
        totalBudgeted > 0 ? (totalIncome / totalBudgeted) * 100 : 0;

      // Budget status
      let budgetStatus = "on-track";
      if (budgetUtilization > 100) budgetStatus = "over-budget";
      else if (budgetUtilization > 80) budgetStatus = "approaching-limit";
      else if (budgetUtilization < 50) budgetStatus = "under-budget";

      setStats({
        totalIncome,
        monthlyIncome,
        averageIncome,
        totalSavings,
        monthlySavings: totalSavings / 12,
        savingsRate,
        budgetUtilization,
        incomeCount: incomeData.length,
        topIncomeSource: topSource,
        budgetStatus,
      });
    },
    [savings, budgets],
  );

  // Handle search and filter - update refs and trigger load
  useEffect(() => {
    searchTermRef.current = searchTerm;
    filterCategoryRef.current = filterCategory;
    selectedMonthRef.current = selectedMonth;
    selectedYearRef.current = selectedYear;

    const timer = setTimeout(() => {
      if (!isFirstLoadRef.current) {
        loadIncomes();
        loadBudgets();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [
    searchTerm,
    filterCategory,
    selectedMonth,
    selectedYear,
    loadIncomes,
    loadBudgets,
  ]);

  // Filter incomes based on month/year (client-side filtering)
  useEffect(() => {
    let filtered = [...incomes];

    if (selectedMonth !== undefined && selectedYear !== undefined) {
      filtered = filtered.filter((inc) => {
        const date = new Date(inc.date);
        return (
          date.getMonth() === selectedMonth &&
          date.getFullYear() === selectedYear
        );
      });
    }

    setFilteredIncomes(filtered);
  }, [incomes, selectedMonth, selectedYear]);

  // Handle add income - matches Income model
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

      // Validate userId
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
        setTimeout(() => {
          loadIncomes();
          loadSavings();
        }, 100);
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
        setTimeout(() => {
          loadIncomes();
          loadSavings();
        }, 100);
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

  // Handle add budget - matches Budget model
  const handleAddBudget = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const allocatedValue = Number(budgetFormData.allocatedAmount);
    if (!Number.isInteger(allocatedValue) || allocatedValue < 0) {
      toast.error("Allocated amount must be a whole number (no decimals)");
      setIsSubmitting(false);
      return;
    }

    try {
      const budgetData = {
        category: budgetFormData.category.trim().toLowerCase(),
        allocatedAmount: allocatedValue,
        month: parseInt(budgetFormData.month),
        year: parseInt(budgetFormData.year) || new Date().getFullYear(),
        description: budgetFormData.description?.trim() || "",
        email: getUserEmail() || "",
        userId: getUserId() || "",
      };

      if (!budgetData.userId) {
        toast.error("User ID is required");
        setIsSubmitting(false);
        return;
      }

      const response = await api.post("/budgets", budgetData);

      if (response.data.success) {
        toast.success("Budget set successfully!");
        setIsBudgetModalOpen(false);
        resetBudgetForm();
        setTimeout(() => loadBudgets(), 100);
      } else {
        toast.error(response.data.message || "Failed to set budget");
      }
    } catch (error) {
      console.error("Add budget error:", error);
      toast.error(error.response?.data?.message || "Failed to set budget");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle add savings - matches Savings model
  const handleAddSavings = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const targetValue = Number(savingsFormData.targetAmount);
    const currentValue = Number(savingsFormData.currentAmount) || 0;

    if (!Number.isInteger(targetValue) || targetValue <= 0) {
      toast.error("Target amount must be a positive whole number (no decimals)");
      setIsSubmitting(false);
      return;
    }

    if (!Number.isInteger(currentValue) || currentValue < 0) {
      toast.error("Current amount must be a whole number (no decimals)");
      setIsSubmitting(false);
      return;
    }

    try {
      const savingsData = {
        category: savingsFormData.category.trim(),
        targetAmount: targetValue,
        currentAmount: currentValue,
        deadline: savingsFormData.deadline || null,
        description: savingsFormData.description?.trim() || "",
        priority: savingsFormData.priority || "medium",
        email: getUserEmail() || "",
        userId: getUserId() || "",
      };

      if (!savingsData.userId) {
        toast.error("User ID is required");
        setIsSubmitting(false);
        return;
      }

      const response = await api.post("/savings", savingsData);

      if (response.data.success) {
        toast.success("Savings goal set successfully!");
        setIsSavingsModalOpen(false);
        resetSavingsForm();
        setTimeout(() => {
          loadSavings();
          loadIncomes();
        }, 100);
      } else {
        toast.error(response.data.message || "Failed to set savings goal");
      }
    } catch (error) {
      console.error("Add savings error:", error);
      toast.error(error.response?.data?.message || "Failed to set savings goal");
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
      user: getUserName() || filterUserName || "",
      email: getUserEmail() || "",
      userId: getUserId() || "",
      isRecurring: false,
      frequency: "monthly",
    });
    setSelectedIncome(null);
  }, [getUserName, getUserEmail, getUserId, filterUserName]);

  const resetBudgetForm = useCallback(() => {
    setBudgetFormData({
      category: "",
      allocatedAmount: "",
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      description: "",
    });
    setSelectedBudget(null);
  }, []);

  const resetSavingsForm = useCallback(() => {
    setSavingsFormData({
      category: "",
      targetAmount: "",
      currentAmount: "",
      deadline: "",
      description: "",
      priority: "medium",
    });
    setSelectedSavings(null);
  }, []);

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

  // Format currency (RWF - Rwandan Franc)
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
      budgets,
      savings,
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

    // Add budget summary
    csv += "\nBudget Summary\n";
    csv += "Category,Allocated Amount (RWF),Spent Amount (RWF),Remaining,Status\n";
    budgets.forEach((budget) => {
      const spent = budget.spentAmount || 0;
      const remaining = budget.remainingAmount || 0;
      csv += `${budget.category},${budget.allocatedAmount},${spent},${remaining},${budget.status || "on-track"}\n`;
    });

    // Add savings summary
    csv += "\nSavings Goals\n";
    csv +=
      "Category,Target Amount (RWF),Current Amount (RWF),Progress,Deadline,Completed\n";
    savings.forEach((saving) => {
      const progress = saving.progress || 0;
      csv += `${saving.category},${saving.targetAmount},${saving.currentAmount},${progress}%,${saving.deadline || "N/A"},${saving.isCompleted ? "Yes" : "No"}\n`;
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
  }, [filteredIncomes, budgets, savings, stats, userName, getUserName, formatDate]);

  // Get display data
  const displayIncomes = filteredIncomes.length > 0 ? filteredIncomes : incomes;

  // Calculate actual spending per category for budget comparison
  const categoryActuals = {};
  displayIncomes.forEach((inc) => {
    const category = inc.category || "Other";
    categoryActuals[category] =
      (categoryActuals[category] || 0) + (inc.amount || 0);
  });

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

  // Memoized Budget Card
  const BudgetCard = memo(({ budget, formatCurrency }) => {
    const spent = budget.spentAmount || 0;
    const remaining = budget.remainingAmount || 0;
    const percentageUsed = budget.percentageUsed || 0;
    const status = budget.status || "on-track";

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-50 rounded-xl p-4 border border-gray-200"
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="font-semibold text-gray-800 capitalize">{budget.category}</h4>
            <p className="text-sm text-gray-500">
              {budget.description || "No description"}
            </p>
          </div>
          <BudgetStatusBadge allocated={budget.allocatedAmount} spent={spent} status={status} />
        </div>
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Budgeted: {formatCurrency(budget.allocatedAmount)}</span>
        </div>
       
      </motion.div>
    );
  });

  // Memoized Savings Card
  const SavingsCard = memo(({ saving, formatCurrency, formatDate }) => {
    const progress = saving.progress || 0;
    const isComplete = saving.isCompleted || progress >= 100;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl p-4 border ${
          isComplete
            ? "bg-green-50 border-green-300"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              {saving.category}
              {isComplete && (
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
              )}
            </h4>
            <p className="text-sm text-gray-500">
              {saving.description || "No description"}
            </p>
          </div>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              saving.priority === "critical"
                ? "bg-red-100 text-red-700"
                : saving.priority === "high"
                  ? "bg-orange-100 text-orange-700"
                  : saving.priority === "medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-blue-100 text-blue-700"
            }`}
          >
            {saving.priority || "Medium"}
          </span>
        </div>

        <SavingsProgress
          current={saving.currentAmount || 0}
          target={saving.targetAmount}
          formatCurrency={formatCurrency}
          progress={progress}
        />

        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Goal: {formatCurrency(saving.targetAmount)}</span>
          {saving.deadline && (
            <span>Deadline: {formatDate(saving.deadline)}</span>
          )}
        </div>
        {saving.completedDate && (
          <div className="mt-1 text-xs text-green-600">
            Completed: {formatDate(saving.completedDate)}
          </div>
        )}
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
              <AttachMoneyIcon className="text-green-500" />
              Income & Budget Management
            </h2>
            <p className="text-gray-600 mt-1">
              Track income, plan budgets, and manage savings goals
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
              onClick={() => setIsBudgetModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <AccountBalanceIcon className="w-5 h-5" />
              <span>Set Budget</span>
            </button>
            <button
              onClick={() => setIsSavingsModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <SavingsIcon className="w-5 h-5" />
              <span>Set Savings Goal</span>
            </button>
            <button
              onClick={generateReport}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <BarChartIcon className="w-5 h-5" />
              <span>Report</span>
            </button>
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
              <TrendingUpIcon className="w-10 h-10 text-green-500 bg-green-100 p-2 rounded-full" />
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
                  {getMonthName(selectedMonth)} {selectedYear}
                </p>
              </div>
              <CalendarTodayIcon className="w-10 h-10 text-blue-500 bg-blue-100 p-2 rounded-full" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Savings Rate</p>
                <p className="text-xs font-bold text-purple-600">
                  {stats.savingsRate.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatCurrency(stats.totalSavings)} total savings
                </p>
              </div>
              <SavingsIcon className="w-10 h-10 text-purple-500 bg-purple-100 p-2 rounded-full" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Budget Status</p>
                <p className="text-xs font-bold text-orange-600">
                  {stats.budgetStatus === "on-track" && "✓ On Track"}
                  {stats.budgetStatus === "over-budget" && "⚠ Over Budget"}
                  {stats.budgetStatus === "approaching-limit" &&
                    "⚡ Approaching"}
                  {stats.budgetStatus === "under-budget" && "📉 Under Budget"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Top Source: {stats.topIncomeSource}
                </p>
              </div>
              <AccountBalanceIcon className="w-10 h-10 text-orange-500 bg-orange-100 p-2 rounded-full" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("incomes")}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "incomes"
                  ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <TrendingUpIcon className="w-4 h-4 inline mr-2" />
              Income Records
            </button>
            <button
              onClick={() => setActiveTab("budgets")}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "budgets"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <AccountBalanceIcon className="w-4 h-4 inline mr-2" />
              Budget Planning
            </button>
            <button
              onClick={() => setActiveTab("savings")}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "savings"
                  ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <SavingsIcon className="w-4 h-4 inline mr-2" />
              Savings Goals
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Incomes Tab */}
          {activeTab === "incomes" && (
            <div>
              {/* Search and Filters */}
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
                      value={selectedMonth}
                      onChange={(e) =>
                        setSelectedMonth(parseInt(e.target.value))
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={i}>
                          {getMonthName(i)}
                        </option>
                      ))}
                    </select>

                    <select
                      value={selectedYear}
                      onChange={(e) =>
                        setSelectedYear(parseInt(e.target.value))
                      }
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
          )}

          {/* Budgets Tab */}
          {activeTab === "budgets" && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Budget Planning
                  </h3>
                  <p className="text-sm text-gray-500">
                    {getMonthName(selectedMonth)} {selectedYear} - Track your
                    spending against budget
                  </p>
                  {getUserEmail() && (
                    <p className="text-xs text-gray-400 mt-1">
                      Budgets for: {getUserEmail()}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setIsBudgetModalOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <AddIcon className="w-5 h-5" />
                  <span>Add Budget</span>
                </button>
              </div>

              {budgets.length === 0 ? (
                <div className="text-center py-8">
                  <AccountBalanceIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No budgets set for this month</p>
                  <p className="text-gray-400 text-sm">
                    Set a budget to start tracking your spending
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {budgets.map((budget, index) => (
                    <BudgetCard
                      key={budget._id || index}
                      budget={budget}
                      formatCurrency={formatCurrency}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Savings Tab */}
          {activeTab === "savings" && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Savings Goals
                  </h3>
                  <p className="text-sm text-gray-500">
                    Track your progress towards financial goals
                  </p>
                  {getUserEmail() && (
                    <p className="text-xs text-gray-400 mt-1">
                      Savings for: {getUserEmail()}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setIsSavingsModalOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <AddIcon className="w-5 h-5" />
                  <span>Add Savings Goal</span>
                </button>
              </div>

              {savings.length === 0 ? (
                <div className="text-center py-8">
                  <SavingsIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No savings goals set</p>
                  <p className="text-gray-400 text-sm">
                    Start saving towards your financial goals
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savings.map((saving, index) => (
                    <SavingsCard
                      key={saving._id || index}
                      saving={saving}
                      formatCurrency={formatCurrency}
                      formatDate={formatDate}
                    />
                  ))}
                </div>
              )}
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

      {/* Budget Modal */}
      <Modal
        isOpen={isBudgetModalOpen}
        onClose={() => {
          setIsBudgetModalOpen(false);
          resetBudgetForm();
        }}
        title="Set Budget"
      >
        <BudgetForm
          budgetFormData={budgetFormData}
          setBudgetFormData={setBudgetFormData}
          onSubmit={handleAddBudget}
          isSubmitting={isSubmitting}
          categories={BUDGET_CATEGORIES}
          onCancel={() => {
            setIsBudgetModalOpen(false);
            resetBudgetForm();
          }}
          getMonthName={getMonthName}
        />
      </Modal>

      {/* Savings Modal */}
      <Modal
        isOpen={isSavingsModalOpen}
        onClose={() => {
          setIsSavingsModalOpen(false);
          resetSavingsForm();
        }}
        title="Set Savings Goal"
      >
        <SavingsForm
          savingsFormData={savingsFormData}
          setSavingsFormData={setSavingsFormData}
          onSubmit={handleAddSavings}
          isSubmitting={isSubmitting}
          categories={SAVINGS_CATEGORIES}
          onCancel={() => {
            setIsSavingsModalOpen(false);
            resetSavingsForm();
          }}
        />
      </Modal>

      {/* Report Modal */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Income & Budget Report"
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
              <p className="text-sm text-gray-500">Savings Rate</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.savingsRate.toFixed(1)}%
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-xl">
              <p className="text-sm text-gray-500">Budget Status</p>
              <p className="text-2xl font-bold text-orange-600">
                {stats.budgetStatus === "on-track"
                  ? "On Track"
                  : stats.budgetStatus === "over-budget"
                    ? "Over Budget"
                    : stats.budgetStatus === "approaching-limit"
                      ? "Approaching"
                      : "Under Budget"}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-2">
              Top Income Source
            </h4>
            <p className="text-lg text-gray-700">{stats.topIncomeSource}</p>
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

          <div>
            <h4 className="font-semibold text-gray-800 mb-2">
              Savings Goals Summary
            </h4>
            {savings.length === 0 ? (
              <p className="text-gray-500 text-sm">No savings goals set</p>
            ) : (
              <div className="space-y-2">
                {savings.map((saving, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm">{saving.category}</span>
                    <span className="text-sm">
                      {formatCurrency(saving.currentAmount || 0)} /{" "}
                      {formatCurrency(saving.targetAmount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsReportModalOpen(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={exportReport}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
            >
              <DownloadIcon className="w-5 h-5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};