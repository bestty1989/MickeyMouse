function sendMessage() {
    const messageInput = document.getElementById('message');
    const message = messageInput.value.trim();

    if (message && currentUser) {
        const newMessage = { 
            sender: currentUser, 
            content: message, 
            timestamp: Date.now() 
        };
        
        // ... 其余代码保持不变
    }
}

function sendImage() {
    const imageData = document.getElementById('preview-image').src;
    if (currentUser) {
        const newMessage = { 
            sender: currentUser, 
            content: imageData,
            type: 'image', 
            timestamp: Date.now() 
        };

        // ... 其余代码保持不变
    }
}
