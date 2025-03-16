import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "@/components/pages/home/index";
import { Button } from "./components/ui/button";

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tasks" element={<Button />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
