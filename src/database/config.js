const mongoose = require('mongoose')

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN, {
      useNewUrlParser: true,
    })
    console.log('Database connected')
  } catch (err) {
    console.log(err)
    throw new Error('Error when initializing the database')
  }
}

module.exports = {
  dbConnection,
}
