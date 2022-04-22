const { Client, Intents } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: "Carbon The Cat",
    codename: "carbon",
    ignore: true,
    run(mgr) {
        const client = new Client({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES
            ],
        });

        client.once("ready", () => {
            console.log(this.name + " Ready!");
            mgr.init(this.codename);
        });

        client.addListener("messageCreate", (message) => {
            if (message.author.bot) return;
            
            let number = Math.random();
            if (number < mgr.db.chance[this.codename] / 100) {
                message.reply("Nice!");
                return;
            }
        });

        client.login(mgr.config.tokens[this.codename]);
    }
}