const { response } = require('express')
const { Room, User } = require('../models')

const getRooms = async (req, res = response) => {
  const query = { state: true }

  const [total, rooms] = await Promise.all([
    Room.countDocuments(query),
    Room.find(query).populate('members', 'name'),
  ])

  res.json({
    total,
    rooms,
  })
}

const getRoomById = async (req, res = response) => {
  const { id } = req.params

  const room = await Room.findById(id).populate('members', 'name')

  res.json({ room })
}

const createRoom = async (req, res = response) => {
  const name = req.body.name.toUpperCase()
  const { members = [], number } = req.body

  const roomNameDB = await Room.findOne({ name })
  if (roomNameDB) {
    return res.status(400).json({
      msg: `The room ${roomNameDB.name}, already exists`,
    })
  }

  const roomNumberDB = await Room.findOne({ number })
  if (roomNumberDB) {
    return res.status(400).json({
      msg: `The room ${roomNumberDB.number}, already exists`,
    })
  }

  const data = {
    name,
    number,
    members,
  }

  const room = new Room(data)
  await room.save()
  await sincronizeMembers(members, room._id)
  res.status(201).json(room)
}

const updateRoom = async (req, res = response) => {
  const { id } = req.params
  const { state, members = [], ...data } = req.body

  if (data.name) {
    data.name = data.name.toUpperCase()
  }

  if (members) {
    data.members = members
  }
  await sincronizeMembers(members, id)

  const room = await Room.findByIdAndUpdate(id, data, { new: true })
  await room.save()

  res.json(room)
}

const deleteRoom = async (req, res = response) => {
  const { id } = req.params

  const deletedRoom = await Room.findByIdAndDelete(id)
  await sincronizeMembers([], id)

  res.json(deletedRoom)
}

const sincronizeMembers = async (members, roomId) => {
  const allUsers = await User.find()
  allUsers.forEach(async user => {
    if (members.includes(user._id.toString())) {
      if (!user.rooms.includes(roomId)) user.rooms.push(roomId)
    } else {
      user.rooms = user.rooms.filter(id => id != roomId)
    }
    await user.save()
  })
}

module.exports = {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
}
