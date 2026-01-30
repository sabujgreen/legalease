import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// USER, LAWYER, ADMIN
router.get(
  "/user-area",
  protect,
  allowRoles("USER", "LAWYER", "ADMIN"),
  (req, res) => {
    res.json({ message: "User area accessed" });
  }
);

// LAWYER + ADMIN only
router.get(
  "/lawyer-area",
  protect,
  allowRoles("LAWYER", "ADMIN"),
  (req, res) => {
    res.json({ message: "Lawyer area accessed" });
  }
);

// ADMIN only
router.get(
  "/admin-area",
  protect,
  allowRoles("ADMIN"),
  (req, res) => {
    res.json({ message: "Admin area accessed" });
  }
);

export default router;
