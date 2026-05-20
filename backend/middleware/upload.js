const multer = require("multer");

/**
 * Memory storage — files land in req.files[fieldName][0].buffer
 * We stream them to Cloudinary manually in each route handler.
 */
const memoryStorage = multer.memoryStorage();

/**
 * Accept by MIME type (most reliable) with filename extension as fallback.
 * Browsers set mimetype correctly; some tools only set the filename.
 */
const mediaFilter = (req, file, cb) => {
  const allowedMime = [
    "image/jpeg", "image/jpg", "image/png", "image/webp",
    "image/gif",  "image/heic", "image/heif",
    "video/mp4",  "video/quicktime", "video/webm",
    "application/octet-stream", // some browsers send this for heic/heif
  ];
  const allowedExt = /\.(jpe?g|png|webp|gif|heic|heif|mp4|mov|webm)$/i;

  const mimeOk = allowedMime.includes(file.mimetype);
  const extOk  = allowedExt.test(file.originalname);

  if (mimeOk || extOk) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file: ${file.originalname} (${file.mimetype})`));
  }
};

const uploadMiddleware = multer({
  storage: memoryStorage,
  fileFilter: mediaFilter,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB
});

module.exports = {
  galleryUpload: uploadMiddleware,
  projectUpload: uploadMiddleware,
};
