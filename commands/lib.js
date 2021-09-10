const sleep = require('sleep');
var fs = require('fs');
const kidsunf = require('../kids.json');
const Discord = require('discord.js');

module.exports = {

    generateHTML: function (music, duration, isMuted) {

        if (isMuted) {
            return "<!DOCTYPE html><head><!--meta http-equiv=\"Cache-Control\" content=\"no-cache, no-store, must-revalidate\" / --></head><!--meta http-equiv=\"refresh\" content=\"" + 1 + "\" --> <audio id = \"my_audio\" autoplay controls><source src=\"../audio/" + music + "\" type=\"audio/mpeg\"></audio><script>window.onload = function() {document.getElementById(\"my_audio\").muted = true; document.getElementById(\"my_audio\").play(); setTimeout(function() { document.getElementById('my_audio').muted = true; location = location;}, (" + 1 + " * 1000));} </script>";
        }
        else {
            return "<!DOCTYPE html><head><!--meta http-equiv=\"Cache-Control\" content=\"no-cache, no-store, must-revalidate\" / --></head><!--meta http-equiv=\"refresh\" content=\"" + 20 + "\" --> <audio id = \"my_audio\" autoplay controls><source src=\"../audio/" + music + "\" type=\"audio/mpeg\"></audio><script>window.onload = function() {document.getElementById(\"my_audio\").muted = false; document.getElementById(\"my_audio\").play(); setTimeout(function() { document.getElementById('my_audio').muted = true; location = location;}, (" + duration + " * 1000));} </script>";
        }
    },

    playSound: function (music, duration) {

        const firstPlay = module.exports.generateHTML(music, duration, false);
        fs.writeFileSync('D:\\dbots\\robojamie\\commands\\pagie.html', firstPlay, 'utf-8');
        const muteNow = module.exports.generateHTML(music, duration, true);
        sleep.sleep(duration);
        fs.writeFileSync('D:\\dbots\\robojamie\\commands\\pagie.html', muteNow, 'utf-8');
    },

    matchKid: function (arg, game) {
        var matchingkids = [];
        var kids = [];
        if (game) {
            kids = kidsunf.filter(entry => entry.game === game);
        }
        else { kids = kidsunf; }

        if (!arg) {
            var rand = Math.floor(Math.random() * kids.length);
            const randkid = kids[rand].name;
            return randkid;
        }

        for (var kid of kids) {
            if (Array.isArray(kid.alias)) {
                for (var alias of kid.alias) {
                    if ((alias.toLowerCase() === (arg)) && !matchingkids.includes(kid)) {
                        matchingkids.push(kid);
                    }
                }
            }
            else {
                if ((kid.alias.toLowerCase() === (arg) && !matchingkids.includes(kid))) {
                    matchingkids.push(kid);
                }
            }
            console.log("arg: " + arg + " kid: " + kid.name);
            if ((kid.name.toLowerCase() === (arg) && !matchingkids.includes(kid))) {
                matchingkids.push(kid);
            }
        }

        if (matchingkids.length == 0) {
            return "";
        }
        else {
            console.log(matchingkids);
            var rand = Math.floor(Math.random() * matchingkids.length);
            console.log(rand);
            const randkid = matchingkids[rand].name;
            console.log(randkid);
            return randkid;
        }
    },

    sendMsg(content, message, file, duration, channel, tclient) {
        if (!channel) {
            if (file) {
                const dfile = new Discord.MessageAttachment(file);
                message.channel.send(content, dfile);
            }
            else {
                message.channel.send(content);
            }
        }
        else {
            tclient.say(channel, content);
            if (file) {
                if (file.endsWith(".wav") || file.endsWith(".mp3")) {
                    file = file.slice(6);
                    module.exports.playSound(file, duration);
                }
            }
        }
    },
}