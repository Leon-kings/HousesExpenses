/* eslint-disable no-unused-vars */
// // Front.jsx
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { motion, AnimatePresence } from "framer-motion";
// // Material Icons
// import EmailIcon from "@mui/icons-material/Email";
// import LockIcon from "@mui/icons-material/Lock";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// import CloseIcon from "@mui/icons-material/Close";
// import PersonIcon from "@mui/icons-material/Person";
// import SendIcon from "@mui/icons-material/Send";
// import HelpIcon from "@mui/icons-material/Help";
// import SavingsIcon from "@mui/icons-material/Savings";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// // Simple email format check used for the "accepted" tick + validation
// const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

// // Password strength scorer — used for the strength meter + gating submit
// const getPasswordStrength = (password) => {
//   if (!password) return { label: "", score: 0 };

//   let score = 0;
//   if (password.length >= 8) score++;
//   if (password.length >= 12) score++;
//   if (/[A-Z]/.test(password)) score++;
//   if (/[a-z]/.test(password)) score++;
//   if (/[0-9]/.test(password)) score++;
//   if (/[^A-Za-z0-9]/.test(password)) score++;

//   if (password.length < 6 || score <= 2) {
//     return { label: "Weak", score, color: "red" };
//   }
//   if (score <= 4) {
//     return { label: "Medium", score, color: "yellow" };
//   }
//   return { label: "Strong", score, color: "green" };
// };

// // Small reusable HEMS logo mark used inside the form cards
// const FormLogo = () => (
//   <div className="flex items-center justify-center space-x-2 mb-6">
//     <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-1.5 rounded-lg">
//       <SavingsIcon className="w-5 h-5 text-white" />
//     </div>
//     <span className="text-lg font-bold text-gray-800 tracking-tight">HEMS</span>
//   </div>
// );

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

// export const Front = () => {
//   const navigate = useNavigate();
//   const [isLoginModalOpen, setIsLoginModalOpen] = useState(true);
//   const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
//   const [isContactModalOpen, setIsContactModalOpen] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showRegisterPassword, setShowRegisterPassword] = useState(false);
//   const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] =
//     useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isRegisterLoading, setIsRegisterLoading] = useState(false);

//   // Login form state
//   const [loginData, setLoginData] = useState({
//     email: "",
//     password: "",
//   });
//   const [loginErrors, setLoginErrors] = useState({});
//   const [loginSubmitted, setLoginSubmitted] = useState(false);

//   // Register form state
//   const [registerData, setRegisterData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [registerErrors, setRegisterErrors] = useState({});
//   const [registerSubmitted, setRegisterSubmitted] = useState(false);

//   // Contact form state
//   const [contactData, setContactData] = useState({
//     name: "",
//     email: "",
//     subject: "",
//     message: "",
//   });
//   const [contactErrors, setContactErrors] = useState({});
//   const [contactSubmitted, setContactSubmitted] = useState(false);

//   // ---- Validity checks (drive the blue "accepted" tick) ----
//   const loginValid = {
//     email: isValidEmail(loginData.email),
//     password: loginData.password.trim().length > 0,
//   };

//   const passwordStrength = getPasswordStrength(registerData.password);
//   const isPasswordWeak =
//     registerData.password.length > 0 && passwordStrength.label === "Weak";

//   const registerValid = {
//     name: registerData.name.trim().length > 0,
//     email: isValidEmail(registerData.email),
//     password: registerData.password.length >= 6 && !isPasswordWeak,
//     confirmPassword:
//       registerData.confirmPassword.length > 0 &&
//       registerData.confirmPassword === registerData.password,
//   };

//   const contactValid = {
//     name: contactData.name.trim().length > 0,
//     email: isValidEmail(contactData.email),
//     subject: contactData.subject.trim().length > 0,
//     message: contactData.message.trim().length > 0,
//   };

//   // ---- Validation -> error message builders ----
//   const validateLogin = () => {
//     const errors = {};
//     if (!loginData.email.trim()) errors.email = "Email is required";
//     else if (!isValidEmail(loginData.email))
//       errors.email = "Enter a valid email address";
//     if (!loginData.password.trim()) errors.password = "Password is required";
//     return errors;
//   };

//   const validateRegister = () => {
//     const errors = {};
//     if (!registerData.name.trim()) errors.name = "Full name is required";
//     if (!registerData.email.trim()) errors.email = "Email is required";
//     else if (!isValidEmail(registerData.email))
//       errors.email = "Enter a valid email address";
//     if (!registerData.password.trim()) errors.password = "Password is required";
//     else if (registerData.password.length < 6)
//       errors.password = "Password must be at least 6 characters";
//     else if (isPasswordWeak)
//       errors.password =
//         "Password is too weak — add length, numbers, or symbols";
//     if (!registerData.confirmPassword.trim())
//       errors.confirmPassword = "Please confirm your password";
//     else if (registerData.confirmPassword !== registerData.password)
//       errors.confirmPassword = "Passwords do not match";
//     return errors;
//   };

//   const validateContact = () => {
//     const errors = {};
//     if (!contactData.name.trim()) errors.name = "Your name is required";
//     if (!contactData.email.trim()) errors.email = "Email is required";
//     else if (!isValidEmail(contactData.email))
//       errors.email = "Enter a valid email address";
//     if (!contactData.subject.trim()) errors.subject = "Subject is required";
//     if (!contactData.message.trim()) errors.message = "Message is required";
//     return errors;
//   };

//   // Check if user is already logged in
//   useEffect(() => {
//     const token = localStorage.getItem("authToken");
//     const userData = JSON.parse(localStorage.getItem("userData") || "null");

//     if (token && userData) {
//       // Redirect based on role
//       if (userData.role === "admin") {
//         navigate("/dashboard");
//       } else {
//         navigate("/user/dashboard");
//       }
//     }
//   }, [navigate]);

//   // Handle login with static credentials
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoginSubmitted(true);
//     const errors = validateLogin();
//     setLoginErrors(errors);
//     if (Object.keys(errors).length > 0) {
//       toast.error("Please fill in all required fields correctly");
//       return;
//     }

//     setIsLoading(true);

//     // Simulate network delay
//     await new Promise(resolve => setTimeout(resolve, 800));

//     try {
//       // Check against demo users
//       if (loginData.email === DEMO_USERS.admin.email &&
//           loginData.password === DEMO_USERS.admin.password) {
//         const userData = {
//           id: DEMO_USERS.admin.id,
//           name: DEMO_USERS.admin.name,
//           email: DEMO_USERS.admin.email,
//           role: DEMO_USERS.admin.role,
//         };

//         localStorage.setItem("authToken", "demo-admin-token-12345");
//         localStorage.setItem("userData", JSON.stringify(userData));

//         toast.success("Welcome Admin!");

//         // Close modals
//         setIsLoginModalOpen(false);
//         setIsRegisterModalOpen(false);
//         setIsContactModalOpen(false);

//         navigate("/dashboard");
//       } else {
//         // For demo purposes, allow any email/password to login as regular user
//         // if password length is at least 4 characters
//         if (loginData.email && loginData.password && loginData.password.length >= 4) {
//           const userData = {
//             id: 2,
//             name: loginData.email.split('@')[0] || "User",
//             email: loginData.email,
//             role: "user",
//           };

//           localStorage.setItem("authToken", "demo-user-token-67890");
//           localStorage.setItem("userData", JSON.stringify(userData));

//           toast.success("Welcome!");

//           // Close modals
//           setIsLoginModalOpen(false);
//           setIsRegisterModalOpen(false);
//           setIsContactModalOpen(false);

//           navigate("/user/dashboard");
//         } else {
//           toast.error("Invalid credentials. Use admin@example.com / admin");
//         }
//       }
//     } catch (error) {
//       toast.error("Login failed. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle registration
//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setRegisterSubmitted(true);
//     const errors = validateRegister();
//     setRegisterErrors(errors);
//     if (Object.keys(errors).length > 0) {
//       toast.error("Please fill in all required fields correctly");
//       return;
//     }

//     setIsRegisterLoading(true);

//     // Simulate network delay
//     await new Promise(resolve => setTimeout(resolve, 800));

//     try {
//       // Create new user (demo)
//       const userData = {
//         id: Date.now(),
//         name: registerData.name,
//         email: registerData.email,
//         role: "user",
//       };

//       localStorage.setItem("authToken", "demo-user-token-" + Date.now());
//       localStorage.setItem("userData", JSON.stringify(userData));

//       toast.success("Registration successful!");

//       // Close modals
//       setIsLoginModalOpen(false);
//       setIsRegisterModalOpen(false);
//       setIsContactModalOpen(false);

//       navigate("/user/dashboard");
//     } catch (error) {
//       toast.error("Registration failed. Please try again.");
//     } finally {
//       setIsRegisterLoading(false);
//     }
//   };

//   // Handle contact submission
//   const handleContactSubmit = async (e) => {
//     e.preventDefault();
//     setContactSubmitted(true);
//     const errors = validateContact();
//     setContactErrors(errors);
//     if (Object.keys(errors).length > 0) {
//       toast.error("Please fill in all required fields");
//       return;
//     }

//     // Simulate network delay
//     await new Promise(resolve => setTimeout(resolve, 500));

//     toast.success("Message sent successfully!");
//     setIsContactModalOpen(false);
//     setContactData({ name: "", email: "", subject: "", message: "" });
//     setContactErrors({});
//     setContactSubmitted(false);
//   };

//   // Switch between login and register modals
//   const switchToRegister = () => {
//     setIsLoginModalOpen(false);
//     setIsRegisterModalOpen(true);
//   };

//   const switchToLogin = () => {
//     setIsRegisterModalOpen(false);
//     setIsLoginModalOpen(true);
//   };

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

//       {/* Header with Brand */}
//       <div className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md shadow-sm">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl">
//                 <SavingsIcon className="w-8 h-8 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold text-gray-800">HEMS</h1>
//                 <p className="text-xs text-gray-500">
//                   Household Expense Management
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={() => setIsContactModalOpen(true)}
//               className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
//             >
//               <HelpIcon className="w-5 h-5" />
//               <span className="hidden sm:inline">Need Help?</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Login Modal - Cannot be closed, only switch to register or contact */}
//       <AnimatePresence>
//         {isLoginModalOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0, y: 20 }}
//               animate={{ scale: 1, opacity: 1, y: 0 }}
//               exit={{ scale: 0.9, opacity: 0, y: 20 }}
//               className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto relative"
//             >
//               {/* Demo Credentials Notice */}
//               {/* <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
//                 <p className="text-xs text-blue-700 text-center">
//                   🔑 Demo: <strong>admin@example.com</strong> / <strong>admin</strong>
//                   <br />
//                   <span className="text-xs text-gray-500">Or use any email/password (min 4 chars) for user access</span>
//                 </p>
//               </div> */}

//               <FormLogo />

//               <div className="text-center mb-8">
//                 <h2 className="text-3xl font-bold text-gray-800">
//                   Welcome Back
//                 </h2>
//                 <p className="text-gray-500 text-sm mt-2">
//                   Sign in to manage your household finances
//                 </p>
//               </div>

//               <form onSubmit={handleLogin} className="space-y-5" noValidate>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Email Address
//                   </label>
//                   <div className="relative">
//                     <EmailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                     <input
//                       type="email"
//                       value={loginData.email}
//                       onChange={(e) => {
//                         setLoginData({ ...loginData, email: e.target.value });
//                         if (loginSubmitted) {
//                           setLoginErrors((prev) => ({
//                             ...prev,
//                             email: undefined,
//                           }));
//                         }
//                       }}
//                       className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
//                         loginSubmitted && loginErrors.email
//                           ? "border-red-400 focus:ring-red-400"
//                           : "border-gray-300 focus:ring-purple-500"
//                       }`}
//                       placeholder="you@example.com"
//                     />
//                     {loginValid.email && (
//                       <CheckCircleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
//                     )}
//                   </div>
//                   {loginSubmitted && loginErrors.email && (
//                     <p className="text-xs text-red-500 mt-1">
//                       {loginErrors.email}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Password
//                   </label>
//                   <div className="relative">
//                     <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       value={loginData.password}
//                       onChange={(e) => {
//                         setLoginData({
//                           ...loginData,
//                           password: e.target.value,
//                         });
//                         if (loginSubmitted) {
//                           setLoginErrors((prev) => ({
//                             ...prev,
//                             password: undefined,
//                           }));
//                         }
//                       }}
//                       className={`w-full pl-10 pr-20 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
//                         loginSubmitted && loginErrors.password
//                           ? "border-red-400 focus:ring-red-400"
//                           : "border-gray-300 focus:ring-purple-500"
//                       }`}
//                       placeholder="••••••••"
//                     />
//                     {loginValid.password && (
//                       <CheckCircleIcon className="absolute right-11 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
//                     )}
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                     >
//                       {showPassword ? (
//                         <VisibilityOffIcon className="w-5 h-5" />
//                       ) : (
//                         <VisibilityIcon className="w-5 h-5" />
//                       )}
//                     </button>
//                   </div>
//                   {loginSubmitted && loginErrors.password && (
//                     <p className="text-xs text-red-500 mt-1">
//                       {loginErrors.password}
//                     </p>
//                   )}
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
//                     <input
//                       type="checkbox"
//                       className="rounded bg-white text-purple-600 "
//                     />
//                     <span>Remember me</span>
//                   </label>
//                   <button
//                     type="button"
//                     className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
//                     onClick={() =>
//                       toast.info("Password reset feature coming soon!")
//                     }
//                   >
//                     Forgot password?
//                   </button>
//                 </div>

//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   type="submit"
//                   disabled={isLoading}
//                   className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isLoading ? (
//                     <div className="flex items-center justify-center space-x-2">
//                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                       <span>Signing in...</span>
//                     </div>
//                   ) : (
//                     "Sign In"
//                   )}
//                 </motion.button>
//               </form>

//               <div className="mt-6 text-center">
//                 <p className="text-sm text-gray-600">
//                   Don't have an account?{" "}
//                   <button
//                     onClick={switchToRegister}
//                     className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
//                   >
//                     Register
//                   </button>
//                 </p>
//                 <p className="text-sm text-gray-600 mt-2">
//                   Need help?{" "}
//                   <button
//                     onClick={() => {
//                       setIsLoginModalOpen(false);
//                       setIsContactModalOpen(true);
//                     }}
//                     className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
//                   >
//                     Contact Us
//                   </button>
//                 </p>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Register Modal - Cannot be closed, only switch to login or contact */}
//       <AnimatePresence>
//         {isRegisterModalOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0, y: 20 }}
//               animate={{ scale: 1, opacity: 1, y: 0 }}
//               exit={{ scale: 0.9, opacity: 0, y: 20 }}
//               className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto relative"
//             >
//               <FormLogo />

//               <div className="text-center mb-8">
//                 <h2 className="text-3xl font-bold text-gray-800">
//                   Create Account
//                 </h2>
//                 <p className="text-gray-500 text-sm mt-2">
//                   Start managing your household finances today
//                 </p>
//               </div>

//               <form onSubmit={handleRegister} className="space-y-4" noValidate>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Full Name
//                   </label>
//                   <div className="relative">
//                     <PersonIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                     <input
//                       type="text"
//                       value={registerData.name}
//                       onChange={(e) => {
//                         setRegisterData({
//                           ...registerData,
//                           name: e.target.value,
//                         });
//                         if (registerSubmitted) {
//                           setRegisterErrors((prev) => ({
//                             ...prev,
//                             name: undefined,
//                           }));
//                         }
//                       }}
//                       className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
//                         registerSubmitted && registerErrors.name
//                           ? "border-red-400 focus:ring-red-400"
//                           : "border-gray-300 focus:ring-emerald-500"
//                       }`}
//                       placeholder="John Doe"
//                     />
//                     {registerValid.name && (
//                       <CheckCircleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
//                     )}
//                   </div>
//                   {registerSubmitted && registerErrors.name && (
//                     <p className="text-xs text-red-500 mt-1">
//                       {registerErrors.name}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Email Address
//                   </label>
//                   <div className="relative">
//                     <EmailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                     <input
//                       type="email"
//                       value={registerData.email}
//                       onChange={(e) => {
//                         setRegisterData({
//                           ...registerData,
//                           email: e.target.value,
//                         });
//                         if (registerSubmitted) {
//                           setRegisterErrors((prev) => ({
//                             ...prev,
//                             email: undefined,
//                           }));
//                         }
//                       }}
//                       className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
//                         registerSubmitted && registerErrors.email
//                           ? "border-red-400 focus:ring-red-400"
//                           : "border-gray-300 focus:ring-emerald-500"
//                       }`}
//                       placeholder="you@example.com"
//                     />
//                     {registerValid.email && (
//                       <CheckCircleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
//                     )}
//                   </div>
//                   {registerSubmitted && registerErrors.email && (
//                     <p className="text-xs text-red-500 mt-1">
//                       {registerErrors.email}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Password
//                   </label>
//                   <div className="relative">
//                     <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                     <input
//                       type={showRegisterPassword ? "text" : "password"}
//                       value={registerData.password}
//                       onChange={(e) => {
//                         setRegisterData({
//                           ...registerData,
//                           password: e.target.value,
//                         });
//                         if (registerSubmitted) {
//                           setRegisterErrors((prev) => ({
//                             ...prev,
//                             password: undefined,
//                           }));
//                         }
//                       }}
//                       className={`w-full pl-10 pr-20 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
//                         registerSubmitted && registerErrors.password
//                           ? "border-red-400 focus:ring-red-400"
//                           : "border-gray-300 focus:ring-emerald-500"
//                       }`}
//                       placeholder="••••••••"
//                       minLength={6}
//                     />
//                     {registerValid.password && (
//                       <CheckCircleIcon className="absolute right-11 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
//                     )}
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setShowRegisterPassword(!showRegisterPassword)
//                       }
//                       className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                     >
//                       {showRegisterPassword ? (
//                         <VisibilityOffIcon className="w-5 h-5" />
//                       ) : (
//                         <VisibilityIcon className="w-5 h-5" />
//                       )}
//                     </button>
//                   </div>

//                   {/* Password strength meter */}
//                   {registerData.password.length > 0 && (
//                     <div className="mt-2">
//                       <div className="flex items-center gap-2">
//                         <div className="flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden">
//                           <div
//                             className={`h-full rounded-full transition-all duration-300 ${
//                               passwordStrength.color === "red"
//                                 ? "bg-red-500 w-1/3"
//                                 : passwordStrength.color === "yellow"
//                                   ? "bg-yellow-500 w-2/3"
//                                   : "bg-green-500 w-full"
//                             }`}
//                           />
//                         </div>
//                         <span
//                           className={`text-xs font-semibold ${
//                             passwordStrength.color === "red"
//                               ? "text-red-500"
//                               : passwordStrength.color === "yellow"
//                                 ? "text-yellow-600"
//                                 : "text-green-600"
//                           }`}
//                         >
//                           {passwordStrength.label}
//                         </span>
//                       </div>
//                       {isPasswordWeak && (
//                         <p className="text-xs text-red-500 mt-1">
//                           Weak password — add length, numbers, or symbols to
//                           continue
//                         </p>
//                       )}
//                     </div>
//                   )}

//                   {registerSubmitted && registerErrors.password && (
//                     <p className="text-xs text-red-500 mt-1">
//                       {registerErrors.password}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Confirm Password
//                   </label>
//                   <div className="relative">
//                     <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                     <input
//                       type={showRegisterConfirmPassword ? "text" : "password"}
//                       value={registerData.confirmPassword}
//                       onChange={(e) => {
//                         setRegisterData({
//                           ...registerData,
//                           confirmPassword: e.target.value,
//                         });
//                         if (registerSubmitted) {
//                           setRegisterErrors((prev) => ({
//                             ...prev,
//                             confirmPassword: undefined,
//                           }));
//                         }
//                       }}
//                       className={`w-full pl-10 pr-20 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
//                         registerSubmitted && registerErrors.confirmPassword
//                           ? "border-red-400 focus:ring-red-400"
//                           : "border-gray-300 focus:ring-emerald-500"
//                       }`}
//                       placeholder="••••••••"
//                     />
//                     {registerValid.confirmPassword && (
//                       <CheckCircleIcon className="absolute right-11 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
//                     )}
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setShowRegisterConfirmPassword(
//                           !showRegisterConfirmPassword,
//                         )
//                       }
//                       className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                     >
//                       {showRegisterConfirmPassword ? (
//                         <VisibilityOffIcon className="w-5 h-5" />
//                       ) : (
//                         <VisibilityIcon className="w-5 h-5" />
//                       )}
//                     </button>
//                   </div>
//                   {registerSubmitted && registerErrors.confirmPassword && (
//                     <p className="text-xs text-red-500 mt-1">
//                       {registerErrors.confirmPassword}
//                     </p>
//                   )}
//                 </div>

//                 <motion.button
//                   whileHover={{ scale: isPasswordWeak ? 1 : 1.02 }}
//                   whileTap={{ scale: isPasswordWeak ? 1 : 0.98 }}
//                   type="submit"
//                   disabled={isRegisterLoading || isPasswordWeak}
//                   className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isRegisterLoading ? (
//                     <div className="flex items-center justify-center space-x-2">
//                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                       <span>Creating account...</span>
//                     </div>
//                   ) : (
//                     "Create Account"
//                   )}
//                 </motion.button>
//               </form>

//               <div className="mt-6 text-center">
//                 <p className="text-sm text-gray-600">
//                   Already have an account?{" "}
//                   <button
//                     onClick={switchToLogin}
//                     className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
//                   >
//                     Sign In
//                   </button>
//                 </p>
//                 <p className="text-sm text-gray-600 mt-2">
//                   Need help?{" "}
//                   <button
//                     onClick={() => {
//                       setIsRegisterModalOpen(false);
//                       setIsContactModalOpen(true);
//                     }}
//                     className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
//                   >
//                     Contact Us
//                   </button>
//                 </p>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Contact Modal - Can be closed, but only if logged in */}
//       <AnimatePresence>
//         {isContactModalOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
//             onClick={(e) => {
//               // Only allow closing if user is logged in
//               const token = localStorage.getItem("authToken");
//               if (token && e.target === e.currentTarget) {
//                 setIsContactModalOpen(false);
//               }
//             }}
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0, y: 20 }}
//               animate={{ scale: 1, opacity: 1, y: 0 }}
//               exit={{ scale: 0.9, opacity: 0, y: 20 }}
//               className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto relative"
//               onClick={(e) => e.stopPropagation()}
//             >
//               {/* Close button only shows if user is logged in */}
//               {localStorage.getItem("authToken") ? (
//                 <button
//                   onClick={() => setIsContactModalOpen(false)}
//                   className="absolute top-4 right-4 text-gray-400 bg-gradient-to-r from-red-500 to-red-700 text-white py-2 px-4 rounded-full hover:from-pink-600 hover:to-rose-600 transition-all duration-200"
//                 >
//                   <CloseIcon className="w-6 h-6" />
//                 </button>
//               ) : (
//                 <div className="absolute top-4 right-4 text-xs text-gray-400">

//                 </div>
//               )}

//               <FormLogo />

//               <div className="text-center mb-8">

//                 <h2 className="text-3xl font-bold text-gray-800">Contact Us</h2>
//                 <p className="text-gray-500 text-sm mt-2">
//                   We'd love to hear from you
//                 </p>
//               </div>

//               <form
//                 onSubmit={handleContactSubmit}
//                 className="space-y-4"
//                 noValidate
//               >
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Your Name
//                   </label>
//                   <div className="relative">
//                     <PersonIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                     <input
//                       type="text"
//                       value={contactData.name}
//                       onChange={(e) => {
//                         setContactData({
//                           ...contactData,
//                           name: e.target.value,
//                         });
//                         if (contactSubmitted) {
//                           setContactErrors((prev) => ({
//                             ...prev,
//                             name: undefined,
//                           }));
//                         }
//                       }}
//                       className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
//                         contactSubmitted && contactErrors.name
//                           ? "border-red-400 focus:ring-red-400"
//                           : "border-gray-300 focus:ring-pink-500"
//                       }`}
//                       placeholder="John Doe"
//                     />
//                     {contactValid.name && (
//                       <CheckCircleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
//                     )}
//                   </div>
//                   {contactSubmitted && contactErrors.name && (
//                     <p className="text-xs text-red-500 mt-1">
//                       {contactErrors.name}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Email Address
//                   </label>
//                   <div className="relative">
//                     <EmailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                     <input
//                       type="email"
//                       value={contactData.email}
//                       onChange={(e) => {
//                         setContactData({
//                           ...contactData,
//                           email: e.target.value,
//                         });
//                         if (contactSubmitted) {
//                           setContactErrors((prev) => ({
//                             ...prev,
//                             email: undefined,
//                           }));
//                         }
//                       }}
//                       className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
//                         contactSubmitted && contactErrors.email
//                           ? "border-red-400 focus:ring-red-400"
//                           : "border-gray-300 focus:ring-pink-500"
//                       }`}
//                       placeholder="you@example.com"
//                     />
//                     {contactValid.email && (
//                       <CheckCircleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
//                     )}
//                   </div>
//                   {contactSubmitted && contactErrors.email && (
//                     <p className="text-xs text-red-500 mt-1">
//                       {contactErrors.email}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Subject
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="text"
//                       value={contactData.subject}
//                       onChange={(e) => {
//                         setContactData({
//                           ...contactData,
//                           subject: e.target.value,
//                         });
//                         if (contactSubmitted) {
//                           setContactErrors((prev) => ({
//                             ...prev,
//                             subject: undefined,
//                           }));
//                         }
//                       }}
//                       className={`w-full px-4 pr-10 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
//                         contactSubmitted && contactErrors.subject
//                           ? "border-red-400 focus:ring-red-400"
//                           : "border-gray-300 focus:ring-pink-500"
//                       }`}
//                       placeholder="How can we help?"
//                     />
//                     {contactValid.subject && (
//                       <CheckCircleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
//                     )}
//                   </div>
//                   {contactSubmitted && contactErrors.subject && (
//                     <p className="text-xs text-red-500 mt-1">
//                       {contactErrors.subject}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Message
//                   </label>
//                   <div className="relative">
//                     <textarea
//                       value={contactData.message}
//                       onChange={(e) => {
//                         setContactData({
//                           ...contactData,
//                           message: e.target.value,
//                         });
//                         if (contactSubmitted) {
//                           setContactErrors((prev) => ({
//                             ...prev,
//                             message: undefined,
//                           }));
//                         }
//                       }}
//                       rows="4"
//                       className={`w-full px-4 pr-10 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all resize-none ${
//                         contactSubmitted && contactErrors.message
//                           ? "border-red-400 focus:ring-red-400"
//                           : "border-gray-300 focus:ring-pink-500"
//                       }`}
//                       placeholder="Your message here..."
//                     />
//                     {contactValid.message && (
//                       <CheckCircleIcon className="absolute right-3 top-3 w-5 h-5 text-blue-500" />
//                     )}
//                   </div>
//                   {contactSubmitted && contactErrors.message && (
//                     <p className="text-xs text-red-500 mt-1">
//                       {contactErrors.message}
//                     </p>
//                   )}
//                 </div>

//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   type="submit"
//                   className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
//                 >
//                   <SendIcon className="w-5 h-5" />
//                   <span>Send Message</span>
//                 </motion.button>
//               </form>

//               {/* Show login/register links if not logged in */}
//               {!localStorage.getItem("authToken") && (
//                 <div className="mt-4 text-center space-y-2">
//                   <p className="text-sm text-gray-600">
//                     <button
//                       onClick={() => {
//                         setIsContactModalOpen(false);
//                         setIsLoginModalOpen(true);
//                       }}
//                       className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
//                     >
//                       Sign In
//                     </button>
//                     {" or "}
//                     <button
//                       onClick={() => {
//                         setIsContactModalOpen(false);
//                         setIsRegisterModalOpen(true);
//                       }}
//                       className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
//                     >
//                       Create Account
//                     </button>
//                     {" to close this window"}
//                   </p>
//                 </div>
//               )}
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// Front.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
// Material Icons
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import SendIcon from "@mui/icons-material/Send";
import HelpIcon from "@mui/icons-material/Help";
import SavingsIcon from "@mui/icons-material/Savings";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PhoneIcon from "@mui/icons-material/Phone";

// Simple email format check used for the "accepted" tick + validation
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

// Phone number validation (basic - allows various formats)
const isValidPhone = (value) => {
  if (!value) return false;
  // Remove all non-digit characters for validation
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
};

// Password strength scorer — used for the strength meter + gating submit
const getPasswordStrength = (password) => {
  if (!password) return { label: "", score: 0 };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (password.length < 6 || score <= 2) {
    return { label: "Weak", score, color: "red" };
  }
  if (score <= 4) {
    return { label: "Medium", score, color: "yellow" };
  }
  return { label: "Strong", score, color: "green" };
};

// Small reusable HEMS logo mark used inside the form cards
const FormLogo = () => (
  <div className="flex items-center justify-center space-x-2 mb-6">
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-1.5 rounded-lg">
      <SavingsIcon className="w-5 h-5 text-white" />
    </div>
    <span className="text-lg font-bold text-gray-800 tracking-tight">HEMS</span>
  </div>
);

// Static user data for demo
const DEMO_USERS = {
  admin: {
    email: "admin@example.com",
    password: "admin",
    name: "Admin User",
    role: "admin",
    id: 1,
    phone: "+1234567890",
  },
};

export const Front = () => {
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(true);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [loginErrors, setLoginErrors] = useState({});
  const [loginSubmitted, setLoginSubmitted] = useState(false);

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [registerErrors, setRegisterErrors] = useState({});
  const [registerSubmitted, setRegisterSubmitted] = useState(false);

  // Contact form state
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [contactErrors, setContactErrors] = useState({});
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // ---- Validity checks (drive the blue "accepted" tick) ----
  const loginValid = {
    email: isValidEmail(loginData.email),
    password: loginData.password.trim().length > 0,
  };

  const passwordStrength = getPasswordStrength(registerData.password);
  const isPasswordWeak =
    registerData.password.length > 0 && passwordStrength.label === "Weak";

  const registerValid = {
    name: registerData.name.trim().length > 0,
    email: isValidEmail(registerData.email),
    phone:
      registerData.phone.trim().length > 0 && isValidPhone(registerData.phone),
    password: registerData.password.length >= 6 && !isPasswordWeak,
    confirmPassword:
      registerData.confirmPassword.length > 0 &&
      registerData.confirmPassword === registerData.password,
  };

  const contactValid = {
    name: contactData.name.trim().length > 0,
    email: isValidEmail(contactData.email),
    subject: contactData.subject.trim().length > 0,
    message: contactData.message.trim().length > 0,
  };

  // ---- Validation -> error message builders ----
  const validateLogin = () => {
    const errors = {};
    if (!loginData.email.trim()) errors.email = "Email is required";
    else if (!isValidEmail(loginData.email))
      errors.email = "Enter a valid email address";
    if (!loginData.password.trim()) errors.password = "Password is required";
    return errors;
  };

  const validateRegister = () => {
    const errors = {};
    if (!registerData.name.trim()) errors.name = "Full name is required";
    if (!registerData.email.trim()) errors.email = "Email is required";
    else if (!isValidEmail(registerData.email))
      errors.email = "Enter a valid email address";
    if (!registerData.phone.trim()) errors.phone = "Phone number is required";
    else if (!isValidPhone(registerData.phone))
      errors.phone = "Enter a valid phone number (10-15 digits)";
    if (!registerData.password.trim()) errors.password = "Password is required";
    else if (registerData.password.length < 6)
      errors.password = "Password must be at least 6 characters";
    else if (isPasswordWeak)
      errors.password =
        "Password is too weak — add length, numbers, or symbols";
    if (!registerData.confirmPassword.trim())
      errors.confirmPassword = "Please confirm your password";
    else if (registerData.confirmPassword !== registerData.password)
      errors.confirmPassword = "Passwords do not match";
    return errors;
  };

  const validateContact = () => {
    const errors = {};
    if (!contactData.name.trim()) errors.name = "Your name is required";
    if (!contactData.email.trim()) errors.email = "Email is required";
    else if (!isValidEmail(contactData.email))
      errors.email = "Enter a valid email address";
    if (!contactData.subject.trim()) errors.subject = "Subject is required";
    if (!contactData.message.trim()) errors.message = "Message is required";
    return errors;
  };

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = JSON.parse(localStorage.getItem("userData") || "null");

    if (token && userData) {
      // Redirect based on role
      if (userData.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    }
  }, [navigate]);

  // Handle login with static credentials
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginSubmitted(true);
    const errors = validateLogin();
    setLoginErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setIsLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      // Check against demo users
      if (
        loginData.email === DEMO_USERS.admin.email &&
        loginData.password === DEMO_USERS.admin.password
      ) {
        const userData = {
          id: DEMO_USERS.admin.id,
          name: DEMO_USERS.admin.name,
          email: DEMO_USERS.admin.email,
          role: DEMO_USERS.admin.role,
          phone: DEMO_USERS.admin.phone,
        };

        localStorage.setItem("authToken", "demo-admin-token-12345");
        localStorage.setItem("userData", JSON.stringify(userData));

        toast.success("Welcome Admin!");

        // Close modals
        setIsLoginModalOpen(false);
        setIsRegisterModalOpen(false);
        setIsContactModalOpen(false);

        navigate("/dashboard");
      } else {
        // For demo purposes, allow any email/password to login as regular user
        // if password length is at least 4 characters
        if (
          loginData.email &&
          loginData.password &&
          loginData.password.length >= 4
        ) {
          const userData = {
            id: 2,
            name: loginData.email.split("@")[0] || "User",
            email: loginData.email,
            role: "user",
            phone: "",
          };

          localStorage.setItem("authToken", "demo-user-token-67890");
          localStorage.setItem("userData", JSON.stringify(userData));

          toast.success("Welcome!");

          // Close modals
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(false);
          setIsContactModalOpen(false);

          navigate("/user/dashboard");
        } else {
          toast.error("Invalid credentials. Use admin@example.com / admin");
        }
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterSubmitted(true);
    const errors = validateRegister();
    setRegisterErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setIsRegisterLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      // Create new user (demo)
      const userData = {
        id: Date.now(),
        name: registerData.name,
        email: registerData.email,
        phone: registerData.phone,
        role: "user",
      };

      localStorage.setItem("authToken", "demo-user-token-" + Date.now());
      localStorage.setItem("userData", JSON.stringify(userData));

      toast.success("Registration successful!");

      // Close modals
      setIsLoginModalOpen(false);
      setIsRegisterModalOpen(false);
      setIsContactModalOpen(false);

      navigate("/user/dashboard");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsRegisterLoading(false);
    }
  };

  // Handle contact submission
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    const errors = validateContact();
    setContactErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    toast.success("Message sent successfully!");
    setIsContactModalOpen(false);
    setContactData({ name: "", email: "", subject: "", message: "" });
    setContactErrors({});
    setContactSubmitted(false);
  };

  // Switch between login and register modals
  const switchToRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const switchToLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
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

      {/* Header with Brand */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md shadow-sm">
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
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <HelpIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Need Help?</span>
            </button>
          </div>
        </div>
      </div>

      {/* Login Modal - Cannot be closed, only switch to register or contact */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto relative"
            >
              <FormLogo />

              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">
                  Welcome Back
                </h2>
                <p className="text-gray-500 text-sm mt-2">
                  Sign in to manage your household finances
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5" noValidate>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <EmailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => {
                        setLoginData({ ...loginData, email: e.target.value });
                        if (loginSubmitted) {
                          setLoginErrors((prev) => ({
                            ...prev,
                            email: undefined,
                          }));
                        }
                      }}
                      className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
                        loginSubmitted && loginErrors.email
                          ? "border-red-400 focus:ring-red-400"
                          : "border-gray-300 focus:ring-purple-500"
                      }`}
                      placeholder="you@example.com"
                    />
                    {loginValid.email && (
                      <CheckCircleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  {loginSubmitted && loginErrors.email && (
                    <p className="text-xs text-red-500 mt-1">
                      {loginErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginData.password}
                      onChange={(e) => {
                        setLoginData({
                          ...loginData,
                          password: e.target.value,
                        });
                        if (loginSubmitted) {
                          setLoginErrors((prev) => ({
                            ...prev,
                            password: undefined,
                          }));
                        }
                      }}
                      className={`w-full pl-10 pr-20 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
                        loginSubmitted && loginErrors.password
                          ? "border-red-400 focus:ring-red-400"
                          : "border-gray-300 focus:ring-purple-500"
                      }`}
                      placeholder="••••••••"
                    />
                    {loginValid.password && (
                      <CheckCircleIcon className="absolute right-11 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
                    )}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <VisibilityOffIcon className="w-5 h-5" />
                      ) : (
                        <VisibilityIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {loginSubmitted && loginErrors.password && (
                    <p className="text-xs text-red-500 mt-1">
                      {loginErrors.password}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded bg-white text-purple-600 "
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
                    onClick={() =>
                      toast.info("Password reset feature coming soon!")
                    }
                  >
                    Forgot password?
                  </button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </motion.button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <button
                    onClick={switchToRegister}
                    className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
                  >
                    Register
                  </button>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Need help?{" "}
                  <button
                    onClick={() => {
                      setIsLoginModalOpen(false);
                      setIsContactModalOpen(true);
                    }}
                    className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
                  >
                    Contact Us
                  </button>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Register Modal - Cannot be closed, only switch to login or contact */}
      <AnimatePresence>
        {isRegisterModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto relative"
            >
              <FormLogo />

              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">
                  Create Account
                </h2>
                <p className="text-gray-500 text-sm mt-2">
                  Start managing your household finances today
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4" noValidate>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <PersonIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={registerData.name}
                      onChange={(e) => {
                        setRegisterData({
                          ...registerData,
                          name: e.target.value,
                        });
                        if (registerSubmitted) {
                          setRegisterErrors((prev) => ({
                            ...prev,
                            name: undefined,
                          }));
                        }
                      }}
                      className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
                        registerSubmitted && registerErrors.name
                          ? "border-red-400 focus:ring-red-400"
                          : "border-gray-300 focus:ring-emerald-500"
                      }`}
                      placeholder="John Doe"
                    />
                    {registerValid.name && (
                      <CheckCircleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  {registerSubmitted && registerErrors.name && (
                    <p className="text-xs text-red-500 mt-1">
                      {registerErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <EmailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={registerData.email}
                      onChange={(e) => {
                        setRegisterData({
                          ...registerData,
                          email: e.target.value,
                        });
                        if (registerSubmitted) {
                          setRegisterErrors((prev) => ({
                            ...prev,
                            email: undefined,
                          }));
                        }
                      }}
                      className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
                        registerSubmitted && registerErrors.email
                          ? "border-red-400 focus:ring-red-400"
                          : "border-gray-300 focus:ring-emerald-500"
                      }`}
                      placeholder="you@example.com"
                    />
                    {registerValid.email && (
                      <CheckCircleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  {registerSubmitted && registerErrors.email && (
                    <p className="text-xs text-red-500 mt-1">
                      {registerErrors.email}
                    </p>
                  )}
                </div>

                {/* Phone Number Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={registerData.phone}
                      onChange={(e) => {
                        setRegisterData({
                          ...registerData,
                          phone: e.target.value,
                        });
                        if (registerSubmitted) {
                          setRegisterErrors((prev) => ({
                            ...prev,
                            phone: undefined,
                          }));
                        }
                      }}
                      className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
                        registerSubmitted && registerErrors.phone
                          ? "border-red-400 focus:ring-red-400"
                          : "border-gray-300 focus:ring-emerald-500"
                      }`}
                      placeholder="+1 (555) 000-0000"
                    />
                    {registerValid.phone && (
                      <CheckCircleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  {registerSubmitted && registerErrors.phone && (
                    <p className="text-xs text-red-500 mt-1">
                      {registerErrors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showRegisterPassword ? "text" : "password"}
                      value={registerData.password}
                      onChange={(e) => {
                        setRegisterData({
                          ...registerData,
                          password: e.target.value,
                        });
                        if (registerSubmitted) {
                          setRegisterErrors((prev) => ({
                            ...prev,
                            password: undefined,
                          }));
                        }
                      }}
                      className={`w-full pl-10 pr-20 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
                        registerSubmitted && registerErrors.password
                          ? "border-red-400 focus:ring-red-400"
                          : "border-gray-300 focus:ring-emerald-500"
                      }`}
                      placeholder="••••••••"
                      minLength={6}
                    />
                    {registerValid.password && (
                      <CheckCircleIcon className="absolute right-11 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setShowRegisterPassword(!showRegisterPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showRegisterPassword ? (
                        <VisibilityOffIcon className="w-5 h-5" />
                      ) : (
                        <VisibilityIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Password strength meter */}
                  {registerData.password.length > 0 && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              passwordStrength.color === "red"
                                ? "bg-red-500 w-1/3"
                                : passwordStrength.color === "yellow"
                                  ? "bg-yellow-500 w-2/3"
                                  : "bg-green-500 w-full"
                            }`}
                          />
                        </div>
                        <span
                          className={`text-xs font-semibold ${
                            passwordStrength.color === "red"
                              ? "text-red-500"
                              : passwordStrength.color === "yellow"
                                ? "text-yellow-600"
                                : "text-green-600"
                          }`}
                        >
                          {passwordStrength.label}
                        </span>
                      </div>
                      {isPasswordWeak && (
                        <p className="text-xs text-red-500 mt-1">
                          Weak password — add length, numbers, or symbols to
                          continue
                        </p>
                      )}
                    </div>
                  )}

                  {registerSubmitted && registerErrors.password && (
                    <p className="text-xs text-red-500 mt-1">
                      {registerErrors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showRegisterConfirmPassword ? "text" : "password"}
                      value={registerData.confirmPassword}
                      onChange={(e) => {
                        setRegisterData({
                          ...registerData,
                          confirmPassword: e.target.value,
                        });
                        if (registerSubmitted) {
                          setRegisterErrors((prev) => ({
                            ...prev,
                            confirmPassword: undefined,
                          }));
                        }
                      }}
                      className={`w-full pl-10 pr-20 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
                        registerSubmitted && registerErrors.confirmPassword
                          ? "border-red-400 focus:ring-red-400"
                          : "border-gray-300 focus:ring-emerald-500"
                      }`}
                      placeholder="••••••••"
                    />
                    {registerValid.confirmPassword && (
                      <CheckCircleIcon className="absolute right-11 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setShowRegisterConfirmPassword(
                          !showRegisterConfirmPassword,
                        )
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showRegisterConfirmPassword ? (
                        <VisibilityOffIcon className="w-5 h-5" />
                      ) : (
                        <VisibilityIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {registerSubmitted && registerErrors.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">
                      {registerErrors.confirmPassword}
                    </p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: isPasswordWeak ? 1 : 1.02 }}
                  whileTap={{ scale: isPasswordWeak ? 1 : 0.98 }}
                  type="submit"
                  disabled={isRegisterLoading || isPasswordWeak}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRegisterLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </motion.button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <button
                    onClick={switchToLogin}
                    className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
                  >
                    Sign In
                  </button>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Need help?{" "}
                  <button
                    onClick={() => {
                      setIsRegisterModalOpen(false);
                      setIsContactModalOpen(true);
                    }}
                    className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
                  >
                    Contact Us
                  </button>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Modal - Can be closed, but only if logged in */}
      <AnimatePresence>
        {isContactModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => {
              // Only allow closing if user is logged in
              const token = localStorage.getItem("authToken");
              if (token && e.target === e.currentTarget) {
                setIsContactModalOpen(false);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button only shows if user is logged in */}
              {localStorage.getItem("authToken") ? (
                <button
                  onClick={() => setIsContactModalOpen(false)}
                  className="absolute top-4 right-4 text-gray-400 bg-gradient-to-r from-red-500 to-red-700 text-white py-2 px-4 rounded-full hover:from-pink-600 hover:to-rose-600 transition-all duration-200"
                >
                  <CloseIcon className="w-6 h-6" />
                </button>
              ) : (
                <div className="absolute top-4 right-4 text-xs text-gray-400"></div>
              )}

              <FormLogo />

              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Contact Us</h2>
                <p className="text-gray-500 text-sm mt-2">
                  We'd love to hear from you
                </p>
              </div>

              <form
                onSubmit={handleContactSubmit}
                className="space-y-4"
                noValidate
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <div className="relative">
                    <PersonIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={contactData.name}
                      onChange={(e) => {
                        setContactData({
                          ...contactData,
                          name: e.target.value,
                        });
                        if (contactSubmitted) {
                          setContactErrors((prev) => ({
                            ...prev,
                            name: undefined,
                          }));
                        }
                      }}
                      className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
                        contactSubmitted && contactErrors.name
                          ? "border-red-400 focus:ring-red-400"
                          : "border-gray-300 focus:ring-pink-500"
                      }`}
                      placeholder="John Doe"
                    />
                    {contactValid.name && (
                      <CheckCircleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  {contactSubmitted && contactErrors.name && (
                    <p className="text-xs text-red-500 mt-1">
                      {contactErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <EmailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={contactData.email}
                      onChange={(e) => {
                        setContactData({
                          ...contactData,
                          email: e.target.value,
                        });
                        if (contactSubmitted) {
                          setContactErrors((prev) => ({
                            ...prev,
                            email: undefined,
                          }));
                        }
                      }}
                      className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
                        contactSubmitted && contactErrors.email
                          ? "border-red-400 focus:ring-red-400"
                          : "border-gray-300 focus:ring-pink-500"
                      }`}
                      placeholder="you@example.com"
                    />
                    {contactValid.email && (
                      <CheckCircleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  {contactSubmitted && contactErrors.email && (
                    <p className="text-xs text-red-500 mt-1">
                      {contactErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={contactData.subject}
                      onChange={(e) => {
                        setContactData({
                          ...contactData,
                          subject: e.target.value,
                        });
                        if (contactSubmitted) {
                          setContactErrors((prev) => ({
                            ...prev,
                            subject: undefined,
                          }));
                        }
                      }}
                      className={`w-full px-4 pr-10 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
                        contactSubmitted && contactErrors.subject
                          ? "border-red-400 focus:ring-red-400"
                          : "border-gray-300 focus:ring-pink-500"
                      }`}
                      placeholder="How can we help?"
                    />
                    {contactValid.subject && (
                      <CheckCircleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  {contactSubmitted && contactErrors.subject && (
                    <p className="text-xs text-red-500 mt-1">
                      {contactErrors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <div className="relative">
                    <textarea
                      value={contactData.message}
                      onChange={(e) => {
                        setContactData({
                          ...contactData,
                          message: e.target.value,
                        });
                        if (contactSubmitted) {
                          setContactErrors((prev) => ({
                            ...prev,
                            message: undefined,
                          }));
                        }
                      }}
                      rows="4"
                      className={`w-full px-4 pr-10 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all resize-none ${
                        contactSubmitted && contactErrors.message
                          ? "border-red-400 focus:ring-red-400"
                          : "border-gray-300 focus:ring-pink-500"
                      }`}
                      placeholder="Your message here..."
                    />
                    {contactValid.message && (
                      <CheckCircleIcon className="absolute right-3 top-3 w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  {contactSubmitted && contactErrors.message && (
                    <p className="text-xs text-red-500 mt-1">
                      {contactErrors.message}
                    </p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <SendIcon className="w-5 h-5" />
                  <span>Send Message</span>
                </motion.button>
              </form>

              {/* Show login/register links if not logged in */}
              {!localStorage.getItem("authToken") && (
                <div className="mt-4 text-center space-y-2">
                  <p className="text-sm text-gray-600">
                    <button
                      onClick={() => {
                        setIsContactModalOpen(false);
                        setIsLoginModalOpen(true);
                      }}
                      className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
                    >
                      Sign In
                    </button>
                    {" or "}
                    <button
                      onClick={() => {
                        setIsContactModalOpen(false);
                        setIsRegisterModalOpen(true);
                      }}
                      className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
                    >
                      Create Account
                    </button>
                    {" to close this window"}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
