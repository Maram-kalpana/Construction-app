import api from "./axios";

// GET ALL PROJECTS
export const getProjects = () => {
  return api.get("/manager/my-projects");
};

// GET SINGLE PROJECT
export const getProjectById = (id) => {
  return api.get(`/manager/my-project/${id}`);
};

// GET PROJECT DASHBOARD SUMMARY
export const getProjectDashboard = (projectId) => {
  return api.get(`/manager/project-dashboard/${projectId}`);
};

// GET PROJECT TOTAL RECEIVED
export const getProjectTotalReceived = (projectId) => {
  return api.get(`/manager/project-dashboard/${projectId}/total-received`);
};