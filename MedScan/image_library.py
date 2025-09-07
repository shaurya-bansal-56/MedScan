from pathlib import Path
import json
import os

ROOT_DIR = Path(__file__).parent

def ImageLibrary():
    while True:
        print("""Which do you wish to pull from library. 
        Please specify the image path: 
        """)
        image = input("ENTER: ")

        if os.path.exists(image):
            json_file = image.replace(".png", ".json")
            CONTENTS = ROOT_DIR / json_file

            with open(CONTENTS, 'r') as f:
                dictionary = json.load(f)
            
            name = dictionary['Name']
            print(name)
            print("\n")
            dosage = dictionary['Dosage']
            print("DOSAGE:")
            print(dosage)
            print("\n")
            usage = dictionary["Usage"]
            print("USES:")
            for i in usage:
                print("- ", i)
            print("\n")
            common_side_effects = dictionary['Side Effects']['Common Side Effects']
            print("COMMON SIDE EFFECTS:")
            for i in common_side_effects:
                print("- ", i)
            print("\n")
            uncommon_side_effects = dictionary['Side Effects']["Uncommon Side Effects"]
            print("UNCOMMON SIDE EFFECTS")
            for i in uncommon_side_effects:
                print("- ", i)
            print("\n")


            break
        
        else:
            print("This image does not exist in your Library. Please specify another image")
            print("\n")
            continue
