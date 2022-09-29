const fs = require('fs')
const watch = require('node-watch')
const log = require('./src/log')

const server = require('./src/api.js')

let options = JSON.parse(fs.readFileSync('config.json'))

if (!options.server || !options.mongo) {
  log.info('Invalid config file')
  process.exit()
}

server.setOptions(options)

watch(['config.json'], function(evt, filename) {
  options = JSON.parse(fs.readFileSync('config.json'))
  server.setOptions(options)
})

run()

async function run() {
  log.info('Example API Server')
  log.info('==================')

  server.initialize()
}
