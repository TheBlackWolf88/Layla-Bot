const {SlashCommandBuilder, setPosition} = require("discord.js");
const ufSchema = require('../schemas/userFlairs')


module.exports = {
  data: new SlashCommandBuilder()
    .setName('cflair')
    .setDescription('Creates a unique role for you.')
    .addStringOption(option => 
      option.setName('rolename')
      .setDescription('The name of your role')
      .setRequired(true)
    )
    .addStringOption(option => 
      option.setName('hexcolor')
      .setDescription('Defines the hexadecimal value of the color of your choosing')
      .setRequired(true)
    ),
  async execute(interaction){
    let roleName = interaction.options.getString('rolename')
    let roleColor = interaction.options.getString('hexcolor')
  
//    await interaction.reply(await client.user.tag)
    
    const userFlair = await ufSchema.findOne({uId: interaction.user.id})
    let flairPos = 3;
    if(userFlair){
      const oldRole = interaction.guild.roles.cache.find(role => role == userFlair.roleId)
      flairPos = oldRole.position
      interaction.guild.roles.delete(oldRole.id)
    }
    

    await interaction.guild.roles.create({
      name: roleName,
      color: roleColor,
      reason: '',
      position: flairPos,
      hoist : true, 
    })

    const role = await interaction.guild.roles.cache.find(role => role.name == roleName);
    
    if(userFlair){
      await ufSchema.findOneAndUpdate({uId: interaction.user.id}, {roleId: role.id})
    } else {
      await ufSchema.create({uId: interaction.user.id, roleId: role.id})
    }

    interaction.member.roles.add(role)
    await interaction.reply(`New role, <@&${role.id}> created.`)
  }
}
