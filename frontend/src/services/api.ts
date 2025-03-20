// // src/services/api.ts
// import axios from "axios";

// // const API_BASE_URL = "https://thimar.onrender.com/api";
// const API_BASE_URL = "https://thimar.onrender.com/api";

// // Helper to get token (you may replace this with your auth logic)
// const getAuthHeader = () => {
// //   const token = localStorage.getItem("token");
//   const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQyMzgyOTUyLCJpYXQiOjE3NDIyMTAxNTIsImp0aSI6ImY4NjVjZWZjY2M3OTQ4NzdhOWVkZTU1ZmMwNTQ5YTNmIiwidXNlcl9pZCI6N30.yIYjYZs_sG8RSOsS4lgOI7hDFnVGOkvVoP94XUE9hYM"

//   return token ? { Authorization: `Bearer ${token}` } : {};
// };

// export const fetchGoalsApi = async () => {
//   const response = await axios.get(`${API_BASE_URL}/goals/`, {
//     headers: getAuthHeader(),
//   });
//   return response.data;
// };

// export const addGoalApi = async (goal: any) => {
//   const response = await axios.post(`${API_BASE_URL}/goals/`, goal, {
//     headers: getAuthHeader(),
//   });
//   return response.data;
// };

// export const updateGoalApi = async (goal: any) => {
//   const response = await axios.put(`${API_BASE_URL}/goals/${goal.id}/`, goal, {
//     headers: getAuthHeader(),
//   });
//   return response.data;
// };

// export const deleteGoalApi = async (goalId: string) => {
//   await axios.delete(`${API_BASE_URL}/goals/${goalId}/`, {
//     headers: getAuthHeader(),
//   });
// };

import axios from "axios";

const API_BASE_URL = "https://thimar.onrender.com/api";

// Helper to get token (adjust per your auth implementation)
const getAuthHeader = () => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQyNTYzNzIyLCJpYXQiOjE3NDIzOTA5MjIsImp0aSI6ImZlMDUzZTJkODE5ZDQ3YjQ4MjRjY2E0NGRlM2MzMGExIiwidXNlcl9pZCI6N30.YeOKrZG-3a_Z8ylcw2mL3Y0jBD3QDYJnez8zKqOW8UQ";
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchGoalsApi = async () => {
  const response = await axios.get(`${API_BASE_URL}/goals/`, {
    headers: getAuthHeader(),
  });
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
  const response = await axios.put(`${API_BASE_URL}/goals/${goal.id}/`, goal, {
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
  const response = await axios.put(
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
