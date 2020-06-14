/* global api, describe, it, expect */

describe('When querying the customer endpoint without additional queries', () => {

  it('should have a body', (done) => {
    api.get('/customers')
      .end((err, res) => {
        expect(res.status).to.eq(200)
        expect(res.body).to.exist
        done()
      })
  })

  it('should return a data array', (done) => {
    api.get('/customers')
      .end((err, res) => {
        expect(res.status).to.eq(200)
        expect(res.body.customers).to.exist
        expect(res.body.customers).to.be.an('array')
        done()
      })
  })
  
})

describe('When querying the customer endpoint specifying a customer', () => {

  it('should have a body', (done) => {
    api.get('/customers?id=1')
      .end((err, res) => {
        expect(res.status).to.eq(200)
        expect(res.body).to.exist
        done()
      })
  })

  it('should return a data array', (done) => {
    api.get('/customers?id=1')
      .end((err, res) => {
        expect(res.status).to.eq(200)
        expect(res.body.customers).to.exist
        expect(res.body.customers).to.be.an('array')
        done()
      })
  })
  
  it('should return 1 customer', (done) => {
    api.get('/customers?id=1')
      .end((err, res) => {
        expect(res.status).to.eq(200)
        expect(res.body.customers).to.be.an('array')
        expect(res.body.customers).to.have.lengthOf(1)
        done()
      })
  })
  
  it('should return key customer properties', (done) => {
    api.get('/customers?id=1')
      .end((err, res) => {
        expect(res.status).to.eq(200)
        expect(res.body.customers[0]).to.have.property('id')
        expect(res.body.customers[0]).to.have.property('name')
        done()
      })
  })

  it('should return specific customer', (done) => {
    api.get('/customers?id=1')
      .end((err, res) => {
        expect(res.status).to.eq(200)
        expect(res.body.customers).to.have.lengthOf(1)
        expect(res.body.customers[0]).to.deep.equal({
          'id': 1,
          'name': 'Bobbie Francis'
        })
        done()
      })
  })

  it('should return customer not found message if id doesn\'t exist', (done) => {
    api.get('/customers?id=51600')
      .end((err, res) => {
        expect(res.status).to.eq(404)
        expect(res.body.customers).to.have.lengthOf(0)
        expect(res.body.message).to.eq('no customer found')
        done()
      })
  })

})
