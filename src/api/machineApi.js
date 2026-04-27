import api from "./axios";

// 🔥 GET LIST (REAL DATA)
export const getEquipmentEntries = (params) =>
  api.get("/manager/equipment-entries", { params });

// 🔥 ADD ENTRY
export const addMachine = (data) =>
  api.post("/manager/equipment-entries/add", data);

// 🔥 UPDATE ENTRY
export const updateMachine = (id, data) =>
  api.post(`/manager/equipment-entries/update/${id}`, data);

// 🔥 DELETE ENTRY
export const deleteMachine = (id) =>
  api.post(`/manager/equipment-entries/delete/${id}`);