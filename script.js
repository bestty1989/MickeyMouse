let currentUser = null;
let passwords = {
    '琦琦': '20000415',
    '琪琪': '222222',
    '绮绮': '333333'  // 添加新用户
};

function showLoginForm() {
    document.getElementById('login-form').style.display = 'block';
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (passwords[username] === password) {
        currentUser = username;
        localStorage.setItem('currentUser', username);
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('login-button').style.display = 'none';
        document.getElementById('message-input').style.display = 'flex';
        document.getElementById('settings-button').style.display = 'block';
        
        // 登录后检查是否显示清空留言按钮
        const clearMessagesOption = document.getElementById('clear-messages-option');
        if (clearMessagesOption) {
            clearMessagesOption.style.display = username === '琦琦' ? 'block' : 'none';
        }
        
        alert('登录成功！');
        loadMessages();
    } else {
        alert('用户名或密码错误！');
    }
}

function toggleSettings() {
    const settingsMenu = document.getElementById('settings-menu');
    settingsMenu.style.display = settingsMenu.style.display === 'none' ? 'block' : 'none';
    
    // 只有琦琦才能看到清空留言的选项
    const clearMessagesOption = document.getElementById('clear-messages-option');
    if (clearMessagesOption) {
        clearMessagesOption.style.display = currentUser === '琦琦' ? 'block' : 'none';
    }
}

function showChangePasswordForm() {
    document.getElementById('change-password-form').style.display = 'block';
    document.getElementById('settings-menu').style.display = 'none';
}

function changePassword() {
    const newPassword = document.getElementById('new-password').value;
    if (newPassword) {
        passwords[currentUser] = newPassword;
        alert('密码修改成功！');
        document.getElementById('change-password-form').style.display = 'none';
    } else {
        alert('请输入新密码！');
    }
}

function confirmLogout() {
    if (confirm('确定要退出账户吗？')) {
        logout();
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    document.getElementById('login-button').style.display = 'block';
    document.getElementById('message-input').style.display = 'none';
    document.getElementById('settings-button').style.display = 'none';
    document.getElementById('settings-menu').style.display = 'none';
    loadMessages(); // 重新加载消息以显示加密版本
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function sendMessage() {
    const messageInput = document.getElementById('message');
    const message = messageInput.value.trim();

    if (message) {
        const messages = JSON.parse(localStorage.getItem('messages') || '[]');
        messages.push({ 
            sender: currentUser, 
            content: message, 
            timestamp: Date.now() 
        });
        localStorage.setItem('messages', JSON.stringify(messages));
        messageInput.value = '';
        loadMessages();
    }
}

function loadMessages() {
    const chatContainer = document.getElementById('chat-container');
    chatContainer.innerHTML = '';
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');

    messages.forEach((message, index) => {
        const messageElement = document.createElement('div');
        
        let messageTime = '时间未知';
        if (message.timestamp) {
            const date = new Date(message.timestamp);
            if (!isNaN(date.getTime())) {
                messageTime = date.toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                });
            }
        }
        
        if (message.type === 'system') {
            messageElement.className = 'message-system';
            messageElement.innerHTML = `
                ${currentUser ? message.content : '系统消息'}
                <div class="message-time">${messageTime}</div>
            `;
        } else if (message.type === 'image') {
            messageElement.className = 'message';
            messageElement.style.backgroundColor = getMessageColor(message.sender);
            messageElement.innerHTML = currentUser ? `
                <img src="${message.content}" alt="用户上传的图片" style="max-width: 200px;">
                <div class="message-time">${messageTime}</div>
            ` : `
                <div>图片消息</div>
                <div class="message-time">${messageTime}</div>
            `;
        } else {
            messageElement.className = 'message';
            messageElement.style.backgroundColor = getMessageColor(message.sender);
            messageElement.innerHTML = `
                ${currentUser ? message.content : '********'}
                <div class="message-time">${messageTime}</div>
            `;
        }
        
        chatContainer.appendChild(messageElement);
    });

    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function getMessageColor(sender) {
    switch(sender) {
        case '琦琦':
            return '#B3D9FF'; // 更深的蓝色
        case '琪琪':
            return '#FFE6F0'; // 浅粉色
        case '绮绮':
            return '#FFFF00'; // 黄色
        default:
            return '#F0F0F0'; // 默认浅灰色
    }
}

function checkLoginStatus() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = storedUser;
        document.getElementById('login-button').style.display = 'none';
        document.getElementById('message-input').style.display = 'flex';
        document.getElementById('settings-button').style.display = 'block';
        
        // 检查登录状态时也要检查是否显示清空留言按钮
        const clearMessagesOption = document.getElementById('clear-messages-option');
        if (clearMessagesOption) {
            clearMessagesOption.style.display = storedUser === '琦琦' ? 'block' : 'none';
        }
    } else {
        document.getElementById('login-button').style.display = 'block';
        document.getElementById('message-input').style.display = 'none';
        document.getElementById('settings-button').style.display = 'none';
        
        // 未登录时隐藏清空留言按钮
        const clearMessagesOption = document.getElementById('clear-messages-option');
        if (clearMessagesOption) {
            clearMessagesOption.style.display = 'none';
        }
    }
    loadMessages();
}

// 在页面加载完成后立即隐藏清空留言按钮
window.onload = function() {
    const clearMessagesOption = document.getElementById('clear-messages-option');
    if (clearMessagesOption) {
        clearMessagesOption.style.display = 'none';
    }
    checkLoginStatus();
};

setInterval(loadMessages, 60000);

function triggerFileInput() {
    document.getElementById('avatar-upload').click();
}

function changeAvatar(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('avatar-image').src = e.target.result;
            localStorage.setItem(`${currentUser}-avatar`, e.target.result);
        };
        reader.readAsDataURL(file);
    }
}

function loadAvatar() {
    const avatarSrc = localStorage.getItem(`${currentUser}-avatar`);
    const avatarImg = document.getElementById('avatar-image');
    if (avatarSrc) {
        avatarImg.src = avatarSrc;
        avatarImg.style.display = 'block';
    } else {
        avatarImg.style.display = 'none';
    }
}

function confirmClearMessages() {
    if (currentUser === '琦琦') {
        if (confirm('确定要清空所有留言吗？此操作不可撤销。')) {
            clearMessages();
        }
    } else {
        alert('只有琦琦有权限清空留言。');
    }
}

function clearMessages() {
    if (currentUser === '琦琦') {
        localStorage.removeItem('messages');
        loadMessages();
        alert('所有留言已清空。');
    }
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('preview-image').src = e.target.result;
            document.getElementById('image-preview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

function sendImage() {
    const imageData = document.getElementById('preview-image').src;
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    messages.push({ 
        sender: currentUser, 
        content: imageData,
        type: 'image', 
        timestamp: Date.now() 
    });
    localStorage.setItem('messages', JSON.stringify(messages));
    cancelImageUpload();
    loadMessages();
}

function cancelImageUpload() {
    document.getElementById('image-preview').style.display = 'none';
    document.getElementById('image-upload').value = '';
}