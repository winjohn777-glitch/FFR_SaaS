import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from './generated/prisma';

// Import routes
import authRoutes from './routes/auth';
import organizationRoutes from './routes/organizations';
import accountRoutes from './routes/accounts';
import contactRoutes from './routes/contacts';
import journalEntryRoutes from './routes/journalEntries';
import invoiceRoutes from './routes/invoices';
import billRoutes from './routes/bills';
import paymentRoutes from './routes/payments';
import reportRoutes from './routes/reports';
import employeeRoutes from './routes/employees';
import trainingRoutes from './routes/training';
import customerRoutes from './routes/customers';
import leadRoutes from './routes/leads';
import opportunityRoutes from './routes/opportunities';
import jobRoutes from './routes/jobs';
import inventoryRoutes from './routes/inventory';
import documentRoutes from './routes/documents';
import transactionRoutes from './routes/transactions';
import fiscalPeriodRoutes from './routes/fiscalPeriods';
import metricsRoutes from './routes/metrics';
import sopRoutes from './routes/sop';
import integrationRoutes from './routes/integration';

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 5001;

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.API_RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.API_RATE_LIMIT_MAX_REQUESTS || '1000'), // requests per window
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(helmet());
app.use(limiter);
app.use(cors({
  origin: process.env.NODE_ENV === 'development'
    ? ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3010', 'http://localhost:5000']
    : [], // Add production URLs here
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Florida First Roofing Accounting API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: 'PostgreSQL connected'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/journal-entries', journalEntryRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/fiscal-periods', fiscalPeriodRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/sop', sopRoutes);
app.use('/api/integration', integrationRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);

  if (err.code === 'P2002') {
    return res.status(400).json({
      error: 'Duplicate entry',
      message: 'A record with this information already exists'
    });
  }

  if (err.code && err.code.startsWith('P')) {
    return res.status(400).json({
      error: 'Database error',
      message: 'Invalid data provided'
    });
  }

  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.originalUrl });
});

// Start server
const server = app.listen(port, () => {
  console.log(`🚀 Florida First Roofing Accounting API running on port ${port}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📁 Database: PostgreSQL - ${process.env.DATABASE_URL}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 Shutting down server...');
  server.close(async () => {
    await prisma.$disconnect();
    console.log('✅ Server shut down gracefully');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('🛑 Received SIGINT, shutting down...');
  server.close(async () => {
    await prisma.$disconnect();
    console.log('✅ Server shut down gracefully');
    process.exit(0);
  });
});

export default app;
export { prisma };