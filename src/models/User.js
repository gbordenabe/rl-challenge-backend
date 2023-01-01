const { Schema, model } = require('mongoose')

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  img: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    emun: ['TEACHER_ROLE', 'STUDENT_ROLE'],
  },
  state: {
    type: Boolean,
    default: true,
  },
  siblings: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: [],
    },
  ],
  rooms: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      default: [],
    },
  ],
})

UserSchema.methods.toJSON = function () {
  const { _id, __v, password, ...user } = this.toObject()
  user.uid = _id
  return user
}

module.exports = model('User', UserSchema)
