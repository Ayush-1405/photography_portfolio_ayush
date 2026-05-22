const express = require("express");
const { Project, Gallery } = require("../db");
const { requireAuth } = require("../middleware/auth");
const router = express.Router();

// This route allows "syncing" (seeding) the database with initial static data
// if it's empty, or specifically requested.
router.post("/static", requireAuth, async (req, res) => {
  try {
    const { projects, gallery } = req.body;
    let addedProjects = 0;
    let addedGallery = 0;

    if (Array.isArray(projects)) {
      for (const p of projects) {
        // Check if project already exists by title
        const exists = await Project.findOne({ title: p.title });
        if (!exists) {
          await Project.create({
            title: p.title,
            category: p.category,
            year: p.year,
            description: p.description || "",
            src: p.src,
            type: p.type || "image",
            sort_order: p.id || 0,
          });
          addedProjects++;
        }
      }
    }

    if (Array.isArray(gallery)) {
      for (const g of gallery) {
        // Check if gallery item already exists by src
        const exists = await Gallery.findOne({ src: g.src });
        if (!exists) {
          await Gallery.create({
            type: g.type || "image",
            src: g.src,
            span: g.span || "tall",
            caption: g.caption || "",
            sort_order: g.id || 0,
          });
          addedGallery++;
        }
      }
    }

    res.json({
      message: "Sync complete",
      addedProjects,
      addedGallery,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
