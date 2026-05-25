import api from "./api";

export const loginRequest = (email, password) =>
  api.post("/auth/login", { email, password }).then((r) => r.data);

export const registerRequest = (name, email, password) =>
  api.post("/auth/register", { name, email, password }).then((r) => r.data);

export const profileRequest = () => api.get("/auth/profile").then((r) => r.data);
