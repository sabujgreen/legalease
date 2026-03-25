import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const EMAIL_CONFIG_MISSING = "EMAIL_CONFIG_MISSING";
const EMAIL_SEND_FAILED = "EMAIL_SEND_FAILED";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendEmail = async ({ to, subject, text, html }) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        const configError = new Error("Email service is not configured");
        configError.code = EMAIL_CONFIG_MISSING;
        throw configError;
    }

    try {
        const info = await transporter.sendMail({
            from: `"LegalEase Support" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        });

        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        const sendError = new Error("Failed to send email");
        sendError.code = EMAIL_SEND_FAILED;
        sendError.cause = error;
        throw sendError;
    }
};
