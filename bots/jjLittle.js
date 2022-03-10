const { Client, Intents } = require("discord.js");
const { SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
    name: "JJ's Little Friend",
    codename: "jjLittle",
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
            console.log(this.name + " Ready!");
        });

        client.addListener("messageCreate", (message) => {
            if (message.author.bot) return;

            if (message.content.match(/i'?.*(to)? (pee|piss)( |$)/gim)?.length > 0) {
                // Do stats stuff later *****************
                // config.stats.iHaveToPee++;
                // updateConfig();
                if (Math.random < 1 / 100) {
                    return message.reply("https://i.imgur.com/XqQZQ.gif");
                }
                return message.reply("go piss gowrl");
            }

            if (message.content.match(/ +L$| +L +|^ *L+ *$/gim)?.length > 0) {
                message.react("🇱");
                return;
            }

            let number = Math.random();
            if (number < mgr.db.chance[this.codename] / 100) {
                message.reply("L");
                return;
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
