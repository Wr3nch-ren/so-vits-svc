import socket
import subprocess
import json
import os

def handle_client(client_socket):
    # Receive data from client
    request = client_socket.recv(1024).decode()
    data = json.loads(request)
    generated_voice = None
    """_webpage_function_
    0. Webpage is implemented to support multiple file selection,
    voice recording, model's generated voice preview and download.
    Website can do these stuff.
    1. Select multiple files to upload or record the voice.
    2. Select the model to generate the voice.
    3. When the model is selected, the voice will be generated and be able to preview.
    4. The generated voice can be downloaded.
    When the website is closed, the generated voice will be deleted.
    """
    """_manual_usage_
    0. Before the webpage is implemented, these are the manual usage.
    1. Run the inference_main.py to generate the voice.
    1.5 The inference_main.py's flag is as follows:
    python inference_main.py -m "logs/44k/G_633600.pth" -c "configs/config.json" -n "raw_wav.wav" -t 0 -s "speaker"
    Explaination of the flags:
    -m: model path
    -c: config path
    -n: input wav file path
    -t: transpose (pitch shift) value
    -s: speaker name (inside the config.json or directory name inside dataset directory)
    2. The generated voice will be saved in the results directory.
    2.5 The generated voice's name is having a pattern as follows:
    raw_wav.wav_0key_speaker_sovdiff_pm.flac (assuming -n "raw_wav.wav", -t 0, -s speaker)
    Pattern is: {input_wav_file_name}.wav_{transpose}key_{speaker}_sovdiff_pm.flac
    """
    # The information above tells the original manual usage before the server and webpage linking is implemented.
    # The webpage will be implemented to automate the process that is done manually.
    
    # Check if the request is for uploading voice files
    if data["type"] == "upload":
        # Save the uploaded voices into ../raw/ directory
        for file in data["files"]:
            with open(f"../raw/{file['name']}", "wb") as f:
                f.write(file["data"])
        # Send the response to the client
        response = {"status": "success"}
        client_socket.send(json.dumps(response).encode())
    
    # Check if the request is for generating voice (the speaker selection is pressed)
    elif data["type"] == "generate":
        # Run the inference_main.py to generate the voice
        model_path = "logs/44k/G_633600.pth" # Webpage is not implemented to support model selection
        input_wav = data["input_wav"]
        speaker = data["speaker"]
        transpose = 0 # Webpage is not implemented to support transpose
        command = f"python inference_main.py -m {model_path} -c configs/config.json -n {input_wav} -t {transpose} -s {speaker}"
        subprocess.run(command, shell=True)
        # Obtain the generated voice's name
        generated_voice = f"{input_wav}_{transpose}key_{speaker}_sovdiff_pm.flac"
        # Send the response to the client
        response = {"status": "success"}
        client_socket.send(json.dumps(response).encode())
    
    # Check if the request is for downloading the generated voice
    elif data["type"] == "download":
        # Send the generated voice to the client
        with open(f"../results/{generated_voice}", "rb") as f:
            voice = f.read()
        response = {"status": "success", "voice": voice}
        client_socket.send(json.dumps(response).encode())
    
    # Close the connection
    client_socket.close()
    
    # Delete the generated voice and raw voice
    if generated_voice:
        os.remove(f"../results/{generated_voice}")
    if data["type"] == "upload":
        for file in data["files"]:
            os.remove(f"../raw/{file['name']}")
    
def main():
    # Create a socket object
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    # Bind the socket to the address and port
    server.bind(("127.0.0.1", 5000))
    # Listen for connections
    server.listen(5)
    print("[*] Listening on port 5000")
    while True:
        # Accept connections from clients
        client, addr = server.accept()
        print(f"[*] Accepted connection from {addr[0]}:{addr[1]}")
        # Handle the client
        handle_client(client)

if __name__ == "__main__":
    main()