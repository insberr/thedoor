const { Client, Intents } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: "Jill's Little Friend",
    codename: "jillLittle",
    ignore: true,
    commands: [
        // TODO Add permissions so random users dont mess with the config lol **************************** plss
        new SlashCommandBuilder()
            .setName('chance')
            .setDescription('The chance of the bot replying with "ur mom"')
            .addNumberOption(option => option.setName('edit').setDescription('Edit the chance of the bot replying with "ur mom"').setMinValue(0.00001).setMaxValue(100)),

        // blacklist channels
    ],
    run(mgr) {
        const client = new Client({
            intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
        });

        client.once("ready", () => {
            console.log(this.name + " is ready.");
            mgr.init(this.codename);
        });

        client.addListener("messageCreate", (message) => {
            if (message.author.bot) return;

            if (message.content.match(/(will)|(should)|(who)|(what)|(when)|(why)|(how)|(where)\?/gim) === null) return;

            let number = Math.random();

            if (number < mgr.db.chance[this.codename] / 100) {
                message.reply("ur mom");
            }
        });

        client.on('interactionCreate', async interaction => {
            if (!interaction.isCommand()) return;
        
            const { commandName } = interaction;
        
            if (commandName === 'chance') {
                if (interaction.options.getNumber('edit')) {
                    mgr.db.chance[this.codename] = interaction.options.getNumber('edit');
                    mgr.save();
                    interaction.reply('Chance set to **' + interaction.options.getNumber('edit') + '%**');
                    return;
                }

                interaction.reply('Chance is: **' + mgr.db.chance[this.codename] + '%**');
                return;
            }
        });

        client.login(mgr.config.tokens[this.codename]);
    },
};
