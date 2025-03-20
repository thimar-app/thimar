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

export type Goals = {
  id: string;
  name: string;
  description: string;
  image: string;
  progress: number;
  user_id: string;
  subGoals: SubGoal[];
}[];

// const goals: Goals = [
//   {
//     id: "8b93e7f0-35a2-4189-9559-822f3f97fbf3",
//     name: "⚡ Improve Physical Health",
//     description:
//       "Focus on building a healthier lifestyle through exercise, diet, and wellness.",
//     image: "https://placehold.co/500x550/1e1e1e/a1a1aa",
//     progress: 22,
//     user_id: "user_123",
//     subGoals: [
//       {
//         id: "1-1",
//         name: "Exercise Regularly",
//         goal_id: "1",
//         tasks: [
//           {
//             id: "1-1-1",
//             name: "Go to the gym (3 times a week)",
//             description: "Strength training and cardio workouts.",
//             date: new Date(),
//             sub_goal_id: "1-1",
//             prayer_id: null,
//             priority: "High",
//             status: false,
//             repeat: true,
//           },
//           {
//             id: "1-1-2",
//             name: "Morning jog (5km)",
//             description: "Outdoor jogging for endurance and fitness.",
//             date: new Date(),
//             sub_goal_id: "1-1",
//             prayer_id: null,
//             priority: "Medium",
//             status: false,
//             repeat: true,
//           },
//           {
//             id: "1-1-3",
//             name: "Do 15 minutes of stretching",
//             description: "Improve flexibility and prevent injuries.",
//             date: new Date(),
//             sub_goal_id: "1-1",
//             prayer_id: null,
//             priority: "Low",
//             status: false,
//             repeat: true,
//           },
//         ],
//       },
//       {
//         id: "1-2",
//         name: "Healthy Eating",
//         goal_id: "1",
//         tasks: [
//           {
//             id: "1-2-1",
//             name: "Eat at least 5 servings of vegetables daily",
//             description: "Ensure proper nutrition with a balanced diet.",
//             date: new Date(),
//             sub_goal_id: "1-2",
//             prayer_id: null,
//             priority: "High",
//             status: false,
//             repeat: true,
//           },
//           {
//             id: "1-2-2",
//             name: "Drink 2 liters of water",
//             description: "Stay hydrated throughout the day.",
//             date: new Date(),
//             sub_goal_id: "1-2",
//             prayer_id: null,
//             priority: "Medium",
//             status: false,
//             repeat: true,
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: "e27229e6-d21d-453f-ad27-ff44071be057",
//     name: "💻 Build a Web App (SaaS Platform)",
//     description:
//       "Develop a SaaS-based web application to solve a real-world problem.",
//     image: "https://placehold.co/500x550/1e1e1e/a1a1aa",
//     progress: 77,
//     user_id: "user_123",
//     subGoals: [
//       {
//         id: "2-1",
//         name: "Research & Planning",
//         goal_id: "2",
//         tasks: [
//           {
//             id: "2-1-1",
//             name: "Identify a profitable SaaS idea",
//             description: "Find a market gap and validate an idea.",
//             date: new Date(),
//             sub_goal_id: "2-1",
//             prayer_id: null,
//             priority: "High",
//             status: false,
//             repeat: false,
//           },
//         ],
//       },
//       {
//         id: "2-2",
//         name: "Development",
//         goal_id: "2",
//         tasks: [
//           {
//             id: "2-2-1",
//             name: "Set up Next.js & Tailwind project",
//             description: "Initialize the project with required dependencies.",
//             date: new Date(),
//             sub_goal_id: "2-2",
//             prayer_id: null,
//             priority: "High",
//             status: false,
//             repeat: false,
//           },
//           {
//             id: "2-2-2",
//             name: "Build authentication & user dashboard",
//             description: "Implement secure login and a dashboard for users.",
//             date: new Date(),
//             sub_goal_id: "2-2",
//             prayer_id: null,
//             priority: "High",
//             status: false,
//             repeat: false,
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: "67d6e6b8-7d40-800e-94b1-1fa06b3309c6",
//     name: "📚 Complete a 30-Day Reading Challenge",
//     description:
//       "Read daily for 30 days to develop a consistent reading habit.",
//     image: "https://placehold.co/500x550/1e1e1e/a1a1aa",
//     progress: 36,
//     user_id: "user_123",
//     subGoals: [
//       {
//         id: "3-1",
//         name: "Choose Books",
//         goal_id: "3",
//         tasks: [
//           {
//             id: "3-1-1",
//             name: "Select 3 books to read this month",
//             description: "Pick books based on interest and learning goals.",
//             date: new Date(),
//             sub_goal_id: "3-1",
//             prayer_id: null,
//             priority: "High",
//             status: false,
//             repeat: false,
//           },
//         ],
//       },
//       {
//         id: "3-2",
//         name: "Daily Reading Habit",
//         goal_id: "3",
//         tasks: [
//           {
//             id: "3-2-1",
//             name: "Read for 30 minutes daily",
//             description: "Develop a habit of consistent reading.",
//             date: new Date(),
//             sub_goal_id: "3-2",
//             prayer_id: null,
//             priority: "High",
//             status: false,
//             repeat: true,
//           },
//         ],
//       },
//     ],
//   },
// ];

// export default goals;
