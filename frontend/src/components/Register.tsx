import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, loginUser, getUserProfile, UserData, ApiError } from '../api/auth';
import { useAuth } from '../context/AuthContext';

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
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

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
      
      navigate('');
    } catch (error) {
      setErrors(error as ApiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Create an Account</h2>
        
        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errors.general}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            {errors.username && (
              <p className="text-red-500 text-xs italic mt-1">{errors.username}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs italic mt-1">{errors.email}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-xs italic mt-1">{errors.password}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password2">
              Confirm Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password2"
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              required
            />
            {errors.password2 && (
              <p className="text-red-500 text-xs italic mt-1">{errors.password2}</p>
            )}
          </div>
          
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <input
                id="useLocation"
                type="checkbox"
                checked={useLocation}
                onChange={handleLocationToggle}
                className="mr-2"
              />
              <label className="text-gray-700 text-sm font-bold" htmlFor="useLocation">
                Use my current location for prayer times
              </label>
            </div>
            
            {errors.location && (
              <p className="text-red-500 text-xs italic mb-2">{errors.location}</p>
            )}
            
            {useLocation && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="latitude">
                    Latitude
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="latitude"
                    type="number"
                    step="any"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="longitude">
                    Longitude
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="longitude"
                    type="number"
                    step="any"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
            <div className="text-center text-gray-600 mt-2">
              Already have an account?{' '}
              <Link to="/" className="text-blue-500 hover:text-blue-700">
                Login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;