const socket = io();

// trimite mesaj catre server
function sendSocketMessage(text) {
    socket.emit("send-message", {
        from: "other",
        text: text
    });
}

// primeste mesaj de la server
socket.on("receive-message", data => {
    // trimitem mesajul catre main.js
    document.dispatchEvent(new CustomEvent("socket-message", {
        detail: data
    }));
});
