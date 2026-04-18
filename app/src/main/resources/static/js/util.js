// util.js

const ROLE_KEY = "userRole";
const LEGACY_ROLE_KEY = "role";

export function normalizeRole(role) {
  if (!role) return null;

  const lowered = role.toLowerCase();
  switch (lowered) {
    case "admin":
      return "admin";
    case "doctor":
      return "doctor";
    case "patient":
      return "patient";
    case "loggedpatient":
      return "loggedPatient";
    default:
      return role;
  }
}

// ===============================
// ROLE HELPERS
// ===============================
export function setRole(role) {
  const normalized = normalizeRole(role);
  if (!normalized) return;

  localStorage.setItem(ROLE_KEY, normalized);
  localStorage.setItem(LEGACY_ROLE_KEY, normalized);
}

export function getRole() {
  return normalizeRole(localStorage.getItem(ROLE_KEY) || localStorage.getItem(LEGACY_ROLE_KEY));
}

export function clearRole() {
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(LEGACY_ROLE_KEY);
}

// ===============================
// DEBOUNCE
// ===============================
export function debounce(fn, delay = 300) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// ===============================
// DATE FORMATTER (YYYY-MM-DD → DD/MM/YYYY)
// ===============================
export function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}
