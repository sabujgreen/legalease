import express from "express";
import cors from "cors";

import authRoutes from "./modules/auth/auth.routes.js";
import testRoutes from "./routes/test.routes.js";
import roleTestRoutes from "./routes/role-test.routes.js";
import lawyerRoutes from "./modules/lawyer/lawyer.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import caseRoutes from "./modules/case/case.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import cookieParser from "cookie-parser";
import chatbotRoutes from "./modules/chatbot/chatbot.routes.js";
import consultationRoutes from "./modules/consultation/consultation.routes.js";


const app = express();

//Important
app.set("trust proxy", 1); // ✅ Required for Render/Vercel to handle cookies correctly
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);


app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/roles", roleTestRoutes);
app.use("/api/lawyer", lawyerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/consultation", consultationRoutes);



app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "LegalEase Backend" });
});

export default app;
