export interface Goal {
  id: string;
  user: number;
  name: string;
  description?: string;
  image_url?: string;
  image_path?: string;
  created_at: string;
  updated_at: string;
  progress: number;
  sub_goals: SubGoal[];
}

export interface SubGoal {
  id: string;
  name: string;
  goal: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
  total_pages: number;
} 