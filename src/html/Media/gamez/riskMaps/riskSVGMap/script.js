const continents = document.querySelectorAll('.North_America, .South_America, .Europe, .Africa, .Asia, .Australia');

let zoomTimeout; // Variable to hold zoom timeout
let changeColorTimeout; // Variable to hold color change timeout
let colorChangeInProgress = false; // Flag to indicate if color change animation is in progress

// Function to handle mouse enter event
function handleMouseEnter() {
    clearTimeout(changeColorTimeout); // Clear color change timeout if it's active
    clearTimeout(zoomTimeout); // Clear zoom timeout if it's active
    colorChangeInProgress = false; // Reset color change animation state
    zoomInToNorthAmerica(); // Start zoom animation
}

// Function to handle mouse leave event
function handleMouseLeave() {
    clearTimeout(zoomTimeout); // Clear zoom timeout if it's active
    clearTimeout(changeColorTimeout); // Clear color change timeout if it's active
    colorChangeInProgress = false; // Set flag to stop color change animation

    continents.forEach(continent => {
        // Reset each continent to its original color
        switch (continent.getAttribute('class')) {
            case "South_America":
                continent.style.stroke = "#4d9900";
                continent.style.fill = "#d8e9b6";
                break;
            case "Europe":
                continent.style.stroke = "#cc0066";
                continent.style.fill = "#f0d6e1";
                break;
            case "Africa":
                continent.style.stroke = "#ff6633";
                continent.style.fill = "#fad8be";
                break;
            case "Asia":
                continent.style.stroke = "#99cc00";
                continent.style.fill = "#e2f0cb";
                break;
            case "Australia":
                continent.style.stroke = "#0077cc";
                continent.style.fill = "#85c1ff";
                break;
            default:
                break;
        }
    });
    worldMap.setAttribute('viewBox', '0 0 800 533'); // Reset viewBox
}

// Function to change the color of a continent
function changeContinentColor() {
    // Define the delay between each continent color change
    const delay = 500; // Adjust this value as needed
    let variableSpeed = 1

    // Counter variable to track the delay for each continent
    let delayCounter = 0;

    colorChangeInProgress = true;

    // Loop through each continent
    continents.forEach(continent => {
        // Variably increase the delay counter for each continent
        variableSpeed += 0.05;
        delayCounter += delay / variableSpeed;

        // Set a timeout to change the continent color after a delay
        changeColorTimeout = setTimeout(() => {
            if(!colorChangeInProgress) return;
            continent.style.stroke = '#0066cc';
            continent.style.fill = '#cce5ff'; // Set new color
        }, delayCounter); // Set the delay for this continent
    });
}

const mapContainer = document.getElementById('mapContainer');
const worldMap = document.getElementById('worldMap');

// Function to zoom in to the North American continent
function zoomInToNorthAmerica() {
    let viewBoxWidth = 800;
    let viewBoxHeight = 533;

    function zoomIn() {
        if (viewBoxWidth >= 400) {
            viewBoxWidth -= 4;
            viewBoxHeight -= 1;
            worldMap.setAttribute('viewBox', `0 0 ${viewBoxWidth} ${viewBoxHeight}`);
            mapContainer.style.transform = 'scale(1.05)';
            zoomTimeout = setTimeout(zoomIn, 16); // Use requestAnimationFrame equivalent timeout
        } else {
            setTimeout(zoomOut, 2000); // Call zoomOut after 2 seconds
        }
    }

    function zoomOut() {
        if (viewBoxWidth < 800 || viewBoxHeight < 533) {
            if (viewBoxWidth < 800) {
                viewBoxWidth += 8;
            }
            if (viewBoxHeight < 533) {
                viewBoxHeight += 4;
            }
            worldMap.setAttribute('viewBox', `0 0 ${viewBoxWidth} ${viewBoxHeight}`);
            mapContainer.style.transform = 'scale(1.05)';
            zoomTimeout = setTimeout(zoomOut, 16); // Use requestAnimationFrame equivalent timeout
        } else {
            changeContinentColor();
        }
    }

    // Start zooming in
    zoomIn();
}