const express = require('express');
const { generateToken, authenticateUser, createUser, authMiddleware } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Please provide email and password'
    });
  }

  // Authenticate user with database
  const user = await authenticateUser(email, password);

  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }

  const token = generateToken(user.id);

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      name: `${user.first_name} ${user.last_name}`,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role
    }
  });
}));

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Private (Admin only)
router.post('/register', asyncHandler(async (req, res) => {
  const { email, password, first_name, last_name, role } = req.body;

  if (!email || !password || !first_name || !last_name || !role) {
    return res.status(400).json({
      success: false,
      error: 'Please provide all required fields'
    });
  }

  try {
    // Create new user in database
    const userId = await createUser({
      email,
      password,
      first_name,
      last_name,
      role
    });

    const token = generateToken(userId);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: userId,
        email,
        name: `${first_name} ${last_name}`,
        first_name,
        last_name,
        role
      }
    });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    throw error;
  }
}));

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', authMiddleware, asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      role: req.user.role
    }
  });
}));

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', asyncHandler(async (req, res) => {
  // In production, you might want to blacklist the token or handle logout logic

  res.json({
    success: true,
    message: 'Logged out successfully'
  });
}));

module.exports = router;