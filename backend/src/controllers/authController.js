import { Staff } from '../models/Staff.js';
import { AuditLog } from '../models/AuditLog.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/token.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const staff = await Staff.findOne({ email }).select('+passwordHash');
  if (!staff) {
    throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
  }

  if (staff.isLocked) {
    throw new AppError(
      'Account is temporarily locked due to multiple consecutive failed login attempts. Please try again after 15 minutes.',
      423,
      'ACCOUNT_LOCKED'
    );
  }

  const isMatch = await staff.comparePassword(password);
  if (!isMatch) {
    await staff.handleFailedLogin();
    throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
  }

  await staff.handleSuccessfulLogin();

  const payload = {
    id: staff._id,
    role: staff.role,
    email: staff.email,
  };

  const accessToken = signAccessToken(payload);
  const refreshTokenValue = signRefreshToken({ id: staff._id });

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
    // Non-blocking
  }

  const staffObj = staff.toObject();
  delete staffObj.passwordHash;

  res.status(200).json({
    success: true,
    data: {
      user: staffObj,
      accessToken,
      refreshToken: refreshTokenValue,
    },
  });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.body.refreshToken || (req.cookies && req.cookies.refreshToken);

  if (!token) {
    throw new AppError('Refresh token is required.', 400, 'REFRESH_TOKEN_REQUIRED');
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    throw new AppError('Invalid or expired refresh token. Please log in again.', 401, 'INVALID_REFRESH_TOKEN');
  }

  const staff = await Staff.findById(decoded.id);
  if (!staff || !staff.isActive) {
    throw new AppError('Account is inactive or no longer exists.', 401, 'USER_INACTIVE');
  }

  const newAccessToken = signAccessToken({
    id: staff._id,
    role: staff.role,
    email: staff.email,
  });

  res.status(200).json({
    success: true,
    data: {
      accessToken: newAccessToken,
    },
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.staff,
    },
  });
});

export const logout = asyncHandler(async (req, res) => {
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
    success: true,
    message: 'Logged out successfully',
  });
});

export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  import('bcryptjs').then(async (bcrypt) => {
    const staff = await Staff.findById(req.staff._id).select('+passwordHash');
    const isMatch = await staff.comparePassword(currentPassword);
    if (!isMatch) {
      throw new AppError('Current password is incorrect.', 400, 'INVALID_CURRENT_PASSWORD');
    }

    staff.passwordHash = await bcrypt.default.hash(newPassword, 12);
    await staff.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  });
});

export default {
  login,
  refreshToken,
  getProfile,
  logout,
  updatePassword,
};
