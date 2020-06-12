
function handleResponse(status, res, displayTransactions, message) {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  const payload = {
    transactions: displayTransactions,
    message: message
  }
  res.write(JSON.stringify(payload))
  res.end()
}

function index(data, res, pool) {
  
  let message = null
  let status = null
  let result = null

  ; (async () => {
    const client = await pool.connect()
    if (Object.keys(data.query).length !== 0) {
      if (data.query.id) {
        let id = data.query.id
        try {
          const acc = await client.query('SELECT * FROM accounts where id = $1', [id])
          if (acc.rows.length !== 0){
            const db = await client.query('SELECT * FROM transactions where $1 IN("from", "to");', [id])
            if (db.rows.length === 0) {
              message = 'no transactions found'
              status = 404
              result = db.rows
            } else {
              status = 200
              result = db.rows
            }
          } else {
            message = 'invalid account'
            status = 400
            result = []
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
      message = 'no account data'
      status = 404
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

function create(data, res, pool) {
  let message = null
  let status = null
  let result = null
  let createdAt = null

  ; (async () => {
    const client = await pool.connect()
    if (Object.keys(data.body).length !== 0) {
      if (data.body.from && data.body.to && data.body.amount) {
        let from = data.body.from
        let to = data.body.to
        let amount = parseInt(data.body.amount)
        try {
          const startBalRecord = await client.query('SELECT balance FROM accounts where id=$1', [from])
          if (startBalRecord.rows[0].balance < amount) {
            message = 'Insufficient funds'
            status = 422
            result = []
          } else {
            const newFromBalance = startBalRecord.rows[0].balance - amount
            const toBalRecord = await client.query('SELECT balance FROM accounts where id=$1', [to])
            const newToBalance = toBalRecord.rows[0].balance + amount
            await client.query('UPDATE accounts SET balance=$1 WHERE id=$2;', [newFromBalance, from])
            await client.query('UPDATE accounts SET balance=$1 WHERE id=$2;', [newToBalance, to])
            createdAt = new Date()
            const transaction = await client.query('INSERT INTO transactions("from", "to", amount, created_at) VALUES($1, $2, $3, $4) RETURNING *;', [from, to, amount, createdAt])
            result = transaction.rows
            status = 202
            message = 'Transfer successful!'
            await client.query('COMMIT')
          }
        } catch (e) {
          message = 'db query error'
          status = 400
          result = []
        } finally {
          client.release()
          handleResponse(status, res, result, message)
        }
      } else {
        message = 'Insufficient fields'
        status = 400
        result = []
        handleResponse(status, res, result, message)
      }
    } else {
      message = 'No data provided'
      status = 400
      result = []
      handleResponse(status, res, result, message)
    }
  })().catch(err => {
    if (err) {
      console.log(err)
      message = 'DB issue. Something\'s gone pretty wrong...'
      handleResponse(400, res, [], message)
    }
  })
}

module.exports = {
  index,
  create
}


