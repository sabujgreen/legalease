import { useEffect, useState } from "react";
import { fetchLawyers } from "../services/lawyer.api";

const ContactLawyer = () => {
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

  return (
    <section className="px-8 py-12">
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
            <p className="text-gray-500 col-span-full">
              Loading lawyers...
            </p>
          ) : lawyers.length > 0 ? (
            lawyers.map((lawyer) => (
              <div
                key={lawyer._id}
                className="bg-white border border-borderColor rounded-xl p-5 hover:shadow-md transition-shadow"
              >
                <h2 className="text-lg font-semibold text-gray-900">
                  {lawyer.userId.name}
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  <span className="font-medium">Specialization:</span>{" "}
                  {lawyer.specialization.join(", ")}
                </p>

                <p className="text-sm text-gray-600">
                  <span className="font-medium">Location:</span>{" "}
                  {lawyer.location.city}, {lawyer.location.state}
                </p>

                <p className="text-sm text-gray-600">
                  <span className="font-medium">Experience:</span>{" "}
                  {lawyer.experienceYears} years
                </p>

                <button
                  className="mt-4 w-full px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dull transition-colors"
                >
                  Contact Lawyer
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full">
              No lawyers found matching your search.
            </p>
          )}
        </div>

      </div>
    </section>
  );
};

export default ContactLawyer;
