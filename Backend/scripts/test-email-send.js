
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

console.log("Testing Email Sending...");
console.log("User:", process.env.EMAIL_USER);
// console.log("Pass:", process.env.EMAIL_PASS); // Don't log password

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendTestEmail = async () => {
    try {
        console.log("Attempting to send mail...");
        const info = await transporter.sendMail({
            from: `"Test Script" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Send to self
            subject: "Test Email from LegalEase Scripts",
            text: "This is a test email to verify nodemailer configuration.",
        });
        console.log("Email sent successfully!");
        console.log("Message ID:", info.messageId);
    } catch (error) {
        console.error("FAILED to send email.");
        console.error(error);
    }
};

sendTestEmail();
