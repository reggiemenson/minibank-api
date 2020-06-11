/* global api, describe, it, expect */

describe('Health check to API', () => {

  it('should return a 200 response', async () => {
    const response = await api.get('/')
    expect(response.status).to.eq(200)
  })
  
  it('should return a body', async () => {
    const response = await api.get('/')
    expect(response.body).to.exist
  })

  it('should return a message', async () => {
    const response = await api.get('/')
    expect(response.body.message).to.eq('Guess what\'s up!!')
  })

  it('should return warning message if method incorrect', async () => {
    const response = await api.post('/')
    expect(response.status).to.eq(405)
    expect(response.body.message).to.eq('Invalid method')
  })

  it('should respond with informative error when wrong path is requested', async () => {
    const response = await api.get('/misbehaving-path')
    expect(response.status).to.eq(400)
    expect(response.body.message).to.eq('Bad Path')
  })
})
