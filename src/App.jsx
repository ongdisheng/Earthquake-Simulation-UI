import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SimulationForm from "./components/SimulationForm";
import SettingsForm from "./components/SettingsForm";
import AlertsPanel from "./components/AlertsPanel";
import NavBar from "./components/NavBar";
import PageCard from "./components/PageCard";
import MessageProvider from "./components/MessageProvider";

const App = () => (
  <Router>
    <MessageProvider>
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
        <Route
          path="/settings"
          element={
            <PageCard title="Settings">
              <SettingsForm />
            </PageCard>
          }
        />
        <Route path="/alerts" element={<AlertsPanel />} />
      </Routes>
    </MessageProvider>
  </Router>
);

export default App;
