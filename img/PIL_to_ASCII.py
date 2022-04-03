from PIL import Image
import sys

#ASCII_CHARS = ["@", "#", "S", "%", "?", "*", "+", ";", ":", ",", "."]
ASCII_CHARS = """$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,"^`'. """

def resize_image(image, new_width):
    width, height = image.size
    ratio = height/width/2 #maintain aspect ratio 1.65
    new_height = int(new_width * ratio)
    resized_image = image.resize((new_width, new_height))
    return(resized_image)

def grayify(image):
    grayscale_image = image.convert("L")
    return(grayscale_image)
    
def pixels_to_ascii(image):
    pixels = image.getdata()
    characters = "".join([ASCII_CHARS[pixel//int(sys.argv[3])] for pixel in pixels])
    return(characters)    

def main(new_width=int(sys.argv[2])):
    image = Image.open(sys.argv[1])
  
    new_image_data = pixels_to_ascii(grayify(resize_image(image,new_width)))
    
    pixel_count = len(new_image_data)  
    ascii_image = "\n".join([new_image_data[index:(index+new_width)] for index in range(0, pixel_count, new_width)])
    
    print(ascii_image)

    with open(sys.argv[4], "w") as f:
        f.write("\n");
        f.write(ascii_image)
        f.write("\n");

main()

# python3 PIL_to_ASCII.py {source} {w.size} {depth} {filename}
# python3 PIL_to_ASCII.py yokota.png 150 25 1.txt
