
// /* eslint-disable react-hooks/set-state-in-effect */
// /* eslint-disable no-unused-vars */
// import React, { useState, useEffect, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { toast } from "react-toastify";
// import axios from "axios";

// // Material Icons
// import PersonAddIcon from "@mui/icons-material/PersonAdd";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import CloseIcon from "@mui/icons-material/Close";
// import SearchIcon from "@mui/icons-material/Search";
// import FilterListIcon from "@mui/icons-material/FilterList";
// import RefreshIcon from "@mui/icons-material/Refresh";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import CancelIcon from "@mui/icons-material/Cancel";
// import EmailIcon from "@mui/icons-material/Email";
// import PhoneIcon from "@mui/icons-material/Phone";
// import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
// import { Person } from "@mui/icons-material";
// import LockIcon from "@mui/icons-material/Lock";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// import SaveIcon from "@mui/icons-material/Save";

// // Fallback data (only used if API completely fails)
// const FALLBACK_USERS = [
//   {
//     id: 1,
//     name: "John Johnson",
//     email: "john@example.com",
//     phone: "+1 (555) 123-4567",
//     role: "admin",
//     status: "active",
//     createdAt: "2024-01-15T10:00:00",
//     lastLogin: "2026-07-22T14:30:00",
//   },
//   {
//     id: 2,
//     name: "Jane Johnson",
//     email: "jane@example.com",
//     phone: "+1 (555) 987-6543",
//     role: "user",
//     status: "active",
//     createdAt: "2024-01-20T09:30:00",
//     lastLogin: "2026-07-21T11:20:00",
//   },
//   {
//     id: 3,
//     name: "Michael Johnson",
//     email: "michael@example.com",
//     phone: "+1 (555) 456-7890",
//     role: "user",
//     status: "inactive",
//     createdAt: "2024-02-01T08:15:00",
//     lastLogin: "2026-07-19T16:45:00",
//   },
//   {
//     id: 4,
//     name: "Sarah Johnson",
//     email: "sarah@example.com",
//     phone: "+1 (555) 789-0123",
//     role: "user",
//     status: "active",
//     createdAt: "2024-02-15T11:00:00",
//     lastLogin: "2026-07-20T09:10:00",
//   },
//   {
//     id: 5,
//     name: "David Johnson",
//     email: "david@example.com",
//     phone: "+1 (555) 321-0987",
//     role: "user",
//     status: "pending",
//     createdAt: "2026-07-10T13:45:00",
//     lastLogin: "2026-07-22T08:00:00",
//   },
// ];

// // API Configuration
// const getApiConfig = () => {
//   const env = typeof window !== "undefined" ? window._env_ || {} : {};
//   return {
//     apiBaseUrl:
//       env.REACT_APP_API_URL ||
//       "https://household-expenses-management-system.onrender.com/api",
//   };
// };

// // Status Badge Component - FIXED with null/undefined check
// const StatusBadge = ({ status }) => {
//   // Guard against undefined or null status
//   const safeStatus = status || "pending";

//   const statusConfig = {
//     active: {
//       color: "bg-green-100 text-green-800",
//       icon: <CheckCircleIcon className="w-3 h-3" />,
//     },
//     inactive: {
//       color: "bg-red-100 text-red-800",
//       icon: <CancelIcon className="w-3 h-3" />,
//     },
//     pending: {
//       color: "bg-yellow-100 text-yellow-800",
//       icon: <Person className="w-3 h-3" />,
//     },
//   };

//   const config = statusConfig[safeStatus] || statusConfig.pending;

//   return (
//     <span
//       className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}
//     >
//       {config.icon}
//       {safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)}
//     </span>
//   );
// };

// // Role Badge Component - FIXED with null/undefined check
// const RoleBadge = ({ role }) => {
//   const safeRole = role || "user";

//   const roleConfig = {
//     admin: {
//       color: "bg-purple-100 text-purple-800",
//       icon: <AdminPanelSettingsIcon className="w-3 h-3" />,
//     },
//     user: {
//       color: "bg-blue-100 text-blue-800",
//       icon: <Person className="w-3 h-3" />,
//     },
//   };

//   const config = roleConfig[safeRole] || roleConfig.user;

//   return (
//     <span
//       className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}
//     >
//       {config.icon}
//       {safeRole.charAt(0).toUpperCase() + safeRole.slice(1)}
//     </span>
//   );
// };

// // User Form Modal (unchanged, but ensure it uses the correct API)
// const UserFormModal = ({ isOpen, onClose, user, onSave, isEditing }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     role: "user",
//     status: "active",
//     password: "",
//     confirmPassword: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   useEffect(() => {
//     if (user) {
//       setFormData({
//         name: user.name || "",
//         email: user.email || "",
//         phone: user.phone || "",
//         role: user.role || "user",
//         status: user.status || "active",
//         password: "",
//         confirmPassword: "",
//       });
//     } else {
//       setFormData({
//         name: "",
//         email: "",
//         phone: "",
//         role: "user",
//         status: "active",
//         password: "",
//         confirmPassword: "",
//       });
//     }
//     setErrors({});
//   }, [user, isOpen]);

//   const validate = () => {
//     const newErrors = {};

//     if (!formData.name.trim()) {
//       newErrors.name = "Full name is required";
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = "Invalid email format";
//     }

//     if (!formData.phone.trim()) {
//       newErrors.phone = "Phone number is required";
//     } else if (formData.phone.replace(/\D/g, "").length < 10) {
//       newErrors.phone = "Invalid phone number";
//     }

//     if (!isEditing) {
//       if (!formData.password) {
//         newErrors.password = "Password is required";
//       } else if (formData.password.length < 6) {
//         newErrors.password = "Password must be at least 6 characters";
//       }

//       if (!formData.confirmPassword) {
//         newErrors.confirmPassword = "Please confirm password";
//       } else if (formData.confirmPassword !== formData.password) {
//         newErrors.confirmPassword = "Passwords do not match";
//       }
//     }

//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const validationErrors = validate();

//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       toast.error("Please fix the errors before continuing");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const submitData = { ...formData };
//       if (isEditing) {
//         delete submitData.password;
//         delete submitData.confirmPassword;
//       }

//       await onSave(submitData);
//       onClose();
//     } catch (error) {
//       console.error("Error saving user:", error);
//       toast.error("Failed to save user. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
//           onClick={(e) => {
//             if (e.target === e.currentTarget && !isSubmitting) {
//               onClose();
//             }
//           }}
//         >
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0, y: 20 }}
//             animate={{ scale: 1, opacity: 1, y: 0 }}
//             exit={{ scale: 0.9, opacity: 0, y: 20 }}
//             className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
//           >
//             <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-200 rounded-t-3xl">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   {isEditing ? (
//                     <EditIcon className="text-blue-600" />
//                   ) : (
//                     <PersonAddIcon className="text-green-600" />
//                   )}
//                   <h2 className="text-xl font-bold text-gray-800">
//                     {isEditing ? "Edit User" : "Add New User"}
//                   </h2>
//                 </div>
//                 <button
//                   onClick={onClose}
//                   disabled={isSubmitting}
//                   className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
//                 >
//                   <CloseIcon className="w-6 h-6 text-gray-500" />
//                 </button>
//               </div>
//             </div>

//             <form onSubmit={handleSubmit} className="p-6 space-y-4">
//               {/* Name */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Full Name *
//                 </label>
//                 <div className="relative">
//                   <Person className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                   <input
//                     type="text"
//                     value={formData.name}
//                     onChange={(e) => {
//                       setFormData({ ...formData, name: e.target.value });
//                       setErrors({ ...errors, name: undefined });
//                     }}
//                     className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
//                       errors.name
//                         ? "border-red-400 focus:ring-red-400"
//                         : "border-gray-300 focus:ring-purple-500"
//                     }`}
//                     placeholder="John Doe"
//                     disabled={isSubmitting}
//                   />
//                 </div>
//                 {errors.name && (
//                   <p className="text-xs text-red-500 mt-1">{errors.name}</p>
//                 )}
//               </div>

//               {/* Email */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Email Address *
//                 </label>
//                 <div className="relative">
//                   <EmailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                   <input
//                     type="email"
//                     value={formData.email}
//                     onChange={(e) => {
//                       setFormData({ ...formData, email: e.target.value });
//                       setErrors({ ...errors, email: undefined });
//                     }}
//                     className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
//                       errors.email
//                         ? "border-red-400 focus:ring-red-400"
//                         : "border-gray-300 focus:ring-purple-500"
//                     }`}
//                     placeholder="john@example.com"
//                     disabled={isSubmitting}
//                   />
//                 </div>
//                 {errors.email && (
//                   <p className="text-xs text-red-500 mt-1">{errors.email}</p>
//                 )}
//               </div>

//               {/* Phone */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Phone Number *
//                 </label>
//                 <div className="relative">
//                   <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                   <input
//                     type="tel"
//                     value={formData.phone}
//                     onChange={(e) => {
//                       setFormData({ ...formData, phone: e.target.value });
//                       setErrors({ ...errors, phone: undefined });
//                     }}
//                     className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
//                       errors.phone
//                         ? "border-red-400 focus:ring-red-400"
//                         : "border-gray-300 focus:ring-purple-500"
//                     }`}
//                     placeholder="+1 (555) 000-0000"
//                     disabled={isSubmitting}
//                   />
//                 </div>
//                 {errors.phone && (
//                   <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
//                 )}
//               </div>

//               {/* Role */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Role
//                 </label>
//                 <select
//                   value={formData.role}
//                   onChange={(e) =>
//                     setFormData({ ...formData, role: e.target.value })
//                   }
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//                   disabled={isSubmitting}
//                 >
//                   <option value="user">User</option>
//                   <option value="admin">Admin</option>
//                 </select>
//               </div>

//               {/* Status */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Status
//                 </label>
//                 <select
//                   value={formData.status}
//                   onChange={(e) =>
//                     setFormData({ ...formData, status: e.target.value })
//                   }
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//                   disabled={isSubmitting}
//                 >
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                   <option value="pending">Pending</option>
//                 </select>
//               </div>

//               {/* Password fields - only for new users */}
//               {!isEditing && (
//                 <>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Password *
//                     </label>
//                     <div className="relative">
//                       <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                       <input
//                         type={showPassword ? "text" : "password"}
//                         value={formData.password}
//                         onChange={(e) => {
//                           setFormData({
//                             ...formData,
//                             password: e.target.value,
//                           });
//                           setErrors({ ...errors, password: undefined });
//                         }}
//                         className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
//                           errors.password
//                             ? "border-red-400 focus:ring-red-400"
//                             : "border-gray-300 focus:ring-purple-500"
//                         }`}
//                         placeholder="••••••••"
//                         disabled={isSubmitting}
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                       >
//                         {showPassword ? (
//                           <VisibilityOffIcon className="w-5 h-5" />
//                         ) : (
//                           <VisibilityIcon className="w-5 h-5" />
//                         )}
//                       </button>
//                     </div>
//                     {errors.password && (
//                       <p className="text-xs text-red-500 mt-1">
//                         {errors.password}
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Confirm Password *
//                     </label>
//                     <div className="relative">
//                       <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                       <input
//                         type={showConfirmPassword ? "text" : "password"}
//                         value={formData.confirmPassword}
//                         onChange={(e) => {
//                           setFormData({
//                             ...formData,
//                             confirmPassword: e.target.value,
//                           });
//                           setErrors({ ...errors, confirmPassword: undefined });
//                         }}
//                         className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
//                           errors.confirmPassword
//                             ? "border-red-400 focus:ring-red-400"
//                             : "border-gray-300 focus:ring-purple-500"
//                         }`}
//                         placeholder="••••••••"
//                         disabled={isSubmitting}
//                       />
//                       <button
//                         type="button"
//                         onClick={() =>
//                           setShowConfirmPassword(!showConfirmPassword)
//                         }
//                         className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                       >
//                         {showConfirmPassword ? (
//                           <VisibilityOffIcon className="w-5 h-5" />
//                         ) : (
//                           <VisibilityIcon className="w-5 h-5" />
//                         )}
//                       </button>
//                     </div>
//                     {errors.confirmPassword && (
//                       <p className="text-xs text-red-500 mt-1">
//                         {errors.confirmPassword}
//                       </p>
//                     )}
//                   </div>
//                 </>
//               )}

//               {/* Actions */}
//               <div className="flex gap-3 pt-4">
//                 <button
//                   type="button"
//                   onClick={onClose}
//                   disabled={isSubmitting}
//                   className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                       <span>Saving...</span>
//                     </>
//                   ) : (
//                     <>
//                       <SaveIcon className="w-5 h-5" />
//                       <span>{isEditing ? "Update User" : "Create User"}</span>
//                     </>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// // Confirmation Modal
// const ConfirmModal = ({
//   isOpen,
//   onClose,
//   onConfirm,
//   title,
//   message,
//   confirmText = "Confirm",
//   cancelText = "Cancel",
//   isDanger = false,
// }) => {
//   if (!isOpen) return null;

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
//           onClick={(e) => {
//             if (e.target === e.currentTarget) {
//               onClose();
//             }
//           }}
//         >
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0, y: 20 }}
//             animate={{ scale: 1, opacity: 1, y: 0 }}
//             exit={{ scale: 0.9, opacity: 0, y: 20 }}
//             className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6"
//           >
//             <div className="text-center">
//               <div
//                 className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
//                   isDanger ? "bg-red-100" : "bg-yellow-100"
//                 }`}
//               >
//                 {isDanger ? (
//                   <DeleteIcon className="w-8 h-8 text-red-600" />
//                 ) : (
//                   <WarningIcon className="w-8 h-8 text-yellow-600" />
//                 )}
//               </div>
//               <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
//               <p className="text-gray-600 text-sm">{message}</p>
//             </div>

//             <div className="flex gap-3 mt-6">
//               <button
//                 onClick={onClose}
//                 className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
//               >
//                 {cancelText}
//               </button>
//               <button
//                 onClick={onConfirm}
//                 className={`flex-1 px-4 py-3 rounded-xl text-white transition-all ${
//                   isDanger
//                     ? "bg-red-600 hover:bg-red-700"
//                     : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:shadow-lg"
//                 }`}
//               >
//                 {confirmText}
//               </button>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// // Warning Icon component
// const WarningIcon = ({ className }) => (
//   <svg
//     className={className}
//     fill="none"
//     stroke="currentColor"
//     viewBox="0 0 24 24"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth="2"
//       d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
//     />
//   </svg>
// );

// // Main User Management Component - UPDATED to use real API
// export const UserManagement = () => {
//   const [users, setUsers] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [roleFilter, setRoleFilter] = useState("all");
//   const [statusFilter, setStatusFilter] = useState("all");

//   // Modal states
//   const [isFormModalOpen, setIsFormModalOpen] = useState(false);
//   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [actionType, setActionType] = useState("delete");

//   const apiConfig = getApiConfig();
//   const { apiBaseUrl } = apiConfig;

//   // Fetch users from actual API
//   const fetchUsers = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       const token = localStorage.getItem("authToken");

//       if (!token) {
//         toast.warning("Please log in to view users");
//         setUsers(FALLBACK_USERS);
//         setIsLoading(false);
//         return;
//       }

//       // Use the actual API endpoint: GET /api/users
//       const response = await axios.get(`${apiBaseUrl}/users`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       // Handle different response formats
//       let userData = [];
//       if (response.data) {
//         if (Array.isArray(response.data)) {
//           userData = response.data;
//         } else if (response.data.data && Array.isArray(response.data.data)) {
//           userData = response.data.data;
//         } else if (response.data.users && Array.isArray(response.data.users)) {
//           userData = response.data.users;
//         } else {
//           // If response is a single object, wrap it in an array
//           userData = [response.data];
//         }
//       }

//       if (userData.length > 0) {
//         setUsers(userData);
//         toast.success(`Loaded ${userData.length} users`);
//       } else {
//         // If no users returned, use fallback
//         setUsers(FALLBACK_USERS);
//         toast.info("No users found, showing sample data");
//       }
//     } catch (error) {
//       console.error("Error fetching users:", error);

//       // More detailed error logging
//       if (error.response) {
//         console.error("Response status:", error.response.status);
//         console.error("Response data:", error.response.data);
//         toast.error(`Server error: ${error.response.status}`);
//       } else if (error.request) {
//         console.error("No response received");
//         toast.error("No response from server");
//       } else {
//         toast.error("Failed to fetch users");
//       }

//       // Use fallback data on error
//       setUsers(FALLBACK_USERS);
//       toast.warning("Using sample data");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [apiBaseUrl]);

//   useEffect(() => {
//     fetchUsers();
//   }, [fetchUsers]);

//   // Filter users
//   const getFilteredUsers = () => {
//     let filtered = users;

//     if (searchTerm.trim()) {
//       const term = searchTerm.toLowerCase();
//       filtered = filtered.filter(
//         (user) =>
//           (user.name && user.name.toLowerCase().includes(term)) ||
//           (user.email && user.email.toLowerCase().includes(term)) ||
//           (user.phone && user.phone.includes(term)),
//       );
//     }

//     if (roleFilter !== "all") {
//       filtered = filtered.filter((user) => user.role === roleFilter);
//     }

//     if (statusFilter !== "all") {
//       filtered = filtered.filter((user) => user.status === statusFilter);
//     }

//     return filtered;
//   };

//   // CRUD Operations using actual API
//   const handleCreateUser = async (userData) => {
//     try {
//       const token = localStorage.getItem("authToken");

//       // Use POST /api/users/register
//       const response = await axios.post(
//         `${apiBaseUrl}/users/register`,
//         userData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         },
//       );

//       const newUser = response.data.user || response.data;
//       setUsers((prev) => [newUser, ...prev]);
//       toast.success("User created successfully!");

//       // Refresh the list to get updated data
//       await fetchUsers();
//     } catch (error) {
//       console.error("Error creating user:", error);
//       if (error.response) {
//         toast.error(error.response.data.message || "Failed to create user");
//       } else {
//         toast.error("Failed to create user");
//       }
//       throw error;
//     }
//   };

//   const handleUpdateUser = async (userData) => {
//     try {
//       const token = localStorage.getItem("authToken");

//       // Use PUT /api/users/:id
//       const response = await axios.put(
//         `${apiBaseUrl}/users/${selectedUser.id}`,
//         userData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         },
//       );

//       const updatedUser = response.data.user || response.data;
//       setUsers((prev) =>
//         prev.map((user) =>
//           user.id === selectedUser.id ? { ...user, ...updatedUser } : user,
//         ),
//       );
//       toast.success("User updated successfully!");

//       // Refresh the list to get updated data
//       await fetchUsers();
//     } catch (error) {
//       console.error("Error updating user:", error);
//       if (error.response) {
//         toast.error(error.response.data.message || "Failed to update user");
//       } else {
//         toast.error("Failed to update user");
//       }
//       throw error;
//     }
//   };

//   const handleDeleteUser = async () => {
//     try {
//       const token = localStorage.getItem("authToken");

//       // Use DELETE /api/users/:id
//       await axios.delete(`${apiBaseUrl}/users/${selectedUser.id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       setUsers((prev) => prev.filter((user) => user.id !== selectedUser.id));
//       toast.success("User deleted successfully!");
//       setIsConfirmModalOpen(false);

//       // Refresh the list to get updated data
//       await fetchUsers();
//     } catch (error) {
//       console.error("Error deleting user:", error);
//       if (error.response) {
//         toast.error(error.response.data.message || "Failed to delete user");
//       } else {
//         toast.error("Failed to delete user");
//       }
//       setIsConfirmModalOpen(false);
//     }
//   };

//   // Open modals
//   const openCreateModal = () => {
//     setSelectedUser(null);
//     setIsEditing(false);
//     setIsFormModalOpen(true);
//   };

//   const openEditModal = (user) => {
//     setSelectedUser(user);
//     setIsEditing(true);
//     setIsFormModalOpen(true);
//   };

//   const openDeleteConfirm = (user) => {
//     setSelectedUser(user);
//     setActionType("delete");
//     setIsConfirmModalOpen(true);
//   };

//   const openStatusConfirm = (user) => {
//     setSelectedUser(user);
//     setActionType("status");
//     setIsConfirmModalOpen(true);
//   };

//   const handleStatusToggle = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const newStatus =
//         selectedUser.status === "active" ? "inactive" : "active";

//       // Use PUT /api/users/:id to update status
//       const response = await axios.put(
//         `${apiBaseUrl}/users/${selectedUser.id}`,
//         { status: newStatus },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         },
//       );

//       const updatedUser = response.data.user || response.data;
//       setUsers((prev) =>
//         prev.map((user) =>
//           user.id === selectedUser.id ? { ...user, ...updatedUser } : user,
//         ),
//       );
//       toast.success(
//         `User ${newStatus === "active" ? "activated" : "deactivated"} successfully!`,
//       );
//       setIsConfirmModalOpen(false);

//       // Refresh the list to get updated data
//       await fetchUsers();
//     } catch (error) {
//       console.error("Error toggling status:", error);
//       if (error.response) {
//         toast.error(
//           error.response.data.message || "Failed to update user status",
//         );
//       } else {
//         toast.error("Failed to update user status");
//       }
//       setIsConfirmModalOpen(false);
//     }
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return "Never";
//     try {
//       return new Date(dateString).toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//     } catch {
//       return "Invalid date";
//     }
//   };

//   // Get role counts
//   const getRoleCounts = () => {
//     return {
//       total: users.length,
//       admin: users.filter((u) => u.role === "admin").length,
//       user: users.filter((u) => u.role === "user").length,
//     };
//   };

//   const roleCounts = getRoleCounts();
//   const filteredUsers = getFilteredUsers();

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6 lg:p-8">
//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
//               User Management
//             </h2>
//             <p className="text-gray-600 mt-1">
//               Manage users, roles, and permissions
//             </p>
//           </div>
//           <div className="flex flex-wrap items-center gap-2">
//             <button
//               onClick={fetchUsers}
//               className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
//             >
//               <RefreshIcon className="w-4 h-4" />
//               <span className="text-sm font-medium hidden sm:inline">
//                 Refresh
//               </span>
//             </button>
//             <button
//               onClick={openCreateModal}
//               className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
//             >
//               <PersonAddIcon className="w-4 h-4" />
//               <span className="text-sm font-medium">Add User</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
//         <div className="bg-white rounded-2xl shadow-lg p-4">
//           <p className="text-sm text-gray-500">Total Users</p>
//           <p className="text-2xl font-bold text-gray-800">{roleCounts.total}</p>
//         </div>
//         <div className="bg-white rounded-2xl shadow-lg p-4">
//           <p className="text-sm text-gray-500">Admins</p>
//           <p className="text-2xl font-bold text-purple-600">
//             {roleCounts.admin}
//           </p>
//         </div>
//         <div className="bg-white rounded-2xl shadow-lg p-4">
//           <p className="text-sm text-gray-500">Users</p>
//           <p className="text-2xl font-bold text-blue-600">{roleCounts.user}</p>
//         </div>
//         <div className="bg-white rounded-2xl shadow-lg p-4">
//           <p className="text-sm text-gray-500">Active</p>
//           <p className="text-2xl font-bold text-green-600">
//             {users.filter((u) => u.status === "active").length}
//           </p>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="flex-1 relative">
//             <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search users by name, email, or phone..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//             />
//           </div>
//           <div className="flex gap-2">
//             <select
//               value={roleFilter}
//               onChange={(e) => setRoleFilter(e.target.value)}
//               className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//             >
//               <option value="all">All Roles</option>
//               <option value="admin">Admin</option>
//               <option value="user">User</option>
//             </select>
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//             >
//               <option value="all">All Status</option>
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//               <option value="pending">Pending</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* User Table */}
//       <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//         {isLoading ? (
//           <div className="flex items-center justify-center py-12">
//             <div className="text-center">
//               <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
//               <p className="mt-4 text-gray-600">Loading users...</p>
//             </div>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
//                     User
//                   </th>
//                   <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
//                     Email
//                   </th>
//                   <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
//                     Phone
//                   </th>
//                   <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
//                     Role
//                   </th>
//                   <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
//                     Status
//                   </th>
//                   <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
//                     Last Login
//                   </th>
//                   <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredUsers.length > 0 ? (
//                   filteredUsers.map((user, index) => (
//                     <motion.tr
//                       key={user.id || index}
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: index * 0.05 }}
//                       className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
//                     >
//                       <td className="py-3 px-4">
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
//                             {(user.name || "U").charAt(0).toUpperCase()}
//                           </div>
//                           <span className="font-medium text-gray-800">
//                             {user.name || "Unknown User"}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="py-3 px-4 text-gray-600">
//                         {user.email || "No email"}
//                       </td>
//                       <td className="py-3 px-4 text-gray-600">
//                         {user.phone || "No phone"}
//                       </td>
//                       <td className="py-3 px-4">
//                         <RoleBadge role={user.role} />
//                       </td>
//                       <td className="py-3 px-4">
//                         <StatusBadge status={user.status} />
//                       </td>
//                       <td className="py-3 px-4 text-sm text-gray-500">
//                         {formatDate(user.lastLogin)}
//                       </td>
//                       <td className="py-3 px-4">
//                         <div className="flex items-center justify-center gap-2">
//                           <button
//                             onClick={() => openEditModal(user)}
//                             className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors"
//                             title="Edit User"
//                           >
//                             <EditIcon className="w-5 h-5" />
//                           </button>
//                           <button
//                             onClick={() => openStatusConfirm(user)}
//                             className={`p-1.5 rounded-lg transition-colors ${
//                               user.status === "active"
//                                 ? "hover:bg-yellow-100 text-yellow-600"
//                                 : "hover:bg-green-100 text-green-600"
//                             }`}
//                             title={
//                               user.status === "active"
//                                 ? "Deactivate User"
//                                 : "Activate User"
//                             }
//                           >
//                             {user.status === "active" ? (
//                               <CancelIcon className="w-5 h-5" />
//                             ) : (
//                               <CheckCircleIcon className="w-5 h-5" />
//                             )}
//                           </button>
//                           <button
//                             onClick={() => openDeleteConfirm(user)}
//                             className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
//                             title="Delete User"
//                           >
//                             <DeleteIcon className="w-5 h-5" />
//                           </button>
//                         </div>
//                       </td>
//                     </motion.tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="7" className="py-12 text-center">
//                       <Person className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                       <p className="text-gray-500 font-medium">
//                         No users found
//                       </p>
//                       <p className="text-sm text-gray-400 mt-1">
//                         {searchTerm ||
//                         roleFilter !== "all" ||
//                         statusFilter !== "all"
//                           ? "Try adjusting your filters"
//                           : "Start by adding your first user"}
//                       </p>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* User Form Modal */}
//       <UserFormModal
//         isOpen={isFormModalOpen}
//         onClose={() => {
//           setIsFormModalOpen(false);
//           setSelectedUser(null);
//           setIsEditing(false);
//         }}
//         user={selectedUser}
//         onSave={isEditing ? handleUpdateUser : handleCreateUser}
//         isEditing={isEditing}
//       />

//       {/* Confirmation Modal */}
//       <ConfirmModal
//         isOpen={isConfirmModalOpen}
//         onClose={() => {
//           setIsConfirmModalOpen(false);
//           setSelectedUser(null);
//         }}
//         onConfirm={
//           actionType === "delete" ? handleDeleteUser : handleStatusToggle
//         }
//         title={actionType === "delete" ? "Delete User" : "Change Status"}
//         message={
//           actionType === "delete"
//             ? `Are you sure you want to delete "${selectedUser?.name || "this user"}"? This action cannot be undone.`
//             : `Are you sure you want to ${selectedUser?.status === "active" ? "deactivate" : "activate"} "${selectedUser?.name || "this user"}"?`
//         }
//         confirmText={actionType === "delete" ? "Delete" : "Confirm"}
//         isDanger={actionType === "delete"}
//       />
//     </div>
//   );
// };










/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import axios from "axios";

// Material Icons
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { Person } from "@mui/icons-material";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SaveIcon from "@mui/icons-material/Save";

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
      icon: <CheckCircleIcon className="w-3 h-3" />,
    },
    inactive: {
      color: "bg-red-100 text-red-800",
      icon: <CancelIcon className="w-3 h-3" />,
    },
    pending: {
      color: "bg-yellow-100 text-yellow-800",
      icon: <Person className="w-3 h-3" />,
    },
  };

  const config = statusConfig[safeStatus] || statusConfig.pending;

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}
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
      icon: <AdminPanelSettingsIcon className="w-3 h-3" />,
    },
    user: {
      color: "bg-blue-100 text-blue-800",
      icon: <Person className="w-3 h-3" />,
    },
  };

  const config = roleConfig[safeRole] || roleConfig.user;

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}
    >
      {config.icon}
      {safeRole.charAt(0).toUpperCase() + safeRole.slice(1)}
    </span>
  );
};

// User Form Modal
const UserFormModal = ({ isOpen, onClose, user, onSave, isEditing }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "user",
    status: "active",
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
        role: user.role || "user",
        status: user.status || "active",
        password: "",
        confirmPassword: "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "user",
        status: "active",
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

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (formData.phone.replace(/\D/g, "").length < 10) {
      newErrors.phone = "Invalid phone number";
    }

    if (!isEditing) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm password";
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
      if (isEditing) {
        delete submitData.password;
        delete submitData.confirmPassword;
      }

      await onSave(submitData);
      onClose();
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("Failed to save user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
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
                  {isEditing ? (
                    <EditIcon className="text-blue-600" />
                  ) : (
                    <PersonAddIcon className="text-green-600" />
                  )}
                  <h2 className="text-xl font-bold text-gray-800">
                    {isEditing ? "Edit User" : "Add New User"}
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
                  <Person className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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
                        : "border-gray-300 focus:ring-purple-500"
                    }`}
                    placeholder="John Doe"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <EmailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      setErrors({ ...errors, email: undefined });
                    }}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
                      errors.email
                        ? "border-red-400 focus:ring-red-400"
                        : "border-gray-300 focus:ring-purple-500"
                    }`}
                    placeholder="john@example.com"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
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
                        : "border-gray-300 focus:ring-purple-500"
                    }`}
                    placeholder="+1 (555) 000-0000"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  disabled={isSubmitting}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  disabled={isSubmitting}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              {/* Password fields - only for new users */}
              {!isEditing && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            password: e.target.value,
                          });
                          setErrors({ ...errors, password: undefined });
                        }}
                        className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
                          errors.password
                            ? "border-red-400 focus:ring-red-400"
                            : "border-gray-300 focus:ring-purple-500"
                        }`}
                        placeholder="••••••••"
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
                      <p className="text-xs text-red-500 mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                          });
                          setErrors({ ...errors, confirmPassword: undefined });
                        }}
                        className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
                          errors.confirmPassword
                            ? "border-red-400 focus:ring-red-400"
                            : "border-gray-300 focus:ring-purple-500"
                        }`}
                        placeholder="••••••••"
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
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
                </>
              )}

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
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <SaveIcon className="w-5 h-5" />
                      <span>{isEditing ? "Update User" : "Create User"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Confirmation Modal
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDanger = false,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="text-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  isDanger ? "bg-red-100" : "bg-yellow-100"
                }`}
              >
                {isDanger ? (
                  <DeleteIcon className="w-8 h-8 text-red-600" />
                ) : (
                  <WarningIcon className="w-8 h-8 text-yellow-600" />
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
              <p className="text-gray-600 text-sm">{message}</p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 px-4 py-3 rounded-xl text-white transition-all ${
                  isDanger
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:shadow-lg"
                }`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Warning Icon component
const WarningIcon = ({ className }) => (
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
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);

// Main User Management Component
export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [actionType, setActionType] = useState("delete");

  const apiConfig = getApiConfig();
  const { apiBaseUrl } = apiConfig;

  // Fetch users from actual API
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        toast.warning("Please log in to view users");
        setIsLoading(false);
        return;
      }

      const response = await axios.get(`${apiBaseUrl}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      let userData = [];
      if (response.data) {
        if (Array.isArray(response.data)) {
          userData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          userData = response.data.data;
        } else if (response.data.users && Array.isArray(response.data.users)) {
          userData = response.data.users;
        } else {
          userData = [response.data];
        }
      }

      if (userData.length > 0) {
        setUsers(userData);
        toast.success(`Loaded ${userData.length} users`);
      } else {
        setUsers([]);
        toast.info("No users found");
      }
    } catch (error) {
      console.error("Error fetching users:", error);

      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
        toast.error(`Server error: ${error.response.status}`);
      } else if (error.request) {
        console.error("No response received");
        toast.error("No response from server");
      } else {
        toast.error("Failed to fetch users");
      }

      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filter users
  const getFilteredUsers = () => {
    let filtered = users;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          (user.name && user.name.toLowerCase().includes(term)) ||
          (user.email && user.email.toLowerCase().includes(term)) ||
          (user.phone && user.phone.includes(term)),
      );
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    return filtered;
  };

  // CRUD Operations using actual API
  const handleCreateUser = async (userData) => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.post(
        `${apiBaseUrl}/users/register`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const newUser = response.data.user || response.data;
      setUsers((prev) => [newUser, ...prev]);
      toast.success("User created successfully!");

      await fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error);
      if (error.response) {
        toast.error(error.response.data.message || "Failed to create user");
      } else {
        toast.error("Failed to create user");
      }
      throw error;
    }
  };

  const handleUpdateUser = async (userData) => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.put(
        `${apiBaseUrl}/users/${selectedUser.id}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const updatedUser = response.data.user || response.data;
      setUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUser.id ? { ...user, ...updatedUser } : user,
        ),
      );
      toast.success("User updated successfully!");

      await fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      if (error.response) {
        toast.error(error.response.data.message || "Failed to update user");
      } else {
        toast.error("Failed to update user");
      }
      throw error;
    }
  };

  const handleDeleteUser = async () => {
    try {
      const token = localStorage.getItem("authToken");

      await axios.delete(`${apiBaseUrl}/users/${selectedUser.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setUsers((prev) => prev.filter((user) => user.id !== selectedUser.id));
      toast.success("User deleted successfully!");
      setIsConfirmModalOpen(false);

      await fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      if (error.response) {
        toast.error(error.response.data.message || "Failed to delete user");
      } else {
        toast.error("Failed to delete user");
      }
      setIsConfirmModalOpen(false);
    }
  };

  // Open modals
  const openCreateModal = () => {
    setSelectedUser(null);
    setIsEditing(false);
    setIsFormModalOpen(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setIsEditing(true);
    setIsFormModalOpen(true);
  };

  const openDeleteConfirm = (user) => {
    setSelectedUser(user);
    setActionType("delete");
    setIsConfirmModalOpen(true);
  };

  const openStatusConfirm = (user) => {
    setSelectedUser(user);
    setActionType("status");
    setIsConfirmModalOpen(true);
  };

  const handleStatusToggle = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const newStatus =
        selectedUser.status === "active" ? "inactive" : "active";

      const response = await axios.put(
        `${apiBaseUrl}/users/${selectedUser.id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const updatedUser = response.data.user || response.data;
      setUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUser.id ? { ...user, ...updatedUser } : user,
        ),
      );
      toast.success(
        `User ${newStatus === "active" ? "activated" : "deactivated"} successfully!`,
      );
      setIsConfirmModalOpen(false);

      await fetchUsers();
    } catch (error) {
      console.error("Error toggling status:", error);
      if (error.response) {
        toast.error(
          error.response.data.message || "Failed to update user status",
        );
      } else {
        toast.error("Failed to update user status");
      }
      setIsConfirmModalOpen(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  // Get role counts
  const getRoleCounts = () => {
    return {
      total: users.length,
      admin: users.filter((u) => u.role === "admin").length,
      user: users.filter((u) => u.role === "user").length,
    };
  };

  const roleCounts = getRoleCounts();
  const filteredUsers = getFilteredUsers();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
              User Management
            </h2>
            <p className="text-gray-600 mt-1">
              Manage users, roles, and permissions
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={fetchUsers}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <RefreshIcon className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">
                Refresh
              </span>
            </button>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <PersonAddIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Add User</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-2xl font-bold text-gray-800">{roleCounts.total}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <p className="text-sm text-gray-500">Admins</p>
          <p className="text-2xl font-bold text-purple-600">
            {roleCounts.admin}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <p className="text-sm text-gray-500">Users</p>
          <p className="text-2xl font-bold text-blue-600">{roleCounts.user}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-2xl font-bold text-green-600">
            {users.filter((u) => u.status === "active").length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading users...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    User
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    Phone
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    Role
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    Last Login
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user.id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {(user.name || "U").charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-800">
                            {user.name || "Unknown User"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {user.email || "No email"}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {user.phone || "No phone"}
                      </td>
                      <td className="py-3 px-4">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={user.status} />
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {formatDate(user.lastLogin)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors"
                            title="Edit User"
                          >
                            <EditIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => openStatusConfirm(user)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              user.status === "active"
                                ? "hover:bg-yellow-100 text-yellow-600"
                                : "hover:bg-green-100 text-green-600"
                            }`}
                            title={
                              user.status === "active"
                                ? "Deactivate User"
                                : "Activate User"
                            }
                          >
                            {user.status === "active" ? (
                              <CancelIcon className="w-5 h-5" />
                            ) : (
                              <CheckCircleIcon className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() => openDeleteConfirm(user)}
                            className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                            title="Delete User"
                          >
                            <DeleteIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-12 text-center">
                      <Person className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">
                        No users found
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        {searchTerm ||
                        roleFilter !== "all" ||
                        statusFilter !== "all"
                          ? "Try adjusting your filters"
                          : "Start by adding your first user"}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Form Modal */}
      <UserFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedUser(null);
          setIsEditing(false);
        }}
        user={selectedUser}
        onSave={isEditing ? handleUpdateUser : handleCreateUser}
        isEditing={isEditing}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={
          actionType === "delete" ? handleDeleteUser : handleStatusToggle
        }
        title={actionType === "delete" ? "Delete User" : "Change Status"}
        message={
          actionType === "delete"
            ? `Are you sure you want to delete "${selectedUser?.name || "this user"}"? This action cannot be undone.`
            : `Are you sure you want to ${selectedUser?.status === "active" ? "deactivate" : "activate"} "${selectedUser?.name || "this user"}"?`
        }
        confirmText={actionType === "delete" ? "Delete" : "Confirm"}
        isDanger={actionType === "delete"}
      />
    </div>
  );
};