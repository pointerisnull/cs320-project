function sendMessage() {
    var username = document.getElementById("username").value;
    var message = document.getElementById("input-box").value;
    if (message.trim() === "") return;
    
    var chatContainer = document.getElementById("chat-container");
    var messageElement = document.createElement("p");
    var timeStamp = new Date().toLocaleTimeString();
    
    messageElement.textContent = "[" + timeStamp + "] " + username + ": " + message;
    chatContainer.appendChild(messageElement);
    document.getElementById("input-box").value = "";
    chatContainer.scrollTop = chatContainer.scrollHeight;
}