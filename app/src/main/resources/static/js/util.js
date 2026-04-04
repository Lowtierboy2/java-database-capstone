// util.js

// ===============================
// ROLE HELPERS
// ===============================
export function setRole(role) {
  localStorage.setItem("userRole", role);
}

export function getRole() {
  return localStorage.getItem("userRole");
}

export function clearRole() {
  localStorage.removeItem("userRole");
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