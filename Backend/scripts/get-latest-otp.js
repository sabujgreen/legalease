import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix for strict ESM mode to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from parent directory (Backend root)
dotenv.config({ path: path.join(__dirname, "../.env") });

import Otp from "../src/models/otp/Otp.model.js";

const getLatestOtp = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error("MONGODB_URI is missing");

        await mongoose.connect(uri);

        // Find the most recently created OTP
        const latestOtp = await Otp.findOne().sort({ createdAt: -1 });

        const outputPath = path.join(process.cwd(), "otp_debug.txt");

        if (latestOtp) {
            const output = `LATEST OTP: ${latestOtp.otp}`;
            console.log(output);
            fs.writeFileSync(outputPath, output);
            console.log(`✅ Wrote to: ${outputPath}`);
        } else {
            const msg = "❌ No OTPs found in database.";
            console.log(msg);
            fs.writeFileSync(outputPath, msg);
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error("Error:", error);
        fs.writeFileSync("otp_error.txt", error.message);
    }
};

getLatestOtp();
