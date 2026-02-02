import mongoose from "mongoose";
import User from "../src/models/User.model.js";
import LawyerProfile from "../src/models/lawyer/LawyerProfile.model.js";

const MONGO_URI =
  "";

const lawyersData = [
  {
    name: "Amit Sharma",
    email: "amit.criminal@law.com",
    specialization: ["Criminal Law", "Bail Matters"],
    experienceYears: 12,
    city: "Delhi",
    state: "Delhi",
  },
  {
    name: "Neha Verma",
    email: "neha.family@law.com",
    specialization: ["Family Law", "Divorce", "Child Custody"],
    experienceYears: 8,
    city: "Mumbai",
    state: "Maharashtra",
  },
  {
    name: "Rohit Mehta",
    email: "rohit.corporate@law.com",
    specialization: ["Corporate Law", "Startup Advisory"],
    experienceYears: 10,
    city: "Bengaluru",
    state: "Karnataka",
  },
  {
    name: "Pooja Singh",
    email: "pooja.property@law.com",
    specialization: ["Property Law", "Real Estate"],
    experienceYears: 6,
    city: "Indore",
    state: "Madhya Pradesh",
  },
  {
    name: "Sandeep Jain",
    email: "sandeep.tax@law.com",
    specialization: ["Tax Law", "GST"],
    experienceYears: 14,
    city: "Jaipur",
    state: "Rajasthan",
  },
  {
    name: "Anjali Kapoor",
    email: "anjali.ipr@law.com",
    specialization: ["Intellectual Property", "Trademark"],
    experienceYears: 7,
    city: "Pune",
    state: "Maharashtra",
  },
];

const seedLawyers = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    for (const lawyer of lawyersData) {
      // 1️⃣ Create User
      const user = await User.create({
        name: lawyer.name,
        email: lawyer.email,
        password: "Password@123",
        role: "LAWYER",
        isVerified: true,
      });

      // 2️⃣ Create Lawyer Profile
      await LawyerProfile.create({
        userId: user._id,

        mobile: "9999999999",
        profilePhoto: null,

        barRegistrationNumber: `BAR-${Math.floor(
          100000 + Math.random() * 900000
        )}`,
        barCouncilState: lawyer.state,

        yearOfEnrollment: 2015,
        experienceYears: lawyer.experienceYears,
        specialization: lawyer.specialization,
        courtsPracticedIn: "District Court, High Court",

        location: {
          city: lawyer.city,
          state: lawyer.state,
          jurisdiction: lawyer.state,
        },

        lawDegree: "LLB",
        universityName: "National Law University",
        graduationYear: 2014,

        professionalBio: `Experienced lawyer specializing in ${lawyer.specialization.join(
          ", "
        )}.`,
        languagesSpoken: ["English", "Hindi"],

        consultationType: "Both",
        consultationFee: 1000,
        availabilityStatus: "Available",

        barCouncilCertificate: "dummy-bar-certificate.pdf",
        identityProof: "dummy-id-proof.pdf",
        degreeCertificate: "dummy-degree.pdf",

        verificationStatus: "APPROVED",
        isAvailable: true,
      });

      console.log(`👨‍⚖️ Seeded lawyer: ${lawyer.name}`);
    }

    console.log("🎉 Lawyers seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedLawyers();
