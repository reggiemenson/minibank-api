
const health = require('./views/health')
const customers = require('./views/customers')
const accounts = require('./views/accounts')
const transactions = require('./views/transactions')

const notAllowed = (res) => {
  res.writeHead(405, { 'Content-Type': 'application/json' })
  const payload = {
    message: 'Invalid method'
  }
  res.write(JSON.stringify(payload))
  res.end()
}

const routes = {
  '': (data, res, pool) => {
    switch (data.method) {
      case 'GET':
        health.index(data, res, pool)
        break
      default:
        notAllowed(res)
    }
  },
  'customers': (data, res, pool) => {
    switch (data.method) {
      case 'GET':
        customers.index(data, res, pool)
        break
      default:
        notAllowed(res)
    }
  },
  'accounts': (data, res, pool) => {
    switch (data.method) {
      case 'GET':
        accounts.index(data, res, pool)
        break
      case 'POST':
        accounts.create(data, res, pool)
        break
      default:
        notAllowed(res)
    }
  },
  'accounts/transactions': (data, res, pool) => {
    switch (data.method) {
      case 'GET':
        transactions.index(data, res, pool)
        break
      case 'POST':
        transactions.create(data, res, pool)
        break
      default:
        notAllowed(res)
    }
  },
  'invalid': (data, res) => {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    const payload = {
      message: 'Bad Path'
    }
    res.write(JSON.stringify(payload))
    res.end()
  }
}


module.exports = routes