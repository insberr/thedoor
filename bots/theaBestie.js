const { Client, Intents } = require("discord.js");

module.exports = {
    name: "Thea's Bestie",
    codename: "theaBestie",
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