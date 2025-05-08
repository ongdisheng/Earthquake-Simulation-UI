import React from "react";
import { Card } from "antd";

const PageCard = ({ title, children }) => {
  return (
    <div style={{ marginTop: "40px" }}>
      <Card
        hoverable={false}
        title={<h1 style={{ textAlign: "center" }}>{title}</h1>}
        style={{
          width: 600,
          margin: "0 auto",
          backgroundColor: "#f0f0f0",
          paddingBottom: "20px",
        }}
      >
        {children}
      </Card>
    </div>
  );
};

export default PageCard;
