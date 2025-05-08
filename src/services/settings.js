import axios from "axios";
const baseUrl = `${import.meta.env.VITE_BACKEND_BASE_URL}`;
const alertSuppressTimeUrl = baseUrl + "/api/settings/alert-suppress-time";

export const getAlertSuppressTime = () => {
  return axios.get(alertSuppressTimeUrl);
};

export const updateAlertSuppressTime = (updatedTime) => {
  return axios.put(alertSuppressTimeUrl, updatedTime);
};
