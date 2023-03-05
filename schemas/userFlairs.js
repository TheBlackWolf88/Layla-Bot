const mongoose = require('mongoose')
const {Schema} = mongoose

const userFlairsSchema = new Schema({
  uId: String,
  roleId: String,
})

module.exports = mongoose.model("userFlairs",userFlairsSchema)

