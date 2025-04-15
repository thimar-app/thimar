import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Register from "./components/Register";
import Home from "./components/pages/home";
import { GoalProvider } from "./context/GoalContext";
import Layout from "./Layout";
import Goals from "./components/pages/goals";
import GoalDetails from "./components/pages/goalDetails";
import Tasks from "./components/pages/tasks";
import Pomodoro from "./components/pages/pomodoros";

// const App = () => {
//   return (
//     <GoalProvider>
//       <Router>
      
//         <Layout>
//           <Routes>
//             <Route path="/home" element={<Home />} />
//             <Route path="/goals" element={<Goals />} />
//             <Route path="/goals/:goalId" element={<GoalDetails />} />
//             <Route path="/tasks" element={<Tasks />} />
//             <Route path="/pomodoro" element={<Pomodoro />} />
//           </Routes>
//         </Layout>
//       </Router>
//     </GoalProvider>
//   );
// };

// export default App;






// // Protected route component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <GoalProvider>
                  <Layout>
                    <Routes>
                      <Route path="/home" element={<Home />} />
                      <Route path="/goals" element={<Goals />} />
                      <Route path="/goals/:goalId" element={<GoalDetails />} />
                      <Route path="/tasks" element={<Tasks />} />
                      <Route path="/pomodoro" element={<Pomodoro />} />
                    </Routes>
                  </Layout>
                </GoalProvider>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;