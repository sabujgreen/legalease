// 
// import { v2 as cloudinary } from "cloudinary";

// // 🔥 HARD bind (bypasses CLOUDINARY_URL completely)
// cloudinary.config({
//   cloud_name: "dbrhyvw4g",
//   api_key: "646829179688745",
//   api_secret: "697vTVQJkuTqUgB-sq1IxCbqxC0",
// });

// console.log("Cloudinary initialized with explicit credentials");

// export default cloudinary;
// import { v2 as cloudinary } from "cloudinary";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export default cloudinary;


import dotenv from "dotenv";
dotenv.config(); // 👈 ensures env is loaded even if imported early

import { v2 as cloudinary } from "cloudinary";

// console.log("Cloudinary ENV CHECK:", {
//   cloud: process.env.CLOUDINARY_CLOUD_NAME,
//   key: !!process.env.CLOUDINARY_API_KEY,
//   secret: !!process.env.CLOUDINARY_API_SECRET,
// });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

