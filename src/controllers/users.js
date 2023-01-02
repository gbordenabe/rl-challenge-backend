const { response } = require('express')
const { User, Room } = require('../models')
const bcryptjs = require('bcryptjs')

const usersGet = async (req, res = response) => {
  const query = { state: true }

  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query),
  ])

  res.json({
    total,
    users,
  })
}

const userGetById = async (req, res = response) => {
  const { id } = req.params
  const user = await User.findById(id).populate('rooms', ['name', 'number'])

  res.json(user)
}

const usersPost = async (req, res = response) => {
  const { name, email, password, role, rooms } = req.body
  const user = new User({ name, email, password, role, rooms })

  const salt = bcryptjs.genSaltSync()
  user.password = bcryptjs.hashSync(password, salt)

  await user.save()
  res.json(user)
}

const usersPut = async (req, res = response) => {
  const { id } = req.params
  const { _id, password, rooms = [], siblings = [], ...data } = req.body

  if (password) {
    const salt = bcryptjs.genSaltSync()
    data.password = bcryptjs.hashSync(password, salt)
  }

  if (rooms) {
    data.rooms = rooms
  }
  await sincronizeRooms(rooms, id)

  if (siblings) {
    data.siblings = siblings
  }
  const user = await User.findByIdAndUpdate(id, data)

  res.json(user)
}

const usersDelete = async (req, res = response) => {
  const { id } = req.params

  let user = await User.findByIdAndUpdate(id, { state: false })
  user = await User.findById(id)

  res.json({
    user,
  })
}

const sincronizeRooms = async (rooms, userId) => {
  const allRooms = await Room.find()
  allRooms.forEach(async room => {
    if (rooms.includes(room._id.toString())) {
      if (!room.members.includes(userId)) room.members.push(userId)
    } else {
      room.members = room.members.filter(id => id != userId)
    }
    await room.save()
  })
}

module.exports = { usersGet, usersPut, usersPost, usersDelete, userGetById }
