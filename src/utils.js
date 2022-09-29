const qs = require('qs')

/**
 * To convert a parameter to a boolean.
 * @param {(string|number|boolean)} parameter True, false, 1 or 0 in either string, number or boolean form.
 * @returns {boolean} True or false.
 */
function ensureBoolean(parameter) {
  let param
  if (parameter === 'false' || parameter === 0 || parameter === '0' || parameter === false) {
    param = false
  }
  if (parameter === 'true' || parameter === 1 || parameter === '1' || parameter === true) {
    param = true
  }
  return param
}

/**
 * To convert a parameter to a number.
 * @param {*} parameter Parameter of any type.
 * @returns {number} Parameter converted to number type.
 */
function ensureNumber(parameter) {
  return typeof parameter === 'number' ? parameter : Number(parameter)
}

/**
 * To check if a parameter is an object and if not, return an empty object.
 * @param {*} parameter Parameter of any type.
 * @returns {object} Returns the original parameter if it is an object or returns an empty object.
 */
function ensureObject(parameter) {
  if (typeof parameter === 'object') {
    return parameter
  }
  if (!parameter) {
    return {}
  }
  let param
  try {
    param = JSON.parse(parameter)
  } catch (e) {
    param = qs.parse(parameter)
  }
  if (typeof param !== 'object') {
    return {}
  }
  return param
}

/**
 * To convert a parameter to a string.
 * @param {*} parameter Parameter of any type.
 * @returns {string} Parameter converted to string type.
 */
function ensureString(parameter) {
  return typeof parameter === 'string' ? parameter : JSON.stringify(parameter)
}

function ensurePrecision(number, precision = 8) {
  return (Math.floor(number * (10 ** precision)) / (10 ** precision))
}

module.exports = {
  ensureBoolean,
  ensureNumber,
  ensureObject,
  ensureString,
  ensurePrecision
}
