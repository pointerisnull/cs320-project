var audio = document.getElementById('audio');
var toggleAudio = document.getElementById('toggleBtn');
var volumeSlider = document.getElementById('volumeSlider');
var icon = document.getElementById('icon');


var audioCtx;
var source;
var gainNode;

// Event listener for the toggle button
toggleAudio.addEventListener('click', function () {

    // Initialize audio context and gainNode outside of event listeners if there isn't already a source.
    if(!source) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        source = audioCtx.createMediaElementSource(audio);
        gainNode = audioCtx.createGain();
    }

    // Connect the audio source to the gain node
    source.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (audio.paused) {
        audio.play();
        // Change icon when audio is playing
        icon.classList.remove('fa-volume-xmark');
        icon.classList.add('fa-volume-high');
    } else {
        audio.pause();
        // Change icon when audio is paused
        icon.classList.remove('fa-volume-high');
        icon.classList.add('fa-volume-xmark');
    }
});

// Event listener for the volume slider
volumeSlider.addEventListener('input', function () {
    var volume = parseFloat(volumeSlider.value);
    console.log("Volume:", volume); // Debugging statement
    gainNode.gain.value = volume;
    console.log("Gain Node Gain:", gainNode.gain.value); // Debugging statement
});

// Debugging statement to check if audio element is loaded
console.log("Audio Element:", audio);
