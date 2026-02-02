import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { registerLawyer, checkLawyerStatus } from "../services/lawyer.api";

const LawyerRegistration = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    const [registrationStatus, setRegistrationStatus] = useState("checking"); // 'checking', 'none', 'pending', 'approved'
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        mobile: "",
        profilePhoto: null,
        barCouncilNumber: "",
        stateBarCouncil: "",
        yearOfEnrollment: "",
        totalExperience: "",
        areasOfPractice: [],
        courtsPracticedIn: "",
        currentCity: "",
        state: "",
        jurisdiction: "",
        lawDegree: "",
        universityName: "",
        graduationYear: "",
        professionalBio: "",
        languagesSpoken: [],
        consultationType: "",
        consultationFee: "",
        availabilityStatus: "Available",
        barCouncilCertificate: null,
        identityProof: null,
        degreeCertificate: null,
        agreedToTerms: false,
    });

    // Check if user is already registered as lawyer
    useEffect(() => {
        const checkStatus = async () => {
            if (!user) {
                setRegistrationStatus("none");
                setShowForm(true);
                return;
            }

            // Pre-fill form
            setForm((prev) => ({
                ...prev,
                fullName: user.name || "",
                email: user.email || "",
            }));

            try {
                // Check if user already has a lawyer profile
                const response = await checkLawyerStatus();
                const profile = response.data;

                if (profile.verificationStatus === "APPROVED") {
                    setRegistrationStatus("approved");
                    setShowForm(false);
                } else if (profile.verificationStatus === "PENDING") {
                    setRegistrationStatus("pending");
                    setShowForm(false);
                }
            } catch (error) {
                // No lawyer profile found - show registration form
                if (error.response?.status === 404) {
                    setRegistrationStatus("none");
                    setShowForm(true);
                } else {
                    console.error("Error checking lawyer status:", error);
                    setRegistrationStatus("none");
                    setShowForm(true);
                }
            }
        };

        checkStatus();
    }, [user]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setForm({
            ...form,
            [name]: files[0],
        });
    };

    const handleMultiSelect = (e, fieldName) => {
        const value = e.target.value;
        setForm((prev) => {
            const currentArray = prev[fieldName];
            if (currentArray.includes(value)) {
                return {
                    ...prev,
                    [fieldName]: currentArray.filter((item) => item !== value),
                };
            } else {
                return {
                    ...prev,
                    [fieldName]: [...currentArray, value],
                };
            }
        });
    };

    const handleSubmit = async () => {
        if (!isAuthenticated) {
            alert("Please log in to register as a lawyer");
            return;
        }

        if (!form.fullName || !form.email || !form.mobile) {
            alert("Please fill in your name, email, and mobile number");
            return;
        }

        if (!form.barCouncilNumber || !form.stateBarCouncil) {
            alert("Please fill in Bar Council details");
            return;
        }

        if (!form.barCouncilCertificate) {
            alert("Bar Council Certificate is required");
            return;
        }

        if (!form.agreedToTerms) {
            alert("Please agree to the terms and conditions");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();

            Object.keys(form).forEach((key) => {
                if (form[key] instanceof File) {
                    formData.append(key, form[key]);
                } else if (Array.isArray(form[key])) {
                    formData.append(key, JSON.stringify(form[key]));
                } else if (form[key] !== null && form[key] !== undefined && key !== "agreedToTerms") {
                    formData.append(key, form[key]);
                }
            });

            await registerLawyer(formData);

            // Update status to pending and hide form
            setRegistrationStatus("pending");
            setShowForm(false);
        } catch (err) {
            console.error("Error submitting registration:", err);

            if (err.response?.status === 400) {
                alert(err.response.data.message || "Please check your input and try again");
            } else if (err.response?.status === 401) {
                alert("Please log in to register as a lawyer");
            } else {
                alert("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    // PENDING STATUS - Show when user has submitted but not yet approved
    if (registrationStatus === "pending") {
        return (
            <section className="px-8 py-12 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="max-w-2xl w-full bg-white border border-borderColor rounded-xl p-12 text-center">
                    <div className="mb-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">
                            Registration Submitted Successfully!
                        </h1>
                        <p className="text-lg text-gray-600 mb-2">
                            Thank you for registering as a lawyer with LegalEase.
                        </p>
                        <p className="text-gray-600">
                            Our team will review your application and respond shortly. You will be notified via email once your profile is approved.
                        </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                        <p className="text-sm text-blue-800">
                            <strong>What's next?</strong> Your application status is currently <span className="font-semibold">PENDING</span>.
                            Once approved, you'll have access to the lawyer dashboard where you can manage cases and consultations.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/")}
                        className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dull transition-colors"
                    >
                        Go to Home
                    </button>
                </div>
            </section>
        );
    }

    if (registrationStatus === "approved") {
        return (
            <section className="px-8 py-12 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="max-w-2xl w-full bg-white border border-borderColor rounded-xl p-12 text-center">
                    <div className="mb-6">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">
                            You are Already Registered!
                        </h1>
                        <p className="text-lg text-gray-600 mb-2">
                            Your lawyer profile is active and approved.
                        </p>
                        <p className="text-gray-600">
                            Access your dashboard to manage cases, view consultations, and update your profile.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dull transition-colors"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </section>
        );
    }

    // CHECKING STATUS - Show loading state while checking status
    if (registrationStatus === "checking") {
        return (
            <section className="px-8 py-12 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Checking your registration status...</p>
                </div>
            </section>
        );
    }

    // Registration Form
    return (
        <section className="px-8 py-12 bg-gray-50 min-h-screen">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl font-semibold text-primary">
                    Register as a Lawyer
                </h1>

                <p className="mt-2 text-gray-600">
                    Join our network of legal professionals and connect with clients seeking legal assistance.
                </p>

                <div className="mt-8 bg-white border border-borderColor rounded-xl p-8 space-y-8">

                    {/* Personal Information */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                            Personal Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={form.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    className="w-full px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email address"
                                    className="w-full px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mobile Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="mobile"
                                    value={form.mobile}
                                    onChange={handleChange}
                                    placeholder="e.g., +91 9876543210"
                                    className="w-full px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Profile Photo
                                </label>
                                <input
                                    type="file"
                                    name="profilePhoto"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Professional Details */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                            Professional Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bar Council Registration Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="barCouncilNumber"
                                    value={form.barCouncilNumber}
                                    onChange={handleChange}
                                    placeholder="e.g., D/1234/2020"
                                    className="w-full px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    State Bar Council <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="stateBarCouncil"
                                    value={form.stateBarCouncil}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">Select State Bar Council</option>
                                    <option>Bar Council of Delhi</option>
                                    <option>Bar Council of Maharashtra</option>
                                    <option>Bar Council of Karnataka</option>
                                    <option>Bar Council of Tamil Nadu</option>
                                    <option>Bar Council of Uttar Pradesh</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Year of Enrollment
                                </label>
                                <input
                                    type="number"
                                    name="yearOfEnrollment"
                                    value={form.yearOfEnrollment}
                                    onChange={handleChange}
                                    placeholder="e.g., 2020"
                                    min="1950"
                                    max={new Date().getFullYear()}
                                    className="w-full px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Total Years of Experience
                                </label>
                                <input
                                    type="number"
                                    name="totalExperience"
                                    value={form.totalExperience}
                                    onChange={handleChange}
                                    placeholder="e.g., 5"
                                    min="0"
                                    className="w-full px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Areas of Practice / Specializations
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {["Civil Law", "Criminal Law", "Corporate Law", "Family Law", "Property Law", "Consumer Law", "Taxation", "IPR", "Labor Law"].map((area) => (
                                        <label key={area} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                value={area}
                                                checked={form.areasOfPractice.includes(area)}
                                                onChange={(e) => handleMultiSelect(e, "areasOfPractice")}
                                                className="rounded border-borderColor text-primary focus:ring-primary"
                                            />
                                            <span className="text-sm text-gray-700">{area}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Courts / Authorities Practiced In
                                </label>
                                <input
                                    type="text"
                                    name="courtsPracticedIn"
                                    value={form.courtsPracticedIn}
                                    onChange={handleChange}
                                    placeholder="e.g., District Court, High Court, Supreme Court"
                                    className="w-full px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Jurisdiction */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                            Jurisdiction
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Current City
                                </label>
                                <input
                                    type="text"
                                    name="currentCity"
                                    value={form.currentCity}
                                    onChange={handleChange}
                                    placeholder="e.g., Mumbai"
                                    className="w-full px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    State
                                </label>
                                <input
                                    type="text"
                                    name="state"
                                    value={form.state}
                                    onChange={handleChange}
                                    placeholder="e.g., Maharashtra"
                                    className="w-full px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Jurisdiction
                                </label>
                                <input
                                    type="text"
                                    name="jurisdiction"
                                    value={form.jurisdiction}
                                    onChange={handleChange}
                                    placeholder="e.g., Mumbai District"
                                    className="w-full px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Education */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                            Education
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Law Degree
                                </label>
                                <select
                                    name="lawDegree"
                                    value={form.lawDegree}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">Select Degree</option>
                                    <option>LLB</option>
                                    <option>LLM</option>
                                    <option>BA LLB</option>
                                    <option>BBA LLB</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    University / College Name
                                </label>
                                <input
                                    type="text"
                                    name="universityName"
                                    value={form.universityName}
                                    onChange={handleChange}
                                    placeholder="e.g., National Law School"
                                    className="w-full px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Year of Graduation
                                </label>
                                <input
                                    type="number"
                                    name="graduationYear"
                                    value={form.graduationYear}
                                    onChange={handleChange}
                                    placeholder="e.g., 2018"
                                    min="1950"
                                    max={new Date().getFullYear()}
                                    className="w-full px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                            Additional Information
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Professional Bio
                                </label>
                                <textarea
                                    name="professionalBio"
                                    rows="4"
                                    value={form.professionalBio}
                                    onChange={handleChange}
                                    placeholder="Brief description of your practice, expertise, and achievements..."
                                    className="w-full px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Languages Spoken
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {["English", "Hindi", "Marathi", "Tamil", "Telugu", "Kannada", "Bengali", "Gujarati"].map((lang) => (
                                        <label key={lang} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                value={lang}
                                                checked={form.languagesSpoken.includes(lang)}
                                                onChange={(e) => handleMultiSelect(e, "languagesSpoken")}
                                                className="rounded border-borderColor text-primary focus:ring-primary"
                                            />
                                            <span className="text-sm text-gray-700">{lang}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Consultation Type
                                    </label>
                                    <select
                                        name="consultationType"
                                        value={form.consultationType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="">Select Type</option>
                                        <option>Online</option>
                                        <option>In-Person</option>
                                        <option>Both</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Consultation Fee (₹)
                                    </label>
                                    <input
                                        type="number"
                                        name="consultationFee"
                                        value={form.consultationFee}
                                        onChange={handleChange}
                                        placeholder="e.g., 1500"
                                        min="0"
                                        className="w-full px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Availability Status
                                    </label>
                                    <select
                                        name="availabilityStatus"
                                        value={form.availabilityStatus}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option>Available</option>
                                        <option>Busy</option>
                                        <option>Not Accepting</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Document Uploads */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                            Document Uploads
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bar Council Certificate <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="file"
                                    name="barCouncilCertificate"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={handleFileChange}
                                    className="w-full px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <p className="mt-1 text-xs text-gray-500">PDF, JPG, PNG (Max 5MB)</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Identity Proof (Aadhar / PAN)
                                </label>
                                <input
                                    type="file"
                                    name="identityProof"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={handleFileChange}
                                    className="w-full px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <p className="mt-1 text-xs text-gray-500">PDF, JPG, PNG (Max 5MB)</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Degree Certificate
                                </label>
                                <input
                                    type="file"
                                    name="degreeCertificate"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={handleFileChange}
                                    className="w-full px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <p className="mt-1 text-xs text-gray-500">PDF, JPG, PNG (Max 5MB)</p>
                            </div>
                        </div>
                    </div>

                    {/* Terms & Conditions */}
                    <div className="bg-light border border-borderColor rounded-lg p-4">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="agreedToTerms"
                                checked={form.agreedToTerms}
                                onChange={handleChange}
                                className="mt-1 rounded border-borderColor text-primary focus:ring-primary"
                            />
                            <span className="text-sm text-gray-700">
                                I agree to the <span className="text-primary font-medium">Terms & Conditions</span> and confirm that all the information provided is accurate and verified.
                            </span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !form.agreedToTerms}
                        className="w-full px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dull transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Submitting Registration..." : "Submit Registration"}
                    </button>

                </div>
            </div>
        </section>
    );
};

export default LawyerRegistration;
