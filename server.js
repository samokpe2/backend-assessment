// Node.js core dependencies
require('dotenv').config();

// Npm dependencies
const express = require("express");
const argv = require("minimist")(process.argv.slice(2));
const compression = require("compression");
const cors = require("cors");
const multer = require('multer');
var useragent = require("express-useragent");
const uuid = require('uuid');
const pinoHttpLogger = require('pino-http')
const promBundle = require("express-prom-bundle");
const metricsMiddleware = promBundle({
  buckets: [0.01, 0.1, 0.5, 1, 3, 5, 7.5, 10, 12.5, 15, 20, 25, 30, 40, 50, 60],
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
  promClient: { collectDefaultMetrics: {} }
});


// Local dependencies
const router = require("./app/router");
const noCache = require("./common/utils/no-cache");
const correlationHeader = require("./common/middleware/correlation-header");
const { logger, PinoLogger } = require('./app/utils/logger')

// Global constants
const unconfiguredApp = express();
const PORT = process.env.PORT || 8080;
const { NODE_ENV } = process.env;

function initialiseGlobalMiddleware(app) {
  app.use(compression());
  app.use(multer().any()); 
  
  if (process.env.DISABLE_REQUEST_LOGGING !== "true") {

    app.use(pinoHttpLogger({
      logger: PinoLogger,
      genReqId: req => req.headers['x-request-id'] || uuid(),
      autoLogging: {
        ignorePaths: ["/metrics", "/healthcheck", "/"],
        ignore: (req) => req.method === 'OPTIONS'
      },
      serializers: {
        req(request) {
          return {            
            url: request.url,
            method: request.method,
            reqId: request.id,
            params: request.params,
            query: request.query,
            headers: {
              host: request.headers.host,
              origin: request.headers.origin,
              referer: request.headers.referer,
              "user-agent": request.headers["user-agent"],
              "x-forwarded-for": request.headers["x-forwarded-for"]
            },
          }
        },
        res(response) {
          return { statusCode: response.statusCode }
        },
        err: pinoHttpLogger.serializers
      }
    }))
  }

  app.use((req, res, next) => {
    res.locals.asset_path = "/public/"; // eslint-disable-line camelcase
    noCache(res);
    next();
  });

  app.use((req, res, next) => {
    if (req.originalUrl === "/stripe-webhook") {
      next();
    } else {
      express.json({ limit: "10mb" })(req, res, next);
    }
  });

  app.use(express.urlencoded({ limit: "10mb", extended: true }));
  app.use(cors());
  app.use("*", correlationHeader);
  app.use(useragent.express());
  app.use(metricsMiddleware);
}

function initialiseProxy(app) {
  app.enable("trust proxy");
}

function initialiseRoutes(app) {
  router.bind(app);
}

function listen() {
  const app = initialise();
  app.listen(PORT);
  logger.info("Listening on port " + PORT);
}

/**
 * Configures app
 * @return app
 */
function initialise() {
  console.log("## ENVIRONMENT ##", process.env.NODE_ENV);
  

  const app = unconfiguredApp;
  app.disable("x-powered-by");
  initialiseProxy(app);
  initialiseGlobalMiddleware(app);
  initialiseRoutes(app);

  return app;
}

/**
 * Starts app after ensuring DB is up
 */
function start() {
  listen();
}

/**
 * -i flag. Immediately invoke start.
 * Allows script to be run by task runner
 */
if (argv.i) {
  start();
}

process.on('unhandledRejection', error => {
  logger.error({ error }, 'Unhandled Promise Rejection')
});

module.exports = {
  start,
  getApp: initialise,
};
