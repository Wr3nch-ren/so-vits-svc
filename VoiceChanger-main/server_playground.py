import asyncio
import websockets
import base64
import json
import subprocess
import os

def save_file(file_path, file_content):
    with open(file_path, "wb") as f:
        f.write(file_content)

async def handle_client(websocket):
    await websocket.send(json.dumps({"status": "success", "message": "Connected to server."}))
    try:
        async for message in websocket:
            
            data = json.loads(message)
            print(data)
            response = {"status": "error", "message": "Invalid request type."}
            generated_voice = None
            
            # Receive request to get voice models (keys inside spk in config.json)
            
            if data["action"] == "get_speakers":
                config = json.load(open("../configs/config.json"))
                speakers = config["spk"].keys()
                response = {"status": "success","message": "List of speakers receive successfully", "speakers": list(speakers)}

            # script.js 177-189
            if data["action"] == "upload":
                file_name = data["fileName"]
                file_content = base64.b64decode(data["fileContent"])  # Decode Base64
                file_path = f"../raw/{file_name}"
                
                # For multiple files
                if type(file_name) == list:
                    for i in range(len(file_name)):
                        file_path = f"../raw/{file_name[i]}"
                        save_file(file_path, file_content[i])
                
                # Save the file to disk
                else:
                    save_file(file_path, file_content)

                print(f"File {file_name} saved successfully!")
                response = {"status": "success", "message": "File uploaded successfully."}
            
            # Voice conversion
            if data["action"] == "convert":
                model_path = "logs/44k/G_633600.pth"  # Default model
                input_wav = data["input_wav"]
                speaker = data["speaker"]
                transpose = 0  # Default transpose value

                if type(input_wav) == list:
                    for i in range(len(input_wav)):
                        command = (
                            f"python inference_main.py -m {model_path} -c configs/config.json "
                            f"-n {input_wav[i]} -t {transpose} -s {speaker}"
                        )
                        subprocess.run(command, shell=True)
                
                else:
                    command = (
                        f"python inference_main.py -m {model_path} -c configs/config.json "
                        f"-n {input_wav} -t {transpose} -s {speaker}"
                    )
                    subprocess.run(command, shell=True)
                generated_voice = f"{input_wav}_{transpose}key_{speaker}_sovdiff_pm.flac"
                
                
            
            # Send the respond
            await websocket.send(json.dumps(response))

    except websockets.ConnectionClosed as e:
        print(f"Connection closed: {e}")

async def main():
    server = await websockets.serve(handle_client, "127.0.0.1", 3000)
    print("[*] WebSocket server running on ws://127.0.0.1:3000")
    await server.wait_closed()

if __name__ == "__main__":
    asyncio.run(main())
