import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use absolute path to Backend/uploads
    const uploadPath = path.resolve("uploads");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter to accept images and PDFs
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
    cb(new Error("Only images (JPEG, JPG, PNG) and PDF files are allowed"), false);
  }
};

// General upload middleware
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Specific middleware for lawyer registration (handles 4 files)
export const lawyerRegistrationUpload = upload.fields([
  { name: "profilePhoto", maxCount: 1 },
  { name: "barCouncilCertificate", maxCount: 1 },
  { name: "identityProof", maxCount: 1 },
  { name: "degreeCertificate", maxCount: 1 },
]);

export default upload;
