import express from "express";
import { chatWithAI } from "./chatbot.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// POST /api/chatbot/chat
router.post("/chat", protect, chatWithAI);

export default router;
