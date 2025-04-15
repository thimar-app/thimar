import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client without auth
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

// Set authorization header with Clerk token
export const setSupabaseAccessToken = (token: string) => {
  if (!token) {
    console.warn('No token provided to setSupabaseAccessToken');
    return;
  }
  
  // Use the proper method to set headers
  supabase.auth.setSession({
    access_token: token,
    refresh_token: ''
  });
};

// Helper function to get the storage bucket
const getStorageBucket = (supabaseClient: SupabaseClient) => {
  return supabaseClient.storage.from('goal-images');
};

export const uploadImageToSupabase = async (
  file: File, 
  userId: string,
  token: string // Add token parameter
): Promise<string> => {
  // Set the token before making the request
  setSupabaseAccessToken(token);

  try {
    // Validate file
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Generate unique filename with user ID as folder name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const bucket = getStorageBucket(supabase);

    // Upload file to Supabase Storage
    const { data, error } = await bucket.upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

    if (error) {
      console.error('Error uploading to Supabase:', error);
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = bucket.getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error in uploadImageToSupabase:', error);
    throw error;
  }
};

export const deleteImageFromSupabase = async (
  imageUrl: string,
  userId: string,
  token: string // Add token parameter
): Promise<void> => {
  // Set the token before making the request
  setSupabaseAccessToken(token);

  try {
    // Extract the file path from the URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `${userId}/${fileName}`;

    const bucket = getStorageBucket(supabase);

    // Delete the file
    const { error } = await bucket.remove([filePath]);

    if (error) {
      console.error('Error deleting from Supabase:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteImageFromSupabase:', error);
    throw error;
  }
}; 