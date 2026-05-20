require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key:    process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

/**
 * Upload a Buffer to Cloudinary using upload_stream (streaming API).
 * Fully async/await compatible — wraps the callback-based stream in a Promise.
 *
 * @param {Buffer} buffer
 * @param {{ folder: string, resource_type?: "image"|"video"|"auto" }} opts
 * @returns {Promise<{ secure_url: string, public_id: string }>}
 */
async function uploadToCloudinary(buffer, { folder, resource_type = "image" }) {
  if (!buffer || buffer.length === 0) {
    throw new Error("uploadToCloudinary: buffer is empty or undefined");
  }

  console.log(`[Cloudinary] Uploading ${buffer.length} bytes → folder="${folder}" resource_type="${resource_type}"`);

  return new Promise((resolve, reject) => {
    const options = {
      folder,
      resource_type,
      // For images: auto quality + format. For videos: no transformation.
      ...(resource_type === "image" && {
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      }),
    };

    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        console.error("[Cloudinary] upload_stream error:", error);
        return reject(new Error(`Cloudinary upload failed: ${error.message}`));
      }
      if (!result || !result.secure_url) {
        return reject(new Error("Cloudinary upload returned no result"));
      }
      console.log(`[Cloudinary] Upload OK → ${result.secure_url}`);
      resolve({ secure_url: result.secure_url, public_id: result.public_id });
    });

    // Write the buffer into the stream and signal end-of-data
    uploadStream.end(buffer);
  });
}

/**
 * Delete a Cloudinary asset by public_id.
 * @param {string|null} public_id
 * @param {"image"|"video"} resource_type
 */
async function deleteFromCloudinary(public_id, resource_type = "image") {
  if (!public_id) return;
  try {
    const result = await cloudinary.uploader.destroy(public_id, { resource_type });
    console.log(`[Cloudinary] Deleted ${public_id} → ${result.result}`);
  } catch (err) {
    console.error("[Cloudinary] delete error:", err.message);
  }
}

module.exports = { cloudinary, uploadToCloudinary, deleteFromCloudinary };
