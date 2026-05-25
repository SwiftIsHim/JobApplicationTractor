import api from "./api";

export const listJobs = () => api.get("/jobs").then((r) => r.data);
export const getJob = (id) => api.get(`/jobs/${id}`).then((r) => r.data);
export const createJob = (payload) => api.post("/jobs", payload).then((r) => r.data);
export const updateJob = (id, payload) => api.put(`/jobs/${id}`, payload).then((r) => r.data);
export const deleteJob = (id) => api.delete(`/jobs/${id}`).then((r) => r.data);
