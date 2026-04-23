// config/envparser.js
const DotEnv = require('dotenv')
const parsedEnv = DotEnv.config().parsed

module.exports = function () {
  // Quasar's build.env runs values through DefinePlugin, which already
  // stringifies them. Pre-stringifying here would double-wrap the value
  // (e.g. API_URI would become the literal string `"https://stc.training"`
  // including quotes) and break URL concatenation at runtime.
  return parsedEnv || {}
}