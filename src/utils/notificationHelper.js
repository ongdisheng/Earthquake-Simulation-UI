let messageApi = null;

export const setMessageApi = (api) => {
  messageApi = api;
};

export const notify = (type, message) => {
  if (!messageApi) {
    console.warn("messageApi not initialized");
    return;
  }

  messageApi.open({
    type,
    content: message,
  });
};
