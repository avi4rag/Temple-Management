const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const env = require('../config/env');

/**
 * Sign a short-lived access token (default 15 minutes)
 * @param {object} payload - { id, role, email }
 */
function signAccessToken(payload) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN || '15m',
    issuer: 'divya-setu-api',
  });
}

/**
 * Sign a longer-lived refresh token (default 7 days)
 * @param {object} payload - { id }
 */
function signRefreshToken(payload) {
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET || env.JWT_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    issuer: 'divya-setu-api',
  });
}

/**
 * Verify an access token
 * @param {string} token
 */
function verifyAccessToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}

/**
 * Verify a refresh token
 * @param {string} token
 */
function verifyRefreshToken(token) {
  return jwt.verify(token, env.REFRESH_TOKEN_SECRET || env.JWT_SECRET);
}

/**
 * Generate cryptographically secure random token string
 * @param {number} bytes
 */
function generateSecureToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateSecureToken,
};
