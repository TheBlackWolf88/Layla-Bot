const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");
const fs = require('node:fs')
const path = require('node:path')
const dotenv = require("dotenv");
dotenv.config();
const mongo = require("./utils/mongo")
const arSchema = require('./schemas/autoRole')

const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers
  ]
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles){
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if('data' in command && 'execute' in command){
      client.commands.set(command.data.name, command)
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing something.`)
    }
}


client.once(Events.ClientReady, async c => {
    await mongo()
    console.log(`Ready! Logged in as ${c.user.tag}`);
})

client.login(process.env.token);

client.on(Events.InteractionCreate, async interaction => {
    if(!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);
    if(!command) {
      console.error(`No command matching ${interaction.commandName}`);
      return
    }
    try{
      await command.execute(interaction)
    } catch(error){
      console.error(error)
      if (interaction.replied || interaction.deferred) {
			  await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			  await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
    }
});

client.on(Events.GuildMemberAdd, async (member) => {
  const role = await arSchema.findOne({ guildId: member.guild.id}).exec()
  const givenRole = await member.guild.roles.cache.get(role.roleId)
  member.roles.add(givenRole)
});



