import { useState } from "react";

const dummyLawyers = [
  {
    id: 1,
    name: "Adv. Rahul Sharma",
    specialization: "Criminal Law",
    location: "Delhi",
    experience: "8 years",
  },
  {
    id: 2,
    name: "Adv. Neha Verma",
    specialization: "Family Law",
    location: "Mumbai",
    experience: "5 years",
  },
  {
    id: 3,
    name: "Adv. Amit Patel",
    specialization: "Property Law",
    location: "Ahmedabad",
    experience: "10 years",
  },
  {
    id: 4,
    name: "Adv. Pooja Singh",
    specialization: "Consumer Law",
    location: "Bhopal",
    experience: "6 years",
  },
  {
    id: 5,
    name: "Adv. Rakesh Mehta",
    specialization: "Corporate Law",
    location: "Bangalore",
    experience: "12 years",
  },
];

const ContactLawyer = () => {
  const [search, setSearch] = useState("");

  const filteredLawyers = dummyLawyers.filter((lawyer) =>
    `${lawyer.name} ${lawyer.specialization} ${lawyer.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

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
          {filteredLawyers.length > 0 ? (
            filteredLawyers.map((lawyer) => (
              <div
                key={lawyer.id}
                className="bg-white border border-borderColor rounded-xl p-5 hover:shadow-md transition-shadow"
              >
                <h2 className="text-lg font-semibold text-gray-900">
                  {lawyer.name}
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  <span className="font-medium">Specialization:</span>{" "}
                  {lawyer.specialization}
                </p>

                <p className="text-sm text-gray-600">
                  <span className="font-medium">Location:</span>{" "}
                  {lawyer.location}
                </p>

                <p className="text-sm text-gray-600">
                  <span className="font-medium">Experience:</span>{" "}
                  {lawyer.experience}
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
