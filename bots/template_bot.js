const { Client, GatewayIntentBits } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: "", // the bot name, can be whatever i suppose
    codename: "", // the camel case name in the config
    ignore: true, // ignore this bot when running index.js
    commands: [], // slash commands if any
    run(mgr) {
        const client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMessageReactions,
            ],
        });

        client.once("ready", () => {
            console.log(this.name + " Ready!");
            mgr.init(this.codename);
        });

        client.addListener("messageCreate", (message) => {
            if (message.author.bot) return;
            console.log(message.content);
        });

        client.login(mgr.config.tokens[this.codename]);
    }
}