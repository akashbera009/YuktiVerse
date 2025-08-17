 
import { v2 as cloudinary } from "cloudinary";
import Resume from "../models/Resume.js";
import { PassThrough } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const saveResumeToDB = async (req, res) => {
  try {
    const path = await import("path");

    const file = req.file;
    const { analysis } = req.body;

    // Validate inputs
    if (!file || !analysis) {
      return res
        .status(400)
        .json({ message: "Missing resume file or analysis" });
    }

    // ✅ Parse analysis from string to JSON object
    let parsedAnalysis;
    try {
      parsedAnalysis = JSON.parse(analysis);
    } catch (err) {
      return res
        .status(400)
        .json({ message: "Invalid JSON in analysis", error: err.message });
    }

    const ext = path.extname(file.originalname).toLowerCase();

    // ✅ Upload to Cloudinary
    const cloudinaryUpload = await new Promise((resolve) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "resumes",
          format: ext === ".pdf" ? "pdf" : undefined,
          type: "upload",
        },
        (error, result) => {
          if (error) {
            console.error("❌ Cloudinary upload error:", error);
            resolve(null);
          } else {
            resolve(result);
          }
        }
      );

      const bufferStream = new PassThrough();
      bufferStream.end(file.buffer);
      bufferStream.pipe(stream);
    });

    // ✅ Save to MongoDB
    const newResume = new Resume({
      userId: req.user.id, // ✅ Associate with logged-in user
      filename: file.originalname,
      cloudinaryUrl: cloudinaryUpload?.secure_url || "",
      analysisResult: parsedAnalysis,
    });

    await newResume.save();

    return res.status(200).json({
      message: "Resume saved successfully",
      analysis: parsedAnalysis,
      cloudinaryUrl: cloudinaryUpload?.secure_url || "Upload failed",
    });
  } catch (err) {
    console.error("❌ Save resume error:", err);
    return res.status(500).json({
      message: "Server error while saving resume",
      error: err.message,
    });
  }
};

// fetch all resume  from backend
// In resumeController.js

const getAllResumes = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const resumes = await Resume.find({
      userId: req.user.id, // only current user's data
    }).sort({ createdAt: -1 });

    res.status(200).json({ resumes });
  } catch (err) {
    res.status(500).json({ message: "Error fetching resumes", error: err });
  }
};

// Export using ES module style
export { getAllResumes };

// delete

// Update the deleteResume function
// In resumeController.js
// controllers/resumeController.js

export const deleteResume = async (req, res) => {
  console.log("🗑 Delete request for ID:", req.params.id);
  console.log("🧍 Authenticated user ID:", req.user?.id);

  try {
    const deleted = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!deleted) {
      console.log("⚠️ Resume not found for this user");
      return res.status(404).json({ message: "Not found or not authorized" });
    }

    if (deleted.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(deleted.cloudinaryPublicId);
        console.log(`☁️ Cloudinary file deleted: ${deleted.cloudinaryPublicId}`);
      } catch (cloudErr) {
        console.error("⚠️ Cloudinary delete failed:", cloudErr);
        // Optional: return error or continue anyway
      }
    }

    console.log("✅ Resume deleted:", deleted.filename);
    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
};