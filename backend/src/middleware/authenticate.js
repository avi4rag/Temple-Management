import { Staff } from '../models/Staff.js';
import { verifyAccessToken } from '../utils/token.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new AppError('Authentication required. Please log in with valid credentials.', 401, 'AUTH_REQUIRED');
  }

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new AppError('Your session has expired. Please refresh your token or log in again.', 401, 'TOKEN_EXPIRED');
    }
    throw new AppError('Invalid authentication token.', 401, 'INVALID_TOKEN');
  }

  const staff = await Staff.findById(decoded.id).select('-passwordHash');
  if (!staff) {
    throw new AppError('The user account associated with this token no longer exists.', 401, 'USER_NOT_FOUND');
  }

  if (!staff.isActive) {
    throw new AppError('Your staff account is currently deactivated. Contact a temple administrator.', 403, 'ACCOUNT_DEACTIVATED');
  }

  req.staff = staff;
  req.user = staff;

  next();
});

export default authenticate;
