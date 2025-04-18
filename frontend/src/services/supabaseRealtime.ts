import { supabase } from '../config/supabase';
import { Goal, SubGoal } from '../context/GoalContext';

// Define the types for the payload
interface RealtimePayload<T> {
  new: T;
  old: T;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
}

// Callback types
type GoalUpdateCallback = (goal: Goal) => void;
type SubGoalUpdateCallback = (subGoal: SubGoal) => void;

// Set up realtime subscription for goals
export const subscribeToGoals = (onUpdate: GoalUpdateCallback) => {
  console.log('Setting up Supabase Realtime subscription for goals');
  
  const subscription = supabase
    .channel('goals-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'goals'
      },
      (payload: RealtimePayload<Goal>) => {
        console.log('Received goal update:', payload);
        onUpdate(payload.new);
      }
    )
    .subscribe();

  return () => {
    console.log('Unsubscribing from goals channel');
    subscription.unsubscribe();
  };
};

// Set up realtime subscription for sub-goals
export const subscribeToSubGoals = (onUpdate: SubGoalUpdateCallback) => {
  console.log('Setting up Supabase Realtime subscription for sub-goals');
  
  const subscription = supabase
    .channel('sub-goals-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'sub_goals'
      },
      (payload: RealtimePayload<SubGoal>) => {
        console.log('Received sub-goal update:', payload);
        onUpdate(payload.new);
      }
    )
    .subscribe();

  return () => {
    console.log('Unsubscribing from sub-goals channel');
    subscription.unsubscribe();
  };
}; 