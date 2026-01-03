const express = require('express');
const { asyncHandler } = require('../middleware/errorHandler');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

// Mock enrollments data
const mockEnrollments = [
  {
    id: 1,
    user_id: 1,
    course_id: 1,
    enrolled_at: '2024-01-15T10:00:00Z',
    started_at: '2024-01-15T11:00:00Z',
    completed_at: null,
    status: 'in_progress',
    progress_percentage: 65,
    current_module_id: 2,
    due_date: '2024-02-15T23:59:59Z'
  },
  {
    id: 2,
    user_id: 1,
    course_id: 2,
    enrolled_at: '2024-01-10T14:30:00Z',
    started_at: '2024-01-10T15:00:00Z',
    completed_at: '2024-01-12T16:45:00Z',
    status: 'completed',
    progress_percentage: 100,
    current_module_id: null,
    due_date: '2024-02-10T23:59:59Z'
  }
];

// @desc    Get user enrollments
// @route   GET /api/enrollments
// @access  Private
router.get('/', asyncHandler(async (req, res) => {
  const { status, course_id } = req.query;
  const userId = req.user.id;

  let userEnrollments = mockEnrollments.filter(e => e.user_id === userId);

  if (status) {
    userEnrollments = userEnrollments.filter(e => e.status === status);
  }

  if (course_id) {
    userEnrollments = userEnrollments.filter(e => e.course_id === parseInt(course_id));
  }

  res.json({
    success: true,
    count: userEnrollments.length,
    data: userEnrollments
  });
}));

// @desc    Enroll in course
// @route   POST /api/enrollments
// @access  Private
router.post('/', asyncHandler(async (req, res) => {
  const { course_id } = req.body;
  const userId = req.user.id;

  if (!course_id) {
    return res.status(400).json({
      success: false,
      error: 'Course ID is required'
    });
  }

  // Check if already enrolled
  const existingEnrollment = mockEnrollments.find(
    e => e.user_id === userId && e.course_id === parseInt(course_id)
  );

  if (existingEnrollment) {
    return res.status(400).json({
      success: false,
      error: 'Already enrolled in this course'
    });
  }

  const newEnrollment = {
    id: mockEnrollments.length + 1,
    user_id: userId,
    course_id: parseInt(course_id),
    enrolled_at: new Date().toISOString(),
    started_at: null,
    completed_at: null,
    status: 'enrolled',
    progress_percentage: 0,
    current_module_id: null,
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
  };

  mockEnrollments.push(newEnrollment);

  res.status(201).json({
    success: true,
    data: newEnrollment
  });
}));

// @desc    Update enrollment progress
// @route   PUT /api/enrollments/:id
// @access  Private
router.put('/:id', asyncHandler(async (req, res) => {
  const enrollmentId = parseInt(req.params.id);
  const userId = req.user.id;
  const { progress_percentage, current_module_id, status } = req.body;

  const enrollmentIndex = mockEnrollments.findIndex(
    e => e.id === enrollmentId && e.user_id === userId
  );

  if (enrollmentIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Enrollment not found'
    });
  }

  const enrollment = mockEnrollments[enrollmentIndex];

  // Update enrollment
  mockEnrollments[enrollmentIndex] = {
    ...enrollment,
    progress_percentage: progress_percentage || enrollment.progress_percentage,
    current_module_id: current_module_id || enrollment.current_module_id,
    status: status || enrollment.status,
    started_at: enrollment.started_at || new Date().toISOString(),
    completed_at: status === 'completed' ? new Date().toISOString() : enrollment.completed_at
  };

  res.json({
    success: true,
    data: mockEnrollments[enrollmentIndex]
  });
}));

module.exports = router;