const { Client, Intents } = require("discord.js");

module.exports = {
    name: "JJ's Little Friend",
    codename: "jjLittle",
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
        });

        client.addListener("messageCreate", (message) => {
            console.log(message.content);
        });

        client.login(mgr.config.tokens[this.codename]);
    }
}