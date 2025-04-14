export type Priority = "High" | "Medium" | "Low" | "Urgent";

export type Task = {
  id: string;
  name: string;
  description: string;
  date: string; // formatted as "YYYY-MM-DD"
  sub_goal: string; // backend expects the sub-goal's primary key here
  prayer: string | null; // same for prayer
  priority: Priority;
  status: boolean;
  repeat: boolean;
};

export type SubGoal = {
  id: string;
  name: string;
  goal_id: string;
  tasks: Task[];
};

export type Goal = {
  id: string;
  name: string;
  description: string;
  image: string;
  progress: number;
  user_id: string;
  subGoals: SubGoal[];
};
