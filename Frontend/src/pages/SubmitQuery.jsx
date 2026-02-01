import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SubmitQuery = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // 1️⃣ Create case
      const createRes = await axios.post(
        "http://localhost:5000/api/cases",
        {
          title: form.category,
          description: form.description,
          userMeta: {
            name: form.name,
            email: form.email,
          },
        },
        { withCredentials: true }
      );

      const caseId = createRes.data.caseId;

      // 2️⃣ Trigger AI analysis + lawyer matching
      const analyzeRes = await axios.post(
        `http://localhost:5000/api/cases/${caseId}/analyze`,
        {},
        { withCredentials: true }
      );

      // 3️⃣ Redirect to result page
      navigate(`/case-result/${caseId}`, {
        state: {
          aiAnalysis: analyzeRes.data.aiAnalysis,
          lawyers: analyzeRes.data.suggestions,
        },
      });
    } catch (err) {
      console.error(err);
      alert("Something went wrong while submitting your query");
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
          Describe your legal issue. Our AI will find the best lawyer for you.
        </p>

        <div className="mt-8 bg-white border rounded-xl p-6 space-y-6">

          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <select
            name="category"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">Select category</option>
            <option>Property / Land Dispute</option>
            <option>Consumer Complaint</option>
            <option>Family / Divorce</option>
            <option>Employment / Workplace</option>
            <option>Police / FIR Related</option>
            <option>Other</option>
          </select>

          <textarea
            name="description"
            rows="5"
            placeholder="Describe your issue"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-3 bg-primary text-white rounded-lg"
          >
            {loading ? "Analyzing..." : "Submit Query"}
          </button>

        </div>
      </div>
    </section>
  );
};

export default SubmitQuery;
