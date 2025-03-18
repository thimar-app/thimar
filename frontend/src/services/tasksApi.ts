import axios from "axios";
import { Task } from "@/db/goals"; // Ensure your Task interface matches your model

const API_BASE_URL = "http://127.0.0.1:8000/api";

// Helper to get auth headers (adjust per your auth implementation)
const getAuthHeader = () => {
    const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQyMzgyOTUyLCJpYXQiOjE3NDIyMTAxNTIsImp0aSI6ImY4NjVjZWZjY2M3OTQ4NzdhOWVkZTU1ZmMwNTQ5YTNmIiwidXNlcl9pZCI6N30.yIYjYZs_sG8RSOsS4lgOI7hDFnVGOkvVoP94XUE9hYM";
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchTasksApi = async (): Promise<Task[]> => {
  const response = await axios.get(`${API_BASE_URL}/tasks/`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const addTaskApi = async (task: Task): Promise<Task> => {
  const response = await axios.post(`${API_BASE_URL}/tasks/`, task, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const updateTaskApi = async (task: Task): Promise<Task> => {
  const response = await axios.put(`${API_BASE_URL}/tasks/${task.id}/`, task, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const deleteTaskApi = async (taskId: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/tasks/${taskId}/`, {
    headers: getAuthHeader(),
  });
};
