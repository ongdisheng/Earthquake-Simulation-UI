import React from "react";
import { Card } from "antd";
import SimulationForm from "./components/SimulationForm";

const App = () => (
  <div>
    <Card
      hoverable={false}
      title={<h1 style={{ textAlign: "center" }}>Earthquake Simulation</h1>}
      style={{ width: 600, margin: "0 auto", backgroundColor: "#f0f0f0" }}
    >
      <SimulationForm />
    </Card>
  </div>
);

export default App;
