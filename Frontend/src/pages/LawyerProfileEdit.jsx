import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import LawyerSidebar from "../components/LawyerSidebar";
import defaultLawyer from "../assets/default-lawyer.png";
import { getMyProfile, updateLawyerProfile } from "../services/lawyer.api";
import { useAuth } from "../context/AuthContext";

const LawyerProfileEdit = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({
        mobile: "",
        profilePhoto: null,
        barRegistrationNumber: "",
        barCouncilState: "",
        yearOfEnrollment: "",
        experienceYears: "",
        specialization: [],
        courtsPracticedIn: "",
        city: "",
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
    });

    // Fetch lawyer profile from backend
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await getMyProfile();
                const profileData = response.data;
                setProfile(profileData);

                // Pre-fill form with profile data
                setForm({
                    mobile: profileData.mobile || "",
                    profilePhoto: null,
                    barRegistrationNumber: profileData.barRegistrationNumber || "",
                    barCouncilState: profileData.barCouncilState || "",
                    yearOfEnrollment: profileData.yearOfEnrollment || "",
                    experienceYears: profileData.experienceYears || "",
                    specialization: profileData.specialization || [],
                    courtsPracticedIn: profileData.courtsPracticedIn || "",
                    city: profileData.location?.city || "",
                    state: profileData.location?.state || "",
                    jurisdiction: profileData.location?.jurisdiction || "",
                    lawDegree: profileData.lawDegree || "",
                    universityName: profileData.universityName || "",
                    graduationYear: profileData.graduationYear || "",
                    professionalBio: profileData.professionalBio || "",
                    languagesSpoken: profileData.languagesSpoken || [],
                    consultationType: profileData.consultationType || "",
                    consultationFee: profileData.consultationFee || "",
                    availabilityStatus: profileData.availabilityStatus || "Available",
                });
            } catch (error) {
                console.error("Failed to fetch profile", error);
                alert("Failed to load profile. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            setForm((prev) => ({ ...prev, [name]: files[0] }));
        }
    };

    const handleMultiSelect = (field, value) => {
        setForm((prev) => {
            const current = prev[field] || [];
            if (current.includes(value)) {
                return { ...prev, [field]: current.filter((v) => v !== value) };
            } else {
                return { ...prev, [field]: [...current, value] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);

            const formData = new FormData();
            Object.keys(form).forEach((key) => {
                if (form[key] instanceof File) {
                    formData.append(key, form[key]);
                } else if (Array.isArray(form[key])) {
                    formData.append(key, JSON.stringify(form[key]));
                } else if (form[key] !== null && form[key] !== undefined) {
                    formData.append(key, form[key]);
                }
            });

            await updateLawyerProfile(formData);

            alert("Profile updated successfully!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Failed to update profile", error);
            alert(error.response?.data?.message || "Failed to update profile. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const getProfileImage = () => {
        if (form.profilePhoto instanceof File) {
            return URL.createObjectURL(form.profilePhoto);
        }
        if (profile?.profilePhoto) {
            return `http://localhost:5000/${profile.profilePhoto.replace(/\\/g, "/")}`;
        }
        return defaultLawyer;
    };

    if (loading) {
        return (
            <DashboardLayout>
                <LawyerSidebar />
                <main className="flex-1 p-10 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-gray-500">Loading profile...</p>
                    </div>
                </main>
            </DashboardLayout>
        );
    }

    const specializationOptions = [
        "Criminal Law",
        "Civil Law",
        "Corporate Law",
        "Family Law",
        "Property Law",
        "Intellectual Property",
        "Tax Law",
        "Labor Law",
    ];

    const languageOptions = [
        "English",
        "Hindi",
        "Marathi",
        "Tamil",
        "Telugu",
        "Bengali",
        "Gujarati",
        "Kannada",
    ];

    return (
        <DashboardLayout>
            <LawyerSidebar />

            <main className="flex-1 p-10 overflow-y-auto">
                <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                    Edit Profile
                </h1>
                <p className="text-gray-600 mb-8">
                    Update your professional information
                </p>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-borderColor">

                    {/* Profile Photo Section */}
                    <div className="p-8 border-b border-borderColor">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Profile Picture</h2>
                        <div className="flex items-center gap-6">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200">
                                <img
                                    src={getProfileImage()}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <label className="px-4 py-2 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary-dull transition-colors inline-block">
                                    Upload New Photo
                                    <input
                                        type="file"
                                        name="profilePhoto"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                                <p className="text-sm text-gray-500 mt-2">JPG, PNG or GIF. Max 5MB.</p>
                            </div>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="p-8 border-b border-borderColor">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name <span className="text-gray-400">(Read-only)</span>
                                </label>
                                <input
                                    type="text"
                                    value={user?.name || profile?.userId?.name || ""}
                                    disabled
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email <span className="text-gray-400">(Read-only)</span>
                                </label>
                                <input
                                    type="email"
                                    value={user?.email || profile?.userId?.email || ""}
                                    disabled
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mobile Number *
                                </label>
                                <input
                                    type="tel"
                                    name="mobile"
                                    value={form.mobile}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-borderColor focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Professional Details */}
                    <div className="p-8 border-b border-borderColor">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Professional Details</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bar Council Registration Number *
                                </label>
                                <input
                                    type="text"
                                    name="barRegistrationNumber"
                                    value={form.barRegistrationNumber}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-borderColor focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    State Bar Council *
                                </label>
                                <input
                                    type="text"
                                    name="barCouncilState"
                                    value={form.barCouncilState}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-borderColor focus:outline-none focus:ring-2 focus:ring-primary"
                                />
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
                                    className="w-full px-4 py-2 rounded-lg border border-borderColor focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Years of Experience
                                </label>
                                <input
                                    type="number"
                                    name="experienceYears"
                                    value={form.experienceYears}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-borderColor focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Courts Practiced In
                                </label>
                                <input
                                    type="text"
                                    name="courtsPracticedIn"
                                    value={form.courtsPracticedIn}
                                    onChange={handleChange}
                                    placeholder="e.g., High Court, District Court"
                                    className="w-full px-4 py-2 rounded-lg border border-borderColor focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Specializations */}
                    <div className="p-8 border-b border-borderColor">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Specializations</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            {specializationOptions.map((spec) => (
                                <label key={spec} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.specialization.includes(spec)}
                                        onChange={() => handleMultiSelect("specialization", spec)}
                                        className="w-4 h-4 text-primary focus:ring-primary rounded"
                                    />
                                    <span className="text-sm text-gray-700">{spec}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Location */}
                    <div className="p-8 border-b border-borderColor">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Location & Jurisdiction</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    City
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={form.city}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-borderColor focus:outline-none focus:ring-2 focus:ring-primary"
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
                                    className="w-full px-4 py-2 rounded-lg border border-borderColor focus:outline-none focus:ring-2 focus:ring-primary"
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
                                    placeholder="e.g., Mumbai Metropolitan Region"
                                    className="w-full px-4 py-2 rounded-lg border border-borderColor focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Education */}
                    <div className="p-8 border-b border-borderColor">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Education</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Law Degree
                                </label>
                                <input
                                    type="text"
                                    name="lawDegree"
                                    value={form.lawDegree}
                                    onChange={handleChange}
                                    placeholder="e.g., LLB, LLM"
                                    className="w-full px-4 py-2 rounded-lg border border-borderColor focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    University
                                </label>
                                <input
                                    type="text"
                                    name="universityName"
                                    value={form.universityName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-borderColor focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Graduation Year
                                </label>
                                <input
                                    type="number"
                                    name="graduationYear"
                                    value={form.graduationYear}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-borderColor focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Professional Bio */}
                    <div className="p-8 border-b border-borderColor">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Professional Bio</h2>
                        <textarea
                            name="professionalBio"
                            value={form.professionalBio}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Tell clients about your experience and expertise..."
                            className="w-full px-4 py-2 rounded-lg border border-borderColor focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    {/* Languages */}
                    <div className="p-8 border-b border-borderColor">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Languages Spoken</h2>
                        <div className="grid md:grid-cols-4 gap-4">
                            {languageOptions.map((lang) => (
                                <label key={lang} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.languagesSpoken.includes(lang)}
                                        onChange={() => handleMultiSelect("languagesSpoken", lang)}
                                        className="w-4 h-4 text-primary focus:ring-primary rounded"
                                    />
                                    <span className="text-sm text-gray-700">{lang}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Consultation Details */}
                    <div className="p-8 border-b border-borderColor">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Consultation Details</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Consultation Type
                                </label>
                                <select
                                    name="consultationType"
                                    value={form.consultationType}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-borderColor focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">Select Type</option>
                                    <option value="Online">Online</option>
                                    <option value="Offline">Offline</option>
                                    <option value="Both">Both</option>
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
                                    placeholder="e.g., 5000"
                                    className="w-full px-4 py-2 rounded-lg border border-borderColor focus:outline-none focus:ring-2 focus:ring-primary"
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
                                    className="w-full px-4 py-2 rounded-lg border border-borderColor focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="Available">Available</option>
                                    <option value="Busy">Busy</option>
                                    <option value="On Leave">On Leave</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-8 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate("/dashboard")}
                            className="px-6 py-2 border border-borderColor rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dull transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </main>
        </DashboardLayout>
    );
};

export default LawyerProfileEdit;
