const lib = require("./lib");


module.exports = {
	name: 'randimg',
	execute(message, args, game, channel, tclient) {
        const imgs = require("../imgkey.json");
        const rand = Math.floor(Math.random() * imgs.length);
        var filename = imgs[rand].filename;
        lib.sendMsg("", message, filename, null, channel, tclient);
    }
}
