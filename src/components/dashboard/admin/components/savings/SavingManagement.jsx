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
// import { useNavigate } from "react-router-dom";
// import jsPDF from "jspdf";
// import "jspdf-autotable";

// // Material Icons
// import AddIcon from "@mui/icons-material/Add";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import CloseIcon from "@mui/icons-material/Close";
// import SearchIcon from "@mui/icons-material/Search";
// import SavingsIcon from "@mui/icons-material/Savings";
// import TrendingUpIcon from "@mui/icons-material/TrendingUp";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import WarningIcon from "@mui/icons-material/Warning";
// import ErrorIcon from "@mui/icons-material/Error";
// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
// import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
// import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
// import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
// import RefreshIcon from "@mui/icons-material/Refresh";
// import DownloadIcon from "@mui/icons-material/Download";
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
// import TableChartIcon from "@mui/icons-material/TableChart";
// import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

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
//   "Vehicle",
//   "Home Improvement",
//   "Wedding",
//   "Vacation",
//   "Technology",
//   "Other",
// ];

// // Priority levels
// const PRIORITY_LEVELS = [
//   { value: "low", label: "Low", color: "bg-blue-100 text-blue-800" },
//   { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
//   { value: "high", label: "High", color: "bg-orange-100 text-orange-800" },
//   { value: "critical", label: "Critical", color: "bg-red-100 text-red-800" },
// ];

// // ============================================================
// // SUCCESS MODAL COMPONENT
// // ============================================================
// const SuccessModal = memo(({ isOpen, onClose, title, message, details }) => {
//   if (!isOpen) return null;

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
//             className="bg-white rounded-3xl shadow-2xl max-w-md w-full"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="p-6 text-center">
//               <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <CheckCircleIcon className="w-12 h-12 text-green-500" />
//               </div>
//               <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
//               <p className="text-gray-600">{message}</p>
//               {details && (
//                 <div className="mt-4 p-4 bg-gray-50 rounded-xl text-left">
//                   <p className="text-sm text-gray-700 whitespace-pre-line">
//                     {details}
//                   </p>
//                 </div>
//               )}
//               <button
//                 onClick={onClose}
//                 className="mt-6 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
//               >
//                 Done
//               </button>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// });

// // ============================================================
// // ERROR/FAIL MODAL COMPONENT
// // ============================================================
// const ErrorModal = memo(({ isOpen, onClose, title, message, details }) => {
//   if (!isOpen) return null;

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
//             className="bg-white rounded-3xl shadow-2xl max-w-md w-full"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="p-6 text-center">
//               <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <ErrorIcon className="w-12 h-12 text-red-500" />
//               </div>
//               <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
//               <p className="text-gray-600">{message}</p>
//               {details && (
//                 <div className="mt-4 p-4 bg-red-50 rounded-xl text-left">
//                   <p className="text-sm text-red-700 whitespace-pre-line">
//                     {details}
//                   </p>
//                 </div>
//               )}
//               <button
//                 onClick={onClose}
//                 className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
//               >
//                 Close
//               </button>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// });

// // ============================================================
// // CONFIRM MODAL COMPONENT
// // ============================================================
// const ConfirmModal = memo(
//   ({
//     isOpen,
//     onClose,
//     onConfirm,
//     title,
//     message,
//     confirmLabel = "Confirm",
//     cancelLabel = "Cancel",
//     isSubmitting = false,
//     type = "danger",
//   }) => {
//     if (!isOpen) return null;

//     const colors = {
//       danger: {
//         icon: WarningIcon,
//         iconColor: "text-red-500",
//         bgColor: "bg-red-100",
//         buttonColor: "bg-red-500 hover:bg-red-600",
//       },
//       warning: {
//         icon: WarningIcon,
//         iconColor: "text-yellow-500",
//         bgColor: "bg-yellow-100",
//         buttonColor: "bg-yellow-500 hover:bg-yellow-600",
//       },
//       info: {
//         icon: CheckCircleIcon,
//         iconColor: "text-blue-500",
//         bgColor: "bg-blue-100",
//         buttonColor: "bg-blue-500 hover:bg-blue-600",
//       },
//     };

//     const colorConfig = colors[type] || colors.danger;
//     const IconComponent = colorConfig.icon;

//     return (
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
//             onClick={onClose}
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0, y: 20 }}
//               animate={{ scale: 1, opacity: 1, y: 0 }}
//               exit={{ scale: 0.9, opacity: 0, y: 20 }}
//               className="bg-white rounded-3xl shadow-2xl max-w-md w-full"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="p-6 text-center">
//                 <div
//                   className={`w-20 h-20 ${colorConfig.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
//                 >
//                   <IconComponent
//                     className={`w-12 h-12 ${colorConfig.iconColor}`}
//                   />
//                 </div>
//                 <h3 className="text-2xl font-bold text-gray-800 mb-2">
//                   {title}
//                 </h3>
//                 <p className="text-gray-600 whitespace-pre-line">{message}</p>

//                 <div className="flex justify-center space-x-3 mt-6">
//                   <button
//                     onClick={onClose}
//                     className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//                   >
//                     {cancelLabel}
//                   </button>
//                   <button
//                     onClick={onConfirm}
//                     disabled={isSubmitting}
//                     className={`px-6 py-2 text-white rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 ${colorConfig.buttonColor}`}
//                   >
//                     {isSubmitting ? (
//                       <>
//                         <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                         <span>Processing...</span>
//                       </>
//                     ) : (
//                       <span>{confirmLabel}</span>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     );
//   },
// );

// // ============================================================
// // MEMOIZED MODAL COMPONENT
// // ============================================================
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

// // ============================================================
// // MEMOIZED SAVINGS FORM COMPONENT
// // ============================================================
// const SavingsForm = memo(
//   ({
//     formData,
//     setFormData,
//     onSubmit,
//     submitLabel,
//     isSubmitting,
//     categories,
//     priorityLevels,
//     onCancel,
//   }) => (
//     <form onSubmit={onSubmit} className="space-y-4">
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Savings Category *
//         </label>
//         <select
//           value={formData.category}
//           onChange={(e) =>
//             setFormData({ ...formData, category: e.target.value })
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
//             min="1"
//             value={formData.targetAmount}
//             onChange={(e) => {
//               const value = e.target.value;
//               if (value === "" || /^\d+$/.test(value)) {
//                 setFormData({ ...formData, targetAmount: value });
//               }
//             }}
//             onKeyDown={(e) => {
//               if (e.key === "." || e.key === ",") {
//                 e.preventDefault();
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
//             value={formData.currentAmount}
//             onChange={(e) => {
//               const value = e.target.value;
//               if (value === "" || /^\d+$/.test(value)) {
//                 setFormData({ ...formData, currentAmount: value });
//               }
//             }}
//             onKeyDown={(e) => {
//               if (e.key === "." || e.key === ",") {
//                 e.preventDefault();
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
//             value={formData.deadline}
//             onChange={(e) =>
//               setFormData({ ...formData, deadline: e.target.value })
//             }
//             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Priority
//           </label>
//           <select
//             value={formData.priority}
//             onChange={(e) =>
//               setFormData({ ...formData, priority: e.target.value })
//             }
//             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//           >
//             {priorityLevels.map((p) => (
//               <option key={p.value} value={p.value}>
//                 {p.label}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Description (Optional)
//         </label>
//         <textarea
//           value={formData.description}
//           onChange={(e) =>
//             setFormData({ ...formData, description: e.target.value })
//           }
//           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//           rows="3"
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

// // ============================================================
// // MEMOIZED CONTRIBUTION FORM COMPONENT
// // ============================================================
// const ContributionForm = memo(
//   ({
//     selectedSavings,
//     contributionData,
//     setContributionData,
//     onSubmit,
//     isSubmitting,
//     formatCurrency,
//     onCancel,
//   }) => (
//     <form onSubmit={onSubmit} className="space-y-4">
//       <div className="text-center mb-4">
//         <h4 className="font-semibold text-gray-800">
//           {selectedSavings?.category}
//         </h4>
//         <p className="text-sm text-gray-500">
//           Current: {formatCurrency(selectedSavings?.currentAmount || 0)} /{" "}
//           {formatCurrency(selectedSavings?.targetAmount || 0)}
//         </p>
//         <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
//           <div
//             className="bg-purple-500 h-2 rounded-full transition-all duration-500"
//             style={{
//               width: `${Math.min(selectedSavings?.progress || 0, 100)}%`,
//             }}
//           />
//         </div>
//         <p className="text-xs text-gray-400 mt-1">
//           Progress: {selectedSavings?.progress?.toFixed(1) || 0}%
//         </p>
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Contribution Amount (RWF) *
//         </label>
//         <input
//           type="number"
//           step="1"
//           min="1"
//           value={contributionData.amount}
//           onChange={(e) => {
//             const value = e.target.value;
//             if (value === "" || /^\d+$/.test(value)) {
//               setContributionData({ ...contributionData, amount: value });
//             }
//           }}
//           onKeyDown={(e) => {
//             if (e.key === "." || e.key === ",") {
//               e.preventDefault();
//             }
//           }}
//           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//           placeholder="0"
//           required
//           autoFocus
//         />
//         <p className="text-xs text-gray-500 mt-1">
//           Whole numbers only (no decimals)
//         </p>
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Note (Optional)
//         </label>
//         <input
//           type="text"
//           value={contributionData.note}
//           onChange={(e) =>
//             setContributionData({ ...contributionData, note: e.target.value })
//           }
//           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//           placeholder="Add a note about this contribution"
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
//               <span>Processing...</span>
//             </>
//           ) : (
//             <>
//               <AttachMoneyIcon className="w-5 h-5" />
//               <span>Contribute</span>
//             </>
//           )}
//         </button>
//       </div>
//     </form>
//   ),
// );

// // ============================================================
// // MEMOIZED SAVINGS CARD COMPONENT
// // ============================================================
// const SavingsCard = memo(
//   ({
//     saving,
//     formatCurrency,
//     formatDate,
//     getPriorityBadge,
//     getStatusBadge,
//     getDaysRemaining,
//     openEditModal,
//     openContributeModal,
//     setSelectedSavings,
//     setIsDeleteModalOpen,
//   }) => {
//     const progress = saving.progress || 0;
//     const isCompleted = saving.isCompleted || false;
//     const daysLeft = getDaysRemaining(saving.deadline);

//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3 }}
//         className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 transition-all hover:shadow-xl ${
//           isCompleted
//             ? "border-l-green-500"
//             : progress >= 75
//               ? "border-l-blue-500"
//               : progress >= 50
//                 ? "border-l-yellow-500"
//                 : "border-l-purple-500"
//         }`}
//       >
//         <div className="flex justify-between items-start mb-3">
//           <div className="flex-1">
//             <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//               {saving.category}
//               {isCompleted && (
//                 <CheckCircleIcon className="w-5 h-5 text-green-500" />
//               )}
//             </h3>
//             <p className="text-sm text-gray-500">
//               {saving.description || "No description"}
//             </p>
//           </div>
//           {getPriorityBadge(saving.priority)}
//         </div>

//         <div className="space-y-2">
//           <div className="flex justify-between text-sm">
//             <span className="text-gray-600">
//               Target: {formatCurrency(saving.targetAmount)}
//             </span>
//             <span className="text-gray-600">
//               Saved: {formatCurrency(saving.currentAmount || 0)}
//             </span>
//           </div>

//           <div className="w-full bg-gray-200 rounded-full h-3">
//             <div
//               className={`h-3 rounded-full transition-all duration-500 ${
//                 isCompleted
//                   ? "bg-green-500"
//                   : progress >= 75
//                     ? "bg-blue-500"
//                     : progress >= 50
//                       ? "bg-yellow-500"
//                       : "bg-purple-500"
//               }`}
//               style={{ width: `${Math.min(progress, 100)}%` }}
//             />
//           </div>

//           <div className="flex justify-between text-xs text-gray-500">
//             <span>{progress.toFixed(1)}% complete</span>
//             {daysLeft && (
//               <span
//                 className={
//                   daysLeft === "Overdue" ? "text-red-500 font-medium" : ""
//                 }
//               >
//                 {daysLeft}
//               </span>
//             )}
//           </div>
//         </div>

//         <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
//           <div className="flex items-center gap-2">
//             {getStatusBadge(isCompleted, progress)}
//             {saving.deadline && (
//               <span className="text-xs text-gray-400 flex items-center gap-1">
//                 <CalendarTodayIcon className="w-3 h-3" />
//                 {formatDate(saving.deadline)}
//               </span>
//             )}
//           </div>
//           <div className="flex space-x-1">
//             {!isCompleted && (
//               <button
//                 onClick={() => openContributeModal(saving)}
//                 className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
//                 title="Contribute"
//               >
//                 <AttachMoneyIcon className="w-5 h-5" />
//               </button>
//             )}
//             <button
//               onClick={() => openEditModal(saving)}
//               className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//               title="Edit"
//             >
//               <EditIcon className="w-5 h-5" />
//             </button>
//             <button
//               onClick={() => {
//                 setSelectedSavings(saving);
//                 setIsDeleteModalOpen(true);
//               }}
//               className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//               title="Delete"
//             >
//               <DeleteIcon className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
//       </motion.div>
//     );
//   },
// );

// // ============================================================
// // MAIN COMPONENT
// // ============================================================
// export const SavingsManagement = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(() => {
//     try {
//       return JSON.parse(localStorage.getItem("userData") || "null");
//     } catch {
//       return null;
//     }
//   });

//   // State for savings
//   const [savings, setSavings] = useState([]);
//   const [filteredSavings, setFilteredSavings] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterCategory, setFilterCategory] = useState("all");
//   const [filterPriority, setFilterPriority] = useState("all");
//   const [filterStatus, setFilterStatus] = useState("all");

//   // Income state
//   const [totalIncome, setTotalIncome] = useState(0);
//   const [incomeData, setIncomeData] = useState([]);

//   // Refs
//   const searchTermRef = useRef(searchTerm);
//   const filterCategoryRef = useRef(filterCategory);
//   const filterPriorityRef = useRef(filterPriority);
//   const filterStatusRef = useRef(filterStatus);
//   const isFirstLoadRef = useRef(true);
//   const isLoadingRef = useRef(false);

//   // Stats
//   const [stats, setStats] = useState({
//     totalTarget: 0,
//     totalCurrent: 0,
//     overallProgress: 0,
//     completedCount: 0,
//     inProgressCount: 0,
//     totalGoals: 0,
//   });

//   // Modal states
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
//   const [selectedSavings, setSelectedSavings] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // ============================================================
//   // SUCCESS/ERROR/CONFIRM MODAL STATES
//   // ============================================================
//   const [successModal, setSuccessModal] = useState({
//     isOpen: false,
//     title: "",
//     message: "",
//     details: "",
//   });

//   const [errorModal, setErrorModal] = useState({
//     isOpen: false,
//     title: "",
//     message: "",
//     details: "",
//   });

//   const [confirmModal, setConfirmModal] = useState({
//     isOpen: false,
//     title: "",
//     message: "",
//     onConfirm: null,
//     type: "danger",
//     confirmLabel: "Confirm",
//   });

//   // Form data
//   const [formData, setFormData] = useState({
//     category: "",
//     targetAmount: "",
//     currentAmount: "",
//     deadline: "",
//     description: "",
//     priority: "medium",
//     email: "",
//     userId: "",
//   });

//   // Contribution form data
//   const [contributionData, setContributionData] = useState({
//     amount: "",
//     note: "",
//   });

//   // Check if user is admin
//   const isAdmin = user?.role === "admin" || user?.role === "Admin";

//   // ============================================================
//   // SHOW MODAL HELPERS
//   // ============================================================
//   const showSuccess = useCallback((title, message, details = "") => {
//     setSuccessModal({ isOpen: true, title, message, details });
//   }, []);

//   const showError = useCallback((title, message, details = "") => {
//     setErrorModal({ isOpen: true, title, message, details });
//   }, []);

//   const showConfirm = useCallback(
//     (title, message, onConfirm, type = "danger", confirmLabel = "Confirm") => {
//       setConfirmModal({
//         isOpen: true,
//         title,
//         message,
//         onConfirm,
//         type,
//         confirmLabel,
//       });
//     },
//     [],
//   );

//   // ============================================================
//   // GET USER ID - FIXED: Properly gets the database ID
//   // ============================================================
//   const getUserId = useCallback(() => {
//     // Try multiple sources to get the user ID
//     const userId = user?.id || user?._id || user?.userId || "";

//     // Log for debugging
//     console.log("🔑 Getting userId:", userId);
//     console.log("👤 User object:", user);

//     return userId;
//   }, [user]);

//   // ============================================================
//   // GET VALID USER ID OR THROW ERROR
//   // ============================================================
//   const getValidUserIdOrThrow = useCallback(() => {
//     const userId = getUserId();

//     if (!userId) {
//       console.error("❌ No userId found in user object:", user);
//       throw new Error("User ID not found. Please log out and log in again.");
//     }

//     // Check if it looks like a MongoDB ObjectId (24 hex characters)
//     const isMongoId = /^[0-9a-fA-F]{24}$/.test(userId);
//     if (!isMongoId) {
//       console.warn(
//         "⚠️ userId doesn't look like a valid MongoDB ObjectId:",
//         userId,
//       );
//       // Still proceed, but log a warning
//     }

//     return userId;
//   }, [getUserId, user]);

//   // Redirect if no valid session
//   useEffect(() => {
//     const token = localStorage.getItem("authToken");
//     const userData = JSON.parse(localStorage.getItem("userData") || "null");

//     if (!token || !userData) {
//       navigate("/");
//       return;
//     }

//     if (!user) setUser(userData);

//     // Set user email and userId in form data
//     if (userData?.email) {
//       const userId = userData.id || userData._id || userData.userId || "";
//       setFormData((prev) => ({
//         ...prev,
//         email: userData.email,
//         userId: userId,
//       }));
//       console.log("🔑 User ID set in form:", userId);
//       console.log("📋 User data:", userData);
//     }

//     // Load savings only on initial mount
//     if (isFirstLoadRef.current) {
//       isFirstLoadRef.current = false;
//       loadSavings();
//       loadIncomes();
//     }
//   }, [navigate]);

//   // ============================================================
//   // LOAD INCOMES
//   // ============================================================
//   const loadIncomes = useCallback(async () => {
//     try {
//       const response = await api.get("/incomes");
//       if (response.data.success) {
//         setIncomeData(response.data.data || []);
//         const total = response.data.data.reduce(
//           (sum, income) => sum + (income.amount || 0),
//           0,
//         );
//         setTotalIncome(total);
//       }
//     } catch (error) {
//       console.error("Load incomes error:", error);
//     }
//   }, []);

//   // ============================================================
//   // LOAD SAVINGS
//   // ============================================================
//   const loadSavings = useCallback(async () => {
//     if (isLoadingRef.current) return;

//     if (!user?.email && !isAdmin) {
//       toast.warning("User email not found");
//       return;
//     }

//     isLoadingRef.current = true;
//     setIsLoading(true);

//     try {
//       const search = searchTermRef.current;
//       const category = filterCategoryRef.current;
//       const status = filterStatusRef.current;

//       const params = {};

//       if (!isAdmin) {
//         params.email = user.email;
//         const userId = getUserId();
//         if (userId) {
//           params.userId = userId;
//         }
//       }

//       if (category && category !== "all") {
//         params.category = category;
//       }

//       if (status && status !== "all") {
//         params.isCompleted = status === "completed";
//       }

//       const response = await api.get("/savings", { params });

//       if (response.data.success) {
//         const savingsData = response.data.data || [];
//         setSavings(savingsData);
//         setFilteredSavings(savingsData);

//         if (response.data.summary) {
//           setStats(response.data.summary);
//         } else {
//           calculateStats(savingsData);
//         }
//       } else {
//         throw new Error("Unexpected response format");
//       }
//     } catch (error) {
//       console.error("Load savings error:", error);
//       showError(
//         "Failed to Load Savings Goals",
//         error.response?.data?.message || "Could not fetch savings goals",
//         error.message,
//       );
//     } finally {
//       setIsLoading(false);
//       isLoadingRef.current = false;
//     }
//   }, [user?.email, isAdmin, getUserId, showError]);

//   // ============================================================
//   // CALCULATE STATS
//   // ============================================================
//   const calculateStats = useCallback((savingsData) => {
//     const totalTarget = savingsData.reduce(
//       (sum, s) => sum + (s.targetAmount || 0),
//       0,
//     );
//     const totalCurrent = savingsData.reduce(
//       (sum, s) => sum + (s.currentAmount || 0),
//       0,
//     );
//     const completed = savingsData.filter((s) => s.isCompleted).length;
//     const inProgress = savingsData.filter((s) => !s.isCompleted).length;

//     setStats({
//       totalTarget,
//       totalCurrent,
//       overallProgress: totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0,
//       completedCount: completed,
//       inProgressCount: inProgress,
//       totalGoals: savingsData.length,
//     });
//   }, []);

//   // ============================================================
//   // FILTER EFFECTS
//   // ============================================================
//   useEffect(() => {
//     searchTermRef.current = searchTerm;
//     filterCategoryRef.current = filterCategory;
//     filterPriorityRef.current = filterPriority;
//     filterStatusRef.current = filterStatus;

//     const timer = setTimeout(() => {
//       if (!isFirstLoadRef.current) {
//         loadSavings();
//       }
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [searchTerm, filterCategory, filterPriority, filterStatus, loadSavings]);

//   useEffect(() => {
//     let filtered = [...savings];

//     if (searchTerm.trim()) {
//       const term = searchTerm.toLowerCase();
//       filtered = filtered.filter(
//         (s) =>
//           s.category?.toLowerCase().includes(term) ||
//           s.description?.toLowerCase().includes(term),
//       );
//     }

//     if (filterPriority && filterPriority !== "all") {
//       filtered = filtered.filter((s) => s.priority === filterPriority);
//     }

//     if (filterStatus && filterStatus !== "all") {
//       filtered = filtered.filter((s) => {
//         if (filterStatus === "completed") return s.isCompleted;
//         if (filterStatus === "in-progress") return !s.isCompleted;
//         return true;
//       });
//     }

//     setFilteredSavings(filtered);
//   }, [savings, searchTerm, filterPriority, filterStatus]);

//   // ============================================================
//   // CRUD OPERATIONS - CREATE
//   // ============================================================
//   const handleAddSavings = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const targetAmountValue = Number(formData.targetAmount);
//       const currentAmountValue = Number(formData.currentAmount) || 0;

//       if (!Number.isInteger(targetAmountValue) || targetAmountValue <= 0) {
//         showError(
//           "Invalid Target Amount",
//           "Target amount must be a positive whole number (no decimals)",
//           "Please enter a valid whole number",
//         );
//         setIsSubmitting(false);
//         return;
//       }

//       if (!Number.isInteger(currentAmountValue) || currentAmountValue < 0) {
//         showError(
//           "Invalid Current Amount",
//           "Current amount must be a whole number (no decimals)",
//           "Please enter a valid whole number",
//         );
//         setIsSubmitting(false);
//         return;
//       }

//       // Get the userId - THIS IS CRITICAL
//       const userId = getValidUserIdOrThrow();

//       const savingsData = {
//         category: formData.category,
//         targetAmount: targetAmountValue,
//         currentAmount: currentAmountValue,
//         deadline: formData.deadline || null,
//         description: formData.description || "",
//         priority: formData.priority || "medium",
//         email: formData.email || user?.email,
//         userId: userId, // ← This must be a valid MongoDB ObjectId
//       };

//       console.log(
//         "📦 Creating savings with data:",
//         JSON.stringify(savingsData, null, 2),
//       );

//       const response = await api.post("/savings", savingsData);

//       if (response.data.success) {
//         const newSavings = response.data.data || response.data;
//         setIsAddModalOpen(false);
//         resetForm();

//         showSuccess(
//           "Savings Goal Created! 🎯",
//           `Goal of ${formatCurrency(newSavings.targetAmount)} set for ${newSavings.category}`,
//           `Current progress: ${formatCurrency(newSavings.currentAmount || 0)}\nPriority: ${newSavings.priority || "medium"}`,
//         );

//         setTimeout(() => {
//           loadSavings();
//           loadIncomes();
//         }, 300);
//       } else {
//         throw new Error(
//           response.data.message || "Failed to create savings goal",
//         );
//       }
//     } catch (error) {
//       console.error("Add savings error:", error);
//       const errorDetails =
//         error.response?.data?.errors?.join("\n") ||
//         error.message ||
//         "An error occurred";
//       showError(
//         "Failed to Create Savings Goal",
//         error.response?.data?.message || "Could not create savings goal",
//         errorDetails,
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // ============================================================
//   // CRUD OPERATIONS - UPDATE
//   // ============================================================
//   const handleEditSavings = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const targetAmountValue = Number(formData.targetAmount);
//       const currentAmountValue = Number(formData.currentAmount) || 0;

//       if (!Number.isInteger(targetAmountValue) || targetAmountValue <= 0) {
//         showError(
//           "Invalid Target Amount",
//           "Target amount must be a positive whole number (no decimals)",
//           "Please enter a valid whole number",
//         );
//         setIsSubmitting(false);
//         return;
//       }

//       if (!Number.isInteger(currentAmountValue) || currentAmountValue < 0) {
//         showError(
//           "Invalid Current Amount",
//           "Current amount must be a whole number (no decimals)",
//           "Please enter a valid whole number",
//         );
//         setIsSubmitting(false);
//         return;
//       }

//       // For updates, we don't need to send userId, but we need to send all other fields
//       const savingsData = {
//         category: formData.category,
//         targetAmount: targetAmountValue,
//         currentAmount: currentAmountValue,
//         deadline: formData.deadline || null,
//         description: formData.description || "",
//         priority: formData.priority || "medium",
//         // userId is not needed for update as it's already set in the database
//       };

//       console.log(
//         "📦 Updating savings with data:",
//         JSON.stringify(savingsData, null, 2),
//       );

//       const response = await api.put(
//         `/savings/${selectedSavings._id}`,
//         savingsData,
//       );

//       if (response.data.success) {
//         const updatedSavings = response.data.data || response.data;
//         setIsEditModalOpen(false);
//         resetForm();

//         showSuccess(
//           "Savings Goal Updated! ✏️",
//           `Goal for ${updatedSavings.category} has been updated.`,
//           `Target: ${formatCurrency(updatedSavings.targetAmount)}\nCurrent: ${formatCurrency(updatedSavings.currentAmount || 0)}`,
//         );

//         setTimeout(() => loadSavings(), 300);
//       } else {
//         throw new Error(
//           response.data.message || "Failed to update savings goal",
//         );
//       }
//     } catch (error) {
//       console.error("Update savings error:", error);
//       const errorDetails =
//         error.response?.data?.errors?.join("\n") ||
//         error.message ||
//         "An error occurred";
//       showError(
//         "Failed to Update Savings Goal",
//         error.response?.data?.message || "Could not update savings goal",
//         errorDetails,
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // ============================================================
//   // CRUD OPERATIONS - DELETE
//   // ============================================================
//   const handleDeleteSavings = async () => {
//     setIsSubmitting(true);

//     try {
//       const response = await api.delete(`/savings/${selectedSavings._id}`);

//       if (response.data.success) {
//         setIsDeleteModalOpen(false);

//         showSuccess(
//           "Savings Goal Deleted! 🗑️",
//           `The savings goal has been permanently deleted.`,
//           `Category: ${selectedSavings.category}\nTarget: ${formatCurrency(selectedSavings.targetAmount)}`,
//         );

//         setTimeout(() => {
//           loadSavings();
//           loadIncomes();
//         }, 300);
//       } else {
//         throw new Error(
//           response.data.message || "Failed to delete savings goal",
//         );
//       }
//     } catch (error) {
//       console.error("Delete savings error:", error);
//       const errorDetails =
//         error.response?.data?.errors?.join("\n") ||
//         error.message ||
//         "An error occurred";
//       showError(
//         "Failed to Delete Savings Goal",
//         error.response?.data?.message || "Could not delete savings goal",
//         errorDetails,
//       );
//     } finally {
//       setIsSubmitting(false);
//       setSelectedSavings(null);
//     }
//   };

//   // ============================================================
//   // FIXED: CONTRIBUTE OPERATION - Send ALL required fields with proper userId
//   // ============================================================
//   const handleContribute = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const amount = Number(contributionData.amount);
//       if (!Number.isInteger(amount) || amount <= 0) {
//         showError(
//           "Invalid Contribution",
//           "Contribution amount must be a positive whole number (no decimals)",
//           "Please enter a valid whole number",
//         );
//         setIsSubmitting(false);
//         return;
//       }

//       // Calculate new amount
//       const currentAmount = selectedSavings.currentAmount || 0;
//       const newCurrentAmount = currentAmount + amount;

//       // Get the userId - THIS IS CRITICAL for the contribution to work
//       // Use the userId from the selected savings, or from the user object
//       const userId = selectedSavings.userId || getValidUserIdOrThrow();

//       console.log("🔑 Contribution using userId:", userId);
//       console.log("📋 Selected savings:", selectedSavings);

//       // Send ALL required fields to pass validation
//       const savingsData = {
//         category: selectedSavings.category,
//         targetAmount: selectedSavings.targetAmount,
//         currentAmount: newCurrentAmount,
//         deadline: selectedSavings.deadline || null,
//         description: selectedSavings.description || "",
//         priority: selectedSavings.priority || "medium",
//         email: selectedSavings.email || user?.email,
//         userId: userId, // ← This MUST be included and be a valid MongoDB ObjectId
//       };

//       console.log(
//         "📤 Contribution data:",
//         JSON.stringify(savingsData, null, 2),
//       );

//       const response = await api.put(
//         `/savings/${selectedSavings._id}`,
//         savingsData,
//       );

//       if (response.data.success) {
//         const updatedSavings = response.data.data || response.data;
//         setIsContributeModalOpen(false);
//         setContributionData({ amount: "", note: "" });

//         const progress = updatedSavings.progress || 0;
//         const isComplete = progress >= 100;

//         showSuccess(
//           isComplete ? "🎉 Goal Achieved!" : "Contribution Successful! 💰",
//           `${amount.toFixed(0)} RWF contributed to ${selectedSavings.category}`,
//           `Progress: ${progress.toFixed(1)}%\nCurrent: ${formatCurrency(updatedSavings.currentAmount)}\nTarget: ${formatCurrency(updatedSavings.targetAmount)}`,
//         );

//         setTimeout(() => loadSavings(), 300);
//       } else {
//         throw new Error(response.data.message || "Failed to contribute");
//       }
//     } catch (error) {
//       console.error("Contribute error:", error);
//       console.error("Error response:", error.response?.data);

//       const errorMessage =
//         error.response?.data?.message || error.message || "An error occurred";
//       const errorDetails = error.response?.data?.errors?.join("\n") || "";

//       // Check for userId-specific error
//       if (
//         errorMessage.includes("User ID") ||
//         errorDetails.includes("User ID")
//       ) {
//         showError(
//           "User ID Error",
//           "The system could not identify your user account.",
//           "Please log out and log in again to refresh your session.",
//         );
//       } else {
//         showError(
//           "Failed to Contribute",
//           errorMessage,
//           errorDetails || "Please try again",
//         );
//       }
//     } finally {
//       setIsSubmitting(false);
//       setSelectedSavings(null);
//     }
//   };

//   // ============================================================
//   // RESET FORM
//   // ============================================================
//   const resetForm = useCallback(() => {
//     const userId = getUserId();
//     setFormData({
//       category: "",
//       targetAmount: "",
//       currentAmount: "",
//       deadline: "",
//       description: "",
//       priority: "medium",
//       email: user?.email || "",
//       userId: userId,
//     });
//     setSelectedSavings(null);
//   }, [user, getUserId]);

//   // ============================================================
//   // OPEN MODALS
//   // ============================================================
//   const openEditModal = useCallback(
//     (saving) => {
//       setSelectedSavings(saving);
//       const userId = saving.userId || getUserId();
//       setFormData({
//         category: saving.category || "",
//         targetAmount: saving.targetAmount?.toString() || "",
//         currentAmount: saving.currentAmount?.toString() || "",
//         deadline: saving.deadline ? saving.deadline.split("T")[0] : "",
//         description: saving.description || "",
//         priority: saving.priority || "medium",
//         email: saving.email || user?.email || "",
//         userId: userId,
//       });
//       setIsEditModalOpen(true);
//     },
//     [user, getUserId],
//   );

//   const openContributeModal = useCallback((saving) => {
//     setSelectedSavings(saving);
//     setContributionData({ amount: "", note: "" });
//     setIsContributeModalOpen(true);
//   }, []);

//   // ============================================================
//   // HELPERS
//   // ============================================================
//   const formatCurrency = useCallback((amount) => {
//     return new Intl.NumberFormat("rw-RW", {
//       style: "currency",
//       currency: "RWF",
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(amount || 0);
//   }, []);

//   const formatDate = useCallback((dateString) => {
//     if (!dateString) return "No deadline";
//     try {
//       return new Date(dateString).toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//       });
//     } catch {
//       return "Invalid date";
//     }
//   }, []);

//   const getPriorityBadge = useCallback((priority) => {
//     const level =
//       PRIORITY_LEVELS.find((p) => p.value === priority) || PRIORITY_LEVELS[1];
//     return (
//       <span
//         className={`px-2 py-1 rounded-full text-xs font-medium ${level.color}`}
//       >
//         {level.label}
//       </span>
//     );
//   }, []);

//   const getStatusBadge = useCallback((isCompleted, progress) => {
//     if (isCompleted) {
//       return (
//         <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center gap-1">
//           <CheckCircleIcon className="w-3 h-3" />
//           Completed
//         </span>
//       );
//     }
//     if (progress >= 75) {
//       return (
//         <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//           Almost There
//         </span>
//       );
//     }
//     if (progress >= 50) {
//       return (
//         <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
//           In Progress
//         </span>
//       );
//     }
//     return (
//       <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//         Just Started
//       </span>
//     );
//   }, []);

//   const getDaysRemaining = useCallback((deadline) => {
//     if (!deadline) return null;
//     const now = new Date();
//     const end = new Date(deadline);
//     const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
//     if (diff < 0) return "Overdue";
//     if (diff === 0) return "Today";
//     return `${diff} days left`;
//   }, []);

//   // ============================================================
//   // EXPORT FUNCTIONS
//   // ============================================================
//   const groupByMonth = useCallback((data) => {
//     const grouped = {};
//     data.forEach((item) => {
//       if (item.deadline) {
//         const date = new Date(item.deadline);
//         const monthYear = date.toLocaleString("default", {
//           month: "long",
//           year: "numeric",
//         });
//         if (!grouped[monthYear]) {
//           grouped[monthYear] = [];
//         }
//         grouped[monthYear].push(item);
//       } else {
//         if (!grouped["No Deadline"]) {
//           grouped["No Deadline"] = [];
//         }
//         grouped["No Deadline"].push(item);
//       }
//     });
//     return grouped;
//   }, []);

//   const groupByWeek = useCallback((data) => {
//     const grouped = {};
//     data.forEach((item) => {
//       if (item.deadline) {
//         const date = new Date(item.deadline);
//         const startOfWeek = new Date(date);
//         startOfWeek.setDate(date.getDate() - date.getDay());
//         const endOfWeek = new Date(startOfWeek);
//         endOfWeek.setDate(startOfWeek.getDate() + 6);
//         const weekKey = `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;
//         if (!grouped[weekKey]) {
//           grouped[weekKey] = [];
//         }
//         grouped[weekKey].push(item);
//       } else {
//         if (!grouped["No Deadline"]) {
//           grouped["No Deadline"] = [];
//         }
//         grouped["No Deadline"].push(item);
//       }
//     });
//     return grouped;
//   }, []);

//   const exportToPDF = useCallback(() => {
//     if (filteredSavings.length === 0) {
//       toast.warning("No savings data to export");
//       return;
//     }

//     const doc = new jsPDF("landscape", "pt", "a4");

//     doc.setFontSize(18);
//     doc.setTextColor(40, 40, 40);
//     doc.text("Savings Report", 40, 50);

//     doc.setFontSize(10);
//     doc.setTextColor(100, 100, 100);
//     doc.text(`Generated: ${new Date().toLocaleDateString()}`, 40, 70);

//     doc.setFontSize(12);
//     doc.setTextColor(40, 40, 40);
//     doc.text("Summary", 40, 95);

//     const summaryData = [
//       ["Total Goals", stats.totalGoals.toString()],
//       ["Total Target Amount", formatCurrency(stats.totalTarget)],
//       ["Total Current Amount", formatCurrency(stats.totalCurrent)],
//       ["Overall Progress", `${stats.overallProgress.toFixed(1)}%`],
//       ["Completed Goals", stats.completedCount.toString()],
//       ["In Progress Goals", stats.inProgressCount.toString()],
//       ["Total Income", formatCurrency(totalIncome)],
//     ];

//     doc.autoTable({
//       startY: 100,
//       head: [["Metric", "Value"]],
//       body: summaryData,
//       theme: "striped",
//       headStyles: { fillColor: [128, 90, 213] },
//       styles: { fontSize: 10 },
//       margin: { left: 40, right: 40 },
//     });

//     const tableY = doc.previousAutoTable.finalY + 20;
//     doc.setFontSize(12);
//     doc.setTextColor(40, 40, 40);
//     doc.text("Savings Goals", 40, tableY);

//     const tableData = filteredSavings.map((s) => [
//       s.category || "",
//       formatCurrency(s.targetAmount || 0),
//       formatCurrency(s.currentAmount || 0),
//       `${(s.progress || 0).toFixed(1)}%`,
//       s.priority || "medium",
//       s.deadline ? formatDate(s.deadline) : "No deadline",
//       s.isCompleted ? "Completed" : "In Progress",
//     ]);

//     doc.autoTable({
//       startY: tableY + 10,
//       head: [
//         [
//           "Category",
//           "Target",
//           "Current",
//           "Progress",
//           "Priority",
//           "Deadline",
//           "Status",
//         ],
//       ],
//       body: tableData,
//       theme: "striped",
//       headStyles: { fillColor: [128, 90, 213] },
//       styles: { fontSize: 8 },
//       margin: { left: 40, right: 40 },
//     });

//     doc.save(`savings-report-${new Date().toISOString().split("T")[0]}.pdf`);
//     toast.success("PDF exported successfully!");
//   }, [filteredSavings, stats, totalIncome, formatCurrency, formatDate]);

//   const exportToCSV = useCallback(() => {
//     if (filteredSavings.length === 0) {
//       toast.warning("No savings data to export");
//       return;
//     }

//     const headers = [
//       "Category",
//       "Target Amount (RWF)",
//       "Current Amount (RWF)",
//       "Progress",
//       "Priority",
//       "Deadline",
//       "Status",
//     ];
//     const rows = filteredSavings.map((s) => [
//       s.category || "",
//       s.targetAmount || 0,
//       s.currentAmount || 0,
//       `${s.progress?.toFixed(1) || 0}%`,
//       s.priority || "medium",
//       s.deadline ? formatDate(s.deadline) : "No deadline",
//       s.isCompleted ? "Completed" : "In Progress",
//     ]);

//     let csv = headers.join(",") + "\n";
//     rows.forEach((row) => {
//       csv += row.join(",") + "\n";
//     });

//     csv += "\nSummary\n";
//     csv += `Total Goals,${stats.totalGoals}\n`;
//     csv += `Total Target Amount (RWF),${stats.totalTarget}\n`;
//     csv += `Total Current Amount (RWF),${stats.totalCurrent}\n`;
//     csv += `Overall Progress,${stats.overallProgress.toFixed(1)}%\n`;
//     csv += `Completed Goals,${stats.completedCount}\n`;
//     csv += `In Progress Goals,${stats.inProgressCount}\n`;
//     csv += `Total Income (RWF),${totalIncome}\n`;

//     const blob = new Blob([csv], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `savings-report-${new Date().toISOString().split("T")[0]}.csv`;
//     a.click();
//     window.URL.revokeObjectURL(url);

//     toast.success("CSV exported successfully!");
//   }, [filteredSavings, stats, totalIncome, formatDate]);

//   // ============================================================
//   // RENDER
//   // ============================================================
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
//               <SavingsIcon className="text-purple-500" />
//               Savings Management
//             </h2>
//             <p className="text-gray-600 mt-1">
//               Track and manage your savings goals
//             </p>
//             {isAdmin && (
//               <span className="inline-flex items-center gap-1 text-sm text-purple-600 bg-purple-100 px-3 py-1 rounded-full mt-1">
//                 <AdminPanelSettingsIcon className="w-4 h-4" />
//                 Admin View - All Households
//               </span>
//             )}
//             {user?.email && !isAdmin && (
//               <p className="text-sm text-gray-500 mt-1">User: {user.email}</p>
//             )}
//           </div>
//           <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
//             <button
//               onClick={exportToPDF}
//               className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg"
//             >
//               <PictureAsPdfIcon className="w-5 h-5" />
//               <span>Export PDF</span>
//             </button>
//             <button
//               onClick={exportToCSV}
//               className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 shadow-md hover:shadow-lg"
//             >
//               <TableChartIcon className="w-5 h-5" />
//               <span>Export CSV</span>
//             </button>
//             <button
//               onClick={() => {
//                 isFirstLoadRef.current = false;
//                 loadSavings();
//                 loadIncomes();
//               }}
//               className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
//             >
//               <RefreshIcon className="w-5 h-5" />
//               <span>Refresh</span>
//             </button>
//             <button
//               onClick={() => setIsAddModalOpen(true)}
//               className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
//             >
//               <AddIcon className="w-5 h-5" />
//               <span>Add Goal</span>
//             </button>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
//           <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-purple-500">
//             <p className="text-sm text-gray-500">Total Goals</p>
//             <p className="text-xs font-bold text-purple-600">
//               {stats.totalGoals}
//             </p>
//           </div>
//           <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-500">
//             <p className="text-sm text-gray-500">Completed</p>
//             <p className="text-xs font-bold text-green-600">
//               {stats.completedCount}
//             </p>
//           </div>
//           <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-500">
//             <p className="text-sm text-gray-500">In Progress</p>
//             <p className="text-xs font-bold text-blue-600">
//               {stats.inProgressCount}
//             </p>
//           </div>
//           <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-orange-500">
//             <p className="text-sm text-gray-500">Progress</p>
//             <p className="text-xs font-bold text-orange-600">
//               {stats.overallProgress.toFixed(1)}%
//             </p>
//           </div>
//           <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-emerald-500">
//             <p className="text-sm text-gray-500">Saved</p>
//             <p className="text-xs font-bold text-emerald-600">
//               {formatCurrency(stats.totalCurrent)}
//             </p>
//           </div>
//         </div>

//         {/* Total Income Card */}
//         <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg p-6 mb-6 text-white">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm opacity-80">Total Income</p>
//               <p className="text-xl font-bold">{formatCurrency(totalIncome)}</p>
//               <p className="text-xs opacity-70 mt-1">
//                 All time income from all sources
//               </p>
//             </div>
//             <MonetizationOnIcon className="w-16 h-16 opacity-30" />
//           </div>
//         </div>

//         {/* Search and Filters */}
//         <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
//           <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
//             <div className="flex-1 relative">
//               <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search savings goals..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//               />
//             </div>

//             <div className="flex flex-wrap gap-2">
//               <select
//                 value={filterCategory}
//                 onChange={(e) => setFilterCategory(e.target.value)}
//                 className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//               >
//                 <option value="all">All Categories</option>
//                 {SAVINGS_CATEGORIES.map((cat) => (
//                   <option key={cat} value={cat}>
//                     {cat}
//                   </option>
//                 ))}
//               </select>

//               <select
//                 value={filterPriority}
//                 onChange={(e) => setFilterPriority(e.target.value)}
//                 className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//               >
//                 <option value="all">All Priorities</option>
//                 {PRIORITY_LEVELS.map((p) => (
//                   <option key={p.value} value={p.value}>
//                     {p.label}
//                   </option>
//                 ))}
//               </select>

//               <select
//                 value={filterStatus}
//                 onChange={(e) => setFilterStatus(e.target.value)}
//                 className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//               >
//                 <option value="all">All Status</option>
//                 <option value="in-progress">In Progress</option>
//                 <option value="completed">Completed</option>
//               </select>

//               <button
//                 onClick={() => {
//                   setSearchTerm("");
//                   setFilterCategory("all");
//                   setFilterPriority("all");
//                   setFilterStatus("all");
//                 }}
//                 className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 Clear
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Savings Cards Grid */}
//         {isLoading ? (
//           <div className="flex items-center justify-center py-12">
//             <div className="text-center">
//               <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
//               <p className="mt-4 text-gray-600">Loading savings goals...</p>
//             </div>
//           </div>
//         ) : filteredSavings.length === 0 ? (
//           <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
//             <SavingsIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
//             <p className="text-gray-500 text-lg">No savings goals found</p>
//             <p className="text-gray-400 text-sm mt-1">
//               {searchTerm ||
//               filterCategory !== "all" ||
//               filterPriority !== "all" ||
//               filterStatus !== "all"
//                 ? "Try adjusting your filters"
//                 : "Start by adding your first savings goal"}
//             </p>
//             <button
//               onClick={() => setIsAddModalOpen(true)}
//               className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
//             >
//               <AddIcon className="w-5 h-5 inline mr-2" />
//               Add Your First Goal
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
//             {filteredSavings.map((saving) => (
//               <SavingsCard
//                 key={saving._id}
//                 saving={saving}
//                 formatCurrency={formatCurrency}
//                 formatDate={formatDate}
//                 getPriorityBadge={getPriorityBadge}
//                 getStatusBadge={getStatusBadge}
//                 getDaysRemaining={getDaysRemaining}
//                 openEditModal={openEditModal}
//                 openContributeModal={openContributeModal}
//                 setSelectedSavings={setSelectedSavings}
//                 setIsDeleteModalOpen={setIsDeleteModalOpen}
//               />
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Add Savings Modal */}
//       <Modal
//         isOpen={isAddModalOpen}
//         onClose={() => {
//           setIsAddModalOpen(false);
//           resetForm();
//         }}
//         title="Add Savings Goal"
//       >
//         <SavingsForm
//           formData={formData}
//           setFormData={setFormData}
//           onSubmit={handleAddSavings}
//           submitLabel="Create Goal"
//           isSubmitting={isSubmitting}
//           categories={SAVINGS_CATEGORIES}
//           priorityLevels={PRIORITY_LEVELS}
//           onCancel={() => {
//             setIsAddModalOpen(false);
//             resetForm();
//           }}
//         />
//       </Modal>

//       {/* Edit Savings Modal */}
//       <Modal
//         isOpen={isEditModalOpen}
//         onClose={() => {
//           setIsEditModalOpen(false);
//           resetForm();
//         }}
//         title="Edit Savings Goal"
//       >
//         <SavingsForm
//           formData={formData}
//           setFormData={setFormData}
//           onSubmit={handleEditSavings}
//           submitLabel="Update Goal"
//           isSubmitting={isSubmitting}
//           categories={SAVINGS_CATEGORIES}
//           priorityLevels={PRIORITY_LEVELS}
//           onCancel={() => {
//             setIsEditModalOpen(false);
//             resetForm();
//           }}
//         />
//       </Modal>

//       {/* Contribute Modal */}
//       <Modal
//         isOpen={isContributeModalOpen}
//         onClose={() => {
//           setIsContributeModalOpen(false);
//           setSelectedSavings(null);
//           setContributionData({ amount: "", note: "" });
//         }}
//         title="Contribute to Savings"
//         size="sm"
//       >
//         <ContributionForm
//           selectedSavings={selectedSavings}
//           contributionData={contributionData}
//           setContributionData={setContributionData}
//           onSubmit={handleContribute}
//           isSubmitting={isSubmitting}
//           formatCurrency={formatCurrency}
//           onCancel={() => {
//             setIsContributeModalOpen(false);
//             setSelectedSavings(null);
//             setContributionData({ amount: "", note: "" });
//           }}
//         />
//       </Modal>

//       {/* Delete Confirmation Modal */}
//       <ConfirmModal
//         isOpen={isDeleteModalOpen}
//         onClose={() => {
//           setIsDeleteModalOpen(false);
//           setSelectedSavings(null);
//         }}
//         onConfirm={handleDeleteSavings}
//         title="Delete Savings Goal"
//         message={`Are you sure you want to delete this savings goal?\n\n"${selectedSavings?.category || "N/A"}"\nTarget: ${formatCurrency(selectedSavings?.targetAmount || 0)}`}
//         type="danger"
//         confirmLabel="Delete"
//         isSubmitting={isSubmitting}
//       />

//        {/* SUCCESS, ERROR, CONFIRM MODALS */}
//       <SuccessModal
//         isOpen={successModal.isOpen}
//         onClose={() => setSuccessModal((prev) => ({ ...prev, isOpen: false }))}
//         title={successModal.title}
//         message={successModal.message}
//         details={successModal.details}
//       />

//       <ErrorModal
//         isOpen={errorModal.isOpen}
//         onClose={() => setErrorModal((prev) => ({ ...prev, isOpen: false }))}
//         title={errorModal.title}
//         message={errorModal.message}
//         details={errorModal.details}
//       />

//       <ConfirmModal
//         isOpen={confirmModal.isOpen}
//         onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
//         onConfirm={() => {
//           if (confirmModal.onConfirm) {
//             confirmModal.onConfirm();
//           }
//           setConfirmModal((prev) => ({ ...prev, isOpen: false }));
//         }}
//         title={confirmModal.title}
//         message={confirmModal.message}
//         type={confirmModal.type}
//         confirmLabel={confirmModal.confirmLabel}
//         isSubmitting={isSubmitting}
//       />
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
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Material Icons
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import SavingsIcon from "@mui/icons-material/Savings";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableChartIcon from "@mui/icons-material/TableChart";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
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
  "Vehicle",
  "Home Improvement",
  "Wedding",
  "Vacation",
  "Technology",
  "Other",
];

// Priority levels
const PRIORITY_LEVELS = [
  { value: "low", label: "Low", color: "bg-blue-100 text-blue-800" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "high", label: "High", color: "bg-orange-100 text-orange-800" },
  { value: "critical", label: "Critical", color: "bg-red-100 text-red-800" },
];

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

// ============================================================
// MEMOIZED SAVINGS FORM COMPONENT
// ============================================================
const SavingsForm = memo(
  ({
    formData,
    setFormData,
    onSubmit,
    submitLabel,
    isSubmitting,
    categories,
    priorityLevels,
    onCancel,
  }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Savings Category *
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Amount (RWF) *
          </label>
          <input
            type="number"
            step="1"
            min="1"
            value={formData.targetAmount}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || /^\d+$/.test(value)) {
                setFormData({ ...formData, targetAmount: value });
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "." || e.key === ",") {
                e.preventDefault();
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
            value={formData.currentAmount}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || /^\d+$/.test(value)) {
                setFormData({ ...formData, currentAmount: value });
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "." || e.key === ",") {
                e.preventDefault();
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
            value={formData.deadline}
            onChange={(e) =>
              setFormData({ ...formData, deadline: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <select
            value={formData.priority}
            onChange={(e) =>
              setFormData({ ...formData, priority: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            {priorityLevels.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
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
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          rows="3"
          placeholder="Additional notes about this savings goal"
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

// ============================================================
// MEMOIZED CONTRIBUTION FORM COMPONENT
// ============================================================
const ContributionForm = memo(
  ({
    selectedSavings,
    contributionData,
    setContributionData,
    onSubmit,
    isSubmitting,
    formatCurrency,
    onCancel,
  }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="text-center mb-4">
        <h4 className="font-semibold text-gray-800">
          {selectedSavings?.category}
        </h4>
        <p className="text-sm text-gray-500">
          Current: {formatCurrency(selectedSavings?.currentAmount || 0)} /{" "}
          {formatCurrency(selectedSavings?.targetAmount || 0)}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-purple-500 h-2 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(selectedSavings?.progress || 0, 100)}%`,
            }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Progress: {selectedSavings?.progress?.toFixed(1) || 0}%
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contribution Amount (RWF) *
        </label>
        <input
          type="number"
          step="1"
          min="1"
          value={contributionData.amount}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "" || /^\d+$/.test(value)) {
              setContributionData({ ...contributionData, amount: value });
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "." || e.key === ",") {
              e.preventDefault();
            }
          }}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          placeholder="0"
          required
          autoFocus
        />
        <p className="text-xs text-gray-500 mt-1">
          Whole numbers only (no decimals)
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Note (Optional)
        </label>
        <input
          type="text"
          value={contributionData.note}
          onChange={(e) =>
            setContributionData({ ...contributionData, note: e.target.value })
          }
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          placeholder="Add a note about this contribution"
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
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <AttachMoneyIcon className="w-5 h-5" />
              <span>Contribute</span>
            </>
          )}
        </button>
      </div>
    </form>
  ),
);

// ============================================================
// MEMOIZED SAVINGS CARD COMPONENT
// ============================================================
const SavingsCard = memo(
  ({
    saving,
    formatCurrency,
    formatDate,
    getPriorityBadge,
    getStatusBadge,
    getDaysRemaining,
    openEditModal,
    openContributeModal,
    setSelectedSavings,
    setIsDeleteModalOpen,
  }) => {
    const progress = saving.progress || 0;
    const isCompleted = saving.isCompleted || false;
    const daysLeft = getDaysRemaining(saving.deadline);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 transition-all hover:shadow-xl ${
          isCompleted
            ? "border-l-green-500"
            : progress >= 75
              ? "border-l-blue-500"
              : progress >= 50
                ? "border-l-yellow-500"
                : "border-l-purple-500"
        }`}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              {saving.category}
              {isCompleted && (
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
              )}
            </h3>
            <p className="text-sm text-gray-500">
              {saving.description || "No description"}
            </p>
          </div>
          {getPriorityBadge(saving.priority)}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              Target: {formatCurrency(saving.targetAmount)}
            </span>
            <span className="text-gray-600">
              Saved: {formatCurrency(saving.currentAmount || 0)}
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                isCompleted
                  ? "bg-green-500"
                  : progress >= 75
                    ? "bg-blue-500"
                    : progress >= 50
                      ? "bg-yellow-500"
                      : "bg-purple-500"
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-gray-500">
            <span>{progress.toFixed(1)}% complete</span>
            {daysLeft && (
              <span
                className={
                  daysLeft === "Overdue" ? "text-red-500 font-medium" : ""
                }
              >
                {daysLeft}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {getStatusBadge(isCompleted, progress)}
            {saving.deadline && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <CalendarTodayIcon className="w-3 h-3" />
                {formatDate(saving.deadline)}
              </span>
            )}
          </div>
          <div className="flex space-x-1">
            {!isCompleted && (
              <button
                onClick={() => openContributeModal(saving)}
                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Contribute"
              >
                <AttachMoneyIcon className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => openEditModal(saving)}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit"
            >
              <EditIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setSelectedSavings(saving);
                setIsDeleteModalOpen(true);
              }}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <DeleteIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  },
);

// ============================================================
// MAIN COMPONENT
// ============================================================
export const SavingsManagement = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("userData") || "null");
    } catch {
      return null;
    }
  });

  // State for savings
  const [savings, setSavings] = useState([]);
  const [filteredSavings, setFilteredSavings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Income state
  const [totalIncome, setTotalIncome] = useState(0);
  const [incomeData, setIncomeData] = useState([]);

  // Refs
  const searchTermRef = useRef(searchTerm);
  const filterCategoryRef = useRef(filterCategory);
  const filterPriorityRef = useRef(filterPriority);
  const filterStatusRef = useRef(filterStatus);
  const isFirstLoadRef = useRef(true);
  const isLoadingRef = useRef(false);

  // Stats
  const [stats, setStats] = useState({
    totalTarget: 0,
    totalCurrent: 0,
    overallProgress: 0,
    completedCount: 0,
    inProgressCount: 0,
    totalGoals: 0,
  });

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [selectedSavings, setSelectedSavings] = useState(null);
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
    targetAmount: "",
    currentAmount: "",
    deadline: "",
    description: "",
    priority: "medium",
    email: "",
    userId: "",
  });

  // Contribution form data
  const [contributionData, setContributionData] = useState({
    amount: "",
    note: "",
  });

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
  // GET USER ID
  // ============================================================
  const getUserId = useCallback(() => {
    const userId = user?.id || user?._id || user?.userId || "";
    return userId;
  }, [user]);

  // ============================================================
  // GET VALID USER ID OR THROW ERROR
  // ============================================================
  const getValidUserIdOrThrow = useCallback(() => {
    const userId = getUserId();

    if (!userId) {
      console.error("❌ No userId found in user object:", user);
      throw new Error("User ID not found. Please log out and log in again.");
    }

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(userId);
    if (!isMongoId) {
      console.warn(
        "⚠️ userId doesn't look like a valid MongoDB ObjectId:",
        userId,
      );
    }

    return userId;
  }, [getUserId, user]);

  // Redirect if no valid session
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = JSON.parse(localStorage.getItem("userData") || "null");

    if (!token || !userData) {
      navigate("/");
      return;
    }

    if (!user) setUser(userData);

    // Set user email and userId in form data
    if (userData?.email) {
      const userId = userData.id || userData._id || userData.userId || "";
      setFormData((prev) => ({
        ...prev,
        email: userData.email,
        userId: userId,
      }));
      console.log("🔑 User ID set in form:", userId);
    }

    // Load savings only on initial mount
    if (isFirstLoadRef.current) {
      isFirstLoadRef.current = false;
      loadSavings();
      loadIncomes();
    }
  }, [navigate]);

  // ============================================================
  // LOAD INCOMES - FIXED with client-side filtering by email
  // ============================================================
  const loadIncomes = useCallback(async () => {
    try {
      const userEmail = user?.email;
      if (!userEmail) {
        console.warn("No user email found for loading incomes");
        return;
      }

      // Fetch all incomes from the /incomes endpoint
      const response = await api.get("/incomes");
      if (response.data.success) {
        const allIncomes = response.data.data || [];
        
        // Filter incomes by the current user's email
        const userIncomes = allIncomes.filter(
          (income) => income.email === userEmail
        );
        
        setIncomeData(userIncomes);
        const total = userIncomes.reduce(
          (sum, income) => sum + (income.amount || 0),
          0,
        );
        setTotalIncome(total);
        
        console.log(`✅ Found ${userIncomes.length} incomes for ${userEmail}, total: ${total}`);
      }
    } catch (error) {
      console.error("Load incomes error:", error);
    }
  }, [user?.email]);

  // ============================================================
  // LOAD SAVINGS - FIXED: Always filters by email
  // ============================================================
  const loadSavings = useCallback(async () => {
    if (isLoadingRef.current) return;

    if (!user?.email) {
      toast.warning("User email not found");
      return;
    }

    isLoadingRef.current = true;
    setIsLoading(true);

    try {
      const search = searchTermRef.current;
      const category = filterCategoryRef.current;
      const status = filterStatusRef.current;

      const params = {
        email: user.email, // Always filter by user's email
      };

      const userId = getUserId();
      if (userId) {
        params.userId = userId;
      }

      if (category && category !== "all") {
        params.category = category;
      }

      if (status && status !== "all") {
        params.isCompleted = status === "completed";
      }

      const response = await api.get("/savings", { params });

      if (response.data.success) {
        const savingsData = response.data.data || [];
        setSavings(savingsData);
        setFilteredSavings(savingsData);

        if (response.data.summary) {
          setStats(response.data.summary);
        } else {
          calculateStats(savingsData);
        }
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Load savings error:", error);
      showError(
        "Failed to Load Savings Goals",
        error.response?.data?.message || "Could not fetch savings goals",
        error.message,
      );
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, [user?.email, getUserId, showError]);

  // ============================================================
  // CALCULATE STATS
  // ============================================================
  const calculateStats = useCallback((savingsData) => {
    const totalTarget = savingsData.reduce(
      (sum, s) => sum + (s.targetAmount || 0),
      0,
    );
    const totalCurrent = savingsData.reduce(
      (sum, s) => sum + (s.currentAmount || 0),
      0,
    );
    const completed = savingsData.filter((s) => s.isCompleted).length;
    const inProgress = savingsData.filter((s) => !s.isCompleted).length;

    setStats({
      totalTarget,
      totalCurrent,
      overallProgress: totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0,
      completedCount: completed,
      inProgressCount: inProgress,
      totalGoals: savingsData.length,
    });
  }, []);

  // ============================================================
  // FILTER EFFECTS
  // ============================================================
  useEffect(() => {
    searchTermRef.current = searchTerm;
    filterCategoryRef.current = filterCategory;
    filterPriorityRef.current = filterPriority;
    filterStatusRef.current = filterStatus;

    const timer = setTimeout(() => {
      if (!isFirstLoadRef.current) {
        loadSavings();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, filterCategory, filterPriority, filterStatus, loadSavings]);

  useEffect(() => {
    let filtered = [...savings];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.category?.toLowerCase().includes(term) ||
          s.description?.toLowerCase().includes(term),
      );
    }

    if (filterPriority && filterPriority !== "all") {
      filtered = filtered.filter((s) => s.priority === filterPriority);
    }

    if (filterStatus && filterStatus !== "all") {
      filtered = filtered.filter((s) => {
        if (filterStatus === "completed") return s.isCompleted;
        if (filterStatus === "in-progress") return !s.isCompleted;
        return true;
      });
    }

    setFilteredSavings(filtered);
  }, [savings, searchTerm, filterPriority, filterStatus]);

  // ============================================================
  // CRUD OPERATIONS - CREATE
  // ============================================================
  const handleAddSavings = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const targetAmountValue = Number(formData.targetAmount);
      const currentAmountValue = Number(formData.currentAmount) || 0;

      if (!Number.isInteger(targetAmountValue) || targetAmountValue <= 0) {
        showError(
          "Invalid Target Amount",
          "Target amount must be a positive whole number (no decimals)",
          "Please enter a valid whole number",
        );
        setIsSubmitting(false);
        return;
      }

      if (!Number.isInteger(currentAmountValue) || currentAmountValue < 0) {
        showError(
          "Invalid Current Amount",
          "Current amount must be a whole number (no decimals)",
          "Please enter a valid whole number",
        );
        setIsSubmitting(false);
        return;
      }

      const userId = getValidUserIdOrThrow();

      const savingsData = {
        category: formData.category,
        targetAmount: targetAmountValue,
        currentAmount: currentAmountValue,
        deadline: formData.deadline || null,
        description: formData.description || "",
        priority: formData.priority || "medium",
        email: formData.email || user?.email,
        userId: userId,
      };

      console.log(
        "📦 Creating savings with data:",
        JSON.stringify(savingsData, null, 2),
      );

      const response = await api.post("/savings", savingsData);

      if (response.data.success) {
        const newSavings = response.data.data || response.data;
        setIsAddModalOpen(false);
        resetForm();

        showSuccess(
          "Savings Goal Created! 🎯",
          `Goal of ${formatCurrency(newSavings.targetAmount)} set for ${newSavings.category}`,
          `Current progress: ${formatCurrency(newSavings.currentAmount || 0)}\nPriority: ${newSavings.priority || "medium"}`,
        );

        setTimeout(() => {
          loadSavings();
          loadIncomes();
        }, 300);
      } else {
        throw new Error(
          response.data.message || "Failed to create savings goal",
        );
      }
    } catch (error) {
      console.error("Add savings error:", error);
      const errorDetails =
        error.response?.data?.errors?.join("\n") ||
        error.message ||
        "An error occurred";
      showError(
        "Failed to Create Savings Goal",
        error.response?.data?.message || "Could not create savings goal",
        errorDetails,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // CRUD OPERATIONS - UPDATE
  // ============================================================
  const handleEditSavings = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const targetAmountValue = Number(formData.targetAmount);
      const currentAmountValue = Number(formData.currentAmount) || 0;

      if (!Number.isInteger(targetAmountValue) || targetAmountValue <= 0) {
        showError(
          "Invalid Target Amount",
          "Target amount must be a positive whole number (no decimals)",
          "Please enter a valid whole number",
        );
        setIsSubmitting(false);
        return;
      }

      if (!Number.isInteger(currentAmountValue) || currentAmountValue < 0) {
        showError(
          "Invalid Current Amount",
          "Current amount must be a whole number (no decimals)",
          "Please enter a valid whole number",
        );
        setIsSubmitting(false);
        return;
      }

      const savingsData = {
        category: formData.category,
        targetAmount: targetAmountValue,
        currentAmount: currentAmountValue,
        deadline: formData.deadline || null,
        description: formData.description || "",
        priority: formData.priority || "medium",
      };

      console.log(
        "📦 Updating savings with data:",
        JSON.stringify(savingsData, null, 2),
      );

      const response = await api.put(
        `/savings/${selectedSavings._id}`,
        savingsData,
      );

      if (response.data.success) {
        const updatedSavings = response.data.data || response.data;
        setIsEditModalOpen(false);
        resetForm();

        showSuccess(
          "Savings Goal Updated! ✏️",
          `Goal for ${updatedSavings.category} has been updated.`,
          `Target: ${formatCurrency(updatedSavings.targetAmount)}\nCurrent: ${formatCurrency(updatedSavings.currentAmount || 0)}`,
        );

        setTimeout(() => loadSavings(), 300);
      } else {
        throw new Error(
          response.data.message || "Failed to update savings goal",
        );
      }
    } catch (error) {
      console.error("Update savings error:", error);
      const errorDetails =
        error.response?.data?.errors?.join("\n") ||
        error.message ||
        "An error occurred";
      showError(
        "Failed to Update Savings Goal",
        error.response?.data?.message || "Could not update savings goal",
        errorDetails,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // CRUD OPERATIONS - DELETE
  // ============================================================
  const handleDeleteSavings = async () => {
    setIsSubmitting(true);

    try {
      const response = await api.delete(`/savings/${selectedSavings._id}`);

      if (response.data.success) {
        setIsDeleteModalOpen(false);

        showSuccess(
          "Savings Goal Deleted! 🗑️",
          `The savings goal has been permanently deleted.`,
          `Category: ${selectedSavings.category}\nTarget: ${formatCurrency(selectedSavings.targetAmount)}`,
        );

        setTimeout(() => {
          loadSavings();
          loadIncomes();
        }, 300);
      } else {
        throw new Error(
          response.data.message || "Failed to delete savings goal",
        );
      }
    } catch (error) {
      console.error("Delete savings error:", error);
      const errorDetails =
        error.response?.data?.errors?.join("\n") ||
        error.message ||
        "An error occurred";
      showError(
        "Failed to Delete Savings Goal",
        error.response?.data?.message || "Could not delete savings goal",
        errorDetails,
      );
    } finally {
      setIsSubmitting(false);
      setSelectedSavings(null);
    }
  };

  // ============================================================
  // CONTRIBUTE OPERATION
  // ============================================================
  const handleContribute = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const amount = Number(contributionData.amount);
      if (!Number.isInteger(amount) || amount <= 0) {
        showError(
          "Invalid Contribution",
          "Contribution amount must be a positive whole number (no decimals)",
          "Please enter a valid whole number",
        );
        setIsSubmitting(false);
        return;
      }

      const currentAmount = selectedSavings.currentAmount || 0;
      const newCurrentAmount = currentAmount + amount;

      const userId = selectedSavings.userId || getValidUserIdOrThrow();

      const savingsData = {
        category: selectedSavings.category,
        targetAmount: selectedSavings.targetAmount,
        currentAmount: newCurrentAmount,
        deadline: selectedSavings.deadline || null,
        description: selectedSavings.description || "",
        priority: selectedSavings.priority || "medium",
        email: selectedSavings.email || user?.email,
        userId: userId,
      };

      console.log(
        "📤 Contribution data:",
        JSON.stringify(savingsData, null, 2),
      );

      const response = await api.put(
        `/savings/${selectedSavings._id}`,
        savingsData,
      );

      if (response.data.success) {
        const updatedSavings = response.data.data || response.data;
        setIsContributeModalOpen(false);
        setContributionData({ amount: "", note: "" });

        const progress = updatedSavings.progress || 0;
        const isComplete = progress >= 100;

        showSuccess(
          isComplete ? "🎉 Goal Achieved!" : "Contribution Successful! 💰",
          `${amount.toFixed(0)} RWF contributed to ${selectedSavings.category}`,
          `Progress: ${progress.toFixed(1)}%\nCurrent: ${formatCurrency(updatedSavings.currentAmount)}\nTarget: ${formatCurrency(updatedSavings.targetAmount)}`,
        );

        setTimeout(() => loadSavings(), 300);
      } else {
        throw new Error(response.data.message || "Failed to contribute");
      }
    } catch (error) {
      console.error("Contribute error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred";
      const errorDetails = error.response?.data?.errors?.join("\n") || "";

      if (
        errorMessage.includes("User ID") ||
        errorDetails.includes("User ID")
      ) {
        showError(
          "User ID Error",
          "The system could not identify your user account.",
          "Please log out and log in again to refresh your session.",
        );
      } else {
        showError(
          "Failed to Contribute",
          errorMessage,
          errorDetails || "Please try again",
        );
      }
    } finally {
      setIsSubmitting(false);
      setSelectedSavings(null);
    }
  };

  // ============================================================
  // RESET FORM
  // ============================================================
  const resetForm = useCallback(() => {
    const userId = getUserId();
    setFormData({
      category: "",
      targetAmount: "",
      currentAmount: "",
      deadline: "",
      description: "",
      priority: "medium",
      email: user?.email || "",
      userId: userId,
    });
    setSelectedSavings(null);
  }, [user, getUserId]);

  // ============================================================
  // OPEN MODALS
  // ============================================================
  const openEditModal = useCallback(
    (saving) => {
      setSelectedSavings(saving);
      const userId = saving.userId || getUserId();
      setFormData({
        category: saving.category || "",
        targetAmount: saving.targetAmount?.toString() || "",
        currentAmount: saving.currentAmount?.toString() || "",
        deadline: saving.deadline ? saving.deadline.split("T")[0] : "",
        description: saving.description || "",
        priority: saving.priority || "medium",
        email: saving.email || user?.email || "",
        userId: userId,
      });
      setIsEditModalOpen(true);
    },
    [user, getUserId],
  );

  const openContributeModal = useCallback((saving) => {
    setSelectedSavings(saving);
    setContributionData({ amount: "", note: "" });
    setIsContributeModalOpen(true);
  }, []);

  // ============================================================
  // HELPERS
  // ============================================================
  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat("rw-RW", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  }, []);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "No deadline";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  }, []);

  const getPriorityBadge = useCallback((priority) => {
    const level =
      PRIORITY_LEVELS.find((p) => p.value === priority) || PRIORITY_LEVELS[1];
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${level.color}`}
      >
        {level.label}
      </span>
    );
  }, []);

  const getStatusBadge = useCallback((isCompleted, progress) => {
    if (isCompleted) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center gap-1">
          <CheckCircleIcon className="w-3 h-3" />
          Completed
        </span>
      );
    }
    if (progress >= 75) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Almost There
        </span>
      );
    }
    if (progress >= 50) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          In Progress
        </span>
      );
    }
    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Just Started
      </span>
    );
  }, []);

  const getDaysRemaining = useCallback((deadline) => {
    if (!deadline) return null;
    const now = new Date();
    const end = new Date(deadline);
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    if (diff < 0) return "Overdue";
    if (diff === 0) return "Today";
    return `${diff} days left`;
  }, []);

  // ============================================================
  // EXPORT FUNCTIONS
  // ============================================================
  const groupByMonth = useCallback((data) => {
    const grouped = {};
    data.forEach((item) => {
      if (item.deadline) {
        const date = new Date(item.deadline);
        const monthYear = date.toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
        if (!grouped[monthYear]) {
          grouped[monthYear] = [];
        }
        grouped[monthYear].push(item);
      } else {
        if (!grouped["No Deadline"]) {
          grouped["No Deadline"] = [];
        }
        grouped["No Deadline"].push(item);
      }
    });
    return grouped;
  }, []);

  const groupByWeek = useCallback((data) => {
    const grouped = {};
    data.forEach((item) => {
      if (item.deadline) {
        const date = new Date(item.deadline);
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        const weekKey = `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;
        if (!grouped[weekKey]) {
          grouped[weekKey] = [];
        }
        grouped[weekKey].push(item);
      } else {
        if (!grouped["No Deadline"]) {
          grouped["No Deadline"] = [];
        }
        grouped["No Deadline"].push(item);
      }
    });
    return grouped;
  }, []);

  const exportToPDF = useCallback(() => {
    if (filteredSavings.length === 0) {
      toast.warning("No savings data to export");
      return;
    }

    const doc = new jsPDF("landscape", "pt", "a4");

    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text("Savings Report", 40, 50);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 40, 70);

    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text("Summary", 40, 95);

    const summaryData = [
      ["Total Goals", stats.totalGoals.toString()],
      ["Total Target Amount", formatCurrency(stats.totalTarget)],
      ["Total Current Amount", formatCurrency(stats.totalCurrent)],
      ["Overall Progress", `${stats.overallProgress.toFixed(1)}%`],
      ["Completed Goals", stats.completedCount.toString()],
      ["In Progress Goals", stats.inProgressCount.toString()],
      ["Total Income", formatCurrency(totalIncome)],
    ];

    doc.autoTable({
      startY: 100,
      head: [["Metric", "Value"]],
      body: summaryData,
      theme: "striped",
      headStyles: { fillColor: [128, 90, 213] },
      styles: { fontSize: 10 },
      margin: { left: 40, right: 40 },
    });

    const tableY = doc.previousAutoTable.finalY + 20;
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text("Savings Goals", 40, tableY);

    const tableData = filteredSavings.map((s) => [
      s.category || "",
      formatCurrency(s.targetAmount || 0),
      formatCurrency(s.currentAmount || 0),
      `${(s.progress || 0).toFixed(1)}%`,
      s.priority || "medium",
      s.deadline ? formatDate(s.deadline) : "No deadline",
      s.isCompleted ? "Completed" : "In Progress",
    ]);

    doc.autoTable({
      startY: tableY + 10,
      head: [
        [
          "Category",
          "Target",
          "Current",
          "Progress",
          "Priority",
          "Deadline",
          "Status",
        ],
      ],
      body: tableData,
      theme: "striped",
      headStyles: { fillColor: [128, 90, 213] },
      styles: { fontSize: 8 },
      margin: { left: 40, right: 40 },
    });

    doc.save(`savings-report-${new Date().toISOString().split("T")[0]}.pdf`);
    toast.success("PDF exported successfully!");
  }, [filteredSavings, stats, totalIncome, formatCurrency, formatDate]);

  const exportToCSV = useCallback(() => {
    if (filteredSavings.length === 0) {
      toast.warning("No savings data to export");
      return;
    }

    const headers = [
      "Category",
      "Target Amount (RWF)",
      "Current Amount (RWF)",
      "Progress",
      "Priority",
      "Deadline",
      "Status",
    ];
    const rows = filteredSavings.map((s) => [
      s.category || "",
      s.targetAmount || 0,
      s.currentAmount || 0,
      `${s.progress?.toFixed(1) || 0}%`,
      s.priority || "medium",
      s.deadline ? formatDate(s.deadline) : "No deadline",
      s.isCompleted ? "Completed" : "In Progress",
    ]);

    let csv = headers.join(",") + "\n";
    rows.forEach((row) => {
      csv += row.join(",") + "\n";
    });

    csv += "\nSummary\n";
    csv += `Total Goals,${stats.totalGoals}\n`;
    csv += `Total Target Amount (RWF),${stats.totalTarget}\n`;
    csv += `Total Current Amount (RWF),${stats.totalCurrent}\n`;
    csv += `Overall Progress,${stats.overallProgress.toFixed(1)}%\n`;
    csv += `Completed Goals,${stats.completedCount}\n`;
    csv += `In Progress Goals,${stats.inProgressCount}\n`;
    csv += `Total Income (RWF),${totalIncome}\n`;

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `savings-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("CSV exported successfully!");
  }, [filteredSavings, stats, totalIncome, formatDate]);

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
              <SavingsIcon className="text-purple-500" />
              Savings Management
            </h2>
            <p className="text-gray-600 mt-1">
              Track and manage your savings goals
            </p>
            {user?.email && (
              <p className="text-sm text-gray-500 mt-1">
                <PersonIcon className="w-4 h-4 inline mr-1" />
                User: {user.email}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            <button
              onClick={() => {
                isFirstLoadRef.current = false;
                loadSavings();
                loadIncomes();
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
            >
              <RefreshIcon className="w-5 h-5" />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              <AddIcon className="w-5 h-5" />
              <span>Add Goal</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-500">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-xs font-bold text-green-600">
              {stats.completedCount}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-500">
            <p className="text-sm text-gray-500">In Progress</p>
            <p className="text-xs font-bold text-blue-600">
              {stats.inProgressCount}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-orange-500">
            <p className="text-sm text-gray-500">Progress</p>
            <p className="text-xs font-bold text-orange-600">
              {stats.overallProgress.toFixed(1)}%
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-emerald-500">
            <p className="text-sm text-gray-500">Saved</p>
            <p className="text-xs font-bold text-emerald-600">
              {formatCurrency(stats.totalCurrent)}
            </p>
          </div>
        </div>

        {/* Total Income Card */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Total Income</p>
              <p className="text-2xl font-bold">{formatCurrency(totalIncome)}</p>
              <p className="text-xs opacity-70 mt-1">
                All time income from all sources
              </p>
            </div>
            <MonetizationOnIcon className="w-16 h-16 opacity-30" />
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search your savings goals..."
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
                {SAVINGS_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="all">All Priorities</option>
                {PRIORITY_LEVELS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="all">All Status</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterCategory("all");
                  setFilterPriority("all");
                  setFilterStatus("all");
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Savings Cards Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your savings goals...</p>
            </div>
          </div>
        ) : filteredSavings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <SavingsIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No savings goals found</p>
            <p className="text-gray-400 text-sm mt-1">
              {searchTerm ||
              filterCategory !== "all" ||
              filterPriority !== "all" ||
              filterStatus !== "all"
                ? "Try adjusting your filters"
                : "Start by adding your first savings goal"}
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
            >
              <AddIcon className="w-5 h-5 inline mr-2" />
              Add Your First Goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {filteredSavings.map((saving) => (
              <SavingsCard
                key={saving._id}
                saving={saving}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                getPriorityBadge={getPriorityBadge}
                getStatusBadge={getStatusBadge}
                getDaysRemaining={getDaysRemaining}
                openEditModal={openEditModal}
                openContributeModal={openContributeModal}
                setSelectedSavings={setSelectedSavings}
                setIsDeleteModalOpen={setIsDeleteModalOpen}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Savings Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetForm();
        }}
        title="Add Savings Goal"
      >
        <SavingsForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleAddSavings}
          submitLabel="Create Goal"
          isSubmitting={isSubmitting}
          categories={SAVINGS_CATEGORIES}
          priorityLevels={PRIORITY_LEVELS}
          onCancel={() => {
            setIsAddModalOpen(false);
            resetForm();
          }}
        />
      </Modal>

      {/* Edit Savings Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          resetForm();
        }}
        title="Edit Savings Goal"
      >
        <SavingsForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleEditSavings}
          submitLabel="Update Goal"
          isSubmitting={isSubmitting}
          categories={SAVINGS_CATEGORIES}
          priorityLevels={PRIORITY_LEVELS}
          onCancel={() => {
            setIsEditModalOpen(false);
            resetForm();
          }}
        />
      </Modal>

      {/* Contribute Modal */}
      <Modal
        isOpen={isContributeModalOpen}
        onClose={() => {
          setIsContributeModalOpen(false);
          setSelectedSavings(null);
          setContributionData({ amount: "", note: "" });
        }}
        title="Contribute to Savings"
        size="sm"
      >
        <ContributionForm
          selectedSavings={selectedSavings}
          contributionData={contributionData}
          setContributionData={setContributionData}
          onSubmit={handleContribute}
          isSubmitting={isSubmitting}
          formatCurrency={formatCurrency}
          onCancel={() => {
            setIsContributeModalOpen(false);
            setSelectedSavings(null);
            setContributionData({ amount: "", note: "" });
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedSavings(null);
        }}
        onConfirm={handleDeleteSavings}
        title="Delete Savings Goal"
        message={`Are you sure you want to delete this savings goal?\n\n"${selectedSavings?.category || "N/A"}"\nTarget: ${formatCurrency(selectedSavings?.targetAmount || 0)}`}
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