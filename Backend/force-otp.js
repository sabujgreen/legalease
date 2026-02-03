import mongoose from "mongoose";
import fs from "fs";

// Hardcoded URI from .env to avoid config issues
const URI = "mongodb+srv://chiragcj555_db_user:OFgbrQ9YyOQDvgmj@cluster0.we2ztfn.mongodb.net/?appName=Cluster0";

const run = async () => {
    try {
        console.log("Connecting...");
        await mongoose.connect(URI);
        console.log("Connected.");

        // Dynamic import because this is a script
        // We need to define the schema manually to avoid import issues
        const otpSchema = new mongoose.Schema({
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
            otp: { type: String, required: true },
            purpose: { type: String, enum: ["EMAIL_VERIFICATION", "PASSWORD_RESET"], required: true },
            expiresAt: { type: Date, required: true },
            createdAt: { type: Date, default: Date.now, expires: 600 },
        });

        // Use a different model name to avoid collision if run multiple times in same context (unlikely here but safe)
        const OtpValues = mongoose.models.Otp || mongoose.model("Otp", otpSchema);

        const latest = await OtpValues.findOne().sort({ createdAt: -1 });

        if (latest) {
            console.log("FOUND OTP:", latest.otp);
            fs.writeFileSync("FORCE_OTP.txt", latest.otp);
        } else {
            console.log("NO OTP FOUND");
            fs.writeFileSync("FORCE_OTP.txt", "NONE");
        }

        await mongoose.disconnect();
        process.exit(0);
    } catch (e) {
        console.error(e);
        fs.writeFileSync("FORCE_OTP_ERROR.txt", e.message);
        process.exit(1);
    }
};

run();
