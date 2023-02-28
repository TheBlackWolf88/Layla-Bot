const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");
const fs = require('node:fs')
const path = require('node:path')
const dotenv = require("dotenv");
dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds]});

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


client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
})

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
})

//TODO: Registering slash commands

client.login(process.env.token);
