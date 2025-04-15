import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GoalProvider } from "./context/GoalContext";
import Login from "./components/Login";
import Register from "./components/Register";
import Layout from "./components/layouts/main-layout";
import AuthLayout from "./components/layouts/auth-layout";
import Home from "./pages/home";
import Goals from "./pages/goals";
import GoalDetails from "./pages/goal-view";
import Tasks from "./pages/tasks";
import Pomodoro from "./pages/pomodoro";

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
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          } />
          <Route path="/register" element={
            <AuthLayout>
              <Register />
            </AuthLayout>
          } />
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