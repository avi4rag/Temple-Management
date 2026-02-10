const Staff = require('../models/Staff');
const AuditLog = require('../models/AuditLog');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/token');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Handle staff login with brute-force lockout protection
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Check if user exists & load password
  const staff = await Staff.findOne({ email }).select('+password');
  if (!staff) {
    throw new AppError('Invalid email or password.', 401);
  }

  // 2. Check if account is locked
  if (staff.isLocked) {
    throw new AppError(
      'Account is temporarily locked due to multiple consecutive failed login attempts. Please try again later or contact an administrator.',
      423
    );
  }

  // 3. Verify password
  const isMatch = await staff.comparePassword(password);
  if (!isMatch) {
    await staff.handleFailedLogin();
    throw new AppError('Invalid email or password.', 401);
  }

  // 4. Reset failed attempts & update last login
  await staff.handleSuccessfulLogin();

  // 5. Generate tokens
  const payload = {
    id: staff._id,
    role: staff.role,
    email: staff.email,
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken({ id: staff._id });

  // 6. Record audit log asynchronously
  try {
    await AuditLog.create({
      staff: staff._id,
      action: 'LOGIN',
      targetEntity: 'Staff',
      targetId: staff._id.toString(),
      details: { email: staff.email, role: staff.role },
      ipAddress: req.ip || '',
      userAgent: req.headers['user-agent'] || '',
    });
  } catch {
    // Non-blocking for audit logging
  }

  // 7. Send sanitized response
  const sanitizedStaff = staff.toObject();
  delete sanitizedStaff.password;

  res.status(200).json({
    status: 'success',
    message: 'Login successful',
    data: {
      user: sanitizedStaff,
      accessToken,
      refreshToken,
    },
  });
});

/**
 * Refresh access token using valid refresh token
 */
const refreshToken = asyncHandler(async (req, res) => {
  const token = req.body.refreshToken || (req.cookies && req.cookies.refreshToken);

  if (!token) {
    throw new AppError('Refresh token is required.', 400);
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    throw new AppError('Invalid or expired refresh token. Please log in again.', 401);
  }

  const staff = await Staff.findById(decoded.id);
  if (!staff || !staff.active) {
    throw new AppError('Account is inactive or no longer exists.', 401);
  }

  const newAccessToken = signAccessToken({
    id: staff._id,
    role: staff.role,
    email: staff.email,
  });

  res.status(200).json({
    status: 'success',
    data: {
      accessToken: newAccessToken,
    },
  });
});

/**
 * Get profile of currently authenticated staff member
 */
const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.staff,
    },
  });
});

/**
 * Invalidate session / Logout
 */
const logout = asyncHandler(async (req, res) => {
  if (req.staff) {
    try {
      await AuditLog.create({
        staff: req.staff._id,
        action: 'LOGOUT',
        targetEntity: 'Staff',
        targetId: req.staff._id.toString(),
        ipAddress: req.ip || '',
        userAgent: req.headers['user-agent'] || '',
      });
    } catch {
      // Non-blocking
    }
  }

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
});

/**
 * Update staff password
 */
const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const staff = await Staff.findById(req.staff._id).select('+password');
  const isMatch = await staff.comparePassword(currentPassword);
  if (!isMatch) {
    throw new AppError('Current password is incorrect.', 400);
  }

  staff.password = newPassword;
  await staff.save();

  res.status(200).json({
    status: 'success',
    message: 'Password updated successfully',
  });
});

module.exports = {
  login,
  refreshToken,
  getProfile,
  logout,
  updatePassword,
};
