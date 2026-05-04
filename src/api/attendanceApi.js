import api from "./axios";

// MARK ATTENDANCE
export const markAttendance = (data) => {
  return api.post("/manager/labours/attendance/mark", data);
};

// GET ATTENDANCE (optional `date` query if backend supports history)
export const getTodayAttendance = (params) => {
  return api.get("/manager/labours/attendance/today", { params: params || undefined });
};