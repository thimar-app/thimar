import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "@/components/pages/home";
import Goals from "@/components/pages/goals";
import GoalDetails from "@/components/pages/goalDetails"; // Rename Tasks to GoalDetails

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/goals/:goalId" element={<GoalDetails />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
