import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { uploadImageToSupabase } from '@/config/supabase';

const SupabaseTest: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { userId } = useAuth();
  const { getSupabaseToken, isReady } = useSupabaseAuth();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file || !userId || !isReady) {
      setError('Please select a file and ensure you are logged in');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      
      console.log('Starting upload with:', {
        fileSize: file.size,
        fileType: file.type,
        userId,
        isReady
      });

      const token = await getSupabaseToken();
      if (!token) {
        throw new Error('Failed to get token for upload');
      }

      const url = await uploadImageToSupabase(file, userId, token);
      setImageUrl(url);
      console.log('Upload successful:', url);
    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Supabase Storage Test</h2>
      
      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100"
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || uploading || !isReady}
        className={`px-4 py-2 rounded ${
          !file || uploading || !isReady
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {imageUrl && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Uploaded Image:</h3>
          <img
            src={imageUrl}
            alt="Uploaded"
            className="max-w-xs rounded shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

export default SupabaseTest; 