from pathlib import Path
import json

ROOT_DIR = Path(__file__).parent

def ImageLibrary():
    image = input("""Which do you wish to pull from library. 
                  Please specify the image path: """)
    json_file = image.replace(".png", ".json")
    CONTENTS = ROOT_DIR / json_file

    with open(CONTENTS, 'r') as f:
        data = json.load(f)
    
    name = data['Name']
    print(name)
    print("\n")
    dosage = data['Dosage']
    print("DOSAGE:")
    print(dosage)
    print("\n")
    usage = data["Usage"]
    print("USES:")
    print(usage)
    print("\n")
    side_effects = data['side effects']
    print("SIDE EFFECTS:")
    print(side_effects)
