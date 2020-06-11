/* global api, describe, it, expect, beforeEach, afterEach, testConfig */

const { Pool } = require('pg')
const pool = new Pool({
  user: testConfig.dbUser,
  password: testConfig.dbPass,
  host: testConfig.hostname,
  port: testConfig.dbPort
})

;(async () => {
  const client = await pool.connect()
  try {
    describe('When querying the transaction endpoint', () => {
      let id = null
      let accOne = null
      let accTwo = null
      let transfer = {
        'amount': '50'
      }
      
      beforeEach(async function () {
        await client.query('BEGIN')
      })
      
      afterEach(async function () {
        (async () => {
          await client.query('ROLLBACK')
        })().catch(err => console.error(err.stack))
      })
      
      it('should return a data array', async () => {
        const res = await api.get('/accounts/transactions?id=29716cec-7424-487c-8194-e67b81b13d99')
        expect(res.body.transactions).to.exist
        expect(res.body.transactions).to.be.an('array')
      })
      
      it('should require an valid account', async () => {
        const res = await api.get('/accounts/transactions?id=29716cec-7424-487c-8194-e67b81b13d99')
        expect(res.status).to.eq(400)
        expect(res.body.message).to.eq('invalid account')
      })
      
      it('should return 1 transaction if transaction has occured', async () => {
        const resOne = await api.post('/accounts').send({ 'id': '1', 'balance': '5000' })
        accOne = resOne.body.accounts[0].id
        const resTwo = await api.post('/accounts').send({ 'id': '2', 'balance': '2000' })
        accTwo = resTwo.body.accounts[0].id
        await api.post('/accounts/transactions').send({ ...transfer, from: accOne, to: accTwo })
        const resThree = await api.get(`/accounts/transactions?id=${accOne}`)
        expect(resThree.status).to.eq(200)
        expect(resThree.body.transactions).to.be.an('array')
        expect(resThree.body.transactions).to.have.lengthOf(1)
      })      
      
      it('should have correct format', async () => {
        const resOne = await api.post('/accounts').send({ 'id': '1', 'balance': '5000' })
        accOne = resOne.body.accounts[0].id
        const resTwo = await api.post('/accounts').send({ 'id': '2', 'balance': '2000' })
        accTwo = resTwo.body.accounts[0].id
        const resThree = await api.post('/accounts/transactions').send({ ...transfer, from: accOne, to: accTwo })
        expect(resThree.body.transactions[0]).to.have.property('from')
        expect(resThree.body.transactions[0]).to.have.property('to')
        expect(resThree.body.transactions[0]).to.have.property('amount')
      })
        
    })
  } finally {
    client.release()
  }
})().catch(err => console.error(err.stack))


