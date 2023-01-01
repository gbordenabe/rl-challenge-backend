const { Schema, model } = require('mongoose')

const RoomSchema = Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true,
  },
  number: {
    type: Number,
    required: [true, 'Number is required'],
    unique: true,
  },
  state: {
    type: Boolean,
    default: true,
    require: true,
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: [],
    },
  ],
})

RoomSchema.methods.toJSON = function () {
  const { __v, state, ...data } = this.toObject()
  return data
}

module.exports = model('Room', RoomSchema)
