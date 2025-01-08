import asyncio
import websockets
import base64
import json
import subprocess
import os

def save_file(file_path, file_content):
    with open(file_path, "wb") as f:
        f.write(file_content)

async def handle_client(websocket, path):
    await websocket.send(json.dumps({"status": "success", "message": "Connected to server."}))
    try:
        async for message in websocket:
            
            data = json.loads(message)
            print(data)
            response = {"status": "error", "message": "Invalid request type."}
            generated_voice = None

            file_name = data["fileName"]
            file_content = base64.b64decode(data["fileContent"])  # Decode Base64
            file_path = f"../raw/{file_name}"
            
            if type(file_name) == list:
                for i in range(len(file_name)):
                    file_path = f"../raw/{file_name[i]}"
                    save_file(file_path, file_content[i])
            
            # Save the file to disk
            else:
                save_file(file_path, file_content)

            print(f"File {file_name} saved successfully!")

    except websockets.ConnectionClosed as e:
        print(f"Connection closed: {e}")

async def main():
    server = await websockets.serve(handle_client, "127.0.0.1", 3000)
    print("[*] WebSocket server running on ws://127.0.0.1:3000")
    await server.wait_closed()

if __name__ == "__main__":
    asyncio.run(main())
