const AppError = require('../utils/AppError');

/**
 * Role-based authorization middleware
 * @param  {...string} allowedRoles - Allowed staff roles, e.g. 'super_admin', 'gate_operator'
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.staff) {
      return next(new AppError('Authentication required before role authorization.', 401));
    }

    if (!allowedRoles.includes(req.staff.role)) {
      return next(
        new AppError(
          `Forbidden: Role '${req.staff.role}' is not authorized to perform this operation.`,
          403
        )
      );
    }

    next();
  };
}

module.exports = authorize;
