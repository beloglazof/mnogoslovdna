import configparser
from telethon import TelegramClient, types
from telethon.tl.types import InputMessagesFilterPhotos

config = configparser.ConfigParser()
config.read("config.ini")

API_ID = config["telegram"]["api_id"]
API_HASH = config["telegram"]["api_hash"]
IMAGES_PATH = config["app"]["images_path"]
# IMAGES_UPLOAD_LIMIT = config["app"].getint("images_upload_limit")
IMAGES_UPLOAD_LIMIT = None
CHAT_ID = "slovodna"


async def main(min_id):
    try:
        client = await TelegramClient("bvd", API_ID, API_HASH).start()
    except OSError:
        print('Failed to connect')

    last_id = None
    message: types.Message
    async for message in client.iter_messages(
        CHAT_ID, 
        limit=IMAGES_UPLOAD_LIMIT, 
        filter=InputMessagesFilterPhotos, 
        reverse=True, 
        min_id = min_id
        ):
        last_id = message.id
        await client.download_media(message, file=f"{IMAGES_PATH}/{message.id}")
    
    return last_id
