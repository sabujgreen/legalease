import cloudinary from "../../config/cloudinary.js";
import User from "../../models/User.model.js";

export const uploadProfilePhoto = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image uploaded" });
  }

  try {
    // ✅ The image is already uploaded by the middleware
    // req.file.path contains the Cloudinary URL
    const imageUrl = req.file.path;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        profileImage: {
          url: imageUrl,
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
