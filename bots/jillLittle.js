const { Client, Intents } = require("discord.js");

module.exports = {
    name: "Jill's Little Friend",
    codename: "jillLittle",
    ignore: false,
    run(mgr) {
        const client = new Client({
            intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
        });

        client.once("ready", () => {
            console.log(this.name + " is ready.");
        });

        client.addListener("messageCreate", (message) => {
            // Change this to slash commands later ************************ plss
            if (message.author.bot) return;

            /*
            if (message.content.startsWith("!set")) {
                const args = message.content.split(" ");
                if (args[1] === "change") {
                    if (args[2] === undefined) return;
                    mgr.db.chance[this.codename] = parseFloat(args[2]);
                    mgr.save();
                    message.channel.send("Chance set to " + args[2] + ".");
                    return;
                } else if (args[1] === 'restart') {
                    client.destroy();
                    this.run(mgr);
                }
                return;
            }
            */

            if (!message.content.match(/(who)|(what)|(when)|(why)|(how)|(where)|\?/gim)?.length < 1) return;
            let number = Math.random();
            if (number < mgr.db.chance[this.codename] / 100) {
                message.reply("ur mom");
            }
        });

        client.login(mgr.config.tokens[this.codename]);
    },
};
