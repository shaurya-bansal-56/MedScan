from med_scanner import MedScanner
from image_library import ImageLibrary

print("Welcome To MedScan")
print("""Would You Like To...
            (1) Scan a photo of a medication
            (2) See Image Library
      """)
try:
    choice = int(input("Pick from above options:"))
    if choice > 2 or choice < 1:
        print("Invalid Option")
    
    if choice == 1:
        from image_scanner import ImageScanner
        image_path = ImageScanner()
        MedScanner(image_path)

    if choice == 2:
        ImageLibrary()
        
except ValueError:
    print("Invalid Option")