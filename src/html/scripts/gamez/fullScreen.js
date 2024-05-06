/* This functions main goal is to call the reqeustFullscreen() method. The rest of the code in the function 
is just making sure the content in the full screen mode is scaled and placed properly. */
function openFullscreen() {
    if(gameContainer.requestFullscreen) {
        gameContainer.requestFullscreen();

        document.getElementById('fullscreen-button').src = "./Media/gamez/etc/exitFullScreen.png"
        document.getElementById('fullscreen-button').onclick = closeFullscreen;

        // Calculate the scaling factor based on the screen width. This is just to make sure the full screen mode fits most screens.
        var screenWidth = window.screen.width;
        var screenHeight = window.screen.height;
        var minScalingFactor = 0.8; // Adjust as needed
        var maxScalingFactor = 0.9; // Adjust as needed

        // Calculate the scaling factor based on the screen width
        var scalingFactor = Math.max(2, screenWidth / 800); // This is based off of my laptop screen as a reference hence the seemingly arbitrary numbers.
        
        // Set the width and height of the insideGameContainer based on the scaling factor
        if(scalingFactor === 2) {
            insideGameContainer.style.width = screenWidth * maxScalingFactor + "px";
            insideGameContainer.style.height = screenHeight + "px";
        }
        else {
            insideGameContainer.style.width = screenWidth * minScalingFactor + "px";
            insideGameContainer.style.height = screenHeight + "px";
        }
        gameContainer.style.justifyContent = 'center';
        gameContainer.style.alignItems = 'center';
        gameContainer.style.display = 'flex';
    } 
    scaleText('inside-game-container');
}

function scaleText(containerId) {
    var container = document.getElementById(containerId);
    var textElements = container.querySelectorAll('.text');

    // Get container dimensions
    var containerWidth = container.offsetWidth;
    var containerHeight = container.offsetHeight;

    // Calculate font size based on container dimensions
    var fontSizeWidth = containerWidth * 0.03; // Adjust this multiplier as needed
    var fontSizeHeight = containerHeight * 0.03; // Adjust this multiplier as needed

    // Set font size based on the smaller dimension (width or height)
    var fontSize = Math.min(fontSizeWidth, fontSizeHeight);

    // Apply font size to all text elements inside the container
    textElements.forEach(function(text) {
        text.style.fontSize = fontSize + 'px';
    });
}

// Call the scaleText function initially
scaleText('inside-game-container');

document.addEventListener('fullscreenchange', escapeFullscreen);

function escapeFullscreen() {
    if(!document.fullscreenElement) {
        // If the fullscreenElement is null, it means the user has exited fullscreen mode
        insideGameContainer.style.width = contentWidth; // Reset width to default
        insideGameContainer.style.height = contentHeight; // Reset height to default
        gameContainer.style.justifyContent = ''; // Reset justifyContent
        gameContainer.style.alignItems = ''; // Reset alignItems
        gameContainer.style.display = ''; // Reset display
        gameContainer.style.transform = ''; // Reset transform (scaling)
        document.getElementById('fullscreen-button').src = "./Media/gamez/etc/enterFullScreen.png"
        document.getElementById('fullscreen-button').onclick = openFullscreen;
    }
}

function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen(); // Exit fullscreen mode
        // Reset styling adjustments
        insideGameContainer.style.width = contentWidth;
        insideGameContainer.style.height = contentHeight;
        gameContainer.style.justifyContent = '';
        gameContainer.style.alignItems = '';
        gameContainer.style.display = '';
        gameContainer.style.transform = '';
        document.getElementById('fullscreen-button').src = "./Media/gamez/etc/enterFullScreen.png";
        document.getElementById('fullscreen-button').onclick = openFullscreen;
    }
}