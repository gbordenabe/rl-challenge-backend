const { request, response } = require('express')
const User = require('../models/User')
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

const usersPost = async (req, res = response) => {
  const { name, email, password, role } = req.body
  const user = new User({ name, email, password, role })

  const salt = bcryptjs.genSaltSync()
  user.password = bcryptjs.hashSync(password, salt)

  await user.save()
  res.json(user)
}

const usersPut = async (req, res = response) => {
  const { id } = req.params
  const { _id, password, email, ...etc } = req.body

  if (password) {
    const salt = bcryptjs.genSaltSync()
    etc.password = bcryptjs.hashSync(password, salt)
  }

  const user = await User.findByIdAndUpdate(id, etc)

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

module.exports = { usersGet, usersPut, usersPost, usersDelete }
