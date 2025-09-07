from med_scanner import MedScanner
import os

folder_path = "MedScan_Images"


for item in os.listdir(folder_path):
    name = "MedScan_Images/" + str(item)
    MedScanner(name)
    