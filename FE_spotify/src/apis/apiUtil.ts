import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});
api.interceptors.request.use((config: any) => {
  const userLocal = localStorage.getItem("user");
  const currentUser = userLocal ? JSON.parse(userLocal) : null;
  config.headers = {
    ...config.headers,
    Authorization: currentUser ? `Bearer ${currentUser.token}` : "",
  };
  return config;
});
export default api;
