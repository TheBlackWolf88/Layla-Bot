const { SlashCommandBuilder } = require('discord.js')
const arSchema = require('../schemas/autoRole')

module.exports = {
  data: new SlashCommandBuilder()
          .setName("setautorole")
          .setDescription("Sets a role that will be applied on all members who join the guild.")
          .addRoleOption(option => option.setName("role")
          .setDescription("Autoapplied role")
          .setRequired(true)),
  async execute(interaction){
      const role = interaction.options.getRole('role')
      arSchema.create({ guildId: interaction.guild.id, roleId: role.id})
      .catch(console.error)
      
      
      await interaction.reply(`Role <@&${role.id}> set to apply to all new members of guild.`)
  }
}
