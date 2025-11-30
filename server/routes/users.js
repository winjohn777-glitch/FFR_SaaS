const express = require('express');
const { asyncHandler } = require('../middleware/errorHandler');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin/Supervisor only)
router.get('/', requireRole(['admin', 'supervisor']), asyncHandler(async (req, res) => {
  const mockUsers = [
    { id: 1, email: 'admin@floridafirstroofing.com', name: 'System Administrator', role: 'admin', department: 'Management' },
    { id: 2, email: 'supervisor@floridafirstroofing.com', name: 'Field Supervisor', role: 'supervisor', department: 'Operations' }
  ];

  res.json({
    success: true,
    count: mockUsers.length,
    data: mockUsers
  });
}));

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
}));

module.exports = router;