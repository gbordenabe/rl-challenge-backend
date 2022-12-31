const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../database/config')

class Server {
  constructor() {
    this.app = express()
    this.port = process.env.PORT

    this.paths = {
      users: '/api/users',
      auth: '/api/auth',
      rooms: '/api/rooms',
    }

    this.conectarDB()

    this.middlewares()

    this.routes()
  }

  async conectarDB() {
    await dbConnection()
  }

  middlewares() {
    this.app.use(cors())
    this.app.use(express.json())
  }

  routes() {
    this.app.use(this.paths.auth, require('../routes/auth'))
    this.app.use(this.paths.users, require('../routes/users'))
    this.app.use(this.paths.rooms, require('../routes/rooms'))
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('Server running on port', this.port)
    })
  }
}

module.exports = Server
