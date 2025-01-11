
$(document).ready(function(){
    const socket = new WebSocket('ws://localhost:3000');
    socket.addEventListener('open', function () {
        console.log('Connected to WS Server');
        const data = { action: "get_speakers" };
        socket.send(JSON.stringify(data)); // Convert object to JSON string
    });
    socket.addEventListener('message', function (message) {
        console.log('Message from Server:', message.data);
        const response = JSON.parse(message.data);
        const speakerContainer = document.getElementById('aaa');
        response.speakers.forEach((speaker) => {
            const section = `
            <section class="voice-item" data-id="${speaker}" data-name="${speaker}">
                <div class="item-photo"><img src="pic/user.png">
                </div>
                <div class="banner-model-list-item-text">
                    <p><b>${speaker}</b></p>
                    <p><span>Female, 26 y/o</span></p>
                </div>
                <button type="button" class="voice-play-button" id="voice-play-button" data-link="voiceAudio/patri/006.wav">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-play-circle-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"/>
                    </svg>
                </button>
            </section>`;
            speakerContainer.innerHTML += section;
        });
    });
    socket.addEventListener('close');

    $("#btn-start-recording").click(function(){
        $("#vc-audio-input").addClass("hide");
        $("#vc-voice-record").removeClass("hide");
    });

    $("#btn-convert").click(function(){
        $("#program-body").addClass("hide");
        $("#loader-body").removeClass("hide");
    });
// Audio Playing Section
    const audioPlayer = new Audio();
    audioPlayer.style.display = 'none';

    $(".voice-play-sel-button").click(function() {
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

    $(".voice-pause-sel-button").click(function() {
        event.preventDefault();
        if (audioPlayer !== null && !audioPlayer.paused) {
            audioPlayer.pause();
            $('.voice-pause-sel-button').hide();
            $('.voice-play-sel-button').show();
        }
    });


// Voice Selection Section
    $('.voice-item').click(function(event) {
        const selectedItem = $(this);
        const dataLink = selectedItem.find('.voice-play-button').attr('data-link');
        const voicePhoto = selectedItem.find('.item-photo img').attr('src');
        const voiceName = selectedItem.find('.banner-model-list-item-text b').text();
        const voiceDescription = selectedItem.find('.banner-model-list-item-text span').text();

        $('.ovc-voice-select-btn .voice-play-sel-button').data('data-link', dataLink);
        $('.ovc-voice-select-btn #sel-voice-photo').attr('src', voicePhoto);
        $('.ovc-voice-select-btn #sel-voice-name').text(voiceName);
        $('.ovc-voice-select-btn #sel-voice-description').text(voiceDescription);

        /*if ($(event.target).hasClass('voice-play-button')) {
            event.preventDefault();
        }*/

    });
    

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
var btnSaveRecording = document.getElementById('btn-save-recording');


btnRestartRecording.onclick = function(){
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

btnStartRecording.onclick = function () {
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


btnSaveRecording.onclick = function () {
    // this.disabled = true;
    if (!recorder || !recorder.getBlob()) return;

    if (isSafari) {
        recorder.getDataURL(function (dataURL) {
            SaveToDisk(dataURL, getFileName('mp3'));
        });
        return;
    }

    var blob = recorder.getBlob();
    var file = new File([blob], getFileName('mp3'), {
        type: 'audio/mp3'
    });
    // invokeSaveAsDialog(file);

    const socket = new WebSocket('ws://localhost:3000');
    socket.addEventListener('open', function () {
        console.log('Connected to WS Server');
        const data = { fileName: getFileName('mp3'), files: [] };
        socket.send(JSON.stringify(data)); // Convert object to JSON string

    });
    socket.addEventListener('message', function (message) {
        console.log('Message from Server:', message.data);
    });
    socket.addEventListener('close');
    return; // This thing make save.php doesn't work, but it's for a good reason
    var formData = new FormData();
    formData.append('new_voice_file', file);
    formData.append('new_voice_file_name',getFileName('mp3'));

    $.ajax({
        url: 'save.php',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        success: function(response) {
            console.log(response);
            console.log(response.url);

            response = JSON.parse(response);
            console.log(response);


            if(response.success){
                alert('File Successfully Generated.');
                var a = document.createElement("a");
                a.href = response.url;
                a.setAttribute("download", response.file_name);
                a.click();
                a.remove();

            }else{
                alert(response.error);
            }
        },
        error: function(response) {
            alert('File not downloading, please try again.');
        }
    });

};

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
            socket.addEventListener('close');
            reader.onload = function(e) {
                const audioElement = document.createElement('audio');
                audioElement.classList.add('audio-preview');
                audioElement.controls = true;
                audioElement.src = e.target.result;

                const label = document.createElement('label');
                label.textContent = file.name;

                previewContainer.appendChild(label);
                previewContainer.appendChild(audioElement);
            };

            reader.readAsDataURL(file);
            const socket = new WebSocket('ws://localhost:3000');
            socket.addEventListener('open', function () {
                console.log('Connected to WS Server');
                reader.onload = function() {
                    const base64Data = reader.result.split(',')[1]; // Remove the data URI prefix
                    const data = {action: "upload", fileName: file.name, fileContent: base64Data };
                    socket.send(JSON.stringify(data)); // Convert object to JSON string
                };
            });
            socket.addEventListener('message', function (message) {
                console.log('Message from Server:', message.data);
            });
        }
    }
}



function a(){
    const socket = new WebSocket('ws://localhost:3000');
    socket.addEventListener('open', function () {
        console.log('Connected to WS Server');
        const data = { type: "upload", files: [] };
        socket.send(JSON.stringify(data)); // Convert object to JSON string

    });
    socket.addEventListener('message', function (message) {
        console.log('Message from Server:', message.data);
    });
    socket.addEventListener('close');
}