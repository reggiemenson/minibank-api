/* global api, describe, it, expect */

describe('When creating a transfer', () => {
  let accOne = null
  let accTwo = null
  let transfer = {
    'amount': '50'
  }

  it('should require fields on method', async () => {
    const res = await api.post('/accounts/transactions').send(transfer)
    expect(res.status).to.eq(400)
    expect(res.body.message).to.eq('Insufficient fields')
  })

  it('should return a created response', async () => {
    const resOne = await api.post('/accounts').send({ 'id': '1', 'balance': '5000' })
    accOne = resOne.body.accounts[0].id
    const resTwo = await api.post('/accounts').send({ 'id': '2', 'balance': '2000' })
    accTwo = resTwo.body.accounts[0].id
    const resThree = await api.post('/accounts/transactions').send({ ...transfer, from: accOne, to: accTwo })
    expect(resThree.status).to.eq(202)
    expect(resThree.body.message).to.eq('Transfer successful!')
  })

  it('should cancel the transaction if there are insufficient funds', async () => {
    const resOne = await api.post('/accounts').send({ 'id': '1' })
    accOne = resOne.body.accounts[0].id
    const resTwo = await api.post('/accounts').send({ 'id': '2', 'balance': '2000' })
    accTwo = resTwo.body.accounts[0].id
    const resThree = await api.post('/accounts/transactions').send({ ...transfer, from: accOne, to: accTwo })
    expect(resThree.status).to.eq(422)
    expect(resThree.body.message).to.eq('Insufficient funds')
    const resFour = await api.get(`/accounts?id=${accOne}`)
    expect(resFour.body.accounts[0].balance).to.eq(0)
  })

  it('should not affect a valid account if there is an issue with another', async () => {
    let bogusAccount = '9b41b048-39f1-4163-acfa-79f7143043d7'
    const resOne = await api.post('/accounts').send({ 'id': '1', 'balance': '5000' })
    accOne = resOne.body.accounts[0].id
    const resThree = await api.post('/accounts/transactions').send({ ...transfer, from: accOne, to: bogusAccount })
    expect(resThree.status).to.eq(400)
    // expect(resThree.body.message).to.eq('Incorrect account details')
    const resFour = await api.get(`/accounts?id=${accOne}`)
    expect(resFour.body.accounts[0].balance).to.eq(5000)
  })

  it('should return one record after successful transfer', async () => {
    const resOne = await api.post('/accounts').send({ 'id': '1', 'balance': '5000' })
    accOne = resOne.body.accounts[0].id
    const resTwo = await api.post('/accounts').send({ 'id': '2', 'balance': '2000' })
    accTwo = resTwo.body.accounts[0].id
    const resThree = await api.post('/accounts/transactions').send({ ...transfer, from: accOne, to: accTwo })
    expect(resThree.status).to.eq(202)
    expect(resThree.body.transactions).to.have.lengthOf(1)
  })

})

