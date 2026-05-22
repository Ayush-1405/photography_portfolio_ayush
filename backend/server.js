require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDb } = require("./db");

const authRoutes    = require("./routes/auth");
const projectRoutes = require("./routes/projects");
const galleryRoutes = require("./routes/gallery");
const syncRoutes    = require("./routes/sync");

const app  = express();
const PORT = process.env.PORT || 4000;

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5175",
    "http://127.0.0.1:5176",
    "https://photography-portfolio-ayush-admin.onrender.com",
    "https://photography-portfolio-ayush.onrender.com",
  ],
  credentials: true,
}));

// ── Body parsers ──────────────────────────────────────────────────────────────
// NOTE: do NOT set a body size limit here — multer handles multipart/form-data
// directly from the raw stream, bypassing express.json(). Setting a limit here
// only affects JSON bodies, not file uploads.
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ extended: true, limit: "500mb" }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth",     authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/gallery",  galleryRoutes);
app.use("/api/sync",     syncRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

// ── Start ─────────────────────────────────────────────────────────────────────
connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
