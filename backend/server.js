require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { connectDb } = require("./db");

const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");
const galleryRoutes = require("./routes/gallery");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "https://photography-portfolio-ayush-admin.onrender.com", "https://photography-portfolio-ayush.onrender.com"],
  credentials: true,
}));
app.use(express.json());

// Serve uploaded files statically
const uploadsDir = path.join(__dirname, "uploads");
["gallery", "project"].forEach((sub) => {
  const dir = path.join(uploadsDir, sub);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});
app.use("/uploads", express.static(uploadsDir));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/gallery", galleryRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Connect DB then start
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
