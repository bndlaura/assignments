const chatItems = document.querySelectorAll(".chat-item");
const headerName = document.querySelector(".chat-header-left h3");
const messagesContainer = document.querySelector(".chat-messages");
const input = document.querySelector(".chat-input input");
const sendBtn = document.querySelector(".send-btn");

const socket = io();

function sendSocketMessage(text) {
    socket.emit("send-message", {
        from: activeChat,
        text: text
    });
}

socket.on("receive-message", data => {
    const from = data.from;

    conversations[from].messages.push({
        sender: from,
        text: data.text
    });

    saveConversations();
    updateChatPreview(from);

    if (activeChat === from) {
        loadConversation(activeChat);
    }
});

let conversations = JSON.parse(localStorage.getItem("conversations")) || {
    Adela: {
        name: "Adela",
        messages: [
            { sender: "Adela", text: "Fata" },
            { sender: "me", text: "Ce faci fata?" }
        ]
    },
    Alina: {
        name: "Alina",
        messages: [
            { sender: "Alina", text: "Ceau" }
        ]
    }
};

let activeChat = "Adela";

function saveConversations() {
    localStorage.setItem("conversations", JSON.stringify(conversations));
}

function loadConversation(name) {
    messagesContainer.innerHTML = "";

    conversations[name].messages.forEach(msg => {
        const div = document.createElement("div");
        div.classList.add("msg", msg.sender === "me" ? "msg-right" : "msg-left");
        div.textContent = msg.text;
        messagesContainer.appendChild(div);
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function updateChatPreview(name) {
    const previewEl = document.querySelector(`.chat-preview[data-preview="${name}"]`);
    const msgs = conversations[name].messages;

    if (!previewEl) return;

    previewEl.textContent = msgs.length > 0 ? msgs[msgs.length - 1].text : "";
}

// switching chats
chatItems.forEach(item => {
    item.addEventListener("click", () => {
        const name = item.dataset.name;

        activeChat = name;
        headerName.textContent = name;

        loadConversation(name);
    });
});

// sending messages
function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    // local
    conversations[activeChat].messages.push({
        sender: "me",
        text
    });

    saveConversations();
    loadConversation(activeChat);
    updateChatPreview(activeChat);

    // server
    sendSocketMessage(text);

    input.value = "";
}

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keydown", e => {
    if (e.key === "Enter") sendMessage();
});

// initial load
loadConversation(activeChat);
Object.keys(conversations).forEach(name => updateChatPreview(name));
