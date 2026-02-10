const Staff = require('../models/Staff');
const { verifyAccessToken } = require('../utils/token');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new AppError('Authentication required. Please log in with valid credentials.', 401);
  }

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new AppError('Your session has expired. Please refresh your token or log in again.', 401);
    }
    throw new AppError('Invalid authentication token.', 401);
  }

  const staff = await Staff.findById(decoded.id).select('-password');
  if (!staff) {
    throw new AppError('The user account associated with this token no longer exists.', 401);
  }

  if (!staff.active) {
    throw new AppError('Your staff account is currently deactivated. Contact a temple administrator.', 403);
  }

  // Attach authenticated staff identity to request
  req.staff = staff;
  req.user = staff; // Convenience alias

  next();
});

module.exports = authenticate;
