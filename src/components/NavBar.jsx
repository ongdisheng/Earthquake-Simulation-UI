import React from "react";
import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

// navigation bar items
const items = [
  {
    label: "Home",
    key: "/",
  },
  {
    label: "Alerts",
    key: "/alerts",
  },
  {
    label: "Settings",
    key: "/settings",
  },
];

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const onClick = (e) => {
    navigate(e.key); // navigate to the route
  };

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[location.pathname]}
      mode="horizontal"
      items={items}
      theme="dark"
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    />
  );
};

export default NavBar;
