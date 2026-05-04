/** Resolve project id from labour API row (flat or nested; common backend shapes). */
export function labourProjectIdFromRow(item) {
  if (!item || typeof item !== 'object') return null;
  const fromProjects = Array.isArray(item.projects) && item.projects[0]?.id != null
    ? item.projects[0].id
    : null;
  return (
    item.project_id ??
    item.projectId ??
    item.fk_project_id ??
    item.building_project_id ??
    item.project?.id ??
    fromProjects ??
    null
  );
}

function projectIdsMatch(a, b) {
  if (a == null || b == null) return false;
  if (String(a) === String(b)) return true;
  const na = Number(a);
  const nb = Number(b);
  if (Number.isFinite(na) && Number.isFinite(nb) && na === nb) return true;
  return false;
}

/**
 * Row belongs to project only when its resolved project id matches (strict).
 * Rows with no project id are excluded when viewing a specific project — otherwise they leak into every site.
 */
export function labourBelongsToProject(rowOrRaw, projectId) {
  if (projectId == null || projectId === '') return true;
  const rid = labourProjectIdFromRow(rowOrRaw);
  if (rid == null || rid === '') return false;
  return projectIdsMatch(rid, projectId);
}

/**
 * When the list API is called with `project_id` but rows omit it, attach it so belongs checks work.
 */
export function labourRowWithInferredProject(rawItem, contextProjectId) {
  if (!rawItem || typeof rawItem !== 'object') return rawItem;
  const existing = labourProjectIdFromRow(rawItem);
  if (existing != null && existing !== '') return rawItem;
  if (contextProjectId == null || contextProjectId === '') return rawItem;
  return { ...rawItem, project_id: contextProjectId };
}

/** Drop attendance rows that belong to another project (when API sends project_id). */
export function attendanceBelongsToProject(record, projectId) {
  if (projectId == null || projectId === '') return true;
  const ap = record?.project_id ?? record?.project?.id;
  if (ap == null || ap === '') return true;
  return projectIdsMatch(ap, projectId);
}

/** Compare project ids on work-log entries vs screen (avoids '' === '' across different projects). */
export function sameScopedProject(entryProjectId, screenProjectId) {
  const a =
    entryProjectId == null || entryProjectId === '' ? '__none__' : String(entryProjectId);
  const b =
    screenProjectId == null || screenProjectId === '' ? '__none__' : String(screenProjectId);
  return a === b;
}
