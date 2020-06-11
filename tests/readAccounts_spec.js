/* global api, describe, it, expect, beforeEach, afterEach, testConfig */

const { Pool } = require('pg')
const pool = new Pool({
  user: testConfig.dbUser,
  password: testConfig.dbPass,
  host: testConfig.hostname,
  port: testConfig.dbPort
})

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

describe('When querying the account endpoint without additional queries', () => {

  it('should have a body', async () => {
    const res = await api.get('/accounts')
    expect(res.status).to.eq(200)
    expect(res.body).to.exist
  })

  it('should return a data array', async () => {
    const res = await api.get('/accounts')
    expect(res.status).to.eq(200)
    expect(res.body.accounts).to.exist
    expect(res.body.accounts).to.be.an('array')
  })
  
})


;(async () => {
  const client = await pool.connect()
  try {
    describe('When querying the account endpoint specifying an account', () => {
      let id = null
    
      beforeEach(async function () {
        await client.query('BEGIN')
      })
    
      afterEach(async function () {
        (async () => {
          await client.query('ROLLBACK')
        })().catch(err => console.error(err.stack))
      })
    
      
      it('should have a body', async () => {
        const res = await api.get('/accounts')
        id = res.body.accounts[0].id
        const resTwo = await api.get(`/accounts?id=${id}`)
        expect(resTwo.status).to.eq(200)
        expect(resTwo.body).to.exist
      })
    
      it('should return a data array', async () => {
        const res = await api.get('/accounts?id=29716cec-7424-487c-8194-e67b81b13d99')
        expect(res.body.accounts).to.exist
        expect(res.body.accounts).to.be.an('array')
      })
      
      it('should return 1 account', async () => {
        const res = await api.get('/accounts')
        id = res.body.accounts[0].id
        const resTwo = await api.get(`/accounts?id=${id}`)
        expect(resTwo.status).to.eq(200)
        expect(resTwo.body.accounts).to.be.an('array')
        expect(resTwo.body.accounts).to.have.lengthOf(1)
      })
      
      it('should return key account properties', async () => {
        const res = await api.get('/accounts')
        id = res.body.accounts[0].id
        const resTwo = await api.get(`/accounts?id=${id}`)
        expect(resTwo.body.accounts[0]).to.have.property('id')
        expect(resTwo.body.accounts[0]).to.have.property('owner')
        expect(resTwo.body.accounts[0]).to.have.property('balance')
      })
    
      it('should return specific account', async () => {
        const res = await api.get('/accounts')
        id = res.body.accounts[0].id
        const resTwo = await api.get(`/accounts?id=${id}`)
        expect(resTwo.status).to.eq(200)
        expect(resTwo.body.accounts).to.have.lengthOf(1)
        expect(resTwo.body.accounts[0]).to.have.property('id').to.eq(id)
      })
    
      it('should return account not found message if id doesn\'t exist', async () => {
        const res = await api.get('/accounts?id=159c492a-1b18-4a86-a53d-8723035cdc7d')
        expect(res.status).to.eq(404)
        expect(res.body.accounts).to.have.lengthOf(0)
        expect(res.body.message).to.eq('no account found')
      })
    
    })
  } finally {
    client.release()
  }
})().catch(err => console.error(err.stack))


