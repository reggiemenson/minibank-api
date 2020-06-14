
function handleResponse(status, res, displayCustomers, message) {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  const payload = {
    customers: displayCustomers,
    message: message
  }
  res.write(JSON.stringify(payload))
  res.end()
}

async function index(data, res, pool) {
  let message = null
  let status = null
  let result = []

  ; (async () => {
    const client = await pool.connect()
    if (Object.keys(data.query).length !== 0) {
      if (data.query.id) {
        let id = parseInt(data.query.id)
        try {
          const db = await client.query('SELECT * FROM customers where id = $1', [id])
          if (db.rows.length === 0) {
            message = 'no customer found'
            status = 404
            result = db.rows
          } else {
            status = 200
            result = db.rows
          }
        } catch {
          message = 'db query error'
          status = 400
        } finally {
          client.release()
          handleResponse(status, res, result, message)
        }
      }
    } else {
      try {
        const db = await client.query('SELECT * FROM customers', [])
        if (db.rows.length === 0) {
          message = 'no customer data'
          status = 404
          result = db.rows
        } else {
          status = 200
          result = db.rows
        }
      } catch {
        message = 'db query error'
        status = 400
      } finally {
        client.release()
        handleResponse(status, res, result, message)
      }
    }
  })().catch(err => {
    if (err) {
      message = 'Something\'s gone pretty wrong...'
      handleResponse(400, res, [], message)
    }
  })

}

module.exports = {
  index
}
