import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import config from './configs';
import database from './database';
import logger from './logger';
import { errorHandler, notFound } from './middlewares/error.middleware';

// Import routes
import authRoutes from './features/auth/auth.routes';
import tourRoutes from './features/tours/tour.routes';
import bookingRoutes from './features/bookings/booking.routes';
import paymentRoutes from './features/payments/payment.routes';
import additionalServiceRoutes from './features/additionalServices/additionalService.routes';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet());

    // CORS
    this.app.use(
      cors({
        origin: config.cors.allowedOrigins,
        credentials: true,
      })
    );

    // Body parser
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Compression
    this.app.use(compression());

    // Logging
    if (config.nodeEnv === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined'));
    }
  }

  private initializeRoutes(): void {
    // Health check
    this.app.get('/health', (_req: Request, res: Response) => {
      res.status(200).json({
        status: 'success',
        message: 'Server is running',
        timestamp: new Date().toISOString(),
      });
    });

    // API routes
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api', additionalServiceRoutes); // Đăng ký trước để bắt route /api/tours/:id/additional-services
    this.app.use('/api/tours', tourRoutes);
    this.app.use('/api/bookings', bookingRoutes);
    this.app.use('/api/payments', paymentRoutes);

    // Root route
    this.app.get('/', (_req: Request, res: Response) => {
      res.status(200).json({
        message: 'Welcome to Travel Tour API',
        version: '1.0.0',
        documentation: '/api/docs',
      });
    });
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFound);

    // Global error handler
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      // Connect to database
      await database.connect();

      // Start server
      this.app.listen(config.port, () => {
        logger.info(`🚀 Server is running on port ${config.port}`);
        logger.info(`📍 Environment: ${config.nodeEnv}`);
        logger.info(`🌐 http://localhost:${config.port}`);
      });
    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }
}

// Start application
const application = new App();
application.start();

export default application.app;
