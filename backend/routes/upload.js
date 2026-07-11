import express from "express";
import upload from "../middleware/multer.js";
import cloudinary from "../config/cloudinary.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/profile-photo",
  protect,
  upload.single("image"),
  async (req, res) => {
    try {

      if (!req.file) {
        return res.status(400).json({
          message: "No image uploaded",
        });
      }
      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
        "base64"
      )}`;
      const result = await cloudinary.uploader.upload(base64, {
        folder: "fitraaa/profile-photos",
      });
      res.status(200).json({
        imageUrl: result.secure_url,
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: error.message,
      });
    }
  }
);

export default router;