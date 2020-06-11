
function handleResponse(status, res, displayAccounts, message) {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  const payload = {
    accounts: displayAccounts,
    message: message
  }
  res.write(JSON.stringify(payload))
  res.end()
}


async function index(data, res, pool) {
  let message = null
  let status = null
  let result = null

  ; (async () => {
    const client = await pool.connect()
    if (Object.keys(data.query).length !== 0) {
      if (data.query.id) {
        let id = data.query.id
        try {
          const db = await client.query('SELECT * FROM accounts where id = $1', [id])
          if (db.rows.length === 0) {
            message = 'no account found'
            status = 404
            result = db.rows
          } else {
            status = 200
            result = db.rows
          }
        } catch {
          message = 'db query error'
          status = 400
          result = []
        } finally {
          client.release()
          handleResponse(status, res, result, message)
        }
      }
    } else {
      try {
        const db = await client.query('SELECT * FROM accounts', [])
        if (db.rows.length === 0) {
          message = 'no account data'
          status = 404
          result = db.rows
        } else {
          status = 200
          result = db.rows
        }
      } catch {
        message = 'db query error'
        status = 400
        result = []
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



function create(data, res, pool) {
  let message = null
  let status = null
  let result = null

  ; (async () => {
    const client = await pool.connect()
    if (Object.keys(data.body).length !== 0) {
      if (data.body.id) {
        let id = data.body.id
        let balance = data.body.balance
        const queryText = id && balance ? 'INSERT INTO accounts(owner, balance) VALUES($1, $2) RETURNING *;' : 'INSERT INTO accounts(owner) VALUES($1) RETURNING *;'
        const queryValues = id && balance ? [id, balance] : [id]
        try {
          const db = await client.query(queryText, queryValues)
          if (db.rows.length === 0) {
            message = 'Account not created. Something\'s gone wrong..'
            status = 404
            result = db.rows
          } else {
            status = 201
            result = db.rows
          }
        } catch {
          message = 'db query error'
          status = 400
          result = []
        } finally {
          client.release()
          handleResponse(status, res, result, message)
        }
      }
      // balance add can go here
    } else {
      message = 'No data provided'
      status = 400
      result = []
      handleResponse(status, res, result, message)
    }
  })().catch(err => {
    if (err) {
      message = 'Something\'s gone pretty wrong...'
      handleResponse(400, res, [], message)
    }
  })
}

module.exports = {
  index,
  create
}
