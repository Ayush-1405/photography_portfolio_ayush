const express = require("express");
const { Project } = require("../db");
const { requireAuth } = require("../middleware/auth");
const { projectUpload } = require("../middleware/upload");
const { uploadToCloudinary, deleteFromCloudinary } = require("../services/cloudinary");

const router = express.Router();

function getResourceType(file) {
  const videoMime = ["video/mp4", "video/quicktime", "video/webm"];
  const videoExt = /\.(mp4|mov|webm)$/i;
  if (videoMime.includes(file.mimetype) || videoExt.test(file.originalname)) {
    return "video";
  }
  return "image";
}

async function uploadFile(file, subfolder) {
  if (!file || !file.buffer) {
    throw new Error(`uploadFile: no buffer for field "${file?.fieldname}"`);
  }
  const resource_type = getResourceType(file);
  const result = await uploadToCloudinary(file.buffer, {
    folder: `gallery/${subfolder}`,
    resource_type,
  });
  return { ...result, resource_type };
}

// GET /api/projects
router.get("/", async (req, res) => {
  try {
    const rows = await Project.find().sort({ sort_order: 1, createdAt: -1 }).lean();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/projects/:id
router.get("/:id", async (req, res) => {
  try {
    const row = await Project.findById(req.params.id).lean();
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/projects
router.post(
  "/",
  requireAuth,
  projectUpload.fields([
    { name: "media", maxCount: 1 },
    { name: "poster", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, category, year, description, src, sort_order } = req.body;
      let calculatedType = req.body.type;

      if (!title || !category || !year) {
        return res.status(400).json({ error: "title, category, and year are required" });
      }

      let mediaSrc = src || null;
      let mediaPublicId = null;

      if (req.files?.media?.[0]) {
        const result = await uploadFile(req.files.media[0], "project");
        mediaSrc = result.secure_url;
        mediaPublicId = result.public_id;
        calculatedType = result.resource_type; // Strict override from file detection
      }

      if (!mediaSrc) {
        return res.status(400).json({ error: "Media file or src URL is required" });
      }

      // Safeguard validation against enum mismatch
      if (calculatedType !== "image" && calculatedType !== "video") {
        calculatedType = "image";
      }

      let posterSrc = null;
      let posterPublicId = null;
      if (req.files?.poster?.[0]) {
        const result = await uploadFile(req.files.poster[0], "project");
        posterSrc = result.secure_url;
        posterPublicId = result.public_id;
      }

      const project = await Project.create({
        title,
        category,
        year,
        description: description || "",
        type: calculatedType,
        src: mediaSrc,
        public_id: mediaPublicId,
        poster: posterSrc,
        poster_public_id: posterPublicId,
        sort_order: parseInt(sort_order) || 0,
      });

      res.status(201).json(project);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// PUT /api/projects/:id
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
        if (existing.public_id) {
          await deleteFromCloudinary(existing.public_id, existing.type === "video" ? "video" : "image");
        }
        const result = await uploadFile(req.files.media[0], "project");
        existing.src = result.secure_url;
        existing.public_id = result.public_id;
        existing.type = result.resource_type;
      } else if (src && src !== existing.src) {
        existing.src = src;
        existing.public_id = null;
      }

      if (req.files?.poster?.[0]) {
        if (existing.poster_public_id) {
          await deleteFromCloudinary(existing.poster_public_id, "image");
        }
        const result = await uploadFile(req.files.poster[0], "project");
        existing.poster = result.secure_url;
        existing.poster_public_id = result.public_id;
      }

      if (title !== undefined) existing.title = title;
      if (category !== undefined) existing.category = category;
      if (year !== undefined) existing.year = year;
      if (description !== undefined) existing.description = description;
      if (type !== undefined && (type === "image" || type === "video")) existing.type = type;
      if (sort_order !== undefined) existing.sort_order = parseInt(sort_order);

      await existing.save();
      res.json(existing);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// DELETE /api/projects/:id
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const existing = await Project.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: "Not found" });

    if (existing.public_id) {
      await deleteFromCloudinary(existing.public_id, existing.type === "video" ? "video" : "image");
    }
    if (existing.poster_public_id) {
      await deleteFromCloudinary(existing.poster_public_id, "image");
    }

    await existing.deleteOne();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;