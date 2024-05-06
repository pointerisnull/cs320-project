// Function to show the achievement dropdown
function showAchievementDropdown() {
    document.getElementById("achievementContent").style.display = "block";
}

// Function to hide the achievement dropdown
function hideAchievementDropdown() {
    document.getElementById("achievementContent").style.display = "none";
}

// Function to add achievements dynamically
function addAchievement(title, description) {
    var achievementContent = document.getElementById("achievementContent");
    var achievementItem = document.createElement("a");
    achievementItem.innerHTML = "<strong>" + title + "</strong><br>" + description; // Use HTML for better formatting
    achievementContent.appendChild(achievementItem);
}

// Example achievements
addAchievement("First Achievement", "Complete your first game of Risk.");
addAchievement("Risk Taker", "Conquer 5 territories in a single turn.");
addAchievement("Victory Royale", "Win a game of Risk by eliminating all other players.");
