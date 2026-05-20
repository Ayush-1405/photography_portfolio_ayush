require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://career_advisor:CareerAdvisorDB1405@cluster0.94w7mbi.mongodb.net/photography?appName=Cluster0&retryWrites=true&w=majority";

async function connectDb() {
  await mongoose.connect(MONGO_URI, { dbName: "photography" });
  console.log("MongoDB connected → photography");
  await seedAdmin();
}

// ── Schemas ──────────────────────────────────────────────────────────────────

const adminSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password_hash: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    year: { type: String, required: true },
    description: { type: String, default: "" },
    src: { type: String, required: true },         // Cloudinary secure_url
    public_id: { type: String, default: null },    // Cloudinary public_id for deletion
    type: { type: String, enum: ["image", "video"], required: true },
    poster: { type: String, default: null },        // Cloudinary URL for poster
    poster_public_id: { type: String, default: null },
    sort_order: { type: Number, default: 0 },
  },
  { timestamps: true, collection: "projects" }
);

const gallerySchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["image", "video"], required: true },
    src: { type: String, required: true },         // Cloudinary secure_url
    public_id: { type: String, default: null },    // Cloudinary public_id for deletion
    span: {
      type: String,
      enum: ["normal", "tall", "wide", "large"],
      default: "tall",
    },
    caption: { type: String, default: "" },
    poster: { type: String, default: null },
    poster_public_id: { type: String, default: null },
    sort_order: { type: Number, default: 0 },
  },
  { timestamps: true, collection: "gallery" }
);

// ── Models ───────────────────────────────────────────────────────────────────

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);
const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);
const Gallery = mongoose.models.Gallery || mongoose.model("Gallery", gallerySchema);

// ── Seed default admin ────────────────────────────────────────────────────────

async function seedAdmin() {
  const exists = await Admin.findOne({ username: "admin" });
  if (!exists) {
    const hash = bcrypt.hashSync("admin123", 10);
    await Admin.create({ username: "admin", password_hash: hash });
    console.log("Default admin created — username: admin, password: admin123");
  }
}

module.exports = { connectDb, Admin, Project, Gallery };
