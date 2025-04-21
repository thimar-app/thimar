import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, loginUser, getUserProfile, UserData, ApiError } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, User, Mail, Lock, ArrowRight, Sun, Moon, MapPin } from 'lucide-react';

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  password2: string;
  latitude: string;
  longitude: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    password2: '',
    latitude: '',
    longitude: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [useLocation, setUseLocation] = useState<boolean>(false);
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

  const handleLocationToggle = (): void => {
    if (!useLocation) {
      // Request location when toggling on
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setFormData({
              ...formData,
              latitude: position.coords.latitude.toString(),
              longitude: position.coords.longitude.toString()
            });
          },
          (error) => {
            console.error("Error obtaining location:", error);
            setErrors({
              ...errors,
              location: "Failed to get your location. Please enter coordinates manually."
            });
          }
        );
      } else {
        setErrors({
          ...errors,
          location: "Geolocation is not supported by this browser."
        });
      }
    } else {
      // Clear location data when toggling off
      setFormData({
        ...formData,
        latitude: '',
        longitude: ''
      });
    }
    setUseLocation(!useLocation);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Convert latitude and longitude to numbers if provided
    const userData: UserData = {
      ...formData,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null
    };

    try {
      // Register the user
      await registerUser(userData);
      
      // After successful registration, log the user in
      await loginUser({
        username: userData.username,
        password: userData.password!
      });
      
      // Get user profile and update context
      const userProfile = await getUserProfile();
      setCurrentUser(userProfile);
      
      navigate('/');
    } catch (error) {
      setErrors(error as ApiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen py-4">
      <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-md overflow-hidden max-w-md w-full mx-auto transition-colors duration-200 max-h-[550px] overflow-y-auto`}>
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

        {/* Logo space - reduced height */}
        <div className={`flex justify-center items-center py-3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-purple-50'}`}>
          <div className="h-12 w-32 flex items-center justify-center text-purple-600">
            {/* Logo will be placed here */}
            <img src="https://fagzgyrlxrpvniypexil.supabase.co/storage/v1/object/public/marketing//logo.png" alt="Thimar Logo" className="w-full h-full object-contain rounded-2xl" />
          </div>
        </div>
        
        <div className="px-6 py-4">
          <h2 className={`text-xl font-semibold text-center ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-1`}>Create an Account</h2>
          <p className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} mb-3 text-sm`}>Sign up to get started</p>
          
          {errors.general && (
            <div className={`${theme === 'dark' ? 'bg-red-900 border-red-800 text-red-200' : 'bg-red-50 border-red-200 text-red-600'} border px-3 py-2 rounded mb-3 flex items-center gap-2 text-sm`}>
              <AlertCircle size={14} />
              <span>{errors.general}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Username field */}
            <div>
              <label className={`block ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} text-xs font-medium mb-1`} htmlFor="username">
                Username
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>
                  <User size={16} />
                </div>
                <input
                  className={`appearance-none border ${errors.username ? (theme === 'dark' ? 'border-red-500' : 'border-red-300') : (theme === 'dark' ? 'border-gray-600' : 'border-gray-200')} 
                  rounded-md w-full py-2 pl-10 pr-3 ${theme === 'dark' ? 'text-white bg-gray-700' : 'text-gray-700 bg-white'} leading-tight 
                  focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm`}
                  id="username"
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.username && (
                <p className={`${theme === 'dark' ? 'text-red-400' : 'text-red-500'} text-xs mt-1 flex items-center gap-1`}>
                  <AlertCircle size={10} />
                  {errors.username}
                </p>
              )}
            </div>

            {/* Email field */}
            <div>
              <label className={`block ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} text-xs font-medium mb-1`} htmlFor="email">
                Email
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>
                  <Mail size={16} />
                </div>
                <input
                  className={`appearance-none border ${errors.email ? (theme === 'dark' ? 'border-red-500' : 'border-red-300') : (theme === 'dark' ? 'border-gray-600' : 'border-gray-200')} 
                  rounded-md w-full py-2 pl-10 pr-3 ${theme === 'dark' ? 'text-white bg-gray-700' : 'text-gray-700 bg-white'} leading-tight 
                  focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm`}
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.email && (
                <p className={`${theme === 'dark' ? 'text-red-400' : 'text-red-500'} text-xs mt-1 flex items-center gap-1`}>
                  <AlertCircle size={10} />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label className={`block ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} text-xs font-medium mb-1`} htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>
                  <Lock size={16} />
                </div>
                <input
                  className={`appearance-none border ${errors.password ? (theme === 'dark' ? 'border-red-500' : 'border-red-300') : (theme === 'dark' ? 'border-gray-600' : 'border-gray-200')} 
                  rounded-md w-full py-2 pl-10 pr-3 ${theme === 'dark' ? 'text-white bg-gray-700' : 'text-gray-700 bg-white'} leading-tight 
                  focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm`}
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.password && (
                <p className={`${theme === 'dark' ? 'text-red-400' : 'text-red-500'} text-xs mt-1 flex items-center gap-1`}>
                  <AlertCircle size={10} />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password field */}
            <div>
              <label className={`block ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} text-xs font-medium mb-1`} htmlFor="password2">
                Confirm Password
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>
                  <Lock size={16} />
                </div>
                <input
                  className={`appearance-none border ${errors.password2 ? (theme === 'dark' ? 'border-red-500' : 'border-red-300') : (theme === 'dark' ? 'border-gray-600' : 'border-gray-200')} 
                  rounded-md w-full py-2 pl-10 pr-3 ${theme === 'dark' ? 'text-white bg-gray-700' : 'text-gray-700 bg-white'} leading-tight 
                  focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm`}
                  id="password2"
                  type="password"
                  name="password2"
                  placeholder="Confirm your password"
                  value={formData.password2}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.password2 && (
                <p className={`${theme === 'dark' ? 'text-red-400' : 'text-red-500'} text-xs mt-1 flex items-center gap-1`}>
                  <AlertCircle size={10} />
                  {errors.password2}
                </p>
              )}
            </div>

            {/* Location checkbox */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <input
                  id="useLocation"
                  type="checkbox"
                  checked={useLocation}
                  onChange={handleLocationToggle}
                  className={`h-4 w-4 rounded ${theme === 'dark' ? 'bg-gray-700 border-gray-500' : 'bg-white border-gray-300'}`}
                />
                <label className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} text-sm`} htmlFor="useLocation">
                  Use my current location for prayer times
                </label>
              </div>
              
              {errors.location && (
                <p className={`${theme === 'dark' ? 'text-red-400' : 'text-red-500'} text-xs mb-2 flex items-center gap-1`}>
                  <AlertCircle size={10} />
                  {errors.location}
                </p>
              )}
            </div>
            
            <div className="pt-1">
              <button
                className={`${theme === 'dark' ? 'bg-purple-700 hover:bg-purple-600' : 'bg-purple-600 hover:bg-purple-700'} text-white font-medium py-2 px-4 rounded-md 
                  focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 w-full transition-all flex items-center justify-center gap-2 text-sm`}
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Register</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
            
            <div className={`text-center ${theme === 'dark' ? 'text-gray-300 border-gray-700' : 'text-gray-500 border-gray-100'} pt-2 mt-1 border-t text-sm`}>
              <p>
                Already have an account?{' '}
                <Link to="/login" className={`${theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'} font-medium`}>
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;