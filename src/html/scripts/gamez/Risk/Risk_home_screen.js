// Next few functions just deal with displaying the relevant screens/pages when their buttons are clicked. (As can be seen from the file name, these are the buttons from the Risk home screen).
function riskHowTo() {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('howToRisk').style.display = 'block';
}

function closeRiskInstructions() {
    document.getElementById('startScreen').style.display = 'flex';
    document.getElementById('howToRisk').style.display = 'none';
}

function riskSettingsScreen() {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('settingsRisk').style.display = 'block';
}
function closeRiskSettingsScreen() {
    document.getElementById('startScreen').style.display = 'flex';
    document.getElementById('settingsRisk').style.display = 'none';
}

// All the colors I cared to put in. These names will be used to determine the name of whatever color(s) the user picked in the settings.
const namedColors = [
    { name: 'black', rgb: [0, 0, 0] },
    { name: 'white', rgb: [255, 255, 255] },
    { name: 'red', rgb: [255, 0, 0] },
    { name: 'green', rgb: [0, 128, 0] },
    { name: 'blue', rgb: [0, 0, 255] },
    { name: 'yellow', rgb: [255, 255, 0] },
    { name: 'cyan', rgb: [0, 255, 255] },
    { name: 'magenta', rgb: [255, 0, 255] },
    { name: 'gray', rgb: [128, 128, 128] },
    { name: 'darkgray', rgb: [169, 169, 169] },
    { name: 'lightgray', rgb: [211, 211, 211] },
    { name: 'maroon', rgb: [128, 0, 0] },
    { name: 'olive', rgb: [128, 128, 0] },
    { name: 'navy', rgb: [0, 0, 128] },
    { name: 'purple', rgb: [128, 0, 128] },
    { name: 'teal', rgb: [0, 128, 128] },
    { name: 'lime', rgb: [0, 255, 0] },
    { name: 'aqua', rgb: [0, 255, 255] },
    { name: 'fuchsia', rgb: [255, 0, 255] },
    { name: 'silver', rgb: [192, 192, 192] },
    { name: 'gold', rgb: [255, 215, 0] },
    { name: 'brown', rgb: [165, 42, 42] },
    { name: 'orange', rgb: [255, 165, 0] },
    { name: 'pink', rgb: [255, 192, 203] },
    { name: 'indigo', rgb: [75, 0, 130] },
];

// Function that is called when the Save button is pushed on the settings page from the Risk home page.
function saveColors() {
    const player1Color = document.getElementById('player1Color').value;
    const player2Color = document.getElementById('player2Color').value;
    const player3Color = document.getElementById('player3Color').value;
    const player4Color = document.getElementById('player4Color').value;
    const player5Color = document.getElementById('player5Color').value;
    const player6Color = document.getElementById('player6Color').value;

    // Update global arrays with selected colors
    colorsFill[0] = player1Color;
    colorsFill[1] = player2Color;
    colorsFill[2] = player3Color;
    colorsFill[3] = player4Color;
    colorsFill[4] = player5Color;
    colorsFill[5] = player6Color;

    for(i = 0; i < colorsFill.length; i++) {
        colorsText[i] = calculateTextColor(colorsFill[i]);
    }

    // Use findClosestColorName function to find the closest named color for each RGB value
    for(i = 0; i < colorsFill.length; i++) {
        colorsFillActual[i] = findClosestColorName(colorsFill[i]);
    }

    console.log(colorsText);
    console.log(colorsFillActual); // Verify updated names
    alert("Colors have been saved!");
}

// This could be better but it serves its purpose.
function calculateTextColor(hexColor) {
    // Convert hex color to RGB
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);

    // Calculate luminance (perceived brightness)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Determine text color based on luminance
    return luminance > 0.5 ? '#000000' : '#FFFFFF'; // Use black text for light background, white text for dark background
}

// Function to find the name of the closest color match
function findClosestColorName(hexColor) {
    let minDiff = Infinity;
    let closestColorName = "";

    // Convert hex color to RGB
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);   
    
    const rgb = [r, g, b];

    // Iterate through predefined colors to find the closest match. (In case you guys are curious, this is using 
    // Euclidean geometry, specifically it is using the distance formula. Idk, I thought it was cool).
    namedColors.forEach(color => {
        const diff = Math.sqrt(
            Math.pow(rgb[0] - color.rgb[0], 2) +
            Math.pow(rgb[1] - color.rgb[1], 2) +
            Math.pow(rgb[2] - color.rgb[2], 2)
        );

        if (diff < minDiff) {
            minDiff = diff;
            closestColorName = color.name;
        }
    });

    return closestColorName.charAt(0).toUpperCase() + closestColorName.slice(1);;
}