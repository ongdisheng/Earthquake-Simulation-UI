import axios from "axios";
const baseUrl = `${import.meta.env.VITE_DISPATCHER_API_URL}`;

const create = (newObject) => {
  return axios.post(baseUrl, newObject);
};

export default { create };
