require('dotenv').config()

const http = require('http')
const url = require('url')
const routes = require('./router')
const config = require('./config/environment')

const { Pool } = require('pg')
const pool = new Pool({
  user: config.dbUser,
  password: config.dbPass,
  host: config.hostname,
  port: config.dbPort
})

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

const server = http.createServer((req, res) => {
  let parsedURL = url.parse(req.url, true)
  let path = parsedURL.pathname
  let qs = parsedURL.query

  let headers = req.headers
  let method = req.method
  let body = ''

  path = path.replace(/^\/+|\/+$/g, '')

  req.on('data', (chunk) => {
    body = JSON.parse(chunk)
  })

  req.on('end', () => {
    let route = typeof routes[path] !== 'undefined' ? routes[path] : routes['invalid']
    let data = {
      path: path,
      headers: headers,
      method: method,
      query: qs,
      body: body
    }
    route(data, res, pool)
  })

  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`)
  })

})

server.listen(config.port, config.hostname, () => {
  console.log(`Server running in ${config.env} at http://${config.hostname}:${config.port}/`)
})

module.exports = server

