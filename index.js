// a discord bot written in discord.js version 13
const { Client, Intents } = require("discord.js");
const config = require("./config.json");
const thea = require("./theaBestie.js");

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ],
});

client.once("ready", () => {
    console.log("The Door Ready!");
});

client.addListener("messageCreate", (message) => {
    console.log(message.content);
});

client.login(config.tokens.theDoor);

thea.bot(config);
