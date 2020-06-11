
function index(data, res){
  res.writeHead(200, { 'Content-Type': 'application/json' })
  const payload = {
    message: 'Guess what\'s up!!'
  }
  res.write(JSON.stringify(payload))
  res.end()
}

module.exports = {
  index
}