import api from "./axios";

// MARK ATTENDANCE
export const markAttendance = (data) => {
  return api.post("/manager/labours/attendance/mark", data);
};

// GET TODAY ATTENDANCE
export const getTodayAttendance = () => {
  return api.get("/manager/labours/attendance/today");
};