$(document).ready(function(){
  $('.btn-download-all-files').click(function() {
    console.log("downloaded ALL files clicked")
    const audioItems = document.querySelectorAll('.audio-item');
    audioItems.forEach(item => {
      const link = document.createElement('a');
      link.href = item.dataset.link;
      link.download = item.querySelector('b').textContent;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  });

  $('.btn-download-this-file').click(function() {
    console.log("downloaded INDIVIDUAL file clicked");
    const audioItems = document.querySelectorAll('.audio-item');
    const fileName = document.getElementById('fileName').textContent;

    console.log("download: ", fileName);

    audioItems.forEach(item => {
      if(item.querySelector('b').textContent == fileName){
        const link = document.createElement('a');
        link.href = item.dataset.link;
        link.download = item.querySelector('b').textContent;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  });
});

// Socket Connection
const socket = new WebSocket("ws://localhost:3000");
socket.addEventListener("open", function () {
  console.log("Connected to WS Server");
  const data = { action: "get_speakers" };
  socket.send(JSON.stringify(data)); // Convert object to JSON string
});
socket.addEventListener("message", function (message) {
  console.log("Message from Server:", message.data);
  const response = JSON.parse(message.data);
  const speakerContainer = document.getElementById("ovc-setup");
  response.speakers.forEach((speaker, index) => {
    const wavPath = response.wav_path[index]; // Get the matching wav_path for the speaker
    console.log("Wav Path:", wavPath);
    const section = `
              <section class="audio-item" data-link="voiceAudio/patri/006.wav">
                <div class="banner-audio-list-item-text">
                    <p><b>006.wav</b></p>
                </div>
              </section>`;
    speakerContainer.innerHTML += section;
  });
});
socket.addEventListener("close");

// Selected Voice