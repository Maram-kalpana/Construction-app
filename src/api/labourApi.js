import api from "./axios";

// GET LIST (optional `project_id` query when backend supports it)
export const getLabours = (params) => {
  return api.get("/manager/labours/list", { params: params || undefined });
};

// ADD
export const addLabour = (data) => {
  return api.post("/manager/labours/add", data);
};

// SHOW
export const getLabourById = (id) => {
  return api.get(`/manager/labours/show/${id}`);
};

// UPDATE
export const updateLabour = (id, data) => {
  return api.post(`/manager/labours/update/${id}`, data);
};

// DELETE
export const deleteLabour = (id) => {
  return api.delete(`/manager/labours/delete/${id}`);
};

// ─── WORK ENTRIES ────────────────────────────────────────────────

// ADD WORK
export const addWork = (data) => {
  return api.post("/manager/labours/add-work", data);
};

// UPDATE WORK (by work_group_id)
export const updateWork = (workGroupId, data) => {
  return api.put(`/manager/labours/update-work/${workGroupId}`, data);
};

// WORK LIST (optional ?date= query)
export const getWorkList = (params) => {
  return api.get("/manager/labours/work-list", { params: params || undefined });
};

// WORK DETAILS
export const getWorkDetails = (id) => {
  return api.get(`/manager/labours/work-details/${id}`);
};