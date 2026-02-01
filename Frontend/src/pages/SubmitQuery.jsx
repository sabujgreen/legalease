import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCase, analyzeCase } from "../services/case.api";
import { useAuth } from "../context/AuthContext";

const SubmitQuery = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [form, setForm] = useState({
    title: "",
    description: "",
    city: "",
    state: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // Validate authentication
    if (!isAuthenticated) {
      alert("Please log in to submit a query");
      return;
    }

    // Validate description length (backend requires min 20 chars)
    if (form.description.length < 20) {
      alert("Please provide a detailed description (at least 20 characters)");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Create case
      const casePayload = {
        title: form.title,
        description: form.description,
      };

      // Add location if provided
      if (form.city || form.state) {
        casePayload.location = {
          city: form.city,
          state: form.state,
        };
      }

      const createRes = await createCase(casePayload);
      const caseId = createRes.data.caseId;

      // 2️⃣ Trigger AI analysis + lawyer matching
      const analyzeRes = await analyzeCase(caseId);

      // 3️⃣ Redirect to result page with data
      navigate(`/case-result/${caseId}`, {
        state: {
          aiAnalysis: analyzeRes.data.aiAnalysis,
          lawyers: analyzeRes.data.suggestions,
        },
      });
    } catch (err) {
      console.error("Error submitting query:", err);

      // Provide user-friendly error messages
      if (err.response?.status === 401) {
        alert("Please log in to submit a query");
      } else if (err.response?.status === 400) {
        alert("Please check your input and try again");
      } else {
        alert("Something went wrong while analyzing your case. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-8 py-12">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-2xl font-semibold text-primary">
          Submit Your Legal Query
        </h1>

        <p className="mt-2 text-gray-600">
          Describe your legal issue. Our AI will analyze it and find the best lawyers for you.
        </p>

        <div className="mt-8 bg-white border border-borderColor rounded-xl p-6 space-y-6">

          {/* Case Title/Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Case Category (Optional)
            </label>
            <select
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select category</option>
              <option>Property / Land Dispute</option>
              <option>Consumer Complaint</option>
              <option>Family / Divorce</option>
              <option>Employment / Workplace</option>
              <option>Criminal / Police</option>
              <option>Contract Dispute</option>
              <option>Other</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Case Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              rows="6"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your legal issue in detail... (minimum 20 characters)"
              className="w-full px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="mt-1 text-xs text-gray-500">
              {form.description.length} / 20 characters minimum
            </p>
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City (Optional)
              </label>
              <input
                name="city"
                type="text"
                value={form.city}
                onChange={handleChange}
                placeholder="e.g., Mumbai"
                className="w-full px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State (Optional)
              </label>
              <input
                name="state"
                type="text"
                value={form.state}
                onChange={handleChange}
                placeholder="e.g., Maharashtra"
                className="w-full px-4 py-2 border border-borderColor rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-light border border-borderColor rounded-lg p-4">
            <p className="text-sm text-gray-700">
              💡 <span className="font-medium">Tip:</span> Providing your location helps us match you with nearby lawyers who can assist you better.
            </p>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading || form.description.length < 20}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dull transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Analyzing your case..." : "Submit & Find Lawyers"}
          </button>

        </div>
      </div>
    </section>
  );
};

export default SubmitQuery;

