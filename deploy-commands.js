const { REST, Routes } = require("discord.js");
const dotenv = require("dotenv");
dotenv.config();
const fs = require("node:fs");
const path = require('node:path')

const commands = [];

const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('js'))

for(const file of commandFiles){
  const command = require(`./commands/${file}`)
  commands.push(command.data.toJSON())
}


const rest = new REST({version:'10'}).setToken(process.env.token);

(async () => {
  try{
    console.log(`Started refreshing ${commands.length} slash commands`)
    const data = await rest.put(
      Routes.applicationCommands(process.env.clientId), 
      {body: commands},
    )
    console.log(`Successfully reloaded ${data.length} commands`)
  } catch(error){
      console.error(error)
  }
})();

