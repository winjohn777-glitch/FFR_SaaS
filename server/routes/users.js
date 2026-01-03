const express = require('express');
const { asyncHandler } = require('../middleware/errorHandler');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin/Supervisor only)
router.get('/', asyncHandler(async (req, res) => {
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

// @desc    Create new user/employee
// @route   POST /api/users
// @access  Private (Admin only)
router.post('/', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('role').optional().isIn(['admin', 'supervisor', 'user', 'employee']).withMessage('Invalid role'),
  body('department').optional().isString().withMessage('Department must be a string'),
  body('organizationId').optional().isInt().withMessage('Organization ID must be an integer')
], asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { email, password, firstName, lastName, role = 'employee', department = 'Operations', organizationId = 1 } = req.body;

  try {
    // Simulate checking if user already exists
    if (email === 'admin@floridafirstroofing.com') {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Mock user creation (without database)
    const newUser = {
      id: Math.floor(Math.random() * 10000),
      email,
      firstName,
      lastName,
      role,
      organizationId,
      organization: { id: organizationId, name: 'Florida First Roofing' }
    };

    res.status(201).json({
      success: true,
      message: 'Employee/user created successfully',
      data: {
        id: newUser.id,
        email: newUser.email,
        name: `${newUser.firstName} ${newUser.lastName}`,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        department: department,
        organization: newUser.organization
      }
    });

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create user/employee'
    });
  }
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