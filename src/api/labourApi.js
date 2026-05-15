import api from "./axios";

/**
 * Labour APIs (base: axios baseURL + path)
 *
 * GET  /manager/labours/list?date=YYYY-MM-DD[&project_id=][&attendance=present|absent]
 * POST /manager/labours/add-work
 * POST /manager/labours/update-work/{work_group_id}
 * GET  /manager/labours/work-list?date=YYYY-MM-DD[&project_id=]
 * GET  /manager/labours/work-details/{work_group_id}
 */

// ─── LABOUR CRUD ────────────────────────────────────────────────

// GET LIST — ?date=YYYY-MM-DD, optional ?attendance=present|absent, ?project_id=
export const getLabours = (params) => {
  console.log("[labourApi] getLabours params:", JSON.stringify(params));
  return api.get("/manager/labours/list", { params: params || undefined });
};

// ADD
export const addLabour = (data) => {
  console.log("[labourApi] addLabour payload:", JSON.stringify(data));
  return api.post("/manager/labours/add", data);
};

// SHOW
export const getLabourById = (id) => {
  return api.get(`/manager/labours/show/${id}`);
};

// UPDATE
export const updateLabour = (id, data) => {
  console.log(`[labourApi] updateLabour(${id}):`, JSON.stringify(data));
  return api.post(`/manager/labours/update/${id}`, data);
};

// DELETE
export const deleteLabour = (id) => {
  console.log(`[labourApi] deleteLabour(${id})`);
  return api.delete(`/manager/labours/delete/${id}`);
};

// ─── WORK ENTRIES ────────────────────────────────────────────────

// ADD WORK
export const addWork = (data) => {
  console.log("[labourApi] addWork payload:", JSON.stringify(data));
  return api.post("/manager/labours/add-work", data);
};

// UPDATE WORK — URL: /manager/labours/update-work/{work_group_id}
export const updateWork = (workGroupId, data) => {
  console.log(`[labourApi] updateWork(${workGroupId}):`, JSON.stringify(data));
  const id = encodeURIComponent(String(workGroupId));
  return api.post(`/manager/labours/update-work/${id}`, data);
};

// WORK LIST — ?date=YYYY-MM-DD[&project_id=]
export const getWorkList = (params) => {
  console.log("[labourApi] getWorkList params:", JSON.stringify(params));
  return api.get("/manager/labours/work-list", { params: params || undefined });
};

// WORK DETAILS — /manager/labours/work-details/{work_group_id}
export const getWorkDetails = (workGroupId) => {
  const id = encodeURIComponent(String(workGroupId));
  console.log(`[labourApi] getWorkDetails(${id})`);
  return api.get(`/manager/labours/work-details/${id}`);
};