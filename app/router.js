'use strict'

// Local dependencies
const healthcheck = require('./healthcheck')
const aws = require('./aws')
const { contextMiddleware } = require('./utils/logger')

// Export
module.exports.bind = app => {
  app.use(contextMiddleware) // Context Middleware For Pino Logger
  app.use(healthcheck.router)
  app.use(aws.router)
}
