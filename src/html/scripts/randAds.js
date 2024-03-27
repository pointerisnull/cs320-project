var links = [
    "https://www.facebook.com/people/Deans-Deli/100057077305073/",
    "https://www.spam.com/",
    "https://ycphacks.io/",
    "../html/risk.html",
    "../html/store.html",
    "https://www.cheese.com/",
    "https://www.meatyourmaker.com/",
    "https://www.disney.com/",
    "https://www.snacks.com/",
    "../html/chess.html"
];

// Array of ad images
var adImages = [
    "../html/Media/Ads/Deans_Deli.jpg",
    "../html/Media/Ads/spam.jpg",
    "../html/Media/Ads/YCP_hackslogo.jpg",
    "../html/Media/Ads/risk.jfif",
    "../html/Media/Ads/store.jfif",
    "../html/Media/Ads/cheese.jfif",
    "../html/Media/Ads/meat.jfif",
    "../html/Media/Ads/family.jfif",
    "../html/Media/Ads/snacks.jfif",
    "../html/Media/Ads/chess.jfif"
];

// Function to display a random image ad
function displayRandomAd() {
    var randomIndex = Math.floor(Math.random() * adImages.length); // Generate a random index
    var imageUrl = adImages[randomIndex]; // Get the image URL
    var adElement = document.createElement("img"); // Create an img element
    adElement.classList.add("ad"); // Add a class for styling
    adElement.alt = "ad";
    adElement.src = imageUrl; // Set the image source
    var link = document.createElement('a');
    link.href = links[randomIndex];
    link.appendChild(adElement);
    document.getElementById("ad-container").appendChild(link); // Append the ad to the container
}

// Call the function to display a random image ad when the page loads
displayRandomAd();

// NOT DONE Function to make AJAX request to DALL-E 3 API https://platform.openai.com/docs/guides/images/usage?context=node&lang=node.js 
function fetchDALLEResult() {
    // Replace 'YOUR_API_KEY' with your actual API key
    var apiKey = 'YOUR_API_KEY'; // API Key must stay private and be an Environment Variable
    var apiUrl = 'https://api.openai.com/v1/davinci-003/completions';

    // Example prompt
    var prompt = 'Generate an image of a cat riding a bicycle';

    // Prepare data for the API request
    var requestData = {
        "prompt": prompt,
        "max_tokens": 100,
        "temperature": 0.7
    };

    // Make AJAX request
    var xhr = new XMLHttpRequest();
    xhr.open('POST', apiUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + apiKey);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                // Request successful, handle response
                var response = JSON.parse(xhr.responseText);
                var output = document.getElementById('output');
                output.innerHTML = '<img src="' + response.choices[0].text.trim() + '" alt="Generated Image">';
            } else {
                // Request failed
                console.error('Request failed. Status: ' + xhr.status);
            }
        }
    };
    xhr.send(JSON.stringify(requestData));
}

// Call the function to fetch DALL-E result when the page loads
// window.onload = fetchDALLEResult;