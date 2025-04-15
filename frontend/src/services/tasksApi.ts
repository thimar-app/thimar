import api from './axios';
import { Task } from "@/lib/types"; // Ensure your Task interface matches your model

export const fetchTasksApi = async (): Promise<Task[]> => {
  const response = await api.get('/tasks/');
  return response.data;
};

export const addTaskApi = async (task: Task): Promise<Task> => {
  const response = await api.post('/tasks/', task);
  return response.data;
};

export const updateTaskApi = async (task: Task): Promise<Task> => {
  const response = await api.patch(`/tasks/${task.id}/`, task);
  return response.data;
};

export const deleteTaskApi = async (taskId: string): Promise<void> => {
  await api.delete(`/tasks/${taskId}/`);
};

export async function createTask(taskData: any) {
  // e.g. POST /tasks/
  const response = await api.post('/tasks/', taskData);
  return response.data; // The created task object
}
