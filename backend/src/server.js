const app = require('./app');
const env = require('./config/env');
const connectDB = require('./config/db');
const logger = require('./utils/logger');

async function start() {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    logger.info(`GO! Track Express API listening on port ${env.PORT} (${env.NODE_ENV})`);
    logger.info(`Tracking provider: ${env.TRACKING_PROVIDER}`);
  });

  const shutdown = (signal) => {
    logger.info(`${signal} received, shutting down gracefully`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Fatal startup error:', err);
  process.exit(1);
});
