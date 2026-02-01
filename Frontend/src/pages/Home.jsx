import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="px-8 py-20">
      <div className="max-w-6xl mx-auto text-center">

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          Simplifying Legal Help for <br />
          <span className="text-primary">Everyone</span>
        </h1>

        {/* Subheading */}
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          LegalEase helps you understand laws, submit legal queries,
          and get assistance without confusion or fear.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex justify-center gap-4">
          <Link
            to="/chatbot"
            className="px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-dull transition-colors"
          >
            Ask AI Assistant
          </Link>

          <Link
            to="/submit-query"
            className="px-6 py-3 rounded-lg border border-primary text-primary font-medium hover:bg-primary hover:text-white transition-colors"
          >
            Submit a Query
          </Link>
        </div>

        {/* Trust line */}
        <p className="mt-10 text-sm text-gray-500">
          Trusted, simple, and designed for everyday legal needs.
        </p>

      </div>
    </section>
  );
};

export default Home;
