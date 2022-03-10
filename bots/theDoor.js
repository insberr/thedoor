const { Client, Intents } = require("discord.js");
const { SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
    name: "The Door",
    codename: "theDoor",
    ignore: false,
    run(mgr) {
        const client = new Client({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES
            ],
        });

        client.once("ready", () => {
            console.log(this.name + " Ready!");
        });

        client.addListener("messageCreate", (message) => {
            // console.log(message.content);
        });

        client.login(mgr.config.tokens[this.codename]);
    }
}