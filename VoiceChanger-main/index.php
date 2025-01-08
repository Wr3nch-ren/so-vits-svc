<!DOCTYPE html>
<html lang="en">

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="css/common2-1.5.1.css" type="text/css" media="all">
    <link rel="stylesheet" href="css/onlinevoice2.1.css" type="text/css" media="all">
    <link rel="stylesheet" href="css/swiper-bundle.min.css" type="text/css" media="all">
    <link rel="stylesheet" href="css/certify.css" type="text/css" media="all">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css">

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <script src="js/RecordRTC.js"></script>
    <script src="js/bootstrap.min.js"></script>

    <title>Voice Changer AI</title>
</head>

<body>

    <header class="p-3 mb-3 sticky-xl-top text-bg-light border-bottom">
        <div class="container">
            <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
                    <span class="fs-4">Voice Changer</span>
                </a>

                <!-- <div class="nav nav-pills">
        
                    <li class="nav-link"><a href="#">
                        <img src="pic/en.png" alt="mdo" width="32" height="32" class="rounded-circle">
                    </a></li>
                    <div class="vr"></div>
                    <li class="nav-link"><a href="#">
                        <img src="pic/th.png" alt="mdo" width="32" height="32" class="rounded-circle">
                    </a></li>
                    
                </div> -->
            </div>
        </div>
    </header>


    <div id="carouselExampleCaptions" class="carousel slide shadow-lg" data-bs-ride="carousel">
        <div class="carousel-indicators">
            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div class="carousel-inner">
            <div class="carousel-item active">
                <img src="pic/slide001.gif" class="d-block w-100" alt="...">
            </div>
            <div class="carousel-item">
                <img src="pic/slide002.gif" class="d-block w-100" alt="...">
            </div>
            <div class="carousel-item">
                <img src="pic/slide003.gif" class="d-block w-100" alt="...">
            </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
    </div>


    <div class="container my-5">
        <div class="row p-4 pt-lg-5 align-items-center rounded-3 border shadow-lg">
            <!--Program-->
            <form class="" id="program-body" action="">
                <div class="row">
                    <div class="ovc-work-body">
                        <!--setup 1: file or recording-->
                        <section class="p-5 ovc-setup" id="vc-audio-input">
                            <button class="p-3 ovc-select-file-btn file-btn" id="addFileButton">
                                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-soundwave" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M8.5 2a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-1 0v-11a.5.5 0 0 1 .5-.5m-2 2a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5m4 0a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5m-6 1.5A.5.5 0 0 1 5 6v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m8 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m-10 1A.5.5 0 0 1 3 7v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5m12 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5"></path>
                                </svg>
                                <p class="pt-2"><span>Support audio formats: MP3, WAV, M4A or multiple files<br>Maximum upload file size: 30 MB</span></p>
                                <input type="file" onchange="readMultipleFiles(this);" accept="audio/mp3, audio/wav, audio/m4a" multiple>
                            </button>
                            <div class="ovc-line-body">
                                <div class="ovc-line"></div>
                                <div class="or-text"><span>OR</span></div>
                            </div>
                            <button class="p-3 ovc-recording-btn" id="btn-start-recording">
                                <i class="bi bi-mic-fill"></i>
                                <b>Start Recording</b>
                            </button>
                        </section>
                        <!--setup 2: start recording & preview-->
                        <section class="p-5 ovc-setup hide" id="vc-voice-record">
                            <div class="recording-body">
                                <div>
                                    <audio controls autoplay playsinline></audio>
                                </div>
                                <p><span>To ensure conversion quality, please record for more
                                    </span><span class="linght-font">than 10 seconds</span>!</p>
                                <button class="btn btn-dark" id="btn-stop-recording">Stop Recording</button>
                                <button class="btn btn-light" id="btn-restart-recording" disabled>Retry Recording</button>
                            </div>
                        </section>
                        <!--setup 3: uploaded file preview-->
                        <section class="p-5 ovc-setup hide" id="vc-file-preview">
                            <div id="audioPreviews"></div>
                        </section>

                    </div>
                    
                    <div class="col-lg-7 p-3 p-lg-5 pt-lg-3 ovc-work-body-no-outline">
                        <button class="ovc-voice-select-btn">
                            <div class="voice-item-photo">
                                <img src="pic/user.png" class="voice-photo" id="sel-voice-photo">
                                <div class="voice-play-sel-button" id="" data-link="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-play-circle-fill" viewBox="0 0 16 16">
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"/>
                                    </svg>
                                </div>
                                <div class="voice-pause-sel-button">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-pause-circle-fill" viewBox="0 0 16 16">
                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5m3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5"/>
                                </svg>
                                </div>
                            </div>
                            <div class="banner-model-list-item-text">
                                <p><b id="sel-voice-name">Not selected</b></p>
                                <p><span id="sel-voice-description">Please select original AI Voice</span></p>
                            </div>
                        </button>

                        <div class="rounded ovc-setup overflow-auto" style="max-width: 500px; max-height: 250px;">
                            <section class="voice-item" data-id="patri" data-name="Patri">
                                <div class="item-photo"><img src="pic/user.png">
                                </div>
                                <div class="banner-model-list-item-text">
                                    <p><b>Patri</b></p>
                                    <p><span>Female, 26 y/o</span></p>
                                </div>
                                <button type="button" class="voice-play-button" id="voice-play-button" data-link="voiceAudio/patri/006.wav">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-play-circle-fill" viewBox="0 0 16 16">
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"/>
                                    </svg>
                                </button>
                            </section>
                            <section class="voice-item" data-id="ex02" data-name="ex02">
                                <div class="item-photo"><img src="pic/user.png">
                                </div>
                                <div class="banner-model-list-item-text">
                                    <p><b>Example02</b></p>
                                    <p><span>N/A</span></p>
                                </div>
                                <button type="button" class="voice-play-button" id="voice-play-button" data-link="voiceAudio/patri/011.wav">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-play-circle-fill" viewBox="0 0 16 16">
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"/>
                                    </svg>
                                </button>
                            </section>
                            <section class="voice-item" data-id="ex03" data-name="ex03">
                                <div class="item-photo"><img src="pic/user.png">
                                </div>
                                <div class="banner-model-list-item-text">
                                    <p><b>Example03</b></p>
                                    <p><span>N/A</span></p>
                                </div>
                                <button type="button" class="voice-play-button" id="voice-play-button" data-link="voiceAudio/patri/017.wav">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-play-circle-fill" viewBox="0 0 16 16">
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"/>
                                    </svg>
                                </button>
                            </section>
                        </div>
                        <button type="submit" class="rounded-pill btn btn-dark" id="btn-convert" style="width: 150px; height: 60px">Convert</button>
                    </div>
                </div>
            </form>
            
            <!--Loading-->
            <section class="p-5 ovc-work-body-no-outline hide" id="loader-body">
                <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status"></div>
                <h2>Loading...</h2>
                <p>You're currently in line, so it might take some time.</p>
            </section>
            <!--Preview & Dowload-->
            <section class="p-5 col-lg-7 p-3 p-lg-5 pt-lg-3 ovc-work-body-no-outline hide" id="download-body">
                <!--<div>
                    <audio controls autoplay playsinline></audio>
                </div>
                <button class="btn btn-dark" id="btn-download-audio">Download</button>-->
                <div class="rounded ovc-setup border overflow-auto" style="max-width: 500px; max-height: 250px;">
                    <section class="audio-item" >
                        <div class="banner-model-list-item-text">
                            <p><span>file.wav</span></p>
                        </div>
                    </section>
                    <section class="audio-item" >
                        <div class="banner-model-list-item-text">
                            <p><span>file.wav</span></p>
                        </div>
                    </section>
                    <section class="audio-item" >
                        <div class="banner-model-list-item-text">
                            <p><span>file.wav</span></p>
                        </div>
                    </section>
                </div>
                <div class="col-lg-7 p-3 p-lg-5 pt-lg-3 ovc-work-body-no-outline">
                    <div class="wave-audio"></div>
                </div>
            </section>
        </div>
    </div>

    


    <div class="container">
        <footer class="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
            <div class="col-md-4 d-flex align-items-center">
                <a href="/" class="mb-3 me-2 mb-md-0 text-body-secondary text-decoration-none lh-1">
                    <svg class="bi" width="30" height="24"><use xlink:href="#bootstrap"></use></svg>
                </a>
                <span class="mb-3 mb-md-0 text-body-secondary">© 2024 Kasetsart University</span>
            </div>
        </footer>
    </div>




    <script>
        
    $(document).ready(function(){
        $("#btn-start-recording").click(function(){
            $("#vc-audio-input").addClass("hide");
            $("#vc-voice-record").removeClass("hide");
        });

        $("#btn-convert").click(function(){
            $("#program-body").addClass("hide");
            $("#loader-body").removeClass("hide");
        });

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


    const btnVoicePlay = document.getElementsByClassName("voice-play-button");

    btnVoicePlay.onclick = function(){
        var link = $(this).attr("data-link");
        link.play();
    };

    var load_rtc_interval = setInterval(function () {
        if (typeof RecordRTC == 'function') {
            clearInterval(load_rtc_interval);
            document.getElementById('record_btn_control').removeAttribute('style');

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

    function stopRecordingCallback() {
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
        btnSaveRecording.disabled = false;


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
                };

                reader.readAsDataURL(file);
            }
        }
    }

    /*function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#audioResult')
                    .attr('src', e.target.result);
                $("#vc-audio-input").addClass("hide");
                $("#vc-file-preview").removeClass("hide");
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    $(function () {
        $('#upload').on('change', function () {
            readURL(input);
        });
    }); */

    /*var x = document.getElementById("patri");

    function playAudio() { 
        x.play(); 
    }*/

        </script>


    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-65727978-1"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
    
        gtag('config', 'UA-65727978-1');
    </script>
</body>
</html>