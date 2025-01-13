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

function decodeBase64Audio(base64String) {
  try {
    // Split the Base64 string to extract metadata and the encoded data
    const [metadata, base64Data] = base64String.split(",");

    // Extract the MIME type from the metadata
    const mimeTypeMatch = metadata.match(/data:(.*?);base64/);
    if (!mimeTypeMatch) {
      throw new Error("Invalid Base64 audio string: MIME type not found.");
    }
    const mimeType = mimeTypeMatch[1];

    // Decode Base64 to binary data
    const binaryString = atob(base64Data);
    const len = binaryString.length;
    const buffer = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      buffer[i] = binaryString.charCodeAt(i);
    }

    // Create a Blob from the binary data using the detected MIME type
    const blob = new Blob([buffer], { type: mimeType });

    // Generate a URL for the Blob
    const audioURL = URL.createObjectURL(blob);

    // Get the file extension from the MIME type
    const fileExtension = mimeType.split("/")[1];

    // Return all relevant data
    return {
      blob,
      mimeType,
      audioURL,
      fileExtension,
    };
  } catch (error) {
    console.error("Error decoding Base64 audio:", error);
    return null;
  }
}

function a() {
  const socket = new WebSocket("ws://localhost:3000");
  socket.addEventListener("open", function () {
    console.log("Connected to WS Server");
    const data = { type: "upload", files: [] };
    socket.send(JSON.stringify(data)); // Convert object to JSON string
  });
  socket.addEventListener("message", function (message) {
    console.log("Message from Server:", message.data);
  });
  socket.addEventListener("close");
}