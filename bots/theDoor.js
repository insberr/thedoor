const { Client, GatewayIntentBits, MessageType, Partials } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const mathjs = require("mathjs");

module.exports = {
    name: "The Door",
    codename: "theDoor",
    ignore: false,
    commands: [
        new SlashCommandBuilder()
            .setName("countingstatus")
            .setDescription("Shows the current counting status"),
        new SlashCommandBuilder()
            .setName("countingedit")
            .setDescription("Edits the counting stuffs")
            .addSubcommand((subcommand) => {
                return subcommand
                    .setName('count')
                    .setDescription('Change the count')
                    .addIntegerOption((option) => {
                        return option
                            .setName("number")
                            .setDescription("The number to set it to")
                            .setMinValue(0)
                            .setMaxValue(1000000000000);
                    })
            })
            .addSubcommand((subcommand) => {
                return subcommand
                    .setName('fails')
                    .setDescription('Change the amount of fails')
                    .addIntegerOption((option) => {
                        return option
                            .setName("number")
                            .setDescription("The number of fails")
                            .setMinValue(0)
                            .setMaxValue(100);
                    })
            })
            .addSubcommand((subcommand) => {
                return subcommand
                    .setName('cooldown')
                    .setDescription('Change the cooldown when a single user is doing multiple numbers in a row')
                    .addIntegerOption((option) => {
                        return option
                            .setName("number")
                            .setDescription("The number of seconds for the cooldown")
                            .setMinValue(0)
                            .setMaxValue(1000);
                    })
            })
            .addSubcommand((subcommand) => {
                return subcommand
                    .setName('maxfails')
                    .setDescription('Change the amount of max fails')
                    .addIntegerOption((option) => {
                        return option
                            .setName("number")
                            .setDescription("The number of max fails")
                            .setMinValue(1)
                            .setMaxValue(100);
                    })
            })
            .addSubcommand((subcommand) => {
                return subcommand
                    .setName('goal')
                    .setDescription('Change the counting goal')
                    .addIntegerOption((option) => {
                        return option
                            .setName("number")
                            .setDescription("The number that the goal is")
                            .setMinValue(1);
                    })
            })
            .addSubcommand((subcommand) => {
                return subcommand
                    .setName('channel')
                    .setDescription('Change the channel for the counting')
                    .addChannelOption((option) => {
                        return option
                            .setName("channel")
                            .setDescription("The channel for counting");
                    });
            }),
        new SlashCommandBuilder()
            .setName("exec")
            .setDescription("Executes code. can only be run by the bot owner")
            .addStringOption((option) => {
                return option.setName("code").setDescription("run this code");
            }),
    ],
    run(mgr) {
        const client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMessageReactions,
            ],
            partials: [
                Partials.Channel, Partials.Message, Partials.Reaction,
            ],
        });

        client.once("ready", () => {
            console.log(this.name + " Ready!");
            mgr.init(this.codename);
        });

        client.addListener("messageCreate", (message) => {
            if (message.author.bot) return;

            this.counting(mgr, message);

            this.stats(mgr, message);
            // console.log(message.content);
        });

        client.addListener("messageDelete", (message) => {
            if (mgr.db.counting.channel !== message.channel.id) return;
            if (!message.reactions.cache.has('✅')) return;

            message.channel.send("A message has been deleted in this channel, the count is **" + mgr.db.counting.count + "**")
        });

        client.on("interactionCreate", async (interaction) => {
            if (!interaction.isCommand()) return;

            const { commandName } = interaction;

            if (commandName === "countingstatus") {
                if (
                    (new Date().getTime() -
                        new Date(mgr.db.counting.lastFailTime).getTime()) /
                        (1000 * 60 * 60 * 24) >=
                    1
                ) {
                    mgr.db.counting.fails = 0;
                    mgr.save();
                }

                interaction.reply(
                    `Current number: **${mgr.db.counting.count}**\nCounting goal: **${mgr.db.counting.goal}**\nHighest number: ${mgr.db.counting.highestNumber}\nFails: **${mgr.db.counting.fails}**\nMax Fails: **${mgr.db.counting.maxFails}**`
                );
                return;
            }

            if (commandName === "countingedit") {
                // ADD MOD ROLE CHECK FOR THE USE OF THIS COMMAND
                if (interaction.user.id !== mgr.config.owner)
                    return interaction.reply(
                        "You are not the bot owner! (for now only the owner can use this command)"
                    );

                if (interaction.options.getSubcommand() === 'count') {
                    mgr.db.counting.count = interaction.options.getInteger("number");
                    mgr.save();
                    interaction.reply(`Count set to **${mgr.db.counting.count}**`);
                    return;
                }

                if (interaction.options.getSubcommand() === 'fails') {
                    mgr.db.counting.fails = interaction.options.getInteger("number");
                    mgr.save();
                    interaction.reply(`Fails set to **${mgr.db.counting.fails}**`);
                    return;
                }

                if (interaction.options.getSubcommand() === 'cooldown') {
                    mgr.db.counting.userCooldownSeconds = interaction.options.getInteger("number");
                    mgr.save();
                    interaction.reply(`Cooldown seconds set to **${mgr.db.counting.userCooldownSeconds}**`);
                    return;
                }

                if (interaction.options.getSubcommand() === 'maxFails') {
                    mgr.db.counting.maxFails = interaction.options.getInteger("number");
                    mgr.save();
                    interaction.reply(`Max fails set to **${interaction.options.getInteger("number")}**`);
                    return;
                }

                if (interaction.options.getSubcommand() === 'goal') {
                    mgr.db.counting.goal = interaction.options.getInteger("number");
                    mgr.save();
                    interaction.reply(`Goal set to **${interaction.options.getInteger("goal")}**`);
                    return;
                }

                if (interaction.options.getSubcommand() === 'channel') {
                    mgr.db.counting.channel = interaction.options.getChannel("channel").id;
                    mgr.save();
                    interaction.reply(`Channel set to **${interaction.options.getChannel("channel").name}**`);
                    return;
                }

                interaction.reply("No valid option was given");
                return;
            }

            if (commandName === "exec") {
                if (interaction.user.id !== mgr.config.owner)
                    return interaction.reply(
                        "You are not the owner of this bot, thus you cannot run this dangerous command"
                    );
                if (interaction.options.getString("code")) {
                    try {
                        const result = eval(
                            interaction.options.getString("code")
                        );
                        interaction.reply(`Result: **${result}**`);
                    } catch (e) {
                        interaction.reply(`Error: **${e}**`);
                    }
                }
            }
        });

        client.on("guildMemberAdd", (member) => {
            // add mod log channel message here or something ?? perhaps a manager for mod logs ??? idfk

            if (mgr.db.thedoor.memberJoin.channel === "") return;
            let joinMessageChannel = member.guild.channels.cache.get(
                mgr.db.thedoor.memberJoin.channel
            );

            joinMessageChannel.send({
                content: mgr.db.thedoor.memberJoin.message.replace(
                    "{user}",
                    `<@!${member.user.id}>`
                ),
                files: [
                    {
                        attachment: mgr.db.thedoor.memberJoin.image.directory,
                        name: mgr.db.thedoor.memberJoin.image.name,
                        description:
                            mgr.db.thedoor.memberJoin.image.description,
                    },
                ],
            });
        });

        client.on("guildMemberRemove", (member) => {
            // add mod log channel message here or something ?? perhaps a manager for mod logs ??? idfk

            if (mgr.db.thedoor.memberLeave.channel === "") return;
            let leaveMessageChannel = member.guild.channels.cache.get(
                mgr.db.thedoor.memberLeave.channel
            );

            leaveMessageChannel.send(
                mgr.db.thedoor.memberLeave.message.replace(
                    "{user}",
                    `<@!${member.user.id}>`
                )
            );
        });

        client.login(mgr.config.tokens[this.codename]);
    },
    counting(mgr, message) {
        if (message.channel.id !== mgr.db.counting.channel) return;
        if (message.type !== MessageType.Default) return;

        if (message.content === '') {
            console.log('What the hell, how?');
            message.reply('You sent an ampty message somehow...');
        }

        let matched = message.content.match(/[0-9+-\/\*\(\)\^\.]/gi)
        if (matched === null) return;

        let userInputNumber;
        try {
            userInputNumber = mathjs.evaluate(message.content);
        } catch (e) {
            // console.log("Math error:\n" + e);
            return;
        }

        if (message.author.id === mgr.db.counting.lastCountMember) {
            let secondsSinceLastCount = (new Date().getTime() - new Date(mgr.db.counting.lastCountTime).getTime()) / 1000;
            let secondsLeft = mgr.db.counting.userCooldownSeconds - secondsSinceLastCount;
            if (secondsLeft > 0) {
                message.react("❌");
                message.reply("Not your turn dumbass <3\nYou can count again in **" + secondsLeft + "** seconds..");
                return;
            }
        }

        if (userInputNumber !== mgr.db.counting.count + 1) {
            message.react("❌");

            mgr.db.counting.fails++;
            if (
                (new Date().getTime() -
                    new Date(mgr.db.counting.lastFailTime).getTime()) /
                    (1000 * 60 * 60 * 24) >=
                1
            ) {
                mgr.db.counting.fails = 1;
            }

            mgr.db.counting.lastFailTime = new Date();
            mgr.save();

            if (mgr.db.counting.fails > mgr.db.counting.maxFails) {
                mgr.db.counting.fails = 0;
                mgr.db.counting.count = 0;
                mgr.save();

                message.reply(
                    "You failed too many times. Resetting the counter."
                );
                return;
            }

            mgr.save();

            message.reply(
                `Wrong number dumbass <3\n${mgr.db.counting.fails}/${mgr.db.counting.maxFails} used.`
            );
            return;
        } else {
            // ADD NUMBER DUH
            mgr.db.counting.count++;
            mgr.db.counting.lastCountMember = message.author.id;
            mgr.db.counting.lastCountTime = new Date();

            if (mgr.db.counting.highestNumber === undefined) mgr.db.counting.highestNumber = 0;
            if (mgr.db.counting.count > mgr.db.counting.highestNumber) {
                mgr.db.counting.highestNumber = mgr.db.counting.count;
            }

            mgr.save();
            message.react("✅");
        }
    },
    stats(mgr, message) {
        // add ignored channels???????

        if (message.type !== MessageType.Default) return;

        // let text = message.content.replace(/<(@&?|#)[0-9]+>/g, "");

        let characters = message.content.split("");
        for (char of characters) {
            if (char.match(/[a-z0-9]|\!\?\.\,\//gi)?.length === 0) return;
            if (mgr.db.stats.timesSaid.letters[char.toLowerCase()] === undefined) {
                mgr.db.stats.timesSaid.letters[char.toLowerCase()] = 0;
            }
            mgr.db.stats.timesSaid.letters[char.toLowerCase()]++;
            mgr.save();
        }

        // add phrases later. im not sure how to check length and stuff like that because storage space is limited yk
    },
};
