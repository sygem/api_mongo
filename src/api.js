const express = require('express')
const eWS = require('express-ws')
const cors = require('cors')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const https = require('https')

const expressWs = eWS(express())
const { app } = expressWs

const log = require('./log')

app.use(morgan('combined', {
  stream: getStream() // TODO: Move this into ./log.js
}))
app.use(express.json())
app.use(cors())

const routes = require('./router')

module.exports = {
  app,
  initialize,
  setOptions
}

let options = {}

async function initialize() {
  routes.setupRateLimiter(app)
  await routes.setupRoutes(app)

  if (options.server.https) {
    https.createServer({
      key: fs.readFileSync(options.server.key),
      cert: fs.readFileSync(options.server.cert)
    }, app
    ).listen(options.server.apiport, () => {
      log.info(`API listening on HTTPS port ${options.server.apiport}!`)
    })
  } else {
    app.listen(options.server.apiport, () => {
      log.info(`API listening on HTTP port ${options.server.apiport}!`)
    })
  }
}

function setOptions(config) {
  routes.setOptions(config)
  options = config
}

function getFilesizeInBytes(filename) {
  try {
    const stats = fs.statSync(filename)
    const fileSizeInBytes = stats.size
    return fileSizeInBytes
  } catch (e) {
    // console.log(e);
    return 0
  }
}

function getStream() {
  const homeDirPath = path.join(__dirname, '../logs/')
  const filepath = `${homeDirPath}api_access.log`
  const size = getFilesizeInBytes(filepath)
  let flag = 'a+'
  if (size > (25 * 1024 * 1024)) { // 25MB
    flag = 'w' // rewrite file
  }
  return fs.createWriteStream(filepath, { flags: flag })
}
