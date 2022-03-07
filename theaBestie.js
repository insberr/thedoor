const { Client, Intents } = require("discord.js");

module.exports = {
    bot(config) {
        const client = new Client({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES
            ],
        });

        client.once("ready", () => {
            console.log("Thea Bestie Ready!");
        });

        client.addListener("messageCreate", (message) => {
            console.log("Thea: " + message.content);
        });

        client.login(config.tokens.theaBestie);
    }
}