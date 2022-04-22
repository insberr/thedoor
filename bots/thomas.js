const { Client, Intents } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: "Thomas",
    codename: "thomas",
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
            mgr.init(this.codename)
        });

        client.addListener("messageCreate", (message) => {
            if (message.author.bot) return;
            
        });

        client.login(mgr.config.tokens[this.codename]);
    }
}