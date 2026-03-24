import dotenv from 'dotenv';
import LawyerProfile from '../src/models/lawyer/LawyerProfile.model.js';
import User from '../src/models/User.model.js';
import connectDB from '../src/config/db.js';

dotenv.config();

const cleanOrphans = async () => {
    try {
        await connectDB();
        console.log('🔌 Connected to MongoDB');

        const profiles = await LawyerProfile.find();
        console.log(`🔍 Checking ${profiles.length} lawyer profiles...`);

        let deletedCount = 0;

        for (const profile of profiles) {
            if (!profile.userId) {
                console.log(`❌ Profile matched but userId field is missing/null: ${profile._id}`);
                await LawyerProfile.findByIdAndDelete(profile._id);
                deletedCount++;
                continue;
            }

            const user = await User.findById(profile.userId);
            if (!user) {
                console.log(`🗑️ Deleting orphan profile ${profile._id} (User ${profile.userId} not found)`);
                await LawyerProfile.findByIdAndDelete(profile._id);
                deletedCount++;
            }
        }

        console.log(`✅ Cleanup complete. Deleted ${deletedCount} orphaned profiles.`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

cleanOrphans();
