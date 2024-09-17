import { app } from './app';
import { container } from './di-container';
import { AppDataSource } from './db/database';
import { connectRedis } from './db/redis';
import { config } from './config/config';
import logger from './utils/logger';
import { CleanupJob } from './jobs/cron';

async function startServer() {
  try {
    await AppDataSource.initialize();
    logger.info('Database initialized');

    await connectRedis();

    app.listen(config.port, () => {
      logger.info(`Server is running on port ${config.port}`);
    });

    const cleanupJob = container.get<CleanupJob>(CleanupJob);
    cleanupJob.start();
  } catch (error) {
    logger.error('Error starting server', error);
    process.exit(1);
  }
}

startServer();