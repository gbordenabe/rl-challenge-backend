const { response } = require('express')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

const validateJWT = async (req, res = response, next) => {
  const token = req.header('x-token')

  if (!token) {
    return res.status(400).json({
      msg: 'There is no token in the request',
    })
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
    req.uid = uid
    const user = await User.findById(uid)

    if (!user) {
      return res.status(401).json({
        msg: 'Invalid token - user does not exist in database',
      })
    }

    if (!user.state) {
      return res.status(401).json({
        msg: 'Invalid token - user with status: false',
      })
    }

    req.user = user
    next()
  } catch (error) {
    console.log(error)
    res.status(401).json({
      msg: 'Invalid token',
    })
  }
}

module.exports = { validateJWT }
