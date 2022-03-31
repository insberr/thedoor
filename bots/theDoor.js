const { Client, Intents } = require("discord.js");
const { SlashCommandBuilder} = require('@discordjs/builders');
const mathjs = require('mathjs');

module.exports = {
    name: "The Door",
    codename: "theDoor",
    ignore: false,
    run(mgr) {
        const client = new Client({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MEMBERS
            ],
        });

        client.once("ready", () => {
            console.log(this.name + " Ready!");
        });

        client.addListener("messageCreate", (message) => {
            if (message.author.bot) return;
            this.counting(mgr, message);
            // console.log(message.content);
        });

        client.on('guildMemberAdd', (member) => {
            // add mod log channel message here or something ?? perhaps a manager for mod logs ??? idfk

            if (mgr.db.thedoor.memberJoin.channel === "") return;
            let joinMessageChannel = member.guild.channels.cache.get(mgr.db.thedoor.memberJoin.channel);

            joinMessageChannel.send({
                content: mgr.db.thedoor.memberJoin.message.replace("{user}", `<@!${member.user.id}>`),
                files: [{
                    attachment: mgr.db.thedoor.memberJoin.image.directory,
                    name: mgr.db.thedoor.memberJoin.image.name,
                    description: mgr.db.thedoor.memberJoin.image.description
                }],
            });
        })

        client.login(mgr.config.tokens[this.codename]);
    },
    counting(mgr, message) {
        if (message.channel.id !== mgr.db.counting.channel) return;

        let userInputNumber;
        try {
            userInputNumber = mathjs.evaluate(message.content);
        } catch (e) {
            // console.log("Math error:\n" + e);
            return;
        };

        if (message.author.id === mgr.db.counting.lastCountMember) {
            message.react("❌");
            message.reply("Not your turn dumbass <3");
            return;
        }

        if (userInputNumber !== mgr.db.counting.count + 1) {
            message.react("❌");

            mgr.db.counting.fails++;
            if (((new Date().getTime() - new Date(mgr.db.counting.lastFailTime).getTime()) / (1000 * 60 * 60 * 24)) >= 1) {
                mgr.db.counting.fails = 1;
            }

            mgr.db.counting.lastFailTime = new Date();
            mgr.save();

            if (mgr.db.counting.fails > mgr.db.counting.maxFails) {
                mgr.db.counting.fails = 0;
                mgr.db.counting.count = 0;
                mgr.save();

                message.reply("You failed too many times. Resetting the counter.");
                return;
            }

            mgr.save();

            message.reply(`Wrong number dumbass <3\n${mgr.db.counting.fails}/${mgr.db.counting.maxFails} left.`);
            return;
        } else {
            // ADD NUMBER DUH
            mgr.db.counting.count++;
            mgr.db.counting.lastCountMember = message.author.id;
            mgr.save();
            message.react("✅");
        }
    }
}