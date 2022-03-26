const { Client, Intents } = require("discord.js");
const { SlashCommandBuilder} = require('@discordjs/builders');

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
        return;
    }
}