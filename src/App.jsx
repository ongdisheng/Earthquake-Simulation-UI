import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SimulationForm from "./components/SimulationForm";
import NavBar from "./components/NavBar";
import PageCard from "./components/PageCard";

const App = () => (
  <Router>
    <NavBar />
    <Routes>
      <Route
        path="/"
        element={
          <PageCard title="Earthquake Simulator">
            <SimulationForm />
          </PageCard>
        }
      />
    </Routes>
  </Router>
);

export default App;
