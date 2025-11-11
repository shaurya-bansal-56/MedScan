from PIL import Image
import google.generativeai as genai
import ast
import json
from pathlib import Path
import os
from flask import Flask, request, jsonify

# request: This function allows us to access request objects and access parts of specific requests
# jsonify: Converts Python data structures into JSON format


# ROOT_DIR = Path(__file__).parent

client = genai.configure(api_key="AIzaSyB4gAJnkpxMM-TryaXKVbnqAkWXU-6ZsT8")


def MedScanner(image_path):
    #     name = image_path.replace(".png", "")
    #     filename = name + ".json"
    #     CONTENTS = ROOT_DIR / filename

    try:
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
                    model=genai.GenerativeModel("gemini-2.5-flash"),
                    contents=[image, prompt.replace("'''", """""")],
                )

                dictionary = ast.literal_eval(response.text)
                # for key in dictionary.keys():
                #     if key == "why":
                #         print(dictionary["why"])
                #     else:
                #         with open(CONTENTS, "w") as f:
                #             json.dump(dictionary, f, indent=2)

                #         name = dictionary["Name"]
                #         print(name)
                #         print("\n")
                #         dosage = dictionary["Dosage"]
                #         print("DOSAGE:")
                #         print(dosage)
                #         print("\n")
                #         usage = dictionary["Usage"]
                #         print("USES:")
                #         for i in usage:
                #             print("- ", i)
                #         print("\n")
                #         common_side_effects = dictionary["Side Effects"][
                #             "Common Side Effects"
                #         ]
                #         print("COMMON SIDE EFFECTS:")
                #         for i in common_side_effects:
                #             print("- ", i)
                #         print("\n")
                #         uncommon_side_effects = dictionary["Side Effects"][
                #             "Uncommon Side Effects"
                #         ]
                #         print("UNCOMMON SIDE EFFECTS")
                #         for i in uncommon_side_effects:
                #             print("- ", i)
                #         print("\n")
                return dictionary
                break

            except SyntaxError:
                print(f"SyntaxError, request retrying...")
                continue
            except Exception as e:
                print(f"Error during request: {e}")
                return {"error": "Failed to process image file."}

    except Exception as e:
        print(f"Error opening image: {e}")
        return {"error": "Failed to open or process image file."}

    # print(
    #     """Do you wish to...
    #                 (1) Save
    #                 (2) Delete
    #     """
    # )

    # while True:
    #     try:
    #         choice = int(input("Please pick from above: "))

    #         if choice > 2 or choice < 1:
    #             print("Invalid Option")

    #         if choice == 1:
    #             break

    #         elif choice == 2:
    #             for key in dictionary.keys():
    #                 if key == "why":
    #                     os.remove(image_path)
    #                 else:
    #                     os.remove(image_path)
    #                     os.remove(filename)
    #         break

    #     except ValueError:

    #         print("Invalid option")


app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(
    UPLOAD_FOLDER, exist_ok=True
)  # This makes an upload folder is it already doesn't exist


@app.route(
    "/camera", methods=["POST"]
)  # 'POST' specififes that it only allows POST requests, such as sending data
# This is a decorator, that tells flask that when a request comes to /camera, run handle_scan
def handle_scan():
    if "photo" not in request.files:  # Checks if the proper photo was returned
        return jsonify({"error": "No 'photo'"}), 400

    else:
        file = request.files["photo"]

        if file.filename == "":
            return jsonify({"error": "No selected file"}), 400

        if file:
            from werkzeug.utils import (
                secure_filename,
            )  # Helps clean up the filename that makes sure the file is saved in te corect file

            filename = secure_filename(
                file.filename
            )  # Takes file and gives it a secure name
            temp_image_path = os.path.join(
                UPLOAD_FOLDER, filename
            )  # Applies folder path to secure path
            file.save(temp_image_path)  # Saves file in folder
            print(f"File saved to {temp_image_path}")

            try:
                analysis_result = MedScanner(
                    temp_image_path
                )  # Runs MedScanner on the temporary image path

                return jsonify(analysis_result)  # Return JSON format of the results

            except Exception as e:  # Any error that occurs will be returned
                print(f"An error occured: {e}")
                return jsonify({"error": str(e)}, 500)

            finally:

                if os.path.exists(
                    temp_image_path
                ):  # Once code has run successfully, it removes files from path
                    os.remove(temp_image_path)
                    print(f"Cleaned up {temp_image_path}")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
