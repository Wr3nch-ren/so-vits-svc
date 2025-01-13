
$(document).ready(function(){
    $("#btn-start-recording").click(function(){
        $("#vc-audio-input").addClass("hide");
        $("#vc-voice-record").removeClass("hide");
    });

    $("#btn-convert").click(function(event){
      event.preventDefault(); // Prevent form submission
      $("#program-body").addClass("hide");
      $("#loader-body").removeClass("hide");
      const socket = new WebSocket("ws://localhost:3000");
      socket.addEventListener("open", function () {
        console.log("Connected to WS Server");
        speaker_name = $("#sel-voice-name").text();
        console.log("Selected Target to convert: " + speaker_name);
        // Check if the user select the one or multiple source voice or record an source voice
        // If the user record a source voice
        if ($("#vc-file-preview").hasClass("hide")) {
            // Input name is the name of the recorded file
            const input_name = $("#vc-voice-record").find("audio").attr("src");
            console.log(input_name)
          const data = {
            action: "convert",
            input_name: input_name,
            speaker: speaker_name,
          };
          socket.send(JSON.stringify(data)); // Convert object to JSON string
        // If the user select multiple source voices
        } else {
          // Get the list of audio names inside ReadMultipleFiles
            const audioPreviews = document.getElementById("audioPreviews");
            const audioPreviewsList = audioPreviews.getElementsByClassName("audio-preview");
            const audioNames = [];
            for (let i = 0; i < audioPreviewsList.length; i++) {
                audioNames.push(audioPreviewsList[i].src);
            }
            console.log(audioNames);
          const data = {
            action: "convert",
            input_name: audioNames,
            speaker: speaker_name,
          };
          socket.send(JSON.stringify(data)); // Convert object to JSON string
        }
      });
      socket.addEventListener("message", function (message) {
        try {
            var response = JSON.parse(message.data);
            console.log(response)
            
            // Ensure that the response has a valid Base64 string
            const base64String = response.voice;
            print("Base64: ", base64String)
    
            if (base64String) {
                // Clean up the Base64 string if necessary
                const sanitizedBase64String = base64String.replace(/[^A-Za-z0-9+/=]/g, '');
                print("Sanitized: ", sanitizedBase64String)
                // Decode the Base64 string
                const binaryString = atob(sanitizedBase64String);
    
                // Convert the binary string to ArrayBuffer
                const arrayBuffer = new ArrayBuffer(binaryString.length);
                const uint8Array = new Uint8Array(arrayBuffer);
    
                for (let i = 0; i < binaryString.length; i++) {
                    uint8Array[i] = binaryString.charCodeAt(i);
                }
    
                // Create a Blob and play it
                const audioBlob = new Blob([arrayBuffer], { type: "audio/wav" });
                const audioURL = URL.createObjectURL(audioBlob);
                const audioElement = new Audio(audioURL);
                audioElement.play();
                
            } else {
                console.error("No voice data found in response.");
            }
    
        } catch (error) {
            console.error("Error processing WebSocket message:", error);
        }

        console.log("Message from Server:", message.data);
        // console.log(decoded_to_wav);
        $("#loader-body").addClass("hide");
        $("#download-body").removeClass("hide");

        // retrieve();
      });
      socket.addEventListener("close");
    });

// Audio Playing Section
    const audioPlayer = new Audio();
    audioPlayer.style.display = 'none';

    $(".voice-play-sel-button").click(function(event) {
        event.preventDefault();
        const audioLink = $(this).data('data-link');
        console.log("Playing audio:", audioLink);
        audioPlayer.src = audioLink;
        audioPlayer.addEventListener('loadeddata', () => {
            audioPlayer.play();

            $('.voice-pause-sel-button').show();
            $('.voice-play-sel-button').hide();
        });
        audioPlayer.addEventListener('ended', () => {
            $('.voice-pause-sel-button').hide();
            $('.voice-play-sel-button').show();
        });
        
    });

    $(".voice-pause-sel-button").click(function(event) {
        event.preventDefault();
        if (audioPlayer !== null && !audioPlayer.paused) {
            audioPlayer.pause();
            $('.voice-pause-sel-button').hide();
            $('.voice-play-sel-button').show();
        }
    });


// Voice Selection Section
    $(document).on('click', '.voice-item', function(event) {
        const selectedItem = $(this);
        const dataLink = selectedItem.find('.voice-play-button').attr('data-link');
        const voicePhoto = selectedItem.find('.item-photo img').attr('src');
        const voiceName = selectedItem.find('.banner-model-list-item-text b').text();
        const voiceDescription = selectedItem.find('.banner-model-list-item-text span').text();
        console.log(selectedItem, dataLink, voicePhoto, voiceName, voiceDescription);

        $('.ovc-voice-select-btn .voice-play-sel-button').data('data-link', dataLink);
        $('.ovc-voice-select-btn #sel-voice-photo').attr('src', voicePhoto);
        $('.ovc-voice-select-btn #sel-voice-name').text(voiceName);
        $('.ovc-voice-select-btn #sel-voice-description').text(voiceDescription);
    });

    // Socket Connection
    const socket = new WebSocket('ws://localhost:3000');
    socket.addEventListener('open', function () {
        console.log('Connected to WS Server');
        const data = { action: "get_speakers" };
        socket.send(JSON.stringify(data)); // Convert object to JSON string
    });
    socket.addEventListener('message', function (message) {
        console.log('Message from Server:', message.data);
        const response = JSON.parse(message.data);
        const speakerContainer = document.getElementById('voice-item');
        response.speakers.forEach((speaker, index) => {
            const wavPath = response.wav_path[index]; // Get the matching wav_path for the speaker
            console.log("Wav Path:", wavPath);
            const section = `
            <section class="voice-item" data-id="${speaker}" data-name="${speaker}">
                <div class="item-photo"><img src="pic/user.png">
                </div>
                <div class="banner-model-list-item-text">
                    <p><b>${speaker}</b></p>
                </div>
                <button type="button" class="voice-play-button" id="voice-play-button" data-link="${wavPath}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-play-circle-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"/>
                    </svg>
                </button>
            </section>`;
            speakerContainer.innerHTML += section;
        });
    });
    socket.addEventListener('close');
    

});

// Voice Recording and Saving Section
const btnVoicePlay = document.getElementsByClassName("voice-play-button");

btnVoicePlay.onclick = function(){
    var link = $(this).attr("data-link");
    link.play();
};

var load_rtc_interval = setInterval(function () {
    if (typeof RecordRTC == 'function') {
        clearInterval(load_rtc_interval);
        // document.getElementById('record_btn_control').removeAttribute('style');

    }
}, 1000);
var audio = document.querySelector('audio');
function captureMicrophone(callback) {
    if (microphone) {
        callback(microphone);
        return;
    }
    if (typeof navigator.mediaDevices === 'undefined' || !navigator.mediaDevices.getUserMedia) {
        alert('This browser does not supports WebRTC getUserMedia API.');
        if (!!navigator.getUserMedia) {
            alert('This browser seems supporting deprecated getUserMedia API.');
        }
    }
    navigator.mediaDevices.getUserMedia({
        audio: isEdge ? true : {
            echoCancellation: false
        }
    }).then(function (mic) {
        callback(mic);
    }).catch(function (error) {
        alert('Unable to capture your microphone. Please check console logs.');
        console.error(error);
    });
}

function replaceAudio(src) {
    var newAudio = document.createElement('audio');
    newAudio.controls = true;
    newAudio.autoplay = true;

    if (src) {
        newAudio.src = src;
    }

    var parentNode = audio.parentNode;
    parentNode.innerHTML = '';
    parentNode.appendChild(newAudio);

    audio = newAudio;
}

function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        // When the file is successfully read
        reader.onloadend = function () {
            const base64Data = reader.result.split(',')[1]; // Remove the data URI prefix
            resolve(base64Data);
        };

        // Handle errors
        reader.onerror = function (error) {
            reject(error);
        };

        // Start reading the blob as a Base64 string
        reader.readAsDataURL(blob);
    });
}

function stopRecordingCallback() {
    console.log("hello!");
    replaceAudio(URL.createObjectURL(recorder.getBlob()));

    btnStartRecording.disabled = false;

    setTimeout(function () {
        if (!audio.paused) return;

        setTimeout(function () {
            if (!audio.paused) return;
            audio.play();
        }, 1000);

        audio.play();
    }, 300);

    audio.play();
    // btnSaveRecording.disabled = false;
    console.log(audio);
    const socket = new WebSocket('ws://localhost:3000');
    socket.addEventListener('open', function () {
        console.log('Connected to WS Server');
        blobToBase64(recorder.getBlob()).then((base64Data) => {
        const data = {action: "upload", fileName: getFileName('mp3'), fileContent: base64Data };
        socket.send(JSON.stringify(data)); // Convert object to JSON string
        });
    });
    socket.addEventListener('message', function (message) {
        console.log('Message from Server:', message.data);
    });
    socket.addEventListener('close');
    return;

}

var isEdge = navigator.userAgent.indexOf('Edge') !== -1 && (!!navigator.msSaveOrOpenBlob || !!navigator.msSaveBlob);
var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

var recorder; // globally accessible
var microphone;

var btnStartRecording = document.getElementById('btn-start-recording');
var btnStopRecording = document.getElementById('btn-stop-recording');
var btnRestartRecording = document.getElementById('btn-restart-recording');
// var btnSaveRecording = document.getElementById('btn-save-recording');

console.log("btnStartREC : " + btnStartRecording)
console.log("btnStopREC : " + btnStopRecording)
console.log("btnRestartREC : " + btnRestartRecording)

btnRestartRecording.onclick = function(event){
    event.preventDefault();
    this.disabled = true;

    if (!microphone) {
        captureMicrophone(function (mic) {
            microphone = mic;

            if (isSafari) {
                replaceAudio();

                audio.muted = true;
                audio.srcObject = microphone;

                btnStartRecording.disabled = false;
                btnStartRecording.style.border = '1px solid red';
                btnStartRecording.style.fontSize = '150%';

                alert('Please click start Recording button again. First time we tried to access your microphone. Now we will record it.');
                return;
            }

            click(btnStartRecording);
        });
        return;
    }

    replaceAudio();

    audio.muted = true;
    audio.srcObject = microphone;

    var options = {
        type: 'audio',
        numberOfAudioChannels: isEdge ? 1 : 2,
        checkForInactiveTracks: true,
        bufferSize: 16384
    };

    if (isSafari || isEdge) {
        options.recorderType = StereoAudioRecorder;
    }

    if (navigator.platform && navigator.platform.toString().toLowerCase().indexOf('win') === -1) {
        options.sampleRate = 48000; // or 44100 or remove this line for default
    }

    if (isSafari) {
        options.sampleRate = 44100;
        options.bufferSize = 4096;
        options.numberOfAudioChannels = 1;
    }

    if (recorder) {
        recorder.destroy();
        recorder = null;
    }
    options.numberOfAudioChannels = 1;
    options.recorderType = StereoAudioRecorder;
    recorder = RecordRTC(microphone, options);

    recorder.startRecording();

    btnStopRecording.disabled = false;
};

btnStartRecording.onclick = function (event) {
    event.preventDefault();
    this.disabled = true;
    this.style.border = '';
    this.style.fontSize = '';

    if (!microphone) {
        captureMicrophone(function (mic) {
            microphone = mic;

            if (isSafari) {
                replaceAudio();

                audio.muted = true;
                audio.srcObject = microphone;

                btnStartRecording.disabled = false;
                btnStartRecording.style.border = '1px solid red';
                btnStartRecording.style.fontSize = '150%';

                alert('Please click startRecording button again. First time we tried to access your microphone. Now we will record it.');
                return;
            }

            click(btnStartRecording);
        });
        return;
    }

    replaceAudio();

    audio.muted = true;
    audio.srcObject = microphone;

    var options = {
        type: 'audio',
        numberOfAudioChannels: isEdge ? 1 : 2,
        checkForInactiveTracks: true,
        bufferSize: 16384
    };

    if (isSafari || isEdge) {
        options.recorderType = StereoAudioRecorder;
    }

    if (navigator.platform && navigator.platform.toString().toLowerCase().indexOf('win') === -1) {
        options.sampleRate = 48000; // or 44100 or remove this line for default
    }

    if (isSafari) {
        options.sampleRate = 44100;
        options.bufferSize = 4096;
        options.numberOfAudioChannels = 1;
    }

    if (recorder) {
        recorder.destroy();
        recorder = null;
    }
    options.numberOfAudioChannels = 1;
    options.recorderType = StereoAudioRecorder;
    recorder = RecordRTC(microphone, options);

    recorder.startRecording();

    btnStopRecording.disabled = false;
    };

    btnStopRecording.onclick = function () {
        this.disabled = true;

        microphone.stop();
        microphone = null;

        recorder.stopRecording(stopRecordingCallback);
        btnRestartRecording.disabled = false;
};


// btnSaveRecording.onclick = function () {
//     // this.disabled = true;
//     if (!recorder || !recorder.getBlob()) return;

//     if (isSafari) {
//         recorder.getDataURL(function (dataURL) {
//             SaveToDisk(dataURL, getFileName('mp3'));
//         });
//         return;
//     }

//     var blob = recorder.getBlob();
//     var file = new File([blob], getFileName('mp3'), {
//         type: 'audio/mp3'
//     });
//     // invokeSaveAsDialog(file);

//     const socket = new WebSocket('ws://localhost:3000');
//     socket.addEventListener('open', function () {
//         console.log('Connected to WS Server');
//         const data = { fileName: getFileName('mp3'), files: [] };
//         socket.send(JSON.stringify(data)); // Convert object to JSON string

//     });
//     socket.addEventListener('message', function (message) {
//         console.log('Message from Server:', message.data);
//     });
//     socket.addEventListener('close');

// };

function click(el) {
    el.disabled = false; // make sure that element is not disabled
    var evt = document.createEvent('Event');
    evt.initEvent('click', true, true);
    el.dispatchEvent(evt);
}

function getRandomString() {
    if (window.crypto && window.crypto.getRandomValues && navigator.userAgent.indexOf('Safari') === -1) {
        var a = window.crypto.getRandomValues(new Uint32Array(3)),
            token = '';
        for (var i = 0, l = a.length; i < l; i++) {
            token += a[i].toString(36);
        }
        return token;
    } else {
        return (Math.random() * new Date().getTime()).toString(36).replace(/\./g, '');
    }
}

function getFileName(fileExtension) {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var date = d.getDate();
    return 'bj-audio-' + year + month + date + '-' + getRandomString() + '.' + fileExtension;
}

function SaveToDisk(fileURL, fileName) {
    console.log(fileURL);
    // for non-IE
    if (!window.ActiveXObject) {
        var save = document.createElement('a');
        save.href = fileURL;
        save.download = fileName || 'unknown';
        save.style = 'display:none;opacity:0;color:transparent;';
        (document.body || document.documentElement).appendChild(save);

        if (typeof save.click === 'function') {
            save.click();
        } else {
            save.target = '_blank';
            var event = document.createEvent('Event');
            event.initEvent('click', true, true);
            save.dispatchEvent(event);
        }

        (window.URL || window.webkitURL).revokeObjectURL(save.href);
    }

    // for IE
    else if (!!window.ActiveXObject && document.execCommand) {
        var _window = window.open(fileURL, '_blank');
        _window.document.close();
        _window.document.execCommand('SaveAs', true, fileName || fileURL)
        _window.close();
    }
}

function convertWavToBase64(file, callback) {
    const reader = new FileReader();

    reader.onload = function(e) {
        // e.target.result is an ArrayBuffer
        const base64String = btoa(
            new Uint8Array(e.target.result)
                .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        callback(base64String); // Pass the Base64 string to the callback
    };

    reader.onerror = function() {
        console.error("Error reading file");
    };

    // Read the file as an ArrayBuffer
    reader.readAsArrayBuffer(file);
}


// Multiple Audio File Selection
function readMultipleFiles(input) {
    const previewContainer = document.getElementById('audioPreviews');
    previewContainer.innerHTML = ''; // Clear previous previews

    if (input.files) {
        $("#vc-audio-input").addClass("hide");
        $("#vc-file-preview").removeClass("hide");
        for (let i = 0; i < input.files.length; i++) {
            const file = input.files[i];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const audioElement = document.createElement('audio');
                audioElement.classList.add('audio-preview');
                audioElement.controls = true;
                audioElement.src = e.target.result;

                const label = document.createElement('label');
                label.textContent = file.name;

                previewContainer.appendChild(label);
                previewContainer.appendChild(audioElement);
                
                // Socket Connection
                console.log("File:", file);
                console.log("File Type:", file.type);
                const socket = new WebSocket('ws://localhost:3000');
                socket.addEventListener('open', function () {
                    console.log('Connected to WS Server');
                    convertWavToBase64(file, (base64Data) => {
                        const data = {action: "upload", fileName: file.name, fileContent: base64Data };
                        socket.send(JSON.stringify(data)); // Convert object to JSON string
                    });
                });
                socket.addEventListener('message', function (message) {
                    console.log('Message from Server:', message.data);
                });
                socket.addEventListener('close');
            };
            
            reader.readAsDataURL(file);

        }
    }
}

// connect to socket to retrive audio file(s) from results/
// function retrieve () {
//   const socket = new WebSocket("ws://localhost:3000");
//   socket.addEventListener("open", function () {
//     console.log("RETRIEVE has connected to WS Server");
//     const data = { action: "retrieve" }; // Ensure the key matches server-side expectations
//     socket.send(JSON.stringify(data)); // Send the request to retrieve files
//   });

//   socket.addEventListener("message", function (event) {
//     const response = JSON.parse(event.data); // Parse the server's response
//     console.log("Files retrieved successfully:", response.files);
//   });
// }



// function a(){
//     const socket = new WebSocket('ws://localhost:3000');
//     socket.addEventListener('open', function () {
//         console.log('Connected to WS Server');
//         const data = { type: "upload", files: [] };
//         socket.send(JSON.stringify(data)); // Convert object to JSON string

//     });
//     socket.addEventListener('message', function (message) {
//         console.log('Message from Server:', message.data);
//     });
//     socket.addEventListener('close');
// }