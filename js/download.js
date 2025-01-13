document.addEventListener("scriptLoaded", () => {
  console.log("DOWNLOAD start...")
  $(document).ready(function () {
    $("#btn-download-all-files").click(async function () {
      console.log("downloaded ALL files clicked");
      const audioItems = document.querySelectorAll(".audio-item");
      if (audioItems.length === 0) {
        console.log("No audio items found");
        return;
      }
      const zip = new JSZip();
      for (const item of audioItems) {
        const link = item.dataset.link;
        const fileName = item.querySelector("b").textContent;
        const response = await fetch(link);
        const blob = await response.blob();
        zip.file(fileName, blob);
      }
      zip.generateAsync({ type: "blob" }).then((content) => {
        const zipLink = document.createElement("a");
        zipLink.href = URL.createObjectURL(content);
        zipLink.download = "audio-files.zip";
        document.body.appendChild(zipLink);
        zipLink.click();
        document.body.removeChild(zipLink);
        console.log("All files downloaded in a zip archive");
      });
    });

    $("#btn-download-this-file").click(function () {
      const fileName = document.getElementById("fileName").textContent.trim();
      const audioItems = document.querySelectorAll(".audio-item");
      let fileFound = false;
      audioItems.forEach((item) => {
        const itemFileName = item.querySelector("b").textContent.trim();
        if (itemFileName === fileName) {
          fileFound = true;
          const fileLink = item.dataset.link;
          const downloadLink = document.createElement("a");
          downloadLink.href = fileLink;
          downloadLink.download = fileName;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }
      });
      if (!fileFound) {
        console.error(`File "${fileName}" not found in the audio list.`);
      }
    });
  });
});
