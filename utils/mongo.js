const dotenv = require('dotenv')
const mongoose = require("mongoose");
dotenv.config()
const mongoPath = process.env.mongoPath

module.exports = async() => {
  await mongoose.connect(mongoPath, {
      keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
  })
  return mongoose
}
