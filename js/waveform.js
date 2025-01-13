import WaveSurfer from "https://cdn.jsdelivr.net/npm/wavesurfer.js@7/dist/wavesurfer.esm.js";

document.addEventListener("scriptLoaded", () => {
  console.log("WAVEFORM start...");
  const wavesurfer = WaveSurfer.create({
    container: "#waveform",
    waveColor: "#92c3cc",
    barWidth: 2,
    progressColor: "#322f2f",
  });

  function waveformInit() {
    const firstAudioItem = document.querySelector(".audio-item");
    const initialUrl = firstAudioItem.getAttribute("data-link");
    wavesurfer.load(initialUrl);
  }

  document.querySelectorAll(".audio-item").forEach((item) => {
    item.addEventListener("click", function () {
      const fileName = this.querySelector("b").textContent;
      const fileNameElement = document.querySelector("#fileName");
      if (fileNameElement) {
        fileNameElement.textContent = fileName;
      } else {
        console.error("No <h2> element with id='fileName' found.");
        return;
      }
      const audioLink = item.dataset.link;
      wavesurfer.load(audioLink);
    });
  });

  wavesurfer.on("click", () => {
    wavesurfer.play();
  });
});
