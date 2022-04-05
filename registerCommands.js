const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fileManager = require("./fileManager.js");
const fs = require("node:fs");

const commandFiles = fs
    .readdirSync("./bots")
    .filter((file) => file.endsWith(".js"));

const guildId = fileManager.config.guildId;

for (const file of commandFiles) {
    const command = require(`./bots/${file}`);
    if (command.ignore) continue;
    if (command.commands === undefined || command.commands < 1) continue;

    let clientId = fileManager.config.clientIds[command.codename];

    const rest = new REST({ version: "9" }).setToken(fileManager.config.tokens[command.codename]);

    /*
    rest.get(Routes.applicationGuildCommands(clientId, guildId))
        .then(data => {
            const promises = [];
            for (const cmd of data) {
                const deleteUrl = `${Routes.applicationGuildCommands(clientId, guildId)}/${cmd.id}`;
                promises.push(rest.delete(deleteUrl));
            }
            return Promise.all(promises);
        });
    */

        
    (async () => {
        try {
            console.log("Started refreshing application (/) commands. Command: " + command.name);
            console.log(command.commands.map(cmd => cmd.toJSON()))
            await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
                body: command.commands.map(cmd => cmd.toJSON()),
            });

            console.log("Successfully reloaded application (/) commands.");
        } catch (error) {
            console.error(error);
        }
    })();
}
