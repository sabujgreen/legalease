const Footer = () => {
  return (
    <footer className="px-6 py-4 border-t border-borderColor bg-light text-center">
      <p className="text-sm text-gray-500">
        © {new Date().getFullYear()} LegalEase. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
