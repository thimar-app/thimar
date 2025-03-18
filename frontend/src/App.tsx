import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "@/components/pages/home";
import Goals from "@/components/pages/goals";
import GoalDetails from "@/components/pages/goalDetails";
import Tasks from "./components/pages/tasks";
import { GoalProvider } from "./context/GoalContext";
import Pomodoro from "./components/pages/pomodoros";

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
