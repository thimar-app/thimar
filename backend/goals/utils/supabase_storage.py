# utils/supabase_storage.py
import os
import uuid
import environ
from supabase import create_client, Client

# Initialize environ
env = environ.Env()
environ.Env.read_env()  # Read .env file

supabase_url = env("SUPABASE_URL")
supabase_key = env("SUPABASE_KEY")
bucket_name = env("SUPABASE_STORAGE_BUCKET", default="goal-images")

supabase: Client = create_client(supabase_url, supabase_key)

def upload_image(image_file, user_id):
    """Upload image to Supabase Storage and return the URL"""
    print(f"Starting upload for user {user_id}")
    if not image_file:
        print("No image file provided")
        return None, None
    
    print(f"Image file name: {image_file.name}")
    
    # Generate a unique filename
    file_ext = os.path.splitext(image_file.name)[1]
    file_name = f"{uuid.uuid4()}{file_ext}"
    
    # Create path using user_id for organization
    file_path = f"user_{user_id}/{file_name}"
    
    # Upload the file to Supabase Storage
    try:
        supabase.storage.from_(bucket_name).upload(
            file_path,
            image_file.read()
        )
        
        # Get the public URL
        file_url = supabase.storage.from_(bucket_name).get_public_url(file_path)
        
        return file_url, file_path
    except Exception as e:
        print(f"Error uploading to Supabase: {e}")
        return None, None

def delete_image(file_path):
    """Delete image from Supabase Storage"""
    if not file_path:
        return False
    
    try:
        supabase.storage.from_(bucket_name).remove([file_path])
        return True
    except Exception as e:
        print(f"Error deleting from Supabase: {e}")
        return False