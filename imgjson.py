import os
from pathlib import Path
import json
from PIL import Image
output = []

with open("imgkey.json", "a+") as write_file:

    maindir = 'imgs'
    for root, dirs, files in os.walk(maindir):
        for file in files:
            try:
                current_dir = Path('.').resolve()
                out_dir = current_dir

                if (file.endswith('.bmp') or file.endswith('.tif')):
                    filename = file[:-4]
                    print(filename)
                    Image.open(str(current_dir) + '\\imgs\\' + file).save(str(out_dir / 'imgs//' + f'{filename}1.png'))
                    f = f'{filename}1.png'
                else:
                    f = file

 
                data = {"filename": 'imgs\\' + f}
                print(data)
                output.append(data)
            except:
                continue
    
    json.dump(output, write_file)