#!/usr/bin/env node

const fileManager = require('./fileManager.js');
const fs = require('fs');
// const config = require("./config.json");
const bots = {};

fs.readdirSync("./bots").forEach(file => {
    if (!file.endsWith(".js")) return;
    if (file === "template_bot.js") return;

    bots[file] = require(`./bots/${file}`);
    if (bots[file].ignore) return;
    bots[file].run(fileManager);
});