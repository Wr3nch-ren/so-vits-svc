import WaveSurfer from 'https://cdn.jsdelivr.net/npm/wavesurfer.js@7/dist/wavesurfer.esm.js'

const wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#92c3cc',
    barWidth: 2,
    progressColor: '#322f2f',
    url: 'voiceAudio/patri/006.wav',
});

// เลือก element .audio-item ตัวแรกและตั้งค่า URL เริ่มต้น
/*const firstAudioItem = document.querySelector('.audio-item');
const initialUrl = firstAudioItem.attr('data-link');
wavesurfer.load(initialUrl);

// เพิ่ม event listener ให้กับ .audio-item ทั้งหมด
document.querySelectorAll('.audio-item').forEach(item => {
    item.addEventListener('click', () => {
        const audioLink = item.dataset.link;
        wavesurfer.load(audioLink);
    });
});*/

wavesurfer.on('click', () => {
    wavesurfer.play()
});



/*import WaveSurfer from 'https://cdn.jsdelivr.net/npm/wavesurfer.js@7/dist/wavesurfer.esm.js'

const wavesurfer = WaveSurfer.create({
  container: '#waveform',
  waveColor: '#4F4A85',
  progressColor: '#383351',
  url: 'voiceAudio/patri/006.wav',
})

wavesurfer.on('interaction', () => {
  wavesurfer.play()
})*/
