const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

function makeStorage(folder) {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../uploads", folder));
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${uuidv4()}${ext}`);
    },
  });
}

const imageFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif|heic|heif/i;
  if (allowed.test(path.extname(file.originalname))) cb(null, true);
  else cb(new Error("Only image files are allowed"));
};

const mediaFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif|heic|heif|mp4|mov|webm/i;
  if (allowed.test(path.extname(file.originalname))) cb(null, true);
  else cb(new Error("Only image or video files are allowed"));
};

const galleryUpload = multer({
  storage: makeStorage("gallery"),
  fileFilter: mediaFilter,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB
});

const projectUpload = multer({
  storage: makeStorage("project"),
  fileFilter: mediaFilter,
  limits: { fileSize: 500 * 1024 * 1024 },
});

module.exports = { galleryUpload, projectUpload };
