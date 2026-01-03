const express = require('express');
const router = express.Router();

// GET /api/metrics - Get dashboard metrics
router.get('/', (req, res) => {
  try {
    // For now, return static data to test the frontend functionality
    // TODO: Replace with real database queries later
    const metrics = {
      monthlyRevenue: {
        value: 108250,
        change: 12.5,
        positive: true,
        formattedValue: '$108,250',
        trend: '+12.5% from last month'
      },
      activeJobs: {
        value: 12,
        change: 3,
        positive: true,
        formattedValue: '12',
        trend: '+3 new this week'
      },
      outstandingInvoices: {
        value: 24750,
        change: 5,
        positive: false,
        formattedValue: '$24,750',
        trend: '5 invoices overdue'
      },
      materialInventory: {
        value: 18200,
        change: 0,
        positive: true,
        formattedValue: '$18,200',
        trend: 'Well stocked'
      },
      sopCompliance: {
        value: 87.3,
        change: 23,
        positive: true,
        formattedValue: '87.3%',
        trend: '23 procedures completed'
      },
      teamTraining: {
        value: 94.2,
        change: 3,
        positive: false,
        formattedValue: '94.2%',
        trend: '3 trainings overdue'
      },
      recentActivity: [
        { id: '1', title: 'New Roof Installation', customer: 'Smith Family', value: '$8,500', status: 'active', progress: 65 },
        { id: '2', title: 'Tile Repair', customer: 'Johnson Home', value: '$2,300', status: 'completed', progress: 100 },
        { id: '3', title: 'Gutter Replacement', customer: 'Davis Property', value: '$1,800', status: 'pending', progress: 0 },
        { id: '4', title: 'Shingle Replacement', customer: 'Wilson House', value: '$4,200', status: 'active', progress: 30 },
        { id: '5', title: 'Roof Inspection', customer: 'Brown Residence', value: '$450', status: 'completed', progress: 100 }
      ],
      upcomingInspections: [
        { date: 'Today 2:00 PM', address: '789 Beach Rd', type: 'Final Inspection' },
        { date: 'Tomorrow 10:00 AM', address: '321 Pine St', type: 'Progress Check' },
        { date: 'Thu 3:00 PM', address: '654 Oak Ave', type: 'Initial Assessment' }
      ],
      lastUpdated: new Date().toISOString()
    };

    res.json(metrics);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// GET /api/metrics/revenue-trends - Get revenue trends for charts
router.get('/revenue-trends', (req, res) => {
  try {
    // Static data for testing - replace with real queries later
    const trends = [
      { month: 'Jul', revenue: 85000, jobs: 15 },
      { month: 'Aug', revenue: 92000, jobs: 18 },
      { month: 'Sep', revenue: 78000, jobs: 14 },
      { month: 'Oct', revenue: 96000, jobs: 19 },
      { month: 'Nov', revenue: 108000, jobs: 22 },
      { month: 'Dec', revenue: 108250, jobs: 21 }
    ];

    res.json(trends);
  } catch (error) {
    console.error('Error fetching revenue trends:', error);
    res.status(500).json({ error: 'Failed to fetch revenue trends' });
  }
});

// GET /api/metrics/job-types - Get job type distribution
router.get('/job-types', (req, res) => {
  try {
    // Static data for testing - replace with real queries later
    const distribution = [
      { name: 'New Installation', value: 45, color: '#1e40af', count: 9 },
      { name: 'Repair', value: 30, color: '#059669', count: 6 },
      { name: 'Maintenance', value: 15, color: '#dc2626', count: 3 },
      { name: 'Inspection', value: 10, color: '#8b4513', count: 2 }
    ];

    res.json(distribution);
  } catch (error) {
    console.error('Error fetching job types:', error);
    res.status(500).json({ error: 'Failed to fetch job types' });
  }
});


module.exports = router;