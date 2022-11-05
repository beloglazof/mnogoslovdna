import configparser
from pathlib import Path
from PIL import Image
import pytesseract
import json

config = configparser.ConfigParser()
config.read("config.ini")
IMAGES_PATH = config["app"]["images_path"]

image_folder = Path(IMAGES_PATH)

def get_word(data: str) -> str:
    return data.replace('\n', ' ').strip().split(' (')[0].replace('- ', '').strip()


def get_word_from_image(image: Image) -> str:
    word = get_word(pytesseract.image_to_string(image, lang="eng+rus"))

    if word.startswith('('):
        tesseract_config = r'--psm 11'
        word = get_word(pytesseract.image_to_string(
            image, lang="rus+eng", config=tesseract_config))

    return word


def main():
    words_data = { 
        'words_by_id': {},
        'word_ids': []
    }

    try:
        with open("./lib/words-data.json", "r", encoding="utf-8") as words_data_file:
            result = words_data_file.read()
            words_data = json.loads(result)
    except OSError:
        pass
    
    print(words_data)

    for image_path in image_folder.iterdir():
        word_id = image_path.stem
        if word_id in words_data["words_by_id"]:
            continue

        image = Image.open(str(image_path))
        word = get_word_from_image(image)

        words_data["words_by_id"][word_id] = word
        words_data["word_ids"] = words_data["word_ids"] + [word_id]
    
    return words_data
