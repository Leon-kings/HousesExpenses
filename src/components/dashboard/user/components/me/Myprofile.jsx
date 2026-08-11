/* eslint-disable no-dupe-else-if */


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