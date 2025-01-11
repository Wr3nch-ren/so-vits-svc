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

            # script.js 177-189 (File uploading)
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
            
            # Previewing speaker's voice
            if data["action"] == "preview":
                speaker = data["speaker"]
                # Take the first wav file in speaker's folder
                speaker_folder = f"../dataset/44k/{speaker}"
                wav_files = [f for f in os.listdir(speaker_folder) if f.endswith(".wav")]
                wav_file = wav_files[0]
                wav_path = os.path.join(speaker_folder, wav_file)
                
                # Send the wav file to client as base64
                with open(wav_path, "rb") as f:
                    wav_content = base64.b64encode(f.read()).decode("utf-8")
                    response = {"status": "success", "message": "Preview voice received successfully.", "wav": wav_content}
                
            
            # Voice conversion
            if data["action"] == "convert":
                model_path = "logs/44k/G_633600.pth"  # Default model
                input_wav = data["input_wav"]
                speaker = data["speaker"]
                transpose = 0  # Default transpose value

                # Multiple files
                if type(input_wav) == list:
                    for i in range(len(input_wav)):
                        command = (
                            f"python inference_main.py -m {model_path} -c configs/config.json "
                            f"-n {input_wav[i]} -t {transpose} -s {speaker}"
                        )
                        subprocess.run(command, shell=True)
                        generated_voice = []
                        for i in range(len(input_wav)):
                            generated_voice.append(f"{input_wav[i]}_{transpose}key_{speaker}_sovdiff_pm.flac")
                        voice_path = [f"../results/{voice}" for voice in generated_voice]
                        voice_content = []
                        for i in range(len(voice_path)):
                            with open(voice_path[i], "rb") as f:
                                voice_content.append(base64.b64encode(f.read()).decode("utf-8"))
                        response = {"status": "success", "message": "Voice conversion successful.", "voice": voice_content}
                
                # Single file
                else:
                    command = (
                        f"python inference_main.py -m {model_path} -c configs/config.json "
                        f"-n {input_wav} -t {transpose} -s {speaker}"
                    )
                    subprocess.run(command, shell=True)
                    generated_voice = f"{input_wav}_{transpose}key_{speaker}_sovdiff_pm.flac"
                    voice_path = f"../results/{generated_voice}"
                    with open(voice_path, "rb") as f:
                        voice_content = base64.b64encode(f.read()).decode("utf-8")
                        response = {"status": "success", "message": "Voice conversion successful.", "voice": voice_content}
            
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
