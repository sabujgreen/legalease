import express from "express";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/protected", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: {
      id: req.user._id,
      role: req.user.role,
    },
  });
});

export default router;
