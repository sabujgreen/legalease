import dotenv from "dotenv";
dotenv.config();

import app from "../app.js";
import connectDB from "../config/db.js";

let isConnected = false;

export default async function handler(req, res) {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
    console.log("MongoDB connected");
  }
  return app(req, res);
}
