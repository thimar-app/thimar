import axios from "axios";

// Update the API base URL to ensure it's correct
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
 * Returns { goal: "...", description: "..." }
 */
export async function generateNewGoalFromAI(existingGoals: any[], previousGenerations: any[] = []) {
  const response = await axios.post(
    `${API_BASE_URL}/gen-ai/new-goal/`,
    { 
      existing_goals: existingGoals,
      previous_generations: previousGenerations
    },
    {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
    }
  );
  return response.data; // Returns { goal: "...", description: "..." }
}

/**
 * Calls the "Generate New Task" endpoint
 * Expects { goal_id, completed_tasks, current_goal, previous_generations, timezone } in the body
 * Returns { title, description, priority, repeat, prayer_time, prayer_context }
 */
export async function generateNewTaskFromAI(payload: any) {
  // Add timezone if not provided
  if (!payload.timezone) {
    payload.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
  
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
  return response.data; // Returns structured task data with prayer time
}

/**
 * Calls the "Generate Baraqah" endpoint
 * Expects { goal_id, completed_tasks, current_goal, previous_generations } in the body
 * Returns { message, source, explanation }
 */
export async function generateBaraqahFromAI(payload: any) {
  try {
    // Ensure we have the required fields
    if (!payload.goal_id) payload.goal_id = "general";
    if (!payload.completed_tasks) payload.completed_tasks = [];
    if (!payload.current_goal) payload.current_goal = { 
      title: "Daily Activities", 
      description: "General daily tasks and activities",
      progress: 0
    };
    if (!payload.previous_generations) payload.previous_generations = [];
    
    console.log("Sending baraqah request with payload:", payload);
    
    const response = await axios.post(
      `${API_BASE_URL}/gen-ai/generate-baraqah/`,
      payload,
      {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
      }
    );
    
    console.log("Baraqah response:", response.data);
    return response.data; // Returns { message, source, explanation }
  } catch (error) {
    console.error("Error generating baraqah:", error);
    // Return a fallback response
    return {
      message: "May Allah bless your efforts and guide you to success.",
      source: "General Islamic wisdom",
      explanation: "A reminder of Allah's blessings in our daily endeavors."
    };
  }
}

/**
 * Legacy function for backward compatibility
 * Now uses the new generateBaraqahFromAI function
 */
export async function generateDouaaAdvice() {
  try {
    const data = await generateBaraqahFromAI({
      goal_id: "general",
      completed_tasks: [],
      current_goal: { title: "Daily Activities", description: "General daily tasks and activities" }
    });
    return { text: data.message }; // Format for backward compatibility
  } catch (error) {
    console.error("Error generating baraqah:", error);
    return { text: "May Allah bless your efforts and guide you to success." };
  }
}