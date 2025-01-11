document.getElementById('btn-download-all-files').addEventListener('click', () => {
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

document.getElementById('btn-download-this-file').addEventListener('click', () => {
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