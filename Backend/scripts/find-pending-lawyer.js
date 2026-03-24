import dotenv from 'dotenv';
import LawyerProfile from '../src/models/lawyer/LawyerProfile.model.js';
import connectDB from '../src/config/db.js';

dotenv.config();

const findPendingProfile = async () => {
    try {
        await connectDB();
        console.log('🔌 Connected to MongoDB');

        const profile = await LawyerProfile.findOne({ verificationStatus: 'PENDING' });

        if (profile) {
            console.log(`✅ Found Pending Profile ID: ${profile._id}`);
            console.log(`   User ID: ${profile.userId}`);
        } else {
            console.log('❌ No PENDING lawyer profiles found.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

findPendingProfile();
