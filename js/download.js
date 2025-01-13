$(document).ready(function () {
  $("#btn-download-all-files").click(async function () {
    console.log("downloaded ALL files clicked");

    const audioItems = document.querySelectorAll(".audio-item");
    if (audioItems.length === 0) {
      console.log("No audio items found");
      return;
    }

    const zip = new JSZip(); // Create a new JSZip instance

    // Loop through all audio items and add them to the zip
    for (const item of audioItems) {
      const link = item.dataset.link;
      const fileName = item.querySelector("b").textContent;

      // Fetch the audio file as a blob
      const response = await fetch(link);
      const blob = await response.blob();

      // Add the blob to the zip archive
      zip.file(fileName, blob);
    }

    // Generate the zip file
    zip.generateAsync({ type: "blob" }).then((content) => {
      // Create a download link for the zip file
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
    console.log("Individual file download clicked");

    // Get the currently displayed file name
    const fileName = document.getElementById("fileName").textContent.trim();
    console.log("File to download:", fileName);

    // Find the corresponding `.audio-item` with the matching file name
    const audioItems = document.querySelectorAll(".audio-item");
    let fileFound = false;

    audioItems.forEach((item) => {
      const itemFileName = item.querySelector("b").textContent.trim();
      if (itemFileName === fileName) {
        fileFound = true;
        const fileLink = item.dataset.link;

        // Create a temporary download link for the file
        const downloadLink = document.createElement("a");
        downloadLink.href = fileLink;
        downloadLink.download = fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        console.log(`File "${fileName}" downloaded successfully.`);
      }
    });

    if (!fileFound) {
      console.error(`File "${fileName}" not found in the audio list.`);
    }
  });
});