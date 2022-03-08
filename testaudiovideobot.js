const ytdl = require("ytdl-core");
const { Client, Intents } = require("discord.js");
const {
    AudioPlayerStatus,
    StreamType,
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
} = require("@discordjs/voice");

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
    ],
});

client.once("ready", () => {
    console.log(" Ready!");
});

client.addListener("messageCreate", async (message) => {
    if (message.content === "door!play") {
        const connection = joinVoiceChannel({
            channelId: "410654658118287360",
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
        });

        const stream = ytdl("https://youtu.be/dQw4w9WgXcQ", {
            filter: "audioonly",
        });
        const resource = createAudioResource(stream, {
            inputType: StreamType.Arbitrary,
        });
        const player = createAudioPlayer();

        player.play(resource);
        connection.subscribe(player);

        player.on(AudioPlayerStatus.Idle, () => connection.destroy());
    }
});

client.login(require("./config.json").tokens.theDoor);
