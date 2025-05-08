// src/components/MessageProvider.js
import React from "react";
import { message } from "antd";
import { setMessageApi } from "../utils/notificationHelper";

const MessageProvider = ({ children }) => {
  const [messageApi, contextHolder] = message.useMessage();

  // set messageApi once
  setMessageApi(messageApi);

  return (
    <>
      {contextHolder}
      {children}
    </>
  );
};

export default MessageProvider;
