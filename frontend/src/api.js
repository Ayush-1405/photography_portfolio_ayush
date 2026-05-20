// Frontend API client — fetches from the backend
const BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export async function fetchProjects() {
  try {
    const res = await fetch(`${BASE}/projects`);
    if (!res.ok) throw new Error("Failed to fetch projects");
    return res.json();
  } catch {
    return null; // fall back to static data
  }
}

export async function fetchGallery() {
  try {
    const res = await fetch(`${BASE}/gallery`);
    if (!res.ok) throw new Error("Failed to fetch gallery");
    return res.json();
  } catch {
    return null; // fall back to static data
  }
}
