const { MongoClient } = require('mongodb')
const log = require('./log')

let mongoConnection = null
let mongodb = null

let options = {}

function setOptions(config) {
  options = config
}

async function initialize() {
  mongoConnection = new MongoClient(options.mongo.uri, { useUnifiedTopology: true }, { useNewUrlParser: true }, { connectTimeoutMS: 30000 }, { keepAlive: 1 })
  await mongoConnection.connect()
  mongodb = mongoConnection.db(`${options.mongo.name}`)

  log.info('Connected to Mongo database')

  // Create indexes
  mongodb.collection('acollection').createIndex({ field: 1 }, { name: 'query for getting a thing by a field' })
}

async function readConfig() {
  const collection = mongodb.collection('config')
  return collection.findOne({}, {
    projection: {
      _id: 0,
      fieldToExclude: 0
    }
  })
}

async function readFullConfig() {
  const collection = mongodb.collection('config')
  return collection.findOne({}, {
    projection: {
      _id: 0
    }
  })
}

async function setConfig(config) {
  const collection = mongodb.collection('config')
  await collection.updateOne({}, { $set: config }, { upsert: true })
}

async function updateConfigField(avalue) {
  const collection = mongodb.collection('config')
  await collection.updateOne({}, { $set: { afield: avalue } }, { upsert: true })
}

module.exports = {
  setOptions,
  initialize,

  // Config
  readConfig,
  readFullConfig,
  setConfig,
  updateConfigField
}
