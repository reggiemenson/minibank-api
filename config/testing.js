const port = process.env.PORT || 5000
const hostname = process.env.HOST || '127.0.0.1'
const dbPort = 2432
const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS


module.exports = {
  env: 'testing',
  port: port,
  hostname: hostname,
  dbUser: dbUser,
  dbPass: dbPass,
  dbPort: dbPort
}

