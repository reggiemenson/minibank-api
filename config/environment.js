const env = process.env.API_ENV || 'development'
const config = require(`./${env}`)

module.exports = config