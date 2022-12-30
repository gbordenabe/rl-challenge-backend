const { Room } = require('../models')
const Role = require('../models/Role')
const User = require('../models/User')

const isValidRole = async (role = '') => {
  const roleExists = await Role.findOne({ role })
  if (!roleExists) {
    throw new Error(`The role ${role} is not registered in the database`)
  }
}

const emailExists = async (email = '') => {
  const emailExists = await User.findOne({ email })
  if (emailExists) {
    throw new Error(`The email ${email} is already registered`)
  }
}

const userExistsById = async id => {
  const userExists = await User.findById(id)
  if (!userExists) {
    throw new Error(`The id ${id} does not exist`)
  }
}

const roomExists = async id => {
  const roomExists = await Room.findById(id)
  if (!roomExists) {
    throw new Error(`The id ${id} does not exist`)
  }
}

module.exports = {
  isValidRole,
  emailExists,
  userExistsById,
  roomExists,
}
