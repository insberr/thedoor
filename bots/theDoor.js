const { Client, Intents } = require("discord.js");
const { SlashCommandBuilder} = require('@discordjs/builders');
const mathjs = require('mathjs');

module.exports = {
    name: "The Door",
    codename: "theDoor",
    ignore: false,
    commands: [
        new SlashCommandBuilder()
        .setName('countingStatus')
        .setDescription('Shows the current counting status'),
        new SlashCommandBuilder()
        .setName('countingEdit')
        .setDescription('Edits the counting stuffs')
        .addSubcommand(subcommand => subcommand
            .addIntegerOption(option => option.setName('count').setDescription('Change the count').required(true).setMinValue(0).setMaxValue(1000000000000))
            .addIntegerOption(option => option.setName('fails').setDescription('Change the amount of fails').required(true).setMinValue(0).setMaxValue(100))
            .addIntegerOption(option => option.setName('maxFails').setDescription('Change the amount of max fails').required(true).setMinValue(1).setMaxValue(100))
            .addIntegerOption(option => option.setName('goal').setDescription('Change the counting goal').required(true).setMinValue(1).setMaxValue(1000000000000))
            .addChannelOption(option => option.setName('channel').setDescription('Change the channel for the Counting').required(true))
        ),
    ],
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

        client.on('interactionCreate', async interaction => {
            if (!interaction.isCommand()) return;

            const { commandName } = interaction;
            
            if (commandName === 'countingStatus') {
                interaction.reply(`Current number: **${mgr.db.counting.count}**\nCounting goal: **${mgr.db.counting.goal}**\nFails: **${mgr.db.counting.fails}**\nMax Fails: **${mgr.db.counting.maxFails}**`);
                return;
            }

            if (commandName === 'countingEdit') {
                if (interaction.options.getInteger('count')) {
                    mgr.db.counting.count = interaction.options.getInteger('count');
                    mgr.save();
                    interaction.reply('Count set to **' + interaction.options.getInteger('count') + '**');
                    return;
                }

                if (interaction.options.getInteger('fails')) {
                    mgr.db.counting.fails = interaction.options.getInteger('fails');
                    mgr.save();
                    interaction.reply('Fails set to **' + interaction.options.getInteger('fails') + '**');
                    return;
                }

                if (interaction.options.getInteger('maxFails')) {
                    mgr.db.counting.maxFails = interaction.options.getInteger('maxFails');
                    mgr.save();
                    interaction.reply('Max Fails set to **' + interaction.options.getInteger('maxFails') + '**');
                    return;
                }

                if (interaction.options.getInteger('goal')) {
                    mgr.db.counting.goal = interaction.options.getInteger('goal');
                    mgr.save();
                    interaction.reply('Goal set to **' + interaction.options.getInteger('goal') + '**');
                    return;
                }

                if (interaction.options.getChannel('channel')) {
                    mgr.db.counting.channel = interaction.options.getChannel('channel').id;
                    mgr.save();
                    interaction.reply('Channel set to **' + interaction.options.getChannel('channel').name + '**');
                    return;
                }

                interaction.reply('No valid option was given');
                return;
            }
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
        if (message.type !== "DEFAULT") return;

        if (message.content.split('').length === 1 && message.content.match(/[a-z]/ig).length === 1) return;

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