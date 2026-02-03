import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Cloudinary storage config
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    let folder = "legalease/others";
    let resourceType = "image";

    // PDFs must be uploaded as raw
    if (file.mimetype === "application/pdf") {
      resourceType = "raw";
      folder = "legalease/documents";
    } else {
      folder = "legalease/images";
    }

    return {
      folder,
      resource_type: resourceType,
      public_id: `${file.fieldname}-${Date.now()}`,
    };
  },
});

// File filter (same logic, unchanged)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only images (JPEG, JPG, PNG) and PDF files are allowed"),
      false
    );
  }
};

// Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Lawyer registration (4 files)
export const lawyerRegistrationUpload = upload.fields([
  { name: "profilePhoto", maxCount: 1 },
  { name: "barCouncilCertificate", maxCount: 1 },
  { name: "identityProof", maxCount: 1 },
  { name: "degreeCertificate", maxCount: 1 },
]);

export default upload;
