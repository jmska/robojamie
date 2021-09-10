// AndyMacBottald / commands / sayline.js
// !sayline - posts a dialogue line from BYSB based on keyword(s) given as arguments
// Requires node.js, discord.js, and string-similarity

const lib = require('./lib');
var fs = require('fs');

module.exports = {
	name: 'sayline',
	execute(message, args, game, channel, tclient) {

        // Log that the command was called in console
        console.log("!sayline command");

        var transcripts;
        var kids = require('../kids.json')
        const { prefix } = require('../config.json')
        const stringSimilarity = require("string-similarity");

        // if no args given, ask for them
        if (!args.length) {
            if (!channel) {
            message.channel.send("Say what? Use !say for a random line.");
                return;
            }

            else {
                tclient.say(channel, "Say what? Use !say for a random line.");
                return;
            }
        }

        // Eventual output variables (name of kid, name of dialogue file, and transcript of dialogue)
        var kidname, filename, transcript;

        var line;
        var matchinglines = [];
        var matchFound = false;
        var maxSimilarity = 0;
        var mostSimilar;
        var subString;
        var arg;

        // if first arg starts with the prefix (currently '!'), filter the transcripts list to only transcripts said by that kid

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

        if (args[0].startsWith(prefix)) {
            arg = args[0].slice(1);

            randkid = lib.matchKid(arg, game)

            transcripts = transcripts.filter(entry => entry.kid === randkid);

            if (transcripts.length == 0) {
                var content = "I don't know a kid named " + arg + "!";
                lib.sendMsg(content, message, null, null, channel, tclient);
                return;
            }
            args.shift();
        }

        // Join all args to one string, remove punctuation and caps 
        arg = ((args.join("")).replace(/[^a-zA-Z ]/g, "")).toLowerCase();
        // Iterate through every line
        for (var i = 0; i < transcripts.length; i++) {
            if (!transcripts[i].transcription) {
                continue;
            }
            // Remove spaces, punctuation and caps from the transcript currently being read (line)
            line = (transcripts[i].transcription.replace(/[^a-zA-Z ]/g, "")).toLowerCase();
            line = line.replace(/\s/g, '');

            // If an exact match is found, push this transcript into matchinglines and set matchFound flag to true
            // (to avoid having to do costly string similarity search for subsequent transcripts)
            if (line.includes(arg)) {
                matchinglines.push(transcripts[i]);
                matchFound = true;
            }
            
            // If an exact match has still not been found, compare each substring of the transcript (of the same length
            // as the argument), and store the closest match. If this is the closest match so far among all transcripts,
            // save this as the current max.
            else if (!matchFound) {
                var subStrings = [];
                if (arg.length < line.length) {
                    for (var j = arg.length; j <= line.length; j++) {

                        subString = line.slice(j - arg.length, j);
                        subStrings.push(subString);
                    }

                    var similarity = (stringSimilarity.findBestMatch(arg, subStrings));

                    if (maxSimilarity < similarity.bestMatch.rating) {
                        maxSimilarity = similarity.bestMatch.rating;
                        mostSimilar = transcripts[i];
                    }
                }
            }
        }

        // If matchinglines is empty after all transcripts are checked, no exact match was found, so use the most similar
        // transcript found instead.
        if (matchinglines.length == 0 && mostSimilar) {
            matchinglines.push(mostSimilar);
        }
        if (!mostSimilar) {
            rand = Math.floor(Math.random() * transcripts.length);
            transcripts = transcripts[rand];

            if (Array.isArray(transcripts[0])) {
                rand = Math.floor(Math.random() * transcripts.length);
                transcripts = transscripts[rand];
            }

            filename = transcripts.filename;
            transcript = transcripts.transcription;
            kidname = transcripts.kid;
            duration = Math.ceil(transcripts.duration);
            content = "*" + kidname + " says something, but I'm not sure what!*";
        }
        else {
            // Choose a random member of matchinglines 
            rand = Math.floor(Math.random() * matchinglines.length);

            // And post that dialogue
            filename = matchinglines[rand].filename;
            transcript = matchinglines[rand].transcription;
            kidname = matchinglines[rand].kid;
            duration = Math.ceil(matchinglines[rand].duration);
            var content;

            if (!matchFound) {
                content = "No exact match found, line with highest similarity score (= " + maxSimilarity + ") was: \n" + kidname + " says: " + transcript;
            }
            else {
                content = "*" + kidname + " says:* " + transcript;
            }
        }
        lib.sendMsg(content, message, filename, duration, channel, tclient);
    }
};