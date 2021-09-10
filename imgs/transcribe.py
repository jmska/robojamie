# AndyMacBottald / transcribe.py
# Python program to generate audiokey.json used to match BYSB dialogue files 
# to the transcription of the dialogue and the kid saying it.
# Requires speech_recognition and pydub

import speech_recognition as sr
import os
from pydub import AudioSegment
import json
import librosa

with open("audiokey.json", "a+") as write_file:

    # initalize arrays to store output JSON (audiokey.json) and kids.json
    output = []
    kids = []
    subdir = False
    maindir = 'audio'

    """ for root, dirs, files in os.walk('D:\\dbots\\andy\\' + maindir):
            for file in files:
                subdir = False
                folder = os.path.basename(root)
                folder = (folder.lower()).replace(" ", "")

                if (folder != 'audio'):
                    subdir = True
                    os.rename(os.path.join(root, file), os.path.join(root, "{}_{}".format(folder, file))) """

    for root, dirs, files in os.walk('D:\\dbots\\andy\\' + maindir):
            for file in files:
                folder = os.path.basename(root)

                if (folder != 'audio'):
                    f = os.path.join(folder, file)
                    f = os.path.join(maindir, f)
                else:
                    f = os.path.join(maindir, file)

                if file.endswith('wav'):
                    sound = AudioSegment.from_wav(f)
                else:
                    sound = AudioSegment.from_mp3(f)

                sound.export("transcript.wav", format="wav")                                                       
                AUDIO_FILE = "transcript.wav"
                                
                r = sr.Recognizer()
                length = librosa.get_duration(filename=AUDIO_FILE)

                with sr.AudioFile(AUDIO_FILE) as source:

                    try:
                        audio = r.record(source)

                        # Store the contents of kids.json in kids
                        with open("kids.json") as kidsf:
                            kids.append(json.load(kidsf))

                        # Iterate through kids, and if the kids' listed alias is found in the file name, associate this dialogue line
                        # with that kid.
                        matches = []
                        for kid in kids[0]:
                            alias = kid["alias"]

                            # If alias property is an array in kids.json (used for example for 'kiesha' and 'keisha' both being recognized),
                            # use the first string in the array (the one corresponding to the audio file names) as the alias to check
                            if type(alias) in [list,tuple]:
                                alias = alias[0]
                            if alias in f:
                                matches.append(kid)
                        
                        # Format JSON for one line of dialogue - name of audio file, name of kid saying line, duration of line, and automatic transcription
                        # of line.
                        longest = ''
                        for match in matches:
                            print(match["name"])
                            if type(match["alias"]) in [list,tuple]:
                                matchalias = match["alias"][0]
                            else:
                                matchalias = match["alias"]
                            if (len(match["alias"]) > len(longest)):
                                longest = match["name"]
                        kidname = longest
                        data = {"filename": f, "kid": kidname, "length": length, "transcription": r.recognize_google(audio)}
                        output.append(data)
                        print(data)           
                    except:
                        if length > 1.0:
                            data = {"filename": f, "kid": kidname, "length": length, "transcription": ""}
                            output.append(data)
                            print(data)
                            continue
                        else:
                            continue

    # Finally, once every line has been iterated through, dump results to audiokey.json
    json.dump(output, write_file)
