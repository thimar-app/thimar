import { useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';

export const useSupabaseAuth = () => {
  const { getToken, isSignedIn, isLoaded } = useAuth();

  const getSupabaseToken = useCallback(async () => {
    if (!isLoaded || !isSignedIn) {
      console.log('Not ready for Supabase:', { isLoaded, isSignedIn });
      return null;
    }

    try {
      const token = await getToken({
        template: 'supabase'
      });
      
      if (!token) {
        console.error('No token available from Clerk');
        return null;
      }

      // Log token details in development
      if (process.env.NODE_ENV === 'development') {
        try {
          const [header, payload] = token.split('.');
          const decodedPayload = JSON.parse(atob(payload));
          console.log('Token payload:', {
            role: decodedPayload.role,
            exp: new Date(decodedPayload.exp * 1000).toISOString()
          });
        } catch (e) {
          console.warn('Could not decode token payload:', e);
        }
      }

      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }, [isLoaded, isSignedIn, getToken]);

  return {
    getSupabaseToken,
    isReady: isLoaded && isSignedIn
  };
}; 