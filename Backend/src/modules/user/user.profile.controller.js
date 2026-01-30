import cloudinary from "../../config/cloudinary.js";
import User from "../../models/User.model.js";

export const uploadProfilePhoto = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image uploaded" });
  }

  try {
    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      {
        folder: "legalease/profile_photos",
        resource_type: "image",
      }
    );

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        profileImage: {
          url: result.secure_url,
          uploadedAt: new Date(),
        },
      },
      { new: true }
    );

    res.json({
      message: "Profile photo uploaded successfully",
      profileImage: user.profileImage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Image upload failed" });
  }
};
