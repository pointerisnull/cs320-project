// // Simulate loading progress (Risk)
// let progress = 0;
// const progressBar = document.getElementById('progressBar');
// const loadingScreen = document.getElementById('loadingScreen');
// const gifContainer = document.getElementById('gifContainer');

// function simulateLoading() {
//     const interval = setInterval(() => {
//         progress += 10; // Increment progress
//         progressBar.style.width = progress + '%'; // Update progress bar width
//         if (progress >= 100) {
//             clearInterval(interval); // Stop the interval when progress reaches 100%
//             setTimeout(() => {
//                 loadingScreen.style.opacity = 0; // Fade out loading screen
//                 setTimeout(() => {
//                     loadingScreen.style.display = 'none'; // Hide loading screen
//                 }, 500); // After fade out animation
//                 setTimeout(() => {
//                     gifContainer.classList.add('hidden');
//                 }, 2130); // After fade out animation
//             }, 1000); // Wait for 1 second before fading out
//         }
//     }, 500); // Interval duration
// }

// // Show the GIF container initially, then start simulating loading
// gifContainer.classList.remove('hidden');
// setTimeout(() => {
//     simulateLoading();
// }, 2000); // Show GIF container after 2 seconds
