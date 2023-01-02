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
  if (rooms.length === 0) {
    const dbRooms = await Room.find()
    dbRooms.forEach(async dbRoom => {
      dbRoom.members = dbRoom.members.filter(id => id != userId)
      await dbRoom.save()
    })
  } else {
    rooms.forEach(async memberId => {
      const dbRoom = await Room.findById(memberId)
      if (!dbRoom.members.includes(userId)) {
        dbRoom.members.push(userId)
      } else {
        dbRoom.members = dbRoom.members.filter(id => id != userId)
      }
      await dbRoom.save()
    })
  }
}

module.exports = { usersGet, usersPut, usersPost, usersDelete, userGetById }
