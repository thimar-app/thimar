// useAuthAxios.ts
import { useAuth } from "@clerk/clerk-react";
import axios, { AxiosError, AxiosInstance } from "axios";
import { useState, useCallback, useEffect, useRef } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://midyear-acre-457323-k1.ey.r.appspot.com";

interface Location {
  latitude: number;
  longitude: number;
}

export const useAuthAxios = () => {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const [isReady, setIsReady] = useState(false);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const axiosInstanceRef = useRef<AxiosInstance | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const initializationAttemptedRef = useRef(false);

  // Wait for Clerk to be loaded
  useEffect(() => {
    if (isLoaded) {
      setIsReady(true);
    }
  }, [isLoaded]);

  // Get user's location when the component mounts
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('User location obtained:', { latitude, longitude });
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  }, []);

  // Create a function to get a fresh token
  const getFreshToken = useCallback(async () => {
    try {
      if (!isSignedIn) {
        console.warn("User is not signed in");
        throw new Error("User is not signed in");
      }
      
      const newToken = await getToken();
      
      if (!newToken) {
        console.error("Failed to get authentication token");
        throw new Error("Failed to get authentication token");
      }
      
      console.log("Got token, length:", newToken.length);
      setToken(newToken);
      return newToken;
    } catch (error) {
      console.error("Error getting token:", error);
      throw error;
    }
  }, [getToken, isSignedIn]);

  const createAxiosInstance = useCallback(async () => {
    if (initializationAttemptedRef.current) {
      return axiosInstanceRef.current;
    }

    try {
      const currentToken = token || await getFreshToken();
      console.log('Creating axios instance with base URL:', API_BASE_URL);
      
      const instance = axios.create({
        baseURL: API_BASE_URL,
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (userLocation) {
        console.log('Adding location headers:', userLocation);
        instance.defaults.headers['x-user-latitude'] = userLocation.latitude.toString();
        instance.defaults.headers['x-user-longitude'] = userLocation.longitude.toString();
      }

      // Add response interceptor for token refresh
      instance.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config;
          if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const newToken = await getFreshToken();
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return instance(originalRequest);
          }
          return Promise.reject(error);
        }
      );

      axiosInstanceRef.current = instance;
      setIsInitialized(true);
      initializationAttemptedRef.current = true;
      return instance;
    } catch (error) {
      console.error("Error creating authenticated axios instance:", error);
      setIsInitialized(false);
      throw error;
    }
  }, [userLocation, getFreshToken, token]);

  const retryWithFreshToken = useCallback(async (error: AxiosError, retryFn: () => Promise<any>) => {
    if (error.response?.status === 401) {
      try {
        console.log('Retrying request with fresh token...');
        const newToken = await getFreshToken();
        if (axiosInstanceRef.current) {
          axiosInstanceRef.current.defaults.headers['Authorization'] = `Bearer ${newToken}`;
        }
        return await retryFn();
      } catch (retryError) {
        console.error('Error retrying with fresh token:', retryError);
        throw retryError;
      }
    }
    throw error;
  }, [getFreshToken]);

  // Initialize axios instance
  useEffect(() => {
    const initializeAxios = async () => {
      if (isReady && isSignedIn && !initializationAttemptedRef.current) {
        try {
          console.log('Initializing axios instance...');
          await createAxiosInstance();
          console.log('Axios instance initialized successfully');
        } catch (error) {
          console.error('Failed to initialize axios instance:', error);
          setIsInitialized(false);
        }
      }
    };

    initializeAxios();
  }, [isReady, isSignedIn, createAxiosInstance]);

  // Update axios instance when token changes
  useEffect(() => {
    if (token && axiosInstanceRef.current) {
      console.log('Updating axios instance with new token');
      axiosInstanceRef.current.defaults.headers['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  // Update axios instance when location changes
  useEffect(() => {
    if (userLocation && axiosInstanceRef.current) {
      console.log('Updating axios instance with new location');
      axiosInstanceRef.current.defaults.headers['x-user-latitude'] = userLocation.latitude.toString();
      axiosInstanceRef.current.defaults.headers['x-user-longitude'] = userLocation.longitude.toString();
    }
  }, [userLocation]);

  return {
    authAxios: axiosInstanceRef.current,
    retryWithFreshToken,
    isReady: isReady && isInitialized,
    createAxiosInstance,
    isInitialized
  };
};
