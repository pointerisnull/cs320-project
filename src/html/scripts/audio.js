var audio = document.getElementById('audio');
var toggleAudio = document.getElementById('toggleBtn');
var volumeSlider = document.getElementById('volumeSlider');
var icon = document.getElementById('icon');

// Initialize audio context
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var source = audioCtx.createMediaElementSource(audio);
var gainNode = audioCtx.createGain();

// Connect the audio source to the gain node
source.connect(gainNode);
gainNode.connect(audioCtx.destination);

// Event listener for the toggle button
toggleAudio.addEventListener('click', function () {
    if (audio.paused) {
        audio.play();
        // change icon img NOT DONE
        icon.classList.remove('fa-solid fa-volume-xmark');
        icon.classList.add('fa-solid fa-volume-high');
    } else {
        audio.pause();
        icon.classList.remove('fa-solid fa-volume-high');
        icon.classList.add('fa-solid fa-volume-xmark');
    }
});

volumeSlider.addEventListener('input', function () {
    var volume = parseFloat(volumeSlider.value);
    gainNode.gain.value = volume;
});
