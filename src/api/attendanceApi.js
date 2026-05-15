import api from "./axios";

/**
 * Attendance — app expects these routes under the API base URL:
 *
 * POST /manager/labours/attendance/mark
 *   Body (typical): { labour_ids: [id], date: "YYYY-MM-DD", is_present: 0|1, project_id? }
 *   Used for both checking and unchecking; is_present: 0 must be accepted.
 *
 * GET /manager/labours/attendance/today?date=YYYY-MM-DD&project_id?
 *   Must return rows for that calendar date (not only "today"), including absent rows if applicable.
 */
export const markAttendance = (data) => {
  return api.post("/manager/labours/attendance/mark", data);
};

// GET ATTENDANCE (optional `date` query if backend supports history)
export const getTodayAttendance = (params) => {
  return api.get("/manager/labours/attendance/today", { params: params || undefined });
};