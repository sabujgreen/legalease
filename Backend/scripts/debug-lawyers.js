import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Fix for strict ESM mode to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from parent directory (Backend root) if running from scripts/
dotenv.config({ path: path.join(__dirname, "../.env") });

import LawyerProfile from "../src/models/lawyer/LawyerProfile.model.js";
import User from "../src/models/User.model.js";

const debugLawyers = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("MONGODB_URI is missing in .env");
        }

        console.log("Connecting to MongoDB...");
        await mongoose.connect(uri);
        console.log("✅ Connected to MongoDB");

        // 1. Get all pending lawyers
        const pendingLawyers = await LawyerProfile.find({
            verificationStatus: "PENDING",
        }); // No populate yet

        console.log(`\nFound ${pendingLawyers.length} pending lawyer profiles.`);

        for (const lawyer of pendingLawyers) {
            console.log(`\n--- Lawyer Profile ID: ${lawyer._id} ---`);
            console.log(`Stored User ID: ${lawyer.userId}`);

            // 2. Manual lookup of User
            const user = await User.findById(lawyer.userId);

            if (user) {
                console.log(`✅ Linked User Found: ${user.name} (${user.email})`);
                console.log(`   User Role: ${user.role}`);
            } else {
                console.log(`❌ ERROR: User document NOT FOUND for ID: ${lawyer.userId}`);
                console.log(`   This orphan profile is causing the 'N/A' issue.`);

                // Optional: Delete orphan
                // await LawyerProfile.deleteOne({ _id: lawyer._id });
                // console.log("   (Orphan profile deleted)");
            }
        }

        console.log("\nDone.");
        await mongoose.disconnect();
    } catch (error) {
        console.error("Scripts Error:", error);
    }
};

debugLawyers();
