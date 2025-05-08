// src/components/MessageProvider.js
import React from "react";
import { message } from "antd";
import { setMessageApi } from "../utils/notificationHelper";
import PropTypes from "prop-types";

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

MessageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MessageProvider;
