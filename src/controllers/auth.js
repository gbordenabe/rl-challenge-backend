const bcryptjs = require('bcryptjs')
const { response } = require('express')
const { generateJWT } = require('../helpers')
const { User } = require('../models')

const login = async (req, res = response) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({
        msg: 'User / Password are not correct - email',
      })
    }

    if (!user.state) {
      return res.status(400).json({
        msg: 'User / Password are not correct - state : false',
      })
    }

    const validPassword = bcryptjs.compareSync(password, user.password)
    if (!validPassword) {
      return res.status(400).json({
        msg: 'User / Password are not correct - password',
      })
    }

    const token = await generateJWT(user.id)

    res.json({
      user,
      token,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Talk to the administrator',
    })
  }
}

module.exports = { login }
