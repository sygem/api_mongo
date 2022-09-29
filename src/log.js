const fs = require('fs')
const path = require('path')
const { ensureString } = require('./utils')

const homeDirPath = path.join(__dirname, '../logs/')

function writeToFile(filepath, args, writeDate = true) {
  const flag = 'a+'
  // if (size > (250 * 1024 * 1024)) { // 250MB
  //  flag = 'w'; // rewrite file
  // }
  const stream = fs.createWriteStream(filepath, { flags: flag })
  if (writeDate) {
    stream.write(`${new Date().toISOString()}          ${ensureString(args.message || args)}\n`)
  } else {
    stream.write(`${ensureString(args.message || args)}\n`)
  }
  if (args.stack && typeof args.stack === 'string') {
    stream.write(`${args.stack}\n`)
  }
  stream.end()
}

function error(args) {
  try {
    console.error(args)
    // write to file
    const filepath = `${homeDirPath}error.log`
    writeToFile(filepath, args)
  } catch (err) {
    console.error('This shall not have happened')
    console.error(err)
  }
}

function warn(args) {
  try {
    console.warn(args)
    // write to file
    const filepath = `${homeDirPath}warn.log`
    writeToFile(filepath, args)
  } catch (err) {
    console.error('This shall not have happened')
    console.error(err)
  }
}

function info(args) {
  try {
    console.log(args)
    // write to file
    const filepath = `${homeDirPath}info.log`
    writeToFile(filepath, args)
  } catch (err) {
    console.error('This shall not have happened')
    console.error(err)
  }
}

function debug(args) {
  try {
    console.log(args)
    // write to file
    const filepath = `${homeDirPath}debug.log`
    writeToFile(filepath, args)
  } catch (err) {
    console.error('This shall not have happened')
    console.error(err)
  }
}

function api(args) {
  try {
    // console.log(args);
    // write to file
    const filepath = `${homeDirPath}api.log`
    writeToFile(filepath, args)
  } catch (err) {
    console.error('This shall not have happened')
    console.error(err)
  }
}

module.exports = {
  error,
  warn,
  info,
  debug,
  api
}
