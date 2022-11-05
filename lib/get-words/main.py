# from firebase_admin import db, initialize_app
import asyncio
import configparser
from pathlib import Path
import json

from get_images import main as get_images
from get_words_data import main as get_words_data

config_path = "config.ini"
config = configparser.ConfigParser()
config.read(config_path)

IMAGES_PATH = config["app"]["images_path"]
LAST_ID = config["app"].getint("last_id")

images_folder = Path(IMAGES_PATH)


async def main():
    # last_id = last_id_ref.get()
    new_last_id = await get_images(LAST_ID)
    if new_last_id:
        config["app"]["last_id"] = str(new_last_id)
        with open(config_path, "w") as configfile:
            config.write(configfile)

    words_data = get_words_data()
    print(words_data)

    with open("./lib/words-data.json", "w", encoding="utf-8") as words_data_file:
        json.dump(words_data, words_data_file, indent=2)


asyncio.run(main())
