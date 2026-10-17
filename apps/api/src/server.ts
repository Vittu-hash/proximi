import { app } from './app.js';
import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import { logger } from './lib/logger.js';

let isShuttingDown = false;

async function startServer(): Promise<void> {
  await connectDB();
  logger.info('Connected to MongoDB');

  const server = app.listen(env.PORT, () => {
    logger.info(`Server listening on port ${env.PORT}`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    if (isShuttingDown) {
      return;
    }
    isShuttingDown = true;
    logger.info(`Received ${signal}, shutting down gracefully`);
    server.close(async () => {
      try {
        await disconnectDB();
        logger.info('MongoDB disconnected');
        process.exit(0);
      } catch (error) {
        logger.error({ error }, 'Error during disconnect');
        process.exit(1);
      }
    });
  };

  process.on('SIGTERM', () => {
    void shutdown('SIGTERM');
  });

  process.on('SIGINT', () => {
    void shutdown('SIGINT');
  });
}

void startServer();
