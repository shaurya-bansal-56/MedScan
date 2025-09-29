from PIL import Image
from google import genai
import ast
import json
from pathlib import Path
import os

ROOT_DIR = Path(__file__).parent

def MedScanner(image_path):
        name = image_path.replace('.png', "")
        filename = name + ".json"
        CONTENTS = ROOT_DIR / filename

        client = genai.Client(api_key="************************")
        image = Image.open(image_path)
        prompt = """Process this query as dictionary, without words such as json or python before the dictionary.
                    Please specify the name of the drug, with 'Name' being a key and the actual name(along with common brand name in parentheses) being the value.
                    Please specifiy the recommend dosage of the drug in simple terminology, with 'Dosage' being the key and the recommended dosage being the value.
                    Please list the uses of the drug in simple terminology, with 'Usage' being the key and the uses in a list format being the value/
                    Please make a dictionary of the side effects of the drug, with 'Common Side Effects' being one key  containg a list of common side 
                    effects as a value, and 'Uncommon Side Effects' being another key containing a list of uncommon side effect. Please make sure when process in the whole
                    dictionary,'Side Effects' is the key and the side effects in are in the format listed previously.
                    If image is not a valid medication, return 'why' as a key, and the explanation as to why it's not valid as its value.
                """
        while True:
            try:
                response = client.models.generate_content(
                    model = "gemini-2.5-flash",
                    contents = [image, prompt.replace("'''", """""")]
                )

                dictionary = ast.literal_eval(response.text)
                for key in dictionary.keys():
                    if key == 'why':
                        print(dictionary['why'])
                    else:
                        with open(CONTENTS, 'w') as f:
                            json.dump(dictionary, f, indent=2)

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

            except SyntaxError:
                continue

        print("""Do you wish to...
                    (1) Save  
                    (2) Delete
        """)
                                
        while True:
            try: 
                choice = int(input("Please pick from above: "))

                if choice > 2 or choice < 1:
                    print("Invalid Option")
                                        
                if choice == 1:
                    break

                elif choice == 2:
                    for key in dictionary.keys():
                        if key == 'why':
                            os.remove(image_path)
                        else:
                            os.remove(image_path)
                            os.remove(filename)
                break

            except ValueError:

                print("Invalid option")
