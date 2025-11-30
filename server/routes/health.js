const express = require('express');
const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'Florida First Roofing Backend - OK',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    database: 'connected', // TODO: Add actual database check
    services: {
      frontend: 'http://localhost:3000',
      backend: 'http://localhost:5000'
    }
  };

  try {
    res.status(200).json(healthCheck);
  } catch (error) {
    healthCheck.message = 'Service Unavailable';
    res.status(503).json(healthCheck);
  }
});

// Readiness check endpoint
router.get('/ready', (req, res) => {
  // TODO: Add checks for database connectivity, external services, etc.
  res.status(200).json({
    status: 'ready',
    timestamp: new Date().toISOString()
  });
});

// Liveness check endpoint
router.get('/live', (req, res) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;