/* global api, describe, it, expect */


describe('When creating an account', () => {
  let id = null
  let customer = {
    'id': '1'
  }

  it('should accept a valid record', async () => {
    const res = await api.post('/accounts').send(customer)
    expect(res.status).to.eq(201)
    expect(res.body).to.exist
  })

  it('should return one record after insert', async () => {
    const res = await api.post('/accounts').send(customer)
    expect(res.status).to.eq(201)
    expect(res.body.accounts).to.have.lengthOf(1)
  })

  it('should return account with customer as owner', async () => {
    const res = await api.post('/accounts').send(customer)
    expect(res.status).to.eq(201)
    expect(res.body).to.exist
    expect(res.body.accounts[0]).to.have.property('owner').to.eq(parseInt(customer.id))
  })

  it('should accept a starting balance', async () => {
    const res = await api.post('/accounts').send({ ...customer, balance: 100 })
    expect(res.status).to.eq(201)
    expect(res.body).to.exist
    expect(res.body.accounts[0]).to.have.property('balance').to.eq(100)
  })

})
