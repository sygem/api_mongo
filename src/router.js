const apicache = require('apicache')
const cache = apicache.middleware

const log = require('./log')
const db = require('./db')
const rateLimit = require('express-rate-limit')

let options = {}

function setOptions(config) {
  db.setOptions(config)
  options = config
  apicache.clear()
}

function setupRateLimiter(app) {
  // set up rate limiter for database-modifying endpoints
  const dbLimiter = rateLimit({
    windowMs: 60 * 60 * 1 * 1000, // per hour
    max: async (request, response) => {
      return options.dbLimit
    },
    keyGenerator: (request, response) => {
      return request.headers['x-forwarded-for'] ?? request.ip
    },
    standardHeaders: true,
    legacyHeaders: false
  })
  app.use('/api/v1/somethingdb', dbLimiter)

  // set up rate limiter for ui info endpoints
  const uiLimiter = rateLimit({
    windowMs: 60 * 60 * 1 * 1000, // per hour
    max: async (request, response) => {
      return options.uiLimit
    },
    keyGenerator: (request, response) => {
      return request.headers['x-forwarded-for'] ?? request.ip
    },
    standardHeaders: true,
    legacyHeaders: false
  })
  app.use('/api/v1/config', uiLimiter)
}

async function setupRoutes(app) {
  await db.initialize()

  app.get('/api/v1/config', cache('30 seconds'), async (req, res) => {
    try {
      log.debug('config')
      const result = await db.readConfig()
      res.json(result)
    } catch (error) {
      const errMessage = createErrorMessage()
      res.json(errMessage)
    }
  })

  function createErrorMessage(message, name, code) {
    const errMessage = {
      status: 'error',
      data: {
        code,
        name,
        message: message || 'Unknown error'
      }
    }
    return errMessage
  }

  function errUnauthorizedMessage() {
    const errMessage = {
      status: 'error',
      data: {
        code: 401,
        name: 'Unauthorized',
        message: 'Unauthorized. Access denied.'
      }
    }
    return errMessage
  }
}

module.exports = {
  setupRateLimiter,
  setupRoutes,
  setOptions
}
