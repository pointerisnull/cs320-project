var audio = document.getElementById('audio');
var toggleAudio = document.getElementById('toggleBtn');
var volumeSlider = document.getElementById('volumeSlider');
var icon = document.getElementById('icon');

  function togglePlayPause() {
    if (audio.paused) {
      audio.play();
      // Change icon when audio is playing
      icon.classList.remove('fa-volume-xmark');
      icon.classList.add('fa-volume-high');
      // change icon img GOOD?
      icon.classList.remove('fa-solid fa-volume-xmark');
      icon.classList.add('fa-solid fa-volume-high');
    } else {
      audio.pause();
      // Change icon when audio is paused
      icon.classList.remove('fa-volume-high');
      icon.classList.add('fa-volume-xmark');
      icon.classList.remove('fa-solid fa-volume-high');
      icon.classList.add('fa-solid fa-volume-xmark');
    }
  }

  function setVolume(volume) {
    audio.volume = volume;
  }
  
// Debugging statement to check if audio element is loaded
console.log("Audio Element:", audio);