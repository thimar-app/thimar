import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/layouts/main-layout";
import Home from "@/pages/home";
import Goals from "@/pages/goals";
import GoalDetails from "@/pages/goal-view";
import Tasks from "./pages/tasks";
import { GoalProvider } from "./context/GoalContext";
import Pomodoro from "@/pages/pomodoro";

const App = () => {
  return (
    <GoalProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/goals/:goalId" element={<GoalDetails />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/pomodoro" element={<Pomodoro />} />
          </Routes>
        </Layout>
      </Router>
    </GoalProvider>
  );
};

export default App;
