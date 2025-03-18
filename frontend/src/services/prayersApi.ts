import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

// Helper to get auth headers (adjust as needed)
const getAuthHeader = () => {

    const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQyMzgyOTUyLCJpYXQiOjE3NDIyMTAxNTIsImp0aSI6ImY4NjVjZWZjY2M3OTQ4NzdhOWVkZTU1ZmMwNTQ5YTNmIiwidXNlcl9pZCI6N30.yIYjYZs_sG8RSOsS4lgOI7hDFnVGOkvVoP94XUE9hYM";
    
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchPrayersApi = async () => {
  const response = await axios.get(`${API_BASE_URL}/prayers/`, {
    headers: getAuthHeader(),
  });
  return response.data;
};
