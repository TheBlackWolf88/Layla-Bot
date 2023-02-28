const {SlashCommandBuilder} = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
      .setName('roll')
      .setDescription('Rolls n k-sided dice.')
      .addIntegerOption(option => 
        option.setName('sod').setDescription("The amount of sides the dice has").setRequired(true))
      .addIntegerOption(option => 
        option.setName('nod').setDescription("Number of dices you want to roll"))
      ,

  async execute(interaction){
    function getRandomIntInclusive(min, max) {
		  min = Math.ceil(min);
		  max = Math.floor(max);
		  return Math.floor(Math.random() * (max - min + 1) + min); 
    }

    let dice = Number(interaction.options.getInteger('sod'))
    let NoD = Number(interaction.options.getInteger('nod')) == 0 ? 1 : Number(interaction.options.getInteger('nod'))

    let sum = 0;
    for(let i = 0; i < NoD; i++){
				sum+=getRandomIntInclusive(1,dice)
			}
			await interaction.reply(`You rolled ${NoD} D${dice}s; the sum of your roll is ${sum}`)

  }
}
