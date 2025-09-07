import cv2

file = input("What would you like to call this image: ")

if ".png" in file:
    file = file.replace(".png", "")

image_path = file + ".png"

def ImageScanner(filename=image_path):

    cap = cv2.VideoCapture(0)

    while True:
        ret, frame = cap.read()

        cv2.imshow("Webcam Feed - Press 'S' to Save, Press 'Q' to quit", frame)

        key=cv2.waitKey(1) & 0xFF

        if key == ord('S'):
            cv2.imwrite(filename, frame)
            print("Image saved")
            break
        
        elif key == ord('Q'):
            print("Quitting without saving")
            break

    cap.release()
    cv2.destroyAllWindows()

    return image_path
