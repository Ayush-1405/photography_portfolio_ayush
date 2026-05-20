const express = require("express");
const path = require("path");
const fs = require("fs");
const { Project } = require("../db");
const { requireAuth } = require("../middleware/auth");
const { projectUpload } = require("../middleware/upload");

const router = express.Router();

// GET /api/projects — public
router.get("/", async (req, res) => {
  try {
    const rows = await Project.find().sort({ sort_order: 1, createdAt: -1 }).lean();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/projects/:id — public
router.get("/:id", async (req, res) => {
  try {
    const row = await Project.findById(req.params.id).lean();
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/projects — protected
router.post(
  "/",
  requireAuth,
  projectUpload.fields([
    { name: "media", maxCount: 1 },
    { name: "poster", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, category, year, description, src, type, sort_order } = req.body;

      if (!title || !category || !year || !type) {
        return res.status(400).json({ error: "title, category, year, type are required" });
      }

      let mediaSrc = src || null;
      let posterSrc = null;

      if (req.files?.media?.[0]) {
        mediaSrc = `/uploads/project/${req.files.media[0].filename}`;
      }
      if (req.files?.poster?.[0]) {
        posterSrc = `/uploads/project/${req.files.poster[0].filename}`;
      }

      if (!mediaSrc) {
        return res.status(400).json({ error: "Media file or src URL is required" });
      }

      const project = await Project.create({
        title,
        category,
        year,
        description: description || "",
        src: mediaSrc,
        type,
        poster: posterSrc || null,
        sort_order: parseInt(sort_order) || 0,
      });

      res.status(201).json(project);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// PUT /api/projects/:id — protected
router.put(
  "/:id",
  requireAuth,
  projectUpload.fields([
    { name: "media", maxCount: 1 },
    { name: "poster", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const existing = await Project.findById(req.params.id);
      if (!existing) return res.status(404).json({ error: "Not found" });

      const { title, category, year, description, src, type, sort_order } = req.body;

      if (req.files?.media?.[0]) {
        deleteUpload(existing.src);
        existing.src = `/uploads/project/${req.files.media[0].filename}`;
      } else if (src) {
        existing.src = src;
      }

      if (req.files?.poster?.[0]) {
        deleteUpload(existing.poster);
        existing.poster = `/uploads/project/${req.files.poster[0].filename}`;
      }

      if (title) existing.title = title;
      if (category) existing.category = category;
      if (year) existing.year = year;
      if (description !== undefined) existing.description = description;
      if (type) existing.type = type;
      if (sort_order !== undefined) existing.sort_order = parseInt(sort_order);

      await existing.save();
      res.json(existing);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// DELETE /api/projects/:id — protected
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const existing = await Project.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: "Not found" });

    deleteUpload(existing.src);
    deleteUpload(existing.poster);

    await existing.deleteOne();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function deleteUpload(src) {
  if (src && src.startsWith("/uploads/")) {
    const p = path.join(__dirname, "../..", src);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }
}

module.exports = router;
