// import React, { createContext, useState, useContext, ReactNode } from "react";
// import { Task } from "@/context/TaskContext";
// import { fetchGoalsApi, addGoalApi, updateGoalApi, deleteGoalApi } from "@/services/api";

// export interface SubGoal {
//   id: string;
//   name: string;
//   goal_id: string;
//   tasks: Task[];
// }

// export interface Goal {
//   id: string;
//   name: string;
//   description: string;
//   image: string;
//   progress: number;
//   user_id: string;
//   subGoals: SubGoal[];
// }

// interface GoalProgress {
//   percentage: number;
//   formattedPercentage: string;
// }

// interface GoalContextType {
//   goals: Goal[];
//   fetchGoals: () => void;
//   addGoal: (goal: Goal) => void;
//   updateGoal: (goal: Goal) => void;
//   deleteGoal: (id: string) => void;
//   addSubGoal: (subGoal: SubGoal) => void;
//   updateSubGoal: (subGoal: SubGoal) => void;
//   deleteSubGoal: (id: string) => void;
//   moveGoal: (dragIndex: number, hoverIndex: number) => void;
//   moveSubGoal: (goalId: string, dragIndex: number, hoverIndex: number) => void;
//   editingGoal: Goal | null;
//   setEditingGoal: (goal: Goal | null) => void;
//   editingSubGoal: SubGoal | null;
//   setEditingSubGoal: (subGoal: SubGoal | null) => void;
//   calculateOverallProgress: () => GoalProgress;
//   getGoalById: (id: string) => Goal | undefined;
//   getSubGoalById: (id: string) => SubGoal | undefined;
//   getSubGoalsByGoalId: (goalId: string) => SubGoal[];
// }

// const GoalContext = createContext<GoalContextType | undefined>(undefined);

// interface GoalProviderProps {
//   initialGoals?: Goal[];
//   children: ReactNode;
// }

// export const GoalProvider: React.FC<GoalProviderProps> = ({
//   initialGoals = [],
//   children,
// }) => {
//   const [goals, setGoals] = useState<Goal[]>(initialGoals);
//   const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
//   const [editingSubGoal, setEditingSubGoal] = useState<SubGoal | null>(null);

//   const fetchGoals = async () => {
//     try {
//       const fetchedGoals = await fetchGoalsApi();
//       setGoals(fetchedGoals);
//     } catch (error) {
//       console.error("Error fetching goals:", error);
//     }
//   };

//   // const addGoal = (goal: Goal) => {
//   //   setGoals((prevGoals) => [...prevGoals, goal]);
//   // };
//   const addGoal = async (goal: Goal) => {
//     try {
//       const newGoal = await addGoalApi(goal);
//       console.log("newGoal", newGoal);
//       setGoals((prevGoals) => [...prevGoals, newGoal]);
//     } catch (error) {
//       console.error("Error adding goal:", error);
//     }
//   };

//   // const updateGoal = (updatedGoal: Goal) => {
//   //   setGoals((prevGoals) =>
//   //     prevGoals.map((goal) => (goal.id === updatedGoal.id ? updatedGoal : goal))
//   //   );
//   // };

//   const updateGoal = async (updatedGoal: Goal) => {
//     try {
//       const newGoal = await updateGoalApi(updatedGoal);
//       setGoals((prevGoals) =>
//         prevGoals.map((goal) => (goal.id === updatedGoal.id ? newGoal : goal))
//       );
//     } catch (error) {
//       console.error("Error updating goal:", error);
//     }
//   };

//   // const deleteGoal = (id: string) => {
//   //   setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== id));
//   // };

//   const deleteGoal = async (id: string) => {
//     try {
//       await deleteGoalApi(id);
//       setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== id));
//     } catch (error) {
//       console.error("Error deleting goal:", error);
//     }
//   };

//   const addSubGoal = (subGoal: SubGoal) => {
//     setGoals((prevGoals) =>
//       prevGoals.map((goal) =>
//         goal.id === subGoal.goal_id
//           ? { ...goal, subGoals: [...goal.subGoals, subGoal] }
//           : goal
//       )
//     );
//   };

//   const updateSubGoal = (updatedSubGoal: SubGoal) => {
//     setGoals((prevGoals) =>
//       prevGoals.map((goal) => {
//         if (goal.id === updatedSubGoal.goal_id) {
//           const updatedSubGoals = goal.subGoals.map((subGoal) =>
//             subGoal.id === updatedSubGoal.id ? updatedSubGoal : subGoal
//           );
//           return { ...goal, subGoals: updatedSubGoals };
//         }
//         return goal;
//       })
//     );
//   };

//   const deleteSubGoal = (id: string) => {
//     setGoals((prevGoals) =>
//       prevGoals.map((goal) => ({
//         ...goal,
//         subGoals: goal.subGoals.filter((subGoal) => subGoal.id !== id),
//       }))
//     );
//   };

//   const moveGoal = (dragIndex: number, hoverIndex: number) => {
//     const newGoals = [...goals];
//     const draggedGoal = newGoals[dragIndex];
//     newGoals.splice(dragIndex, 1);
//     newGoals.splice(hoverIndex, 0, draggedGoal);
//     setGoals(newGoals);
//   };

//   const moveSubGoal = (
//     goalId: string,
//     dragIndex: number,
//     hoverIndex: number
//   ) => {
//     setGoals((prevGoals) =>
//       prevGoals.map((goal) => {
//         if (goal.id === goalId) {
//           const newSubGoals = [...goal.subGoals];
//           const draggedSubGoal = newSubGoals[dragIndex];
//           newSubGoals.splice(dragIndex, 1);
//           newSubGoals.splice(hoverIndex, 0, draggedSubGoal);
//           return { ...goal, subGoals: newSubGoals };
//         }
//         return goal;
//       })
//     );
//   };

//   const calculateOverallProgress = (): GoalProgress => {
//     if (goals.length === 0) {
//       return { percentage: 0, formattedPercentage: "0%" };
//     }

//     const totalProgress = goals.reduce((sum, goal) => sum + goal.progress, 0);
//     const percentage = totalProgress / goals.length;
//     const formattedPercentage = `${Math.round(percentage)}%`;

//     return { percentage, formattedPercentage };
//   };

//   const getGoalById = (id: string): Goal | undefined => {
//     return goals.find((goal) => goal.id === id);
//   };

//   const getSubGoalById = (id: string): SubGoal | undefined => {
//     for (const goal of goals) {
//       const subGoal = goal.subGoals.find((subGoal) => subGoal.id === id);
//       if (subGoal) return subGoal;
//     }
//     return undefined;
//   };

//   const getSubGoalsByGoalId = (goalId: string): SubGoal[] => {
//     const goal = goals.find((g) => g.id === goalId);
//     return goal ? goal.subGoals : [];
//   };

//   const value = {
//     goals,
//     fetchGoals,
//     addGoal,
//     updateGoal,
//     deleteGoal,
//     addSubGoal,
//     updateSubGoal,
//     deleteSubGoal,
//     moveGoal,
//     moveSubGoal,
//     editingGoal,
//     setEditingGoal,
//     editingSubGoal,
//     setEditingSubGoal,
//     calculateOverallProgress,
//     getGoalById,
//     getSubGoalById,
//     getSubGoalsByGoalId,
//   };

//   return <GoalContext.Provider value={value}>{children}</GoalContext.Provider>;
// };

// export const useGoalContext = (): GoalContextType => {
//   const context = useContext(GoalContext);
//   if (context === undefined) {
//     throw new Error("useGoalContext must be used within a GoalProvider");
//   }
//   return context;
// };


import React, { createContext, useState, useContext, ReactNode } from "react";
import {
  fetchGoalsApi,
  addGoalApi,
  updateGoalApi,
  deleteGoalApi,
  addSubGoalApi,
  updateSubGoalApi,
  deleteSubGoalApi,
} from "@/services/api";

// Interfaces matching your backend:
export interface SubGoal {
  id: string;
  name: string;
  goal: string; // backend field: ForeignKey to Goal (as a string id)
  // You can add additional fields if needed
}

export interface Goal {
  id: string;
  name: string;
  description: string;
  image: string;
  progress: number;
  user: string; // Read-only, provided by backend
  sub_goals: SubGoal[]; // Note: backend field is "sub_goals"
}

export interface GoalProgress {
  percentage: number;
  formattedPercentage: string;
}

interface GoalContextType {
  goals: Goal[];
  fetchGoals: () => Promise<void>;
  addGoal: (goal: FormData | Goal) => Promise<void>;
  updateGoal: (goal: Goal) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  addSubGoal: (subGoal: FormData | SubGoal) => Promise<void>;
  updateSubGoal: (subGoal: SubGoal) => Promise<void>;
  deleteSubGoal: (id: string) => Promise<void>;
  moveGoal: (dragIndex: number, hoverIndex: number) => void;
  moveSubGoal: (goalId: string, dragIndex: number, hoverIndex: number) => void;
  editingGoal: Goal | null;
  setEditingGoal: (goal: Goal | null) => void;
  editingSubGoal: SubGoal | null;
  setEditingSubGoal: (subGoal: SubGoal | null) => void;
  calculateOverallProgress: () => GoalProgress;
  getGoalById: (id: string) => Goal | undefined;
  getSubGoalById: (id: string) => SubGoal | undefined;
  getSubGoalsByGoalId: (goalId: string) => SubGoal[];
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

interface GoalProviderProps {
  initialGoals?: Goal[];
  children: ReactNode;
}

export const GoalProvider: React.FC<GoalProviderProps> = ({
  initialGoals = [],
  children,
}) => {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [editingSubGoal, setEditingSubGoal] = useState<SubGoal | null>(null);

  const fetchGoals = async () => {
    try {
      const fetchedGoals = await fetchGoalsApi();
      setGoals(fetchedGoals);
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  const addGoal = async (goal: FormData | Goal) => {
    try {
      const newGoal = await addGoalApi(goal);
      setGoals((prevGoals) => [...prevGoals, newGoal]);
    } catch (error) {
      console.error("Error adding goal:", error);
    }
  };

  const updateGoal = async (updatedGoal: Goal) => {
    try {
      const newGoal = await updateGoalApi(updatedGoal);
      setGoals((prevGoals) =>
        prevGoals.map((goal) => (goal.id === updatedGoal.id ? newGoal : goal))
      );
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      await deleteGoalApi(id);
      setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== id));
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  const addSubGoal = async (subGoal: FormData | SubGoal) => {
    try {
      const newSubGoal = await addSubGoalApi(subGoal);
      setGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal.id === newSubGoal.goal
            ? { ...goal, sub_goals: [...goal.sub_goals, newSubGoal] }
            : goal
        )
      );
    } catch (error) {
      console.error("Error adding sub-goal:", error);
    }
  };

  const updateSubGoal = async (updatedSubGoal: SubGoal) => {
    try {
      const newSubGoal = await updateSubGoalApi(updatedSubGoal);
      setGoals((prevGoals) =>
        prevGoals.map((goal) => {
          if (goal.id === updatedSubGoal.goal) {
            const updatedSubGoals = goal.sub_goals.map((subGoal) =>
              subGoal.id === updatedSubGoal.id ? newSubGoal : subGoal
            );
            return { ...goal, sub_goals: updatedSubGoals };
          }
          return goal;
        })
      );
    } catch (error) {
      console.error("Error updating sub-goal:", error);
    }
  };

  const deleteSubGoal = async (id: string) => {
    try {
      await deleteSubGoalApi(id);
      setGoals((prevGoals) =>
        prevGoals.map((goal) => ({
          ...goal,
          sub_goals: goal.sub_goals.filter((subGoal) => subGoal.id !== id),
        }))
      );
    } catch (error) {
      console.error("Error deleting sub-goal:", error);
    }
  };

  const moveGoal = (dragIndex: number, hoverIndex: number) => {
    const newGoals = [...goals];
    const draggedGoal = newGoals[dragIndex];
    newGoals.splice(dragIndex, 1);
    newGoals.splice(hoverIndex, 0, draggedGoal);
    setGoals(newGoals);
  };

  const moveSubGoal = (goalId: string, dragIndex: number, hoverIndex: number) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) => {
        if (goal.id === goalId) {
          const newSubGoals = [...goal.sub_goals];
          const draggedSubGoal = newSubGoals[dragIndex];
          newSubGoals.splice(dragIndex, 1);
          newSubGoals.splice(hoverIndex, 0, draggedSubGoal);
          return { ...goal, sub_goals: newSubGoals };
        }
        return goal;
      })
    );
  };

  const calculateOverallProgress = (): GoalProgress => {
    if (goals.length === 0) {
      return { percentage: 0, formattedPercentage: "0%" };
    }
    // Sum the progress values (assumed to be computed on the backend)
    const totalProgress = goals.reduce((sum, goal) => sum + goal.progress, 0);
    const percentage = totalProgress / goals.length;
    return { percentage, formattedPercentage: `${Math.round(percentage)}%` };
  };

  const getGoalById = (id: string): Goal | undefined => {
    return goals.find((goal) => goal.id === id);
  };

  const getSubGoalById = (id: string): SubGoal | undefined => {
    for (const goal of goals) {
      const subGoal = goal.sub_goals.find((subGoal) => subGoal.id === id);
      if (subGoal) return subGoal;
    }
    return undefined;
  };

  const getSubGoalsByGoalId = (goalId: string): SubGoal[] => {
    const goal = goals.find((g) => g.id === goalId);
    return goal ? goal.sub_goals : [];
  };

  const value = {
    goals,
    fetchGoals,
    addGoal,
    updateGoal,
    deleteGoal,
    addSubGoal,
    updateSubGoal,
    deleteSubGoal,
    moveGoal,
    moveSubGoal,
    editingGoal,
    setEditingGoal,
    editingSubGoal,
    setEditingSubGoal,
    calculateOverallProgress,
    getGoalById,
    getSubGoalById,
    getSubGoalsByGoalId,
  };

  return <GoalContext.Provider value={value}>{children}</GoalContext.Provider>;
};

export const useGoalContext = (): GoalContextType => {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error("useGoalContext must be used within a GoalProvider");
  }
  return context;
};
