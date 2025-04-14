import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

// Helper to get token (adjust per your auth implementation)
const getAuthHeader = () => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ2OTk2MzM1LCJpYXQiOjE3NDQ1NzcxMzUsImp0aSI6IjU1ODI4YjcyYjIwZjQ2Y2Y4MzQxNzE0MjlkMTYyODlhIiwidXNlcl9pZCI6N30.fzgD3HZp4HrvjxiEjx4Oe14TlIWD9WlpiiWw286nnGc";
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchGoalsApi = async () => {
  const response = await axios.get(`${API_BASE_URL}/goals/`, {
    headers: getAuthHeader(),
  });
  // The backend already returns image_url for display, no need to transform
  return response.data;
};

export const fetchGoalByIdApi = async (goalId: string) => {
  const response = await axios.get(`${API_BASE_URL}/goals/${goalId}/`, {
    headers: getAuthHeader(),
  });
  // The backend already returns image_url for display, no need to transform
  return response.data;
};

export const addGoalApi = async (goal: FormData | any, retryWithFreshToken: unknown, formData: FormData, userId: string, token: string) => {
  // For FormData, we don't need to modify anything as the backend expects 'image' field
  // For regular objects, ensure we're using the image field for file uploads
  const goalData = goal instanceof FormData ? goal : {
    ...goal,
    // If it's a base64 string or URL, we need to convert it to a file
    // Otherwise, just pass the image as is
    image: goal.image,
  };
  
  const response = await axios.post(`${API_BASE_URL}/goals/`, goalData, {
    headers: { ...getAuthHeader() },
  });
  return response.data;
};

export const updateGoalApi = async (goal: any) => {
  // Check if goal is FormData
  if (goal instanceof FormData) {
    const goalId = goal.get('id') as string;
    if (!goalId) {
      throw new Error('Goal ID is required for update');
    }
    
    // For FormData, we don't need to modify anything as the backend expects 'image' field
    const response = await axios.patch(`${API_BASE_URL}/goals/${goalId}/`, goal, {
      headers: {
        ...getAuthHeader(),
      },
    });
    return response.data;
  } else {
    // For regular JSON objects, ensure we're using the image field for file uploads
    const goalData = {
      ...goal,
      // If it's a base64 string or URL, we need to convert it to a file
      // Otherwise, just pass the image as is
      image: goal.image,
    };
    
    const response = await axios.patch(`${API_BASE_URL}/goals/${goal.id}/`, goalData, {
      headers: getAuthHeader(),
    });
    return response.data;
  }
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
