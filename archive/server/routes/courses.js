const express = require('express');
const { asyncHandler } = require('../middleware/errorHandler');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

// Mock courses data (in production, fetch from database)
const mockCourses = [
  {
    id: 1,
    title: 'OSHA Fall Protection',
    description: 'Comprehensive fall protection training for roofing professionals',
    category: 'safety',
    subcategory: 'fall_protection',
    difficulty: 'intermediate',
    duration_hours: 8,
    is_required: true,
    is_certification: true,
    osha_standard: '29 CFR 1926 Subpart M',
    instructor_id: 1,
    status: 'active',
    modules: [
      {
        id: 1,
        title: 'Introduction to Fall Protection',
        order: 1,
        content_type: 'video',
        duration_minutes: 30,
        is_required: true
      },
      {
        id: 2,
        title: 'Personal Fall Arrest Systems',
        order: 2,
        content_type: 'interactive',
        duration_minutes: 45,
        is_required: true
      }
    ],
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    title: 'Shingle Installation Fundamentals',
    description: 'Master the basics of residential shingle installation',
    category: 'technical',
    subcategory: 'installation',
    difficulty: 'beginner',
    duration_hours: 6,
    is_required: false,
    is_certification: true,
    instructor_id: 2,
    status: 'active',
    modules: [
      {
        id: 3,
        title: 'Roofing Materials Overview',
        order: 1,
        content_type: 'presentation',
        duration_minutes: 20,
        is_required: true
      },
      {
        id: 4,
        title: 'Installation Techniques',
        order: 2,
        content_type: 'video',
        duration_minutes: 40,
        is_required: true
      }
    ],
    created_at: '2024-01-10T14:30:00Z',
    updated_at: '2024-01-10T14:30:00Z'
  },
  {
    id: 3,
    title: 'Customer Service Excellence',
    description: 'Professional communication and customer relations for roofing teams',
    category: 'business',
    subcategory: 'customer_service',
    difficulty: 'beginner',
    duration_hours: 4,
    is_required: true,
    is_certification: false,
    instructor_id: 1,
    status: 'active',
    modules: [
      {
        id: 5,
        title: 'Professional Communication',
        order: 1,
        content_type: 'presentation',
        duration_minutes: 25,
        is_required: true
      }
    ],
    created_at: '2024-01-05T09:15:00Z',
    updated_at: '2024-01-05T09:15:00Z'
  }
];

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
router.get('/', asyncHandler(async (req, res) => {
  const { category, difficulty, required, certification, search } = req.query;

  let filteredCourses = [...mockCourses];

  // Apply filters
  if (category) {
    filteredCourses = filteredCourses.filter(course =>
      course.category === category
    );
  }

  if (difficulty) {
    filteredCourses = filteredCourses.filter(course =>
      course.difficulty === difficulty
    );
  }

  if (required !== undefined) {
    filteredCourses = filteredCourses.filter(course =>
      course.is_required === (required === 'true')
    );
  }

  if (certification !== undefined) {
    filteredCourses = filteredCourses.filter(course =>
      course.is_certification === (certification === 'true')
    );
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filteredCourses = filteredCourses.filter(course =>
      course.title.toLowerCase().includes(searchLower) ||
      course.description.toLowerCase().includes(searchLower)
    );
  }

  res.json({
    success: true,
    count: filteredCourses.length,
    data: filteredCourses
  });
}));

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Private
router.get('/:id', asyncHandler(async (req, res) => {
  const course = mockCourses.find(c => c.id === parseInt(req.params.id));

  if (!course) {
    return res.status(404).json({
      success: false,
      error: 'Course not found'
    });
  }

  res.json({
    success: true,
    data: course
  });
}));

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Admin/Instructor only)
router.post('/', requireRole(['admin', 'instructor']), asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    subcategory,
    difficulty,
    duration_hours,
    is_required,
    is_certification,
    osha_standard,
    modules
  } = req.body;

  if (!title || !description || !category || !difficulty || !duration_hours) {
    return res.status(400).json({
      success: false,
      error: 'Please provide all required fields'
    });
  }

  const newCourse = {
    id: mockCourses.length + 1,
    title,
    description,
    category,
    subcategory,
    difficulty,
    duration_hours,
    is_required: is_required || false,
    is_certification: is_certification || false,
    osha_standard,
    instructor_id: req.user.id,
    status: 'draft',
    modules: modules || [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // In production, save to database
  mockCourses.push(newCourse);

  res.status(201).json({
    success: true,
    data: newCourse
  });
}));

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Admin/Instructor only)
router.put('/:id', requireRole(['admin', 'instructor']), asyncHandler(async (req, res) => {
  const courseIndex = mockCourses.findIndex(c => c.id === parseInt(req.params.id));

  if (courseIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Course not found'
    });
  }

  const course = mockCourses[courseIndex];

  // Check if user owns the course or is admin
  if (course.instructor_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to update this course'
    });
  }

  // Update course
  mockCourses[courseIndex] = {
    ...course,
    ...req.body,
    updated_at: new Date().toISOString()
  };

  res.json({
    success: true,
    data: mockCourses[courseIndex]
  });
}));

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Admin only)
router.delete('/:id', requireRole(['admin']), asyncHandler(async (req, res) => {
  const courseIndex = mockCourses.findIndex(c => c.id === parseInt(req.params.id));

  if (courseIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Course not found'
    });
  }

  // In production, soft delete or move to archive
  mockCourses.splice(courseIndex, 1);

  res.json({
    success: true,
    data: {}
  });
}));

// @desc    Get course categories
// @route   GET /api/courses/categories
// @access  Private
router.get('/meta/categories', asyncHandler(async (req, res) => {
  const categories = [
    {
      value: 'safety',
      label: 'Safety Training',
      subcategories: [
        { value: 'fall_protection', label: 'Fall Protection' },
        { value: 'ppe', label: 'Personal Protective Equipment' },
        { value: 'hazmat', label: 'Hazardous Materials' },
        { value: 'emergency', label: 'Emergency Procedures' }
      ]
    },
    {
      value: 'technical',
      label: 'Technical Skills',
      subcategories: [
        { value: 'installation', label: 'Installation Techniques' },
        { value: 'repair', label: 'Repair Methods' },
        { value: 'inspection', label: 'Inspection Procedures' },
        { value: 'tools', label: 'Tools & Equipment' }
      ]
    },
    {
      value: 'business',
      label: 'Business Skills',
      subcategories: [
        { value: 'customer_service', label: 'Customer Service' },
        { value: 'sales', label: 'Sales Techniques' },
        { value: 'project_management', label: 'Project Management' },
        { value: 'documentation', label: 'Documentation' }
      ]
    },
    {
      value: 'certification',
      label: 'Certifications',
      subcategories: [
        { value: 'osha', label: 'OSHA Certification' },
        { value: 'manufacturer', label: 'Manufacturer Certification' },
        { value: 'license', label: 'License Preparation' },
        { value: 'continuing_ed', label: 'Continuing Education' }
      ]
    }
  ];

  res.json({
    success: true,
    data: categories
  });
}));

module.exports = router;