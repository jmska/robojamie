# robojamieMacBottald / transcribe.py
# Python program to generate audiokey.json used to match BYSB dialogue files 
# to the transcription of the dialogue and the kid saying it.
# Requires speech_recognition and pydub

import speech_recognition as sr
import os
from pydub import AudioSegment
import json
import librosa
from pathlib import Path

root_dir = Path('D:\\dbots\\robojamie\\audio')

file_list = [f for f in root_dir.glob('**/*') if f.is_file()]

# initalize arrays to store output JSON (audiokey.json) and kids.json
bysb = []
byba = []
cars = []
degs = []
mgtt = []
rata = []

kids = []

with open("kids.json") as kidsf:
    kids.append(json.load(kidsf))

for file in file_list:
    f = str(file)

    if (f.endswith('.mp3')):
        sound = AudioSegment.from_mp3(f)
        sound.export("transcript.wav", format="wav")
    elif (f.endswith('.wav')):
        sound = AudioSegment.from_wav(f)
        sound.export("transcript.wav", format="wav")
    else:
        continue   

    AUDIO_FILE = "transcript.wav"
                        
    r = sr.Recognizer()

    with sr.AudioFile(AUDIO_FILE) as source:

        duration = librosa.get_duration(filename=AUDIO_FILE)
        audio = r.record(source)
        # Iterate through kids, and if the kids' listed alias is found in the file name, associate this dialogue line
        # with that kid.
        longest_alias = ''
        matched_kid = None
        for i in range(len(kids[0])):
            kid = kids[0][i]
            alias = kid["alias"]

            if type(alias) in [list,tuple]:
                for indiv_alias in alias:
                    if ((indiv_alias in f) and len(indiv_alias) > len(longest_alias)):
                        longest_alias = indiv_alias
                        matched_kid = kid
            
            elif alias in f:
                if (len(alias) > len(longest_alias)):
                    longest_alias = alias
                    matched_kid = kid

        if (matched_kid is None):
            continue

        kid_name = matched_kid["name"]
        kid_game = matched_kid["game"]

        try:
            transcription = r.recognize_google(audio)
        except:
            transcription = ""
        
        data = {"filename": f, "kid": kid_name, "duration": duration,  "transcription": transcription}
        print(data)
        if (len(transcription) > 0 or duration > 1.0):

            if(kid_game == 'bysb'):
                bysb.append(data)
                
            elif(kid_game == 'byba'):
                byba.append(data)    

            elif(kid_game == 'cars'):
                cars.append(data)

            elif(kid_game == 'degs'):
                degs.append(data) 

            elif(kid_game == 'mgtt'):
                mgtt.append(data)

            elif(kid_game == 'rata'):
                rata.append(data)

with open("D:\\dbots\\robojamie\\audio_keys\\bysb.json", "a+") as out:
    json.dump(bysb, out)

with open("D:\\dbots\\robojamie\\audio_keys\\byba.json", "a+") as out:
    json.dump(byba, out)

with open("D:\\dbots\\robojamie\\audio_keys\\cars.json", "a+") as out:
    json.dump(cars, out)

with open("D:\\dbots\\robojamie\\audio_keys\\degs.json", "a+") as out:
    json.dump(degs, out)

with open("D:\\dbots\\robojamie\\audio_keys\mgtt.json", "a+") as out:
    json.dump(mgtt, out)

with open("D:\\dbots\\robojamie\\audio_keys\\rata.json", "a+") as out:
    json.dump(rata, out)    