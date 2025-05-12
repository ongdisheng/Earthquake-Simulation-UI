import React, { useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SimulationForm from "./components/SimulationForm";
import SettingsForm from "./components/SettingsForm";
import AlertsPanel from "./components/AlertsPanel";
import NavBar from "./components/NavBar";
import PageCard from "./components/PageCard";
import MessageProvider from "./components/MessageProvider";

const App = () => {
  const ws = useRef(null);
  const hasInitialized = useRef(false);
  const alertsPanelRef = useRef(null);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    ws.current = new WebSocket(import.meta.env.VITE_BACKEND_WEBSOCKET_URL);

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const alert =
          typeof data.alert === "string" ? JSON.parse(data.alert) : data.alert;

        switch (data.type) {
          case "AUTOCLOSED":
            alertsPanelRef.current?.handleAutoClose(alert.id);
            break;
          case "ADD":
            // handleAdd(alert);
            break;
          default:
            console.warn("Unhandled type:", data.type);
        }
      } catch (err) {
        console.error("WebSocket message error", err);
      }
    };

    return () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    };
  }, []);

  return (
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
          <Route
            path="/alerts"
            element={<AlertsPanel ref={alertsPanelRef} />}
          />
        </Routes>
      </MessageProvider>
    </Router>
  );
};

export default App;
