const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

io.on("connection", socket => {
    console.log("User connected:", socket.id);

    socket.on("send-message", data => {
        socket.broadcast.emit("receive-message", data);
    });
});

http.listen(3000, () => console.log("server running at http://localhost:3000"));
