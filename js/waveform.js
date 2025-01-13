import WaveSurfer from "https://cdn.jsdelivr.net/npm/wavesurfer.js@7/dist/wavesurfer.esm.js";

const wavesurfer = WaveSurfer.create({
  container: "#waveform",
  waveColor: "#92c3cc",
  barWidth: 2,
  progressColor: "#322f2f",
});

// Select the first audio item and load its URL
const firstAudioItem = document.querySelector(".audio-item");
const initialUrl = firstAudioItem.getAttribute("data-link");
wavesurfer.load(initialUrl);

// Add event listeners to all audio items to change the waveform
document.querySelectorAll(".audio-item").forEach((item) => {
  item.addEventListener("click", function () {
    const fileName = this.querySelector("b").textContent; // Get the <b> inside the clicked .audio-item
    console.log("fileName: " + fileName);

    // Update the <h2> element with id="fileName" if it exists
    const fileNameElement = document.querySelector("#fileName");
    if (fileNameElement) {
      fileNameElement.textContent = fileName; // Update the text content of <h2>
    } else {
      console.error("No <h2> element with id='fileName' found.");
      return; // Exit if <h2> element with id "fileName" doesn't exist
    }

    const audioLink = item.dataset.link;
    wavesurfer.load(audioLink); // Load the new audio file and update the waveform
  });
});

// Play the audio when waveform is clicked
wavesurfer.on("click", () => {
  wavesurfer.play();
});
