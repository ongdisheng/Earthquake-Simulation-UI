import React, { useState } from "react";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";

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
  const [current, setCurrent] = useState("/");
  const navigate = useNavigate();

  const onClick = (e) => {
    setCurrent(e.key);
    navigate(e.key); // navigate to the route
  };

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
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
