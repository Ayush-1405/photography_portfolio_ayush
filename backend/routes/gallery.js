const express = require("express");
const path = require("path");
const fs = require("fs");
const { Gallery } = require("../db");
const { requireAuth } = require("../middleware/auth");
const { galleryUpload } = require("../middleware/upload");

const router = express.Router();

// GET /api/gallery — public
router.get("/", async (req, res) => {
  try {
    const rows = await Gallery.find().sort({ sort_order: 1, createdAt: -1 }).lean();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/gallery — protected
router.post(
  "/",
  requireAuth,
  galleryUpload.fields([
    { name: "media", maxCount: 1 },
    { name: "poster", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { type, span, caption, src, sort_order } = req.body;

      if (!type) return res.status(400).json({ error: "type is required" });

      let mediaSrc = src || null;
      let posterSrc = null;

      if (req.files?.media?.[0]) {
        mediaSrc = `/uploads/gallery/${req.files.media[0].filename}`;
      }
      if (req.files?.poster?.[0]) {
        posterSrc = `/uploads/gallery/${req.files.poster[0].filename}`;
      }

      if (!mediaSrc) {
        return res.status(400).json({ error: "Media file or src URL is required" });
      }

      const item = await Gallery.create({
        type,
        src: mediaSrc,
        span: span || "tall",
        caption: caption || "",
        poster: posterSrc || null,
        sort_order: parseInt(sort_order) || 0,
      });

      res.status(201).json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// PUT /api/gallery/:id — protected
router.put(
  "/:id",
  requireAuth,
  galleryUpload.fields([
    { name: "media", maxCount: 1 },
    { name: "poster", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const existing = await Gallery.findById(req.params.id);
      if (!existing) return res.status(404).json({ error: "Not found" });

      const { type, span, caption, src, sort_order } = req.body;

      if (req.files?.media?.[0]) {
        deleteUpload(existing.src);
        existing.src = `/uploads/gallery/${req.files.media[0].filename}`;
      } else if (src) {
        existing.src = src;
      }

      if (req.files?.poster?.[0]) {
        deleteUpload(existing.poster);
        existing.poster = `/uploads/gallery/${req.files.poster[0].filename}`;
      }

      if (type) existing.type = type;
      if (span) existing.span = span;
      if (caption !== undefined) existing.caption = caption;
      if (sort_order !== undefined) existing.sort_order = parseInt(sort_order);

      await existing.save();
      res.json(existing);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// DELETE /api/gallery/:id — protected
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const existing = await Gallery.findById(req.params.id);
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
