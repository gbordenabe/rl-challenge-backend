const { response } = require('express')

const isTeacherRole = (req, res = response, next) => {
  if (!req.user) {
    return res.status(500).json({
      msg: 'You want to verify the role without verifying the token first',
    })
  }

  const { role, name } = req.user

  if (role !== 'TEACHER_ROLE') {
    return res.status(401).json({
      msg: `The user ${name} is not an teacher - He cannot do this`,
    })
  }

  next()
}

const hasRole = (...roles) => {
  return (req, res = response, next) => {
    if (!req.user) {
      return res.status(500).json({
        msg: 'You want to verify the role without verifying the token first',
        msg: '',
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        msg: `The service requires one of these roles ${roles}`,
      })
    }

    next()
  }
}

module.exports = { isTeacherRole, hasRole }
