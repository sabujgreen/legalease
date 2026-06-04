const LegalDocuments = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-primary">Legal Documents</h1>
      <div className="mt-10 rounded-xl border border-borderColor bg-white p-8 text-center">
        <p className="text-lg font-medium text-gray-700">No document found</p>
        <p className="mt-2 text-sm text-gray-500">
          Legal documents are not available at the moment.
        </p>
      </div>
    </div>
  );
};

export default LegalDocuments;
