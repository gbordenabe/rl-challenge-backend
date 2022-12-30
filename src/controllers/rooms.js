const { response } = require('express')
const { Room } = require('../models')

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
  const number = req.body.number

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
    members: req.body.members,
  }

  const room = new Room(data)
  await room.save()
  res.status(201).json(room)
}

const updateRoom = async (req, res = response) => {
  const { id } = req.params
  const { state, ...data } = req.body

  if (data.name) {
    data.name = data.name.toUpperCase()
  }

  const room = await Room.findByIdAndUpdate(id, data, { new: true })
  await room.save()

  res.json(room)
}

const deleteRoom = async (req, res = response) => {
  const { id } = req.params

  const room = await Room.findByIdAndUpdate(id, { state: false }, { new: true })
  await room.save()

  res.json(room)
}

module.exports = {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
}
