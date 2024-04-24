function sendMessage() {
    const username = document.getElementById("username").value;
    var message = document.getElementById("input-box").value;
    if (message.trim() === "") return;
    
    var chatContainer = document.getElementById("chat-container");
    var messageElement = document.createElement("p");
    var timeStamp = new Date().toLocaleTimeString();
    
    messageElement.textContent = "[" + timeStamp + "] " + username + ": " + message;
    
    // 'sent' or 'received' class based on the username
    if (username === "<username>") {
        messageElement.classList.add("message", "sent");
        document.getElementById("username").value = "<other user>";
    } else {
        messageElement.classList.add("message", "received");
        document.getElementById("username").value = "<username>";
    }
    
    chatContainer.appendChild(messageElement);
    document.getElementById("input-box").value = "";
    chatContainer.scrollTop = chatContainer.scrollHeight;
}