const { Client, Intents } = require("discord.js");

module.exports = {
    name: "", // the bot name, can be whatever i suppose
    codename: "", // the camel case name in the config
    ignore: true, // ignore this bot when running index.js
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
            console.log(message.content);
        });

        client.login(mgr.config.tokens[this.codename]);
    }
}