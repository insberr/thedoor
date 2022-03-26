const { Client, Intents } = require("discord.js");
// const LanguageDetect = require("languagedetect");
// const lngDetector = new LanguageDetect();
const cld = require("cld");

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.once("ready", () => {
    console.log(" Ready!");
});

client.addListener("messageCreate", async (message) => {
    if (message.author.bot) return;
    //console.log(lngDetector.detect(message.content, 4));
    //message.reply("```json\n" + JSON.stringify(lngDetector.detect(message.content, 4)) + "\n```");

    const result = await cld.detect(
        message.content,
        {
            languageHint: "ENGLISH",
        },
        (err, result) => {
            if (err) {
                // console.log(err);
                return null;
            }
            return result;
        }
    );
    console.log(message.content + " - " + JSON.stringify(result) + "\n\n");
    // if (message.channel.id !== "953426155837480970") return;
    // message.reply(result);
});

client.login(require("../config.json").tokens.theDoor);
