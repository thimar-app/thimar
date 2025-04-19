import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GoalProvider } from "./context/GoalContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Login from "./components/Login";
import Register from "./components/Register";
import Layout from "./components/layouts/main-layout";
import AuthLayout from "./components/layouts/auth-layout";
import Home from "./pages/home";
import Goals from "./pages/goals";
import GoalDetails from "./pages/goal-view";
import Tasks from "./pages/tasks";
import Pomodoro from "./pages/pomodoro";
import Welcome from "./pages/Welcome";
import { Loading } from "./components/ui/loading";


// // Protected route component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  // Show loading indicator while checking authentication status
  if (loading) {
    return <Loading fullScreen />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/welcome" />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/welcome" element={<Welcome />} />
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
                        <Route path="/" element={<Home />} />
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
    </ThemeProvider>
  );
};

export default App;