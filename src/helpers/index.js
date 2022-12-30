const dbValidator = require('./db-validators')
const generarJWT = require('./generar-jwt')

module.exports = {
  ...dbValidator,
  ...generarJWT,
}
