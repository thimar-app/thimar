import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { getUserProfile, refreshToken, UserData } from '../services/auth';

interface AuthContextType {
  currentUser: UserData | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserData | null>>;
  loading: boolean;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is logged in (has tokens)
        const token = localStorage.getItem('access_token');
        if (token) {
          // Get current user data
          const userData = await getUserProfile();
          setCurrentUser(userData);
        }
      } catch (err) {
        // If error is due to expired token, try to refresh
        try {
          await refreshToken();
          const userData = await getUserProfile();
          setCurrentUser(userData);
        } catch (refreshError) {
          console.error('Auth initialization error:', refreshError);
          setError('Session expired. Please log in again.');
          setCurrentUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const value = {
    currentUser,
    setCurrentUser,
    loading,
    error,
    setError,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};