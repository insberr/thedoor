const { Client, GatewayIntentBits } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: "Carbon The Cat",
    codename: "carbon",
    ignore: false,
    run(mgr) {
        const client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
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