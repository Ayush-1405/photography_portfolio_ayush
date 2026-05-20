// Frontend API — fetches live data from the backend.
// VITE_API_URL must NOT have quotes around it in .env
const BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export async function fetchProjects() {
  try {
    const res = await fetch(`${BASE}/projects`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn("[fetchProjects] failed:", err.message);
    return [];
  }
}

export async function fetchGallery() {
  try {
    const res = await fetch(`${BASE}/gallery`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn("[fetchGallery] failed:", err.message);
    return [];
  }
}
