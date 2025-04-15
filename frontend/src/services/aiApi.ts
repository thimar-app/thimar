import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

// Helper to get token (adjust per your auth logic)
const getAuthHeader = () => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ2OTk2MzM1LCJpYXQiOjE3NDQ1NzcxMzUsImp0aSI6IjU1ODI4YjcyYjIwZjQ2Y2Y4MzQxNzE0MjlkMTYyODlhIiwidXNlcl9pZCI6N30.fzgD3HZp4HrvjxiEjx4Oe14TlIWD9WlpiiWw286nnGc";
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Calls your AI endpoint e.g. POST /gen-ai/new-goal
 * Expects { existing_goals: [...] } in the body
 * Returns { output: "...some AI text..." }
 */
export async function generateNewGoalFromAI(existingGoals: any[]) {
  const response = await axios.post(
    `${API_BASE_URL}/gen-ai/new-goal/`,
    { existing_goals: existingGoals },
    {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
    }
  );
  return response.data; // Typically { output: "... AI text ..." }
}

/**
 * Example function to call “Generate New Task” endpoint
 * that expects something like { goal_id, completed_tasks, ... }
 * and returns { output: "...some text..." } or structured data
 */
export async function generateNewTaskFromAI(payload: any) {
  // e.g., your backend expects { goal_id, completed_tasks, ... }
  const response = await axios.post(
    `${API_BASE_URL}/gen-ai/new-task/`,
    payload,
    {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
    }
  );
  return response.data; // Typically { output: "...some AI text..." }
}

export async function generateDouaaAdvice() {
  const response = await axios.get(
    `${API_BASE_URL}/gen-ai/generate-baraqah/`,
    {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
    }
  );
  return response.data; // Typically { text: "... some advice/douaa ..." }
}