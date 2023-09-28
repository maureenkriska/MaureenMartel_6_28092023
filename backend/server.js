const http = require('http')
const app = require('./app')

// Ajout de la fonction normalizePORT pour renvoyer un port valide (numéro ou chaîne)
const normalizePort = val => {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    return val
  }
  if (port >= 0) {
    return port
  }
  return false
}

const PORT = process.env.PORT

const port = normalizePort(process.env.PORT || 3000)
app.set('port', port)

// Ajout de la fonction errorHandler pour rechercher les erreurs, et enregistrer dans mon serveur
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error
  }
  const address = server.address()
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.')
      process.exit(1)
      break
    default:
      throw error
  }
}

const server = http.createServer(app)

//Ajout d'un écouteur d'événements qui consigne le port sur lequel le serveur s'éxécute
server.on('error', errorHandler)
server.on('listening', () => {
  const address = server.address()
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port
  console.log('Listening on ' + bind)
})

server.listen(port)
