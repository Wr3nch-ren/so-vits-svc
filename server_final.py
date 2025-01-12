import asyncio
import websockets
import base64
import json
import subprocess
import os
from pydub import AudioSegment

def convert_to_wav(input_path, output_path):
    """Convert a .flac file to a .wav file using pydub."""
    audio = AudioSegment.from_file(input_path, format="flac")
    audio.export(output_path, format="wav")

def save_file(file_path, file_content):
    with open(file_path, "wb") as f:
        f.write(file_content)

session_data = {}

async def handle_client(websocket):
    await websocket.send(json.dumps({"status": "success", "message": "Connected to server."}))
    try:
        async for message in websocket:
            
            data = json.loads(message)
            # print(data)
            response = {"status": "error", "message": "Invalid request type."}
            
            
            # Receive request to get voice models (keys inside spk in config.json)
            if data["action"] == "get_speakers":
                config = json.load(open("configs/config.json"))
                speakers = config["spk"].keys()
                wav_path_list = []
                for speaker in speakers:
                    # Find the first wav file in speaker's folder
                    speaker_folder = f"dataset/44k/{speaker}"
                    wav_files = [f for f in os.listdir(speaker_folder) if f.endswith(".wav")]
                    wav_file = wav_files[0]
                    wav_path = os.path.join(speaker_folder, wav_file)
                    wav_path = os.path.normpath(wav_path).replace("\\", "/")
                    wav_path_list.append(wav_path)
                response = {"status": "success","message": "List of speakers receive successfully", "speakers": list(speakers), "wav_path": wav_path_list}
                print("Sending response:", response)

            # script.js 177-189 (File uploading)
            if data["action"] == "upload":
                file_name = data["fileName"]
                print("File name:", file_name)
                file_content = base64.b64decode(data["fileContent"])  # Decode Base64
                print("Printing file content:",file_content)
                file_path = f"raw/{file_name}"
                
                # For multiple files
                if type(file_name) == list:
                    for i in range(len(file_name)):
                        file_path = f"raw/{file_name[i]}"
                        save_file(file_path, file_content[i])
                
                # Save the file to disk
                else:
                    save_file(file_path, file_content)

                print(f"File {file_name} saved successfully!")
                session_data["file_name"] = file_name
                response = {"status": "success", "message": "File uploaded successfully."}
                
            
            # Voice conversion
            if data["action"] == "convert":
                model_path = "logs/44k/G_633600.pth"  # Default model
                # input_name = session_data["file_name"]
                # print(input_name)
                speaker = data["speaker"]
                transpose = 0  # Default transpose value
                
                def process_file(input_file):
                    return ""
                    """
                    # Run the voice conversion command
                    print("file processing...")
                    command = ("python", "inference_main.py", "-m", model_path, "-c", "configs/config.json", "-n", input_file, "-t", str(transpose), "-s", speaker)
                    subprocess.run(command, shell=True)

                    # Generated .flac file
                    generated_flac = f"{input_file}_{transpose}key_{speaker}_sovdiff_pm.flac"
                    flac_path = f"results/{generated_flac}"

                    # Convert .flac to .wav
                    generated_wav = generated_flac.replace(".flac", ".wav")
                    wav_path = f"results/{generated_wav}"
                    convert_to_wav(flac_path, wav_path)

                    # Encode the .wav file to Base64
                    with open(wav_path, "rb") as f:
                        encoded_wav = base64.b64encode(f.read()).decode("utf-8")

                    return encoded_wav
                    """

                """
                # Process multiple files
                if isinstance(input_name, list):
                    voice_content = []
                    for file in input_name:
                        print("Processing file:", file)
                        voice_content.append(await process_file(file))
                    response = {
                        "status": "success",
                        "message": "Voice conversion successful.",
                        "voice": voice_content,
                    }

                # Process a single file
                else:
                    voice_content = await process_file(input_name)
                    response = {
                        "status": "success",
                        "message": "Voice conversion successful.",
                        "voice": voice_content,
                    }
                """
            
            if data["action"] == "retrieve":
                audio_folder = "results"
                audio_files = {}
                for file_name in os.listdir(audio_folder):
                    print(file_name)
                    file_path = os.path.join(audio_folder, file_name)
                    with open(file_path, "rb") as audio_file:
                        encoded_content = base64.b64encode(audio_file.read()).decode('utf-8')
                        audio_files.append({"fileName": file_name, "fileContent": encoded_content})

                response = {"status": "success", "message": "File retrieve successfully."}
                return audio_files
            
            # Send the respond
            await websocket.send(json.dumps(response))

    except websockets.ConnectionClosed as e:
        print(f"Connection closed: {e}")

async def main():
    server = await websockets.serve(handle_client, "127.0.0.1", 3000, max_size=10 * 1024 * 1024)
    print("[*] WebSocket server running on ws://127.0.0.1:3000")
    await server.wait_closed()

if __name__ == "__main__":
    asyncio.run(main())
