import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

// Helper to get auth headers
const getAuthHeader = () => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ2OTk2MzM1LCJpYXQiOjE3NDQ1NzcxMzUsImp0aSI6IjU1ODI4YjcyYjIwZjQ2Y2Y4MzQxNzE0MjlkMTYyODlhIiwidXNlcl9pZCI6N30.fzgD3HZp4HrvjxiEjx4Oe14TlIWD9WlpiiWw286nnGc";
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const checkPrayerTimesUpdate = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/prayers/`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching prayer times:", error);
    throw error;
  }
}; 