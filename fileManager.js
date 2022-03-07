const fs = require("fs");

module.exports = {
    db: JSON.parse(fs.readFileSync("database.json")),
    config: JSON.parse(fs.readFileSync("config.json")),
    save() {
        fs.writeFileSync("database.json", JSON.stringify(this.db, null, 4));
        this.db = JSON.parse(fs.readFileSync("database.json"));
        return;
    },
};

// implement later; config file manager and database kinda thing
// maybe detect manual file changes but idk maybe thats bad ??
// make "backups" once in a while