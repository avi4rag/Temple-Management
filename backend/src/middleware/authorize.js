import { AppError } from '../utils/AppError.js';

export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.staff) {
      return next(new AppError('Authentication required before role authorization.', 401, 'AUTH_REQUIRED'));
    }

    if (!allowedRoles.includes(req.staff.role)) {
      return next(
        new AppError(
          `Forbidden: Role '${req.staff.role}' is not authorized to perform this operation.`,
          403,
          'FORBIDDEN'
        )
      );
    }

    next();
  };
}

export default authorize;
