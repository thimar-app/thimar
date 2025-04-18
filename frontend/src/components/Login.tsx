import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, getUserProfile, ApiError } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, AlertCircle, Lock, User, ArrowRight, Sun, Moon } from 'lucide-react';

interface LoginFormData {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginFormData>({ username: '', password: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  // Load theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('vite-ui-theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('vite-ui-theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: { [key: string]: string } = {};
    if (!credentials.username.trim()) newErrors.username = "Username is required";
    if (!credentials.password) newErrors.password = "Password is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});

    try {
      await loginUser(credentials);
      
      // Fetch user data and update context
      const userData = await getUserProfile();
      setCurrentUser(userData);
      navigate('/home');
    } catch (error) {
      const apiError = error as ApiError;
      setErrors(apiError.detail ? { general: apiError.detail } : apiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-md overflow-hidden max-w-md w-full mx-auto transition-colors duration-200`}>
      {/* Theme toggle button */}
      <div className="absolute top-4 right-4">
        <button 
          onClick={toggleTheme} 
          className={`rounded-full p-2 ${theme === 'dark' ? 'bg-gray-700 text-yellow-300' : 'bg-gray-100 text-gray-600'} hover:opacity-80 transition-colors`}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>

      {/* Logo space */}
      <div className={`flex justify-center items-center py-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-purple-50'}`}>
        <div className="h-16 w-40 flex items-center justify-center text-purple-600">
          {/* Logo will be placed here */}
          <img src="https://fagzgyrlxrpvniypexil.supabase.co/storage/v1/object/public/marketing//logo.png" alt="Thimar Logo" className="w-full h-full object-contain rounded-2xl" />
        </div>
      </div>
      
      <div className="px-6 py-8">
        <h2 className={`text-2xl font-semibold text-center ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-2`}>Welcome Back</h2>
        <p className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} mb-6`}>Sign in to your account</p>
        
        {errors.general && (
          <div className={`${theme === 'dark' ? 'bg-red-900 border-red-800 text-red-200' : 'bg-red-50 border-red-200 text-red-600'} border px-4 py-3 rounded mb-5 flex items-center gap-2`}>
            <AlertCircle size={16} />
            <span>{errors.general}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={`block ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} text-sm font-medium mb-2`} htmlFor="username">
              Username
            </label>
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>
                <User size={18} />
              </div>
              <input
                className={`appearance-none border ${errors.username ? (theme === 'dark' ? 'border-red-500' : 'border-red-300') : (theme === 'dark' ? 'border-gray-600' : 'border-gray-200')} 
                rounded-md w-full py-2.5 pl-10 pr-3 ${theme === 'dark' ? 'text-white bg-gray-700' : 'text-gray-700 bg-white'} leading-tight 
                focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors`}
                id="username"
                type="text"
                name="username"
                placeholder="Enter your username"
                value={credentials.username}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            {errors.username && (
              <p className={`${theme === 'dark' ? 'text-red-400' : 'text-red-500'} text-xs mt-1 flex items-center gap-1`}>
                <AlertCircle size={12} />
                {errors.username}
              </p>
            )}
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className={`block ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} text-sm font-medium`} htmlFor="password">
                Password
              </label>
              <Link to="/forgot-password" className={`${theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'} text-sm`}>
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>
                <Lock size={18} />
              </div>
              <input
                className={`appearance-none border ${errors.password ? (theme === 'dark' ? 'border-red-500' : 'border-red-300') : (theme === 'dark' ? 'border-gray-600' : 'border-gray-200')} 
                rounded-md w-full py-2.5 pl-10 pr-12 ${theme === 'dark' ? 'text-white bg-gray-700' : 'text-gray-700 bg-white'} leading-tight 
                focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors`}
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={handleChange}
                disabled={loading}
              />
              <div 
                className={`absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer ${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
            {errors.password && (
              <p className={`${theme === 'dark' ? 'text-red-400' : 'text-red-500'} text-xs mt-1 flex items-center gap-1`}>
                <AlertCircle size={12} />
                {errors.password}
              </p>
            )}
          </div>
          
          <div className="pt-2">
            <button
              className={`${theme === 'dark' ? 'bg-purple-700 hover:bg-purple-600' : 'bg-purple-600 hover:bg-purple-700'} text-white font-medium py-2.5 px-4 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 w-full transition-all flex items-center justify-center gap-2`}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
          
          <div className={`text-center ${theme === 'dark' ? 'text-gray-300 border-gray-700' : 'text-gray-500 border-gray-100'} pt-4 border-t`}>
            <p>
              Don't have an account?{' '}
              <Link to="/register" className={`${theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'} font-medium`}>
                Create an account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;