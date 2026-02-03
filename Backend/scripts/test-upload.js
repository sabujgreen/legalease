import cloudinary from '../src/config/cloudinary.js';
import dotenv from 'dotenv';
dotenv.config();

const testUpload = async () => {
    try {
        console.log('Testing Cloudinary Connection...');
        // Upload a sample image from a remote URL
        const result = await cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg", {
            public_id: "test_image_" + Date.now(),
            folder: "legalease/tests"
        });
        console.log('✅ Upload Successful!');
        console.log('URL:', result.secure_url);
        console.log('Public ID:', result.public_id);
    } catch (error) {
        console.error('❌ Upload Failed:', error);
        console.error(error);
    }
};

testUpload();
