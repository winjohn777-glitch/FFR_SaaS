const express = require('express');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// @desc    Get user progress for all courses
// @route   GET /api/progress
// @access  Private
router.get('/', asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Mock progress data
  const progress = {
    user_id: userId,
    overall_progress: {
      completed_courses: 2,
      in_progress_courses: 1,
      total_enrolled: 3,
      completion_rate: 67
    },
    courses: [
      {
        course_id: 1,
        course_title: 'OSHA Fall Protection',
        progress_percentage: 65,
        status: 'in_progress',
        modules_completed: 1,
        total_modules: 2,
        last_accessed: '2024-01-20T14:30:00Z'
      },
      {
        course_id: 2,
        course_title: 'Shingle Installation Fundamentals',
        progress_percentage: 100,
        status: 'completed',
        modules_completed: 2,
        total_modules: 2,
        last_accessed: '2024-01-12T16:45:00Z',
        completion_date: '2024-01-12T16:45:00Z'
      }
    ],
    certifications: [
      {
        certification_id: 1,
        course_id: 2,
        title: 'Shingle Installation Certified',
        issued_date: '2024-01-12T16:45:00Z',
        expiry_date: '2025-01-12T23:59:59Z',
        status: 'active'
      }
    ]
  };

  res.json({
    success: true,
    data: progress
  });
}));

// @desc    Update module progress
// @route   POST /api/progress/module
// @access  Private
router.post('/module', asyncHandler(async (req, res) => {
  const { course_id, module_id, completed, time_spent } = req.body;
  const userId = req.user.id;

  if (!course_id || !module_id) {
    return res.status(400).json({
      success: false,
      error: 'Course ID and Module ID are required'
    });
  }

  // Mock update logic
  const moduleProgress = {
    user_id: userId,
    course_id: parseInt(course_id),
    module_id: parseInt(module_id),
    completed: completed || false,
    time_spent_minutes: time_spent || 0,
    completed_at: completed ? new Date().toISOString() : null,
    updated_at: new Date().toISOString()
  };

  res.json({
    success: true,
    data: moduleProgress
  });
}));

module.exports = router;