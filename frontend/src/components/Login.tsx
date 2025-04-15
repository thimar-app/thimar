import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, getUserProfile, ApiError } from '../services/auth';
import { useAuth } from '../context/AuthContext';

interface LoginFormData {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginFormData>({ username: '', password: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
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
    <div className="bg-card rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-8">
        <h2 className="text-2xl font-bold text-center text-foreground mb-8">Login</h2>
        
        {errors.general && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded mb-4">
            {errors.general}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-foreground text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-foreground bg-background leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
            />
            {errors.username && (
              <p className="text-destructive text-xs italic mt-1">{errors.username}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label className="block text-foreground text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-foreground bg-background leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
            {errors.password && (
              <p className="text-destructive text-xs italic mt-1">{errors.password}</p>
            )}
          </div>
          
          <div className="flex flex-col gap-4">
            <button
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
            <div className="text-center text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:text-primary/90">
                Register
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
