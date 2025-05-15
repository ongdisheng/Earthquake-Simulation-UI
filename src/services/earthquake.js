import axios from "axios";
const baseUrl = `${import.meta.env.VITE_BACKEND_BASE_URL || ""}/api/earthquake`;

const create = (newObject) => {
  return axios.post(baseUrl, newObject);
};

const getAlerts = async () => {
  const response = await axios.get(baseUrl + "/alerts");
  return response;
};

const updateAlert = (id, updatedData) => {
  return axios.put(baseUrl + `/alerts/${id}`, updatedData);
};

export default { create, getAlerts, updateAlert };
