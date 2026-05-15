/**
 * Calendar YYYY-MM-DD in the device local timezone (avoids UTC day-shift from toISOString()).
 */

export function formatDateOnlyLocal(dateInput) {
  if (dateInput == null || dateInput === '') return '';
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Parse YYYY-MM-DD as a local calendar date (no UTC midnight interpretation). */
export function parseDateLocalYmd(ymd) {
  if (ymd == null || ymd === '') return new Date();
  const s = String(ymd).trim().slice(0, 10);
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return new Date(ymd);
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const da = Number(m[3]);
  if (!Number.isFinite(y) || !Number.isFinite(mo) || !Number.isFinite(da)) return new Date(ymd);
  return new Date(y, mo - 1, da);
}

/**
 * Normalize stored value to YYYY-MM-DD. Plain date strings are kept as-is;
 * Date objects and timestamps use the local calendar day.
 */
export function toDateOnlyLocal(val) {
  if (val == null || val === '') return '';
  if (typeof val === 'string') {
    const s = val.trim().slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  }
  const d = val instanceof Date ? val : new Date(val);
  if (Number.isNaN(d.getTime())) return '';
  return formatDateOnlyLocal(d);
}
