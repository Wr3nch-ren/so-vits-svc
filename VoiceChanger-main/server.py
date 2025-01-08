import asyncio
import websockets
import json
import subprocess
import os

async def handle_client(websocket, path):
    await websocket.send(json.dumps({"status": "success", "message": "Connected to server."}))
    try:
        async for message in websocket:
            
            data = json.loads(message)
            print(data)
            response = {"status": "error", "message": "Invalid request type."}
            generated_voice = None

            # Handle file upload
            if data["type"] == "upload":
                for file in data["files"]:
                    file_path = f"../raw/{file['name']}"
                    with open(file_path, "wb") as f:
                        f.write(bytes(file["data"]))
                response = {"status": "success", "message": "Files uploaded successfully."}

            # Handle voice generation
            elif data["type"] == "generate":
                model_path = "logs/44k/G_633600.pth"  # Default model
                input_wav = data["input_wav"]
                speaker = data["speaker"]
                transpose = 0  # Default transpose value

                command = (
                    f"python inference_main.py -m {model_path} -c configs/config.json "
                    f"-n {input_wav} -t {transpose} -s {speaker}"
                )

                subprocess.run(command, shell=True)
                generated_voice = f"{input_wav}_{transpose}key_{speaker}_sovdiff_pm.flac"
                response = {"status": "success", "message": "Voice generated successfully.", "file": generated_voice}

            # Handle download request
            elif data["type"] == "download":
                file_path = f"../results/{data['file']}"
                if os.path.exists(file_path):
                    with open(file_path, "rb") as f:
                        voice = f.read()
                    response = {"status": "success", "voice": list(voice)}  # Send bytes as a list
                else:
                    response = {"status": "error", "message": "File not found."}

            # Send response to client
            await websocket.send(json.dumps(response))

            # Clean up generated files
            if generated_voice:
                os.remove(f"../results/{generated_voice}")

            if data["type"] == "upload":
                for file in data["files"]:
                    os.remove(f"../raw/{file['name']}")

    except websockets.ConnectionClosed as e:
        print(f"Connection closed: {e}")

async def main():
    server = await websockets.serve(handle_client, "127.0.0.1", 3000)
    print("[*] WebSocket server running on ws://127.0.0.1:3000")
    await server.wait_closed()

if __name__ == "__main__":
    asyncio.run(main())
