/* eslint-disable react-refresh/only-export-components */
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
// import { Dashboard } from "./components/dashboard/admin/Dashboard";
// import { UserDashboard } from "./components/dashboard/user/UserDashboard";
// import { ExpensesDashboard } from "./components/dashboard/admin/components/expenses/ExpensesManagement";

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

// // Sidebar Component
// const Sidebar = ({ user, onLogout, isOpen, onToggle, location }) => {
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
//       id: "reports",
//       label: "Reports",
//       icon: <BarChartIcon />,
//       path: "/dashboard/reports",
//     },
//     {
//       id: "settings",
//       label: "Settings",
//       icon: <SettingsIcon />,
//       path: "/dashboard/settings",
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
//       id: "reports",
//       label: "Reports",
//       icon: <BarChartIcon />,
//       path: "/user/reports",
//     },
//     {
//       id: "settings",
//       label: "Settings",
//       icon: <SettingsIcon />,
//       path: "/user/settings",
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
//       {/* Mobile Menu Button */}
//       <button
//         onClick={onToggle}
//         className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
//       >
//         {isOpen ? <CloseIcon /> : <MenuIcon />}
//       </button>

//       {/* Sidebar */}
//       <div
//         className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-40 transform transition-transform duration-300 ${
//           isOpen ? "translate-x-0" : "-translate-x-full"
//         } lg:translate-x-0`}
//       >
//         <div className="flex flex-col h-full">
//           {/* Brand */}
//           <div className="p-6 border-b border-gray-200">
//             <div className="flex items-center space-x-3">
//               <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl">
//                 <SavingsIcon className="w-8 h-8 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold text-gray-800">HEMS</h1>
//                 <p className="text-xs text-gray-500">
//                   {isAdmin ? "Admin Panel" : "User Panel"}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* User Info */}
//           <div className="p-4 border-b border-gray-200 bg-gray-50">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
//                 <PersonIcon className="text-white" />
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
//           <nav className="flex-1 p-4 overflow-y-auto">
//             {menuItems.map((item) => (
//               <button
//                 key={item.id}
//                 onClick={() => handleNavigation(item.path)}
//                 className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 mb-1 ${
//                   location.pathname === item.path
//                     ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
//                     : "text-gray-600 hover:bg-gray-100"
//                 }`}
//               >
//                 <span className="w-5 h-5">{item.icon}</span>
//                 <span className="font-medium">{item.label}</span>
//               </button>
//             ))}
//           </nav>

//           {/* Bottom Actions */}
//           <div className="p-4 border-t border-gray-200">
//             <button
//               onClick={() => {
//                 onLogout();
//                 onToggle();
//               }}
//               className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
//             >
//               <LogoutIcon />
//               <span className="font-medium">Logout</span>
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
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem("authToken");
//     const userData = JSON.parse(localStorage.getItem("userData") || "null");

//     if (!token || !userData) {
//       navigate("/");
//       return;
//     }

//     setUser(userData);

//     const handleResize = () => {
//       if (window.innerWidth >= 1024) {
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
//       />

//       {/* Main Content */}
//       <div
//         className={`transition-all duration-300 ${isSidebarOpen ? "lg:ml-64" : "ml-0"}`}
//       >
//         <div className="p-4 md:p-8">{children}</div>
//       </div>
//     </div>
//   );
// };

// // Login handler for Front component
// export const handleLogin = (email, password) => {
//   // Check against demo users
//   if (email === DEMO_USERS.admin.email && password === DEMO_USERS.admin.password) {
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
//       name: email.split('@')[0] || "User",
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

//             <Route
//         path="/dashboard"
//         element={
//           <ProtectedRoute allowedRoles={["admin"]}>
//             <DashboardLayout>
//               <ExpensesDashboard />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />

//       {/* User Dashboard Routes with Sidebar */}
//       <Route
//         path="/user/dashboard"
//         element={
//           <ProtectedRoute allowedRoles={["user", "admin"]}>
//             <DashboardLayout>
//               <UserDashboard />
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
import { Dashboard } from "./components/dashboard/admin/Dashboard";
import { UserDashboard } from "./components/dashboard/user/UserDashboard";
import { ExpensesDashboard } from "./components/dashboard/admin/components/expenses/ExpensesManagement";
import { ReportDashboard } from "./components/dashboard/admin/components/report/ReportManagement";
import { UserManagement } from "./components/dashboard/admin/components/user/UserManagement";

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

// Sidebar Component
const Sidebar = ({ user, onLogout, isOpen, onToggle, location }) => {
  const navigate = useNavigate();

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
      id: "reports",
      label: "Reports",
      icon: <BarChartIcon />,
      path: "/dashboard/reports",
    },
    {
      id: "settings",
      label: "Settings",
      icon: <SettingsIcon />,
      path: "/dashboard/settings",
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
    {
      id: "reports",
      label: "Reports",
      icon: <BarChartIcon />,
      path: "/user/reports",
    },
    {
      id: "settings",
      label: "Settings",
      icon: <SettingsIcon />,
      path: "/user/settings",
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
          <div className="p-3 sm:p-4 border-t border-gray-200">
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
        // 2xl
        setIsSidebarOpen(true);
      } else if (width >= 1280) {
        // xl
        setIsSidebarOpen(true);
      } else if (width >= 1024) {
        // lg
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
      />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64 xl:ml-72 2xl:ml-80" : "ml-0"
        }`}
      >
        <div className="p-3 sm:p-4 md:p-6 lg:p-8">{children}</div>
      </div>
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
              <UserManagement/>
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
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <DashboardLayout>
              <UserDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/expenses"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <DashboardLayout>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  My Expenses
                </h2>
                <p className="text-gray-600">
                  User expense management features coming soon...
                </p>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/income"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <DashboardLayout>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  My Income
                </h2>
                <p className="text-gray-600">
                  User income management features coming soon...
                </p>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/reports"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <DashboardLayout>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Reports
                </h2>
                <p className="text-gray-600">
                  User report features coming soon...
                </p>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/settings"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <DashboardLayout>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Settings
                </h2>
                <p className="text-gray-600">
                  User settings features coming soon...
                </p>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
