// Use VITE_API_URL env var if set, otherwise fall back to local backend
const BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

function getToken() {
  return localStorage.getItem("admin_token");
}

function authHeaders() {
  return { Authorization: `Bearer ${getToken()}` };
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function login(username, password) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Login failed");
  return data;
}

export async function changePassword(currentPassword, newPassword) {
  const res = await fetch(`${BASE}/auth/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed");
  return data;
}

// ── Projects ──────────────────────────────────────────────────────────────────

export async function getProjects() {
  const res = await fetch(`${BASE}/projects`);
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
}

export async function createProject(formData) {
  const res = await fetch(`${BASE}/projects`, {
    method: "POST",
    headers: authHeaders(),   // NO Content-Type — browser sets it with boundary for FormData
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to create project");
  return data;
}

export async function updateProject(id, formData) {
  const res = await fetch(`${BASE}/projects/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update project");
  return data;
}

export async function deleteProject(id) {
  const res = await fetch(`${BASE}/projects/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to delete project");
  return data;
}

// ── Gallery ───────────────────────────────────────────────────────────────────

export async function getGallery() {
  const res = await fetch(`${BASE}/gallery`);
  if (!res.ok) throw new Error("Failed to fetch gallery");
  return res.json();
}

export async function createGalleryItem(formData) {
  const res = await fetch(`${BASE}/gallery`, {
    method: "POST",
    headers: authHeaders(),   // NO Content-Type — browser sets it with boundary for FormData
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to create gallery item");
  return data;
}

export async function updateGalleryItem(id, formData) {
  const res = await fetch(`${BASE}/gallery/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update gallery item");
  return data;
}

export async function deleteGalleryItem(id) {
  const res = await fetch(`${BASE}/gallery/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to delete gallery item");
  return data;
}

// ── Sync ──────────────────────────────────────────────────────────────────────

export async function syncStaticData(payload) {
  const res = await fetch(`${BASE}/sync/static`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to sync data");
  return data;
}
