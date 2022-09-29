const db = require('./src/db')
const fs = require('fs')

const options = JSON.parse(fs.readFileSync('config.json'))
run()

async function run() {
  await db.setOptions(options)
  await db.initialize()
  const defaultConfig = {
    field1: 'value1',
    field2: 'value2'
  }
  await db.setConfig(defaultConfig)
  process.exit()
}
