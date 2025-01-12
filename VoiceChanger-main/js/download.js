// connect to socket to retrive audio file(s) from results/
function retrieve () {
  const socket = new WebSocket("ws://localhost:3000");
  socket.addEventListener("open", function () {
    console.log("DOWNLOAD has connected to WS Server");
    const data = { type: "retrieve" };
    socket.send(JSON.stringify(data)); // Send the request to retrieve files
  });

  socket.addEventListener("message", function (event) {
    const response = JSON.parse(event.data); // Parse the server's response
    console.log("Files retrieved successfully:", response.files);

    const fileListContainer = document.getElementById("file-list");
    fileListContainer.innerHTML = ""; // Clear previous content

    response.files.forEach((file) => {
      // Create download links for each file
      const link = document.createElement("a");
      link.href = `data:audio/wav;base64,${file.fileContent}`;
      link.download = file.fileName;
      link.textContent = `Download ${file.fileName}`;
      link.style.display = "block";

      fileListContainer.appendChild(link);
    });
  });

  socket.addEventListener("close");
}

$(".btn-download-all-files").click(async function () {
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

$(".btn-download-this-file").click(function () {
  console.log("downloaded INDIVIDUAL file clicked");
  const audioItems = document.querySelectorAll(".audio-item");
  const fileName = document.getElementById("fileName").textContent;

  console.log("download: ", fileName);

  audioItems.forEach((item) => {
    if (item.querySelector("b").textContent === fileName) {
      const link = document.createElement("a");
      link.href = item.dataset.link;
      link.download = item.querySelector("b").textContent;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log(`File "${fileName}" downloaded`);
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