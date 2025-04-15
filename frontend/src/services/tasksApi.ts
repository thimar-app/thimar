import axios from "axios";
import { Task } from "@/lib/types"; // Ensure your Task interface matches your model

const API_BASE_URL = "http://127.0.0.1:8000/api";

// Helper to get auth headers (adjust per your auth implementation)
const getAuthHeader = () => {
    const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ2OTk2MzM1LCJpYXQiOjE3NDQ1NzcxMzUsImp0aSI6IjU1ODI4YjcyYjIwZjQ2Y2Y4MzQxNzE0MjlkMTYyODlhIiwidXNlcl9pZCI6N30.fzgD3HZp4HrvjxiEjx4Oe14TlIWD9WlpiiWw286nnGc";
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
  const response = await axios.patch(
    `${API_BASE_URL}/tasks/${task.id}/`,
    task,
    {
      headers: getAuthHeader(),
    }
  );
  return response.data;
};

export const deleteTaskApi = async (taskId: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/tasks/${taskId}/`, {
    headers: getAuthHeader(),
  });
};

export async function createTask(taskData: any) {
  // e.g. POST /tasks/
  const response = await axios.post(`${API_BASE_URL}/tasks/`, taskData, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
  });
  return response.data; // The created task object
}
