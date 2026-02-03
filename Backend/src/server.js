import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

import fs from 'fs';
import path from 'path';

// FORCE LOGGING TO FILE
const accessLogStream = fs.createWriteStream(path.join(process.cwd(), 'server.log'), { flags: 'a' });

// Override console.log to write to file AND stdout
const originalLog = console.log;
console.log = function (...args) {
  const msg = args.map(a => (typeof a === 'object' ? JSON.stringify(a) : a)).join(' ');
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] ${msg}\n`;

  accessLogStream.write(logLine);
  originalLog.apply(console, args);
};

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`LegalEase backend running on port ${PORT}`);
  });
});

