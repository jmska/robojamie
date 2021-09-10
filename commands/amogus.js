const lib = require("./lib");


module.exports = {
	name: 'amogus',
	execute(message, args, game, channel, tclient) {
        const imgs = require("../imgkey.json");
        var filename = "imgs\\skateboard_bot_2111.png"
        lib.sendMsg("", message, filename, null, channel, tclient);
    }
}