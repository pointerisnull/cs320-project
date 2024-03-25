// Array of ad images
var adImages = [ // need to fix sources, only works locally right now
    "C:/Users/nesze/CS320/cs320-project-nez/src/html/Media/Ads/Deans_Deli.jpg",
    "C:/Users/nesze/CS320/cs320-project-nez/src/html/Media/Ads/spam.jpg",
    "C:/Users/nesze/CS320/cs320-project-nez/src/html/Media/Ads/YCP_hackslogo.jpg"
    // Add more image URLs here
];

// Function to display a random image ad
function displayRandomAd() {
    var randomIndex = Math.floor(Math.random() * adImages.length); // Generate a random index
    var imageUrl = adImages[randomIndex]; // Get the image URL
    var adElement = document.createElement("img"); // Create an img element
    adElement.classList.add("ad"); // Add a class for styling
    adElement.alt = "ad";
    adElement.src = imageUrl; // Set the image source
    document.getElementById("ad-container").appendChild(adElement); // Append the ad to the container
}

// Call the function to display a random image ad when the page loads
displayRandomAd();