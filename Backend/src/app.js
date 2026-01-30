import express from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import testRoutes from "./routes/test.routes.js";
import roleTestRoutes from "./routes/role-test.routes.js";
import lawyerRoutes from "./modules/lawyer/lawyer.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import caseRoutes from "./modules/case/case.routes.js";
import userRoutes from "./modules/user/user.routes.js";








const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/roles", roleTestRoutes);
app.use("/api/lawyer", lawyerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/user", userRoutes);


app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "LegalEase Backend" });
});

export default app;
