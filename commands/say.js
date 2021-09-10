// AndyMacBottald / commands / say.js
// !sayline - posts a random dialogue line from BYSB, with an optional kid argument
// Requires node.js and discord.js

const lib = require('./lib');
var fs = require('fs');

module.exports = {
	name: 'say',
	execute(message, args, game, channel, tclient) {

        // Log that this command was called
        console.log("!say command");

        // Declare random nubmer and output variables
        var rand, kidname, filename, transcript;

        // If no arg was given, choose randomly from every transcript file
        if (!args.length) {
            if (game) {
                transcripts = require('../audio_keys/' + game + '.json');
            }
            else {
                audio_keys = fs.readdirSync('audio_keys');
                rand = Math.floor(Math.random() * audio_keys.length);
                transcripts = require('../audio_keys/' + audio_keys[rand]);
            }
                rand = Math.floor(Math.random() * transcripts.length);
                filename = transcripts[rand].filename;
                transcript = transcripts[rand].transcription;
                kidname = transcripts[rand].kid;
                duration = Math.ceil(transcripts[rand].duration);

        }

        // Otherwise, filter transcripts to only ones whose kidn matches / includes the arg (or vice versa)
        else {

            if (game) {
                transcripts = require('../audio_keys/' + game + '.json');
            }
            else {
                transcripts = []
                audio_keys = fs.readdirSync('audio_keys');
                for (var i = 0; i < audio_keys.length; i++) {
                    contents = require('../audio_keys/' + audio_keys[i]);
                    transcripts.push(contents);
                }
                transcripts = [].concat(...transcripts);
            }

            const arg = args[0].toLowerCase();

            randkid = lib.matchKid(arg, game);
            kidlines = transcripts.filter(entry => (entry.kid === (randkid)));

            // If kidlines is empty, a match for this argument wasn't found
            if (kidlines.length == 0) {
                content = "I don't know a kid named " + arg + "!";
                lib.sendMsg(content, message, null, null, channel, tclient);
                return;
            }

            // Otherwise, pick a random dialogue line from the filtered set of lines
            rand = Math.floor(Math.random() * kidlines.length);

            filename = kidlines[rand].filename;
            transcript = kidlines[rand].transcription;
            kidname = kidlines[rand].kid;
            duration = Math.ceil(kidlines[rand].duration);

        }
        var content;
        // Finally, post the chosen line.
        if (transcript === "") {
            content = "*" + kidname + " says something, but I'm not sure what!*";
        }
        else {
            content = "*" + kidname + " says:* " + transcript;
        }
        lib.sendMsg(content, message, filename, duration, channel, tclient);
	},
};