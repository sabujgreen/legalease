import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchLawyers } from "../services/lawyer.api";
import defaultLawyer from "../assets/default-lawyer.png";

const ContactLawyer = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadLawyers = async () => {
      try {
        setLoading(true);
        const res = await fetchLawyers(search);
        setLawyers(res.data);
      } catch (err) {
        console.error("Failed to fetch lawyers", err);
      } finally {
        setLoading(false);
      }
    };

    loadLawyers();
  }, [search]);

  const getProfileImage = (lawyer) => {
    if (lawyer.profilePhoto) {
      if (lawyer.profilePhoto.startsWith("http")) {
        return lawyer.profilePhoto;
      }
      // If profile photo exists, construct the backend URL
      const baseUrl = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";
      return `${baseUrl}/${lawyer.profilePhoto.replace(/\\/g, "/")}`;
    }
    return defaultLawyer;
  };

  const handleCardClick = (lawyerId) => {
    navigate(`/lawyer/${lawyerId}`);
  };

  return (
    <section className="px-8 py-12 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">

        {/* Page Title */}
        <h1 className="text-2xl font-semibold text-primary">
          Contact a Lawyer
        </h1>
        <p className="mt-2 text-gray-600">
          Search and connect with registered lawyers based on your legal needs.
        </p>

        {/* Search Box */}
        <div className="mt-6">
          <input
            type="text"
            placeholder="Search by name, specialization, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-borderColor focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Lawyers List */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full flex justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading lawyers...</p>
              </div>
            </div>
          ) : lawyers.length > 0 ? (
            lawyers.map((lawyer) => (
              <div
                key={lawyer._id}
                onClick={() => handleCardClick(lawyer._id)}
                className="bg-white border border-borderColor rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer hover:border-primary group"
              >
                {/* Profile Picture */}
                <div className="flex justify-center mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-primary transition-colors">
                    <img
                      src={getProfileImage(lawyer)}
                      alt={lawyer.userId.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = defaultLawyer;
                      }}
                    />
                  </div>
                </div>

                {/* Lawyer Info */}
                <div className="text-center">
                  <h2 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                    {lawyer.userId.name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {lawyer.barCouncilState}
                  </p>
                </div>

                {/* Details */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Specialization:</span>{" "}
                      {lawyer.specialization.slice(0, 2).join(", ")}
                      {lawyer.specialization.length > 2 && ` +${lawyer.specialization.length - 2}`}
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-sm text-gray-600">
                      {lawyer.location.city}, {lawyer.location.state}
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-gray-600">
                      {lawyer.experienceYears} years experience
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-gray-600">
                      ₹{lawyer.consultationFee || "Negotiable"}
                    </p>
                  </div>
                </div>

                {/* View Profile Button */}
                <button
                  className="mt-5 w-full px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dull transition-colors group-hover:shadow-md"
                >
                  View Full Profile
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500">
                No lawyers found matching your search.
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Try adjusting your search terms
              </p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default ContactLawyer;
