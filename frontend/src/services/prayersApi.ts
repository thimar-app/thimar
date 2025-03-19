import axios from "axios";

const API_BASE_URL = "https://thimar.onrender.com/api";

// Helper to get auth headers (adjust as needed)
const getAuthHeader = () => {

    const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQyNTYzNzIyLCJpYXQiOjE3NDIzOTA5MjIsImp0aSI6ImZlMDUzZTJkODE5ZDQ3YjQ4MjRjY2E0NGRlM2MzMGExIiwidXNlcl9pZCI6N30.YeOKrZG-3a_Z8ylcw2mL3Y0jBD3QDYJnez8zKqOW8UQ";
    
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchPrayersApi = async () => {
  const response = await axios.get(`${API_BASE_URL}/prayers/`, {
    headers: getAuthHeader(),
  });
  return response.data;
};
