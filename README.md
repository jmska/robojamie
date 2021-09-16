# robojamie
Discord / Twitch bot for various mostly non-practical applications.

Current commands:
    !sayline: Takes an input string and an (optional) character name. Finds and plays a voice line from that character (if specified) that matches the input. If no exact match voice transcription exists, the closest one by character-by-character similiarity is used.

    !say: Takes an (optional) character name and plays a random voice line from that character. If no character is given a random voice line from any character is used (filtered by game depending on which bot / client the request originates from)

    !randimg: Posts a random image from the /imgs folder. Used to post random game textures.

    !amogus: Posts a very particular and funny image from the /imgs folder.

    More (actually useful, maybe) ones coming soon.

How it works:
    Running index.js initalizes a Twitch bot which will monitor the chat in channel(s) specified in a config.json file, as well as (possibly multiple) Discord bots which will monitor servers, also specified in config.json.

    The Python scripts (transcibe.py and imgkey.py) are helper scripts used to scan through a directory of audio / image files (stored in audio/ and imgs/ respectively) and generate a .json file that can then be used by the bot's .js scripts to search through.

    Transcribe.py additionally generates a transcription and finds the duration of each voice line, possibly renames the file to match an entry in kids.json based on the name of the folder it is stored in, and adds a second of silence at the beginning of each audio file (to account for an OBS browser source bug where autoplayed HTML content stutters). 

    .js scripts for each command can be found in appropriately named files in /commands. Additionally lib.js contains custom library functions used by multiple commands for convenience.

    !say and !sayline play voice lines by generating an HTML file set to autoplay the audio file selected. This local html file can then be plugged into an OBS browser source and will re-generate / auto-play content whenever a new command is given.

More details and development coming soon.
