import api from "./axios";

// ✅ GET ALL PROJECTS
export const getProjects = () => {
  return api.get("/manager/my-projects");
};

// ✅ GET SINGLE PROJECT
export const getProjectById = (id) => {
  return api.get(`/manager/my-project/${id}`);
};