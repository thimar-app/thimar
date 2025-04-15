import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

// Helper to get token (adjust per your auth implementation)
const getAuthHeader = () => {
  const token = localStorage.getItem("access");
  return token ? { Authorization: `Bearer ${token}` } : {};
};


export const fetchGoalsApi = async () => {
  const response = await axios.get(`${API_BASE_URL}/goals/`, {
    headers: getAuthHeader(),
  });
  console.log(response.data);
  return response.data;
};

export const fetchGoalByIdApi = async (goalId: string) => {
  const response = await axios.get(`${API_BASE_URL}/goals/${goalId}/`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const addGoalApi = async (goal: FormData | any) => {
  const response = await axios.post(`${API_BASE_URL}/goals/`, goal, {
    headers: { ...getAuthHeader() },
  });
  return response.data;
};

export const updateGoalApi = async (goal: any) => {
  const response = await axios.patch(`${API_BASE_URL}/goals/${goal.id}/`, goal, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const deleteGoalApi = async (goalId: string) => {
  await axios.delete(`${API_BASE_URL}/goals/${goalId}/`, {
    headers: getAuthHeader(),
  });
};

// SubGoal endpoints
export const addSubGoalApi = async (subGoal: any) => {
  const response = await axios.post(
    `${API_BASE_URL}/goals/sub-goals/`,
    subGoal,
    {
      headers: { ...getAuthHeader() },
    }
  );
  return response.data;
};

export const updateSubGoalApi = async (subGoal: any) => {
  const response = await axios.patch(
    `${API_BASE_URL}/goals/sub-goals/${subGoal.id}/`,
    subGoal,
    {
      headers: getAuthHeader(),
    }
  );
  return response.data;
};

export const deleteSubGoalApi = async (subGoalId: string) => {
  await axios.delete(`${API_BASE_URL}/goals/sub-goals/${subGoalId}/`, {
    headers: getAuthHeader(),
  });
};

