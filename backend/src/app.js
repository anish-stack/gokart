const express = require('express');
const path = require('path');

const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');

const env = require('./config/env');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const sanitizeInput = require('./middleware/sanitize');
const { publicApiLimiter } = require('./middleware/rateLimit');
const logger = require('./utils/logger');

const app = express();

/**
 * =========================
 * PUBLIC UPLOADS
 * =========================
 *
 * backend/src/app.js
 *        ↓
 * backend/uploads
 */

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

/**
 * =========================
 * SECURITY
 * =========================
 */
app.use(helmet());

app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        env.CORS_ORIGINS.includes(origin) ||
        env.CORS_ORIGINS.includes('*')
      ) {
        return callback(null, true);
      }

      return callback(
        new Error('Not allowed by CORS')
      );
    },
    credentials: true,
  })
);


/**
 * =========================
 * BODY / COMPRESSION
 * =========================
 */
app.use(compression());

app.use(
  express.json({
    limit: '2mb',
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '2mb',
  })
);


/**
 * =========================
 * SANITIZATION
 * =========================
 */
app.use(hpp());
app.use(mongoSanitize());
app.use(sanitizeInput);


/**
 * =========================
 * LOGGER
 * =========================
 */
if (env.NODE_ENV !== 'test') {
  app.use(
    morgan(
      env.NODE_ENV === 'production'
        ? 'combined'
        : 'dev',
      {
        stream: {
          write: (msg) =>
            logger.info(msg.trim()),
        },
      }
    )
  );
}


/**
 * =========================
 * API ROUTES
 * =========================
 */
app.use(
  '/api',
  publicApiLimiter,
  routes
);


/**
 * =========================
 * ROOT
 * =========================
 */
app.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      name: 'GO! Track Express API',
      status: 'running',
    },
  });
});


/**
 * =========================
 * ERROR HANDLING
 * =========================
 */
app.use(notFound);
app.use(errorHandler);

module.exports = app;