const SubmitQuery = () => {
  return (
    <section className="px-8 py-12">
      <div className="max-w-3xl mx-auto">

        {/* Page Title */}
        <h1 className="text-2xl font-semibold text-primary">
          Submit Your Legal Query
        </h1>

        <p className="mt-2 text-gray-600">
          Describe your legal issue below. Our team or AI assistant will help you
          understand the next steps.
        </p>

        {/* Form */}
        <div className="mt-8 bg-white border border-borderColor rounded-xl p-6 space-y-6">

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full px-4 py-2 rounded-lg border border-borderColor focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg border border-borderColor focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Query Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Query Category
            </label>
            <select
              className="w-full px-4 py-2 rounded-lg border border-borderColor bg-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option>Select category</option>
              <option>Property / Land Dispute</option>
              <option>Consumer Complaint</option>
              <option>Family / Divorce</option>
              <option>Employment / Workplace</option>
              <option>Police / FIR Related</option>
              <option>Other</option>
            </select>
          </div>

          {/* Query Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Describe Your Issue
            </label>
            <textarea
              rows="5"
              placeholder="Explain your legal issue in detail..."
              className="w-full px-4 py-2 rounded-lg border border-borderColor resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              className="px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-dull transition-colors"
            >
              Submit Query
            </button>
          </div>

        </div>

        {/* Note */}
        <p className="mt-6 text-sm text-gray-500">
          ⚠️ Please avoid sharing sensitive personal information unless required.
        </p>

      </div>
    </section>
  );
};

export default SubmitQuery;
