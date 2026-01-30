import express from "express";
import upload from "../../middlewares/upload.middleware.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { uploadProfilePhoto } from "./user.profile.controller.js";


const router = express.Router();

router.post(
  "/profile/photo",
  protect,
  upload.single("photo"),
  uploadProfilePhoto
);

export default router;