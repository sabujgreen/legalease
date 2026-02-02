export const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({
        message: "Access denied: not authenticated",
      });
    }

    // Make role check case-insensitive
    const userRole = req.user.role?.toUpperCase();
    const roles = allowedRoles.map(r => r.toUpperCase());

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        message: "Access denied: insufficient permissions",
      });
    }

    next();
  };
};
