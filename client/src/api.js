import axios from "axios";

const base = import.meta.env.VITE_API_URL || "";
const api = axios.create({ baseURL: base + "/api" });

api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem("token");
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && localStorage.getItem("token")) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const assetUrl = (u) => (!u ? "" : u.startsWith("/uploads") ? base + u : u);
export default api;