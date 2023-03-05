const mongoose = require('mongoose');

module.exports = mongoose.model("autoRole", new mongoose.Schema({
  guildId: String,
  roleId: String,
}))
