import api from './axios';

// Cache object to store API responses
const cache = {
  goals: {} as Record<string, any>,
  lastFetch: {} as Record<string, number>,
};

// Cache duration in milliseconds (30 seconds)
const CACHE_DURATION = 30 * 1000;

// Helper function to check if cache is valid for a specific page
const isCacheValid = (page: number) => {
  const cacheKey = `goals_page_${page}`;
  return cache.goals[cacheKey] && Date.now() - (cache.lastFetch[cacheKey] || 0) < CACHE_DURATION;
};

// Helper to convert JSON object to FormData
const jsonToFormData = (data: any): FormData => {
  const formData = new FormData();
  
  // Add each property to FormData
  Object.keys(data).forEach(key => {
    if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, data[key]);
    }
  });
  
  return formData;
};

// Goals API
export const fetchGoalsApi = async (forceRefresh = false, page = 1, pageSize = 8) => {
  const cacheKey = `goals_page_${page}`;
  
  console.log(`Fetching goals for page ${page} with pageSize ${pageSize}`);
  
  // Return cached data if available and not forcing refresh
  if (!forceRefresh && isCacheValid(page)) {
    console.log(`Using cached data for page ${page}`);
    return cache.goals[cacheKey];
  }

  // Otherwise fetch fresh data
  console.log(`Making API request for page ${page}`);
  const response = await api.get('/goals/', {
    params: {
      page,
      page_size: pageSize
    }
  });
  
  console.log(`API response for page ${page}:`, response.data);
  
  // Update cache for this specific page
  cache.goals[cacheKey] = response.data;
  cache.lastFetch[cacheKey] = Date.now();
  
  return response.data;
};

export const fetchGoalByIdApi = async (goalId: string) => {
  console.log(`Fetching goal by ID: ${goalId}`);
  
  // Check if we have this goal in any cached page
  if (Object.keys(cache.goals).length > 0) {
    // Search through all cached pages for the goal
    for (const pageKey in cache.goals) {
      const pageData = cache.goals[pageKey];
      if (pageData.results) {
        const cachedGoal = pageData.results.find((goal: any) => goal.id === goalId);
        if (cachedGoal) {
          console.log(`Found goal ${goalId} in cache`);
          return cachedGoal;
        }
      }
    }
  }

  // If not in cache, fetch from API
  console.log(`Goal ${goalId} not found in cache, fetching from API`);
  try {
    const response = await api.get(`/goals/${goalId}/`);
    
    // Cache the fetched goal
    const goal = response.data;
    const cacheKey = `goal_${goalId}`;
    cache.goals[cacheKey] = goal;
    cache.lastFetch[cacheKey] = Date.now();
    
    return goal;
  } catch (error) {
    console.error(`Error fetching goal ${goalId}:`, error);
    throw error;
  }
};

export const addGoalApi = async (goal: FormData | any, formData: FormData, userId: string, token: string) => {
  // For FormData, we don't need to modify anything as the backend expects 'image' field
  // For regular objects, convert to FormData
  const goalData = goal instanceof FormData ? goal : jsonToFormData(goal);
  
  const response = await api.post('/goals/', goalData);
  
  // Invalidate cache to ensure fresh data on next fetch
  cache.goals = {} as Record<string, any>;
  
  return response.data;
};

export const updateGoalApi = async (goal: any) => {
  // Check if goal is FormData
  if (goal instanceof FormData) {
    const goalId = goal.get('id') as string;
    if (!goalId) {
      throw new Error('Goal ID is required for update');
    }
    
    const response = await api.patch(`/goals/${goalId}/`, goal);
    
    // Update cache if we have it
    if (Object.keys(cache.goals).length > 0) {
      // Clear all cached pages since the goal list has changed
      cache.goals = {} as Record<string, any>;
    }
    
    return response.data;
  } else {
    // For regular JSON objects, convert to FormData
    const goalData = jsonToFormData(goal);
    
    const response = await api.patch(`/goals/${goal.id}/`, goalData);
    
    // Update cache if we have it
    if (Object.keys(cache.goals).length > 0) {
      // Clear all cached pages since the goal list has changed
      cache.goals = {} as Record<string, any>;
    }
    
    return response.data;
  }
};

export const deleteGoalApi = async (goalId: string) => {
  const response = await api.delete(`/goals/${goalId}/`);
  
  // Update cache if we have it
  if (Object.keys(cache.goals).length > 0) {
    // Clear all cached pages since the goal list has changed
    cache.goals = {} as Record<string, any>;
  }
  
  return response.data;
};

// SubGoals API
export const fetchSubGoalsApi = async (page = 1, pageSize = 10) => {
  const response = await api.get('/goals/sub-goals/', {
    params: {
      page,
      page_size: pageSize
    }
  });
  return response.data;
};

// SubGoal endpoints
export const addSubGoalApi = async (subGoal: any) => {
  // Convert to FormData
  const formData = jsonToFormData(subGoal);
  
  // Log the data being sent to the backend
  console.log('Adding subgoal with data:', subGoal);
  
  const response = await api.post('/goals/sub-goals/', formData);
  
  // Log the response from the backend
  console.log('Subgoal added successfully:', response.data);
  
  // Invalidate cache to ensure fresh data on next fetch
  cache.goals = {} as Record<string, any>;
  
  return response.data;
};

export const updateSubGoalApi = async (subGoal: any) => {
  // Convert to FormData
  const formData = jsonToFormData(subGoal);
  
  const response = await api.patch(`/sub-goals/${subGoal.id}/`, formData);
  
  // Update cache if we have it
  if (cache.goals) {
    cache.goals = cache.goals.map((goal: any) => ({
      ...goal,
      sub_goals: goal.sub_goals.map((sg: any) => 
        sg.id === subGoal.id ? response.data : sg
      ),
    }));
  }
  
  return response.data;
};

export const deleteSubGoalApi = async (subGoalId: string) => {
  const response = await api.delete(`/sub-goals/${subGoalId}/`);
  
  // Update cache if we have it
  if (cache.goals) {
    cache.goals = cache.goals.map((goal: any) => ({
      ...goal,
      sub_goals: goal.sub_goals.filter((sg: any) => sg.id !== subGoalId),
    }));
  }
  
  return response.data;
};

